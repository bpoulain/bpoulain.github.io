# Section 13 — UX Writing avancé & Delivery — Exercices

> Ces exercices travaillent quatre compétences fondamentales : la cohérence de la voix produit à grande échelle, la pensée systémique du contenu, l'arbitrage sous contrainte, et la gestion de la dette UX en collaboration avec les équipes de développement.

---

## Sommaire

- [Concept 1 — Voice & tone à l'échelle produit](#concept-1--voice--tone-à-léchelle-produit)
- [Concept 2 — Content design systémique](#concept-2--content-design-systémique)
- [Concept 3 — Triangle faisabilité / désirabilité / viabilité](#concept-3--triangle-faisabilité--désirabilité--viabilité)
- [Concept 4 — Dette UX & collaboration dev](#concept-4--dette-ux--collaboration-dev)

---

## Concept 1 — Voice & tone à l'échelle produit

**Contexte :** Lydia, une application de paiement mobile grand public (fintech), opère en France, Espagne, Allemagne et Belgique. Elle est utilisée par des profils très variés : étudiants, travailleurs indépendants, familles. Son positionnement est "le compte qui simplifie la vie". L'équipe produit a grandi rapidement (passage de 5 à 40 personnes en 18 mois) et aucun guide de tone of voice n'a été formalisé. Résultat : les notifications push sont enjouées et utilisent des emojis ; les messages d'erreur de paiement sont froids et techniques ; les emails transactionnels sont formels et corporates.

---

### Bloc 1 — Exercices (sans correction)

#### Exercice 1 — Traduction mentale

Comment aborderais-tu ce problème avec ta compréhension actuelle ?

L'équipe marketing vient de te solliciter pour créer une notification push de réengagement pour les utilisateurs inactifs depuis 30 jours. Voici le premier jet proposé par le PM :

> "Hey ! 👀 T'as pas encore essayé le virement instantané ? C'est top, fonce !"

Et voici la notification d'échec de paiement actuellement affichée dans l'application :

> "Transaction refusée. Code erreur : INSUF_FUNDS_003. Contactez votre établissement bancaire."

**Question :** Sans chercher à corriger immédiatement ces deux textes, décris en 3 à 5 phrases ce que tu ressens en lisant l'un puis l'autre, et ce que cela révèle sur l'état du voice & tone de Lydia. Quelle est la première chose que tu ferais avant de réécrire quoi que ce soit ?

---

#### Exercice 2 — Piège de paradigme

Qu'est-ce qui ne va pas ici ? Quels KPI seraient affectés ?

L'équipe décide de résoudre le problème de cohérence en adoptant la règle suivante, appliquée immédiatement à toutes les surfaces :

> "On uniformise tout sur un ton neutre et professionnel. Fini les emojis partout, on parle comme une banque sérieuse."

Voici les trois textes réécrits selon cette règle :

**Onboarding — écran de bienvenue :**
> "Bienvenue sur Lydia. Votre compte a été créé avec succès. Vous pouvez désormais utiliser les fonctionnalités disponibles."

**Notification de remboursement reçu :**
> "Remboursement reçu. Montant : 23,50 €. Expéditeur : Thomas B. Date : 14/04/2026."

**Message d'erreur — connexion impossible :**
> "Connexion impossible. Veuillez vérifier votre connexion internet et réessayer ultérieurement."

**Questions :**
1. Identifie au moins trois problèmes distincts dans cette approche d'uniformisation.
2. Quels KPIs seraient affectés négativement et pourquoi ?
3. Y a-t-il une dimension éthique ou inclusive dans ces textes qui te pose problème ?

---

#### Exercice 3 — Mini-cas réel

**Contexte :** Tu es UX Writer chez Lydia. Après avoir convaincu l'équipe de l'importance du voice & tone, tu dois construire le Tone of Voice Guide et le déployer dans les 4 prochaines semaines sur les surfaces les plus critiques (notifications push, messages d'erreur de paiement, onboarding).

**Dimension éthique à intégrer obligatoirement :** Lydia est utilisée par des personnes en difficulté financière (découverts répétés, restrictions de dépenses). Tes messages d'erreur de paiement touchent des utilisateurs dans des moments de stress et potentiellement de honte.

**Questions :**

a) **Modèle mental AVANT :** Décris ton modèle mental sur le voice & tone avant de lire la section théorique. Quelle était ta définition instinctive de la "cohérence" de ton ? Qu'est-ce qui t'aurait semblé le plus urgent à corriger en premier ?

b) **Construction du guide :** Définis 3 attributs de voix pour Lydia, formulés en binômes contrastés. Pour chaque attribut, donne un exemple de formulation conforme et une formulation non conforme.

c) **Variation contextuelle :** Rédige la version appropriée du message d'erreur "solde insuffisant" pour chacun de ces trois registres de ton : (1) le ton actuel de Lydia (enjoué/tech), (2) le ton uniformisé proposé par l'équipe (neutre/bancaire), (3) le ton que tu recommandes selon les attributs que tu as définis. Justifie ton choix.

d) **Gouvernance :** Décris les trois rituels que tu mettrais en place pour maintenir la cohérence du voice & tone dans une équipe de 40 personnes qui grandira encore.

e) **KPIs :** Quels indicateurs utiliserais-tu pour mesurer que ton intervention a eu un impact réel ? Détaille les KPIs UX et business que tu suivrais sur les 90 premiers jours.

---

### Bloc 2 — Corrections

#### Correction Exercice 1

**Modèle mental attendu :**
Avant d'écrire quoi que ce soit, la priorité est de comprendre la source de l'incohérence. Elle ne vient pas de mauvaise volonté des rédacteurs, mais de l'absence d'un cadre partagé. La première action est de faire l'inventaire des sources (qui a écrit quoi ?) et des contextes (dans quelle logique chaque texte a-t-il été produit ?).

**Raisonnement UX/Product :**
L'écart entre les deux textes illustre le problème fondamental : la voix produit est perçue comme "fun et accessible" par l'équipe marketing (notification push), et comme "sérieuse et sécurisante" par l'équipe produit/tech (erreur de paiement). Ces deux représentations ne sont pas nécessairement contradictoires — mais elles n'ont jamais été arbitrées et documentées. Résultat : l'utilisateur perçoit deux produits différents selon le contexte.

**Ce que révèle l'analyse :**
- La voix est fragmentée selon les équipes, pas selon les contextes fonctionnels
- Personne n'est propriétaire du contenu transversalement
- Le code erreur "INSUF_FUNDS_003" est un texte de développeur exposé directement à l'utilisateur — signal d'une absence totale de pensée UX Writing sur les états d'erreur

**Première action recommandée :** Réaliser un content audit express sur les 10 surfaces les plus fréquentées (pas réécrire immédiatement). Cartographier les écarts avant d'intervenir.

**KPIs impactés :**
- NPS : la dissonance de ton est perçue comme un manque de cohérence de la marque
- Taux de résolution au premier contact (support) : "INSUF_FUNDS_003" génère des tickets de support car les utilisateurs ne comprennent pas le problème ni l'action à effectuer

---

#### Correction Exercice 2

**Problèmes identifiés dans l'approche d'uniformisation neutre :**

1. **Confusion entre voix et ton.** Uniformiser le ton ne signifie pas uniformiser le contexte émotionnel. Un ton "neutre professionnel" appliqué à un remboursement entre amis (contexte social, positif) appauvrit l'expérience et la rend froide. La voix peut rester stable (Lydia est simple, accessible, fiable) sans que le ton ne soit identique dans tous les contextes.

2. **Onboarding : l'occasion manquée de l'engagement émotionnel.** "Votre compte a été créé avec succès. Vous pouvez désormais utiliser les fonctionnalités disponibles" ne dit rien sur la valeur produit ni sur la prochaine action attendue. C'est un accusé de réception administratif, pas un message d'accueil. Il n'oriente pas, n'engage pas, ne rassure pas.

3. **Remboursement reçu : un moment de joie transformé en relevé bancaire.** "Remboursement reçu. Montant : 23,50 €. Expéditeur : Thomas B. Date : 14/04/2026." est grammaticalement correct et informationnellement complet — mais il rate totalement le contexte émotionnel. Recevoir un remboursement d'un ami est un micro-moment positif. Le ton robot détruit cet instant.

4. **Message d'erreur : toujours pas actionnable.** "Vérifiez votre connexion internet et réessayez ultérieurement" ne dit pas quand réessayer, si le problème est côté Lydia ou côté utilisateur, ni si la transaction a été prise en compte. "Ultérieurement" est vague et anxiogène pour quelqu'un qui tente de payer.

**KPIs affectés négativement :**
- Taux de conversion à l'onboarding : un écran de bienvenue sans orientation vers l'action réduit l'activation (première transaction effectuée dans les 7 jours)
- NPS : la neutralité perçue comme froide sur des moments positifs (remboursement, première utilisation) dégrade la relation émotionnelle au produit
- Taux d'abandon sur les erreurs de connexion : un message vague sans délai estimé pousse à l'abandon plutôt qu'à l'attente ou au réessai

**Dimension éthique et inclusive :**
Le message de remboursement tel que formulé suppose que l'utilisateur sait immédiatement quoi faire avec cette information. Pour les utilisateurs peu à l'aise avec les applications financières (seniors, personnes peu bancarisées), un message purement factuel sans contexte peut être anxiogène. L'absence d'action suggérée ("L'argent est maintenant disponible dans votre compte") laisse l'utilisateur dans le doute.

**Erreurs classiques :** Confondre "professionnalisme" avec "neutralité émotionnelle". Un produit peut être fiable et chaleureux simultanément.

**Changement de paradigme :** La cohérence de ton n'est pas l'uniformité de ton — c'est la prévisibilité de la variation.

---

#### Correction Exercice 3

**a) Modèle mental typique avant formation**
La majorité des apprenants perçoivent la cohérence comme une question de "style" d'écriture (emojis ou pas, tutoiement ou vouvoiement). L'intuition est de corriger les textes les plus flagrants en priorité. Ce modèle sous-estime deux choses : (1) la gouvernance (qui décide ?) et (2) la variation contextuelle intentionnelle (certains contextes méritent des registres différents, et c'est voulu).

**b) Attributs de voix recommandés pour Lydia**

| Attribut | Conforme | Non conforme |
|---|---|---|
| **Simple, mais pas simpliste** | "Ton paiement est en cours." | "Transaction en cours de traitement." / "Paye maintenant !!!" |
| **Fiable, mais pas froide** | "Ce paiement a bien été enregistré. Thomas a été notifié." | "Transaction confirmée. Référence : TX-20260414-8821." / "Super, c'est parti !" |
| **Attentive, mais pas paternaliste** | "Ce code ne correspond pas. Réessaye ou réinitialise ton code." | "Mauvais code." / "Attention, si tu te trompes encore, ton compte sera bloqué." |

**c) Trois versions du message "solde insuffisant"**

**Version 1 — Ton actuel (enjoué/tech) :**
> "Aïe ! 😬 Ton solde est insuffisant pour ce paiement. Recharge vite ton compte !"

Problèmes : le "Aïe !" est inadapté à un moment de stress financier. L'emoji renforce l'inadéquation. "Recharge vite" crée une pression inutile sur quelqu'un qui n'a peut-être pas les moyens.

**Version 2 — Ton uniformisé (neutre/bancaire) :**
> "Paiement refusé. Solde disponible insuffisant. Veuillez approvisionner votre compte avant de réessayer."

Problèmes : "approvisionner" est du jargon bancaire. "Veuillez" est formel et distant. Le message ne propose pas d'alternative ni n'oriente vers une action concrète et réaliste.

**Version 3 — Ton recommandé (simple, fiable, attentive) :**
> "Ton solde ne couvre pas ce paiement. Tu peux recharger ton compte ou utiliser un autre moyen de paiement."

Justification : Le message est factuel (le problème est nommé sans drama), non culpabilisant (neutre sur la responsabilité), et orienté solution (deux alternatives proposées). Il ne présuppose pas que l'utilisateur va "recharger rapidement" — il ouvre des options. Il n'utilise pas de jargon. Il respecte le moment de stress potentiel sans l'amplifier.

**Dimension éthique :** Éviter tout terme qui stigmatise la situation financière ("fonds insuffisants" est moins chargé que "compte vide" ou "vous êtes à découvert"). Ne jamais ajouter de message de vente ou de promotion sur un écran d'erreur financière.

**d) Trois rituels de gouvernance**

1. **Design content review hebdomadaire (30 min) :** Tout nouveau contenu est partagé dans un canal Slack dédié avec le label `#content-review`. Le propriétaire éditorial (UX Writer) a 24h pour valider ou proposer une alternative. La décision est documentée dans le ticket Jira associé.

2. **Audit de cohérence trimestriel :** Chaque trimestre, l'UX Writer réalise un échantillonnage de 50 textes produit (tirés aléatoirement sur toutes les surfaces) et les évalue au prisme du Tone of Voice Guide. Le score de cohérence est partagé avec l'équipe produit et sert de baseline pour les sprints suivants.

3. **Onboarding éditorial pour les nouveaux contributeurs :** Toute personne qui va rédiger du contenu produit (PM, designer, dev qui écrit un message d'erreur) suit une session de 45 minutes sur le Tone of Voice Guide avant de commencer. Un "cheat sheet" format A4 est disponible dans le design system.

**e) KPIs à suivre sur 90 jours**

**KPIs UX :**
- Taux de résolution autonome sur les messages d'erreur de paiement (mesurable via analytics : combien d'utilisateurs qui voient le message d'erreur complètent quand même leur action dans la session)
- Taux d'activation à l'onboarding (première transaction dans les 7 jours suivant la création du compte) — le message de bienvenue est un levier direct
- Score qualitatif en test utilisateur : "Ce message vous a-t-il aidé à comprendre ce qui s'est passé ?" (échelle 1-5 sur les messages d'erreur)

**KPIs Business :**
- Volume de tickets support liés aux erreurs de paiement : un message d'erreur actionnable réduit le recours au support
- NPS à 30 et 90 jours post-déploiement : mesure l'impact de la cohérence de ton sur la relation à la marque
- Taux de rétention à 30 jours : la cohérence expérientielle contribue à l'attachement produit

**Erreurs classiques :** Mesurer uniquement la qualité perçue des textes en test utilisateur sans suivre les KPIs comportementaux. Un texte "bien noté" en test peut quand même ne pas produire l'action attendue.

**Biais cognitif à corriger :** Le biais de confirmation pousse à ne montrer en test que les messages qu'on pense réussis. Tester aussi les messages qui semblent évidents — ce sont souvent eux qui créent le plus de friction.

---

## Concept 2 — Content design systémique

**Contexte :** MediConnect est un SaaS B2B de coordination de soins, utilisé par des hôpitaux, cliniques et médecins libéraux en France et au Maghreb. La plateforme compte 47 000 utilisateurs actifs, 12 équipes produit autonomes, et a été construite sur 7 ans par des équipes successives. Le design system existe mais le contenu n'y est pas intégré. Chaque équipe produit rédige ses propres messages, états vides, erreurs et labels de navigation. Résultat : il existe 14 formulations différentes pour dire "Aucun résultat trouvé" dans l'interface.

---

### Bloc 1 — Exercices (sans correction)

#### Exercice 1 — Traduction mentale

Comment aborderais-tu ce problème avec ta compréhension actuelle ?

Un médecin de ville utilise quotidiennement MediConnect pour coordonner les soins de ses patients. Lors d'un test utilisateur, il dit : "Je ne suis jamais sûr d'être au bon endroit dans l'application. Les mots changent selon les sections — parfois c'est 'dossier', parfois 'fiche patient', parfois 'profil médical'. Je dois vérifier que je fais bien la même chose."

**Question :** Sans chercher une solution systémique immédiatement, décris les 3 conséquences concrètes de cette incohérence terminologique pour ce médecin dans son travail quotidien. Qu'est-ce que cette observation révèle sur l'état du content design de MediConnect ?

---

#### Exercice 2 — Piège de paradigme

Qu'est-ce qui ne va pas ici ? Quels KPI seraient affectés ?

L'équipe décide de résoudre le problème en créant un glossaire partagé dans un document Google Docs, listé dans la page "Ressources" de l'intranet. Ce glossaire définit les termes officiels (ex. : "dossier patient" est le terme retenu). Un email est envoyé à toutes les équipes produit pour leur demander de mettre à jour leurs interfaces.

Trois mois plus tard, un nouvel audit révèle que 8 des 14 formulations sont toujours présentes.

**Questions :**
1. Pourquoi cette approche a-t-elle échoué ? Identifie les trois causes structurelles.
2. Quel est le vrai problème que cette approche n'a pas résolu ?
3. Comment le problème va-t-il s'aggraver si rien ne change dans les 12 prochains mois (context : 2 nouvelles équipes produit en recrutement) ?

---

#### Exercice 3 — Mini-cas réel

**Contexte :** Tu intègres MediConnect comme Content Designer. Ta première mission est de poser les bases d'un content design systémique sur les 6 prochains mois. Budget : 1 contenu designer (toi), pas de budget pour un outil de content management dédié (vous utilisez Figma + Zeroheight pour le design system existant).

**Dimension éthique à intégrer obligatoirement :** MediConnect est utilisé dans des contextes médicaux critiques. Une erreur terminologique (confondre "ordonnance" et "prescription", ou afficher "Aucun résultat" quand en réalité il y a une erreur de chargement) peut avoir des conséquences sur la continuité des soins. De plus, une partie des utilisateurs au Maghreb lisent en arabe : le design system doit anticiper les contraintes RTL.

**Questions :**

a) **Modèle mental AVANT :** Qu'est-ce que tu entendais par "design system de contenu" avant de lire la section théorique ? Pensais-tu que c'était une liste de règles de style ou quelque chose de plus structurel ?

b) **Content model :** Construis le content model de l'état vide de MediConnect (ex. : "Aucun dossier patient trouvé"). Ton modèle doit inclure les champs obligatoires, les champs optionnels, les règles de longueur, et au moins 3 exemples d'instanciation dans des contextes différents (résultats de recherche vides, nouveau compte sans données, filtre trop restrictif).

c) **Gouvernance sans outil dédié :** Propose un système de gouvernance réaliste avec les outils disponibles (Figma + Zeroheight). Comment intègres-tu le contenu au design system existant sans budget d'outil supplémentaire ?

d) **Priorisation :** Avec 6 mois et 1 designer, tu ne peux pas tout faire. Quelles sont les 3 surfaces ou composants que tu traites en priorité et pourquoi ? Utilise une logique impact/effort et l'enjeu médical pour justifier.

e) **KPIs :** Quels indicateurs permettent de mesurer la valeur d'un content design systémique sur un produit B2B médical ? Comment les présentes-tu à ta direction pour justifier l'investissement ?

---

### Bloc 2 — Corrections

#### Correction Exercice 1

**Conséquences concrètes pour le médecin :**

1. **Charge cognitive augmentée :** Le médecin doit maintenir une carte mentale de la correspondance entre les termes ("dossier = fiche patient = profil médical"). Cette charge cognitive s'ajoute à celle inhérente à son travail clinique (diagnostics, prescriptions, urgences). Elle augmente le risque d'erreur et la fatigue décisionnelle.

2. **Perte de confiance dans le système :** L'incohérence terminologique crée le doute sur la cohérence fonctionnelle du produit. Si les mots changent, est-ce que les fonctionnalités sont vraiment les mêmes ? Ce doute ralentit l'adoption de nouvelles fonctionnalités et peut conduire à des comportements de contournement (double-vérification manuelle, utilisation d'outils externes).

3. **Risque d'erreur opérationnelle :** Dans un contexte médical, "dossier" et "fiche patient" pourraient désigner des objets légèrement différents (dossier = ensemble des documents liés à un patient ; fiche = informations administratives de base). Si un utilisateur intègre cette différence à tort à partir de l'interface, il peut mal utiliser la fonctionnalité associée.

**Ce que révèle l'observation :**
L'absence de gouvernance éditoriale centralisée. Chaque équipe produit a ses propres conventions terminologiques, sans arbitrage. Le design system est un système visuel, pas un système de contenu.

**KPI immédiatement impacté :** Task success rate — les utilisateurs hésitants sur la terminologie ont un taux de complétion de tâche plus faible sur les actions impliquant une navigation inter-sections.

---

#### Correction Exercice 2

**Trois causes structurelles de l'échec :**

1. **La gouvernance est optionnelle.** Un email de demande n'est pas un processus. Sans critère d'acceptation dans les tickets de développement (ex. : "le terme 'dossier patient' est utilisé dans tous les labels"), la mise à jour n'est jamais prioritaire face aux nouvelles fonctionnalités.

2. **Le glossaire n'est pas dans le flux de travail.** Un document Google Docs dans une page "Ressources" n'est consulté que si quelqu'un pense à le chercher. Si le contenu n'est pas intégré au design system (là où les équipes travaillent tous les jours), il sera ignoré.

3. **Pas de responsable identifié par surface.** L'email demande à "toutes les équipes" de mettre à jour — personne ne se sent personnellement responsable. Sans propriétaire par surface ou par composant, les mises à jour ne se produisent pas.

**Le vrai problème non résolu :**
La création de nouveaux contenus. Le glossaire corrige peut-être les textes existants (si les équipes jouent le jeu), mais il ne prévient pas la création de nouveaux termes divergents par les 2 nouvelles équipes à venir. Sans intégration au processus de création de contenu, le problème se recréera indéfiniment.

**Aggravation sur 12 mois :**
2 nouvelles équipes produit = 2 nouvelles bases de connaissances tacites = potentiellement 6 à 8 nouvelles formulations pour les concepts existants. La dette terminologique va croître plus vite que la capacité à la corriger, jusqu'à ce qu'une refonte complète de la terminologie soit nécessaire — un projet bien plus coûteux qu'une gouvernance initiale bien posée.

**Biais cognitif à corriger :** Le "biais de disponibilité" — l'équipe a produit une solution (le glossaire) et suppose que le problème est réglé parce qu'une action visible a été réalisée. Mesurer le résultat (audit 3 mois après) est exactement la bonne pratique : c'est ce qui révèle l'illusion.

---

#### Correction Exercice 3

**a) Modèle mental typique avant formation**
La plupart des apprenants pensent "design system de contenu" = "charte éditoriale" ou "guide de style". Ce modèle est partiel : il couvre les règles d'écriture mais pas la structure des données de contenu (content models), la gouvernance (qui valide quoi), ni la scalabilité (comment le contenu évolue sans se fragmenter).

**b) Content model — État vide MediConnect**

```
TYPE : État vide (Empty state)
IDENTIFIANT : component/empty-state

CHAMPS OBLIGATOIRES :
  - titre [string] : max 6 mots — formulation de la situation, pas de l'erreur
  - corps [string] : max 25 mots — cause de l'état vide + action suggérée
  - CTA primaire [string] : max 4 mots — action directe et concrète

CHAMPS OPTIONNELS :
  - icône [illustration] : visuel neutre en rapport avec la section
  - lien d'aide [string] : max 5 mots — vers documentation contextuelle
  - CTA secondaire [string] : max 4 mots — alternative si le CTA primaire n'est pas possible

RÈGLES :
  - Ne jamais utiliser "Aucun résultat" seul (formulation trop générique et anxiogène)
  - Distinguer : état vide par défaut (nouveau compte) / état vide par filtre / état vide par erreur
  - En contexte médical critique : toujours préciser si l'absence de données est normale ou potentiellement due à une erreur de chargement
```

**Exemples d'instanciation :**

*1. Nouveau compte médecin — section "Mes patients"*
- Titre : "Aucun patient dans votre liste"
- Corps : "Ajoutez un premier dossier patient ou demandez à votre coordinateur d'en partager un avec vous."
- CTA primaire : "Ajouter un patient"
- CTA secondaire : "Contacter mon coordinateur"

*2. Résultats de recherche vides — filtre trop restrictif*
- Titre : "Aucun dossier ne correspond à vos filtres"
- Corps : "Essayez d'élargir la période ou de retirer un critère de recherche."
- CTA primaire : "Réinitialiser les filtres"
- Lien d'aide : "Comment affiner une recherche"

*3. Erreur de chargement masquée en état vide — contexte critique*
- Titre : "Les ordonnances ne se sont pas chargées"
- Corps : "Une erreur est survenue lors du chargement. Vos données ne sont pas perdues."
- CTA primaire : "Réessayer"
- CTA secondaire : "Contacter le support"
- Note éthique : **Ne jamais afficher "Aucune ordonnance" si la raison est une erreur de chargement** — un médecin pourrait interpréter l'absence de données comme une absence de prescription active pour son patient.

**c) Gouvernance avec Figma + Zeroheight**

1. **Dans Figma :** Chaque composant du design system intègre une section "Content guidelines" dans les annotations. Le composant "Empty State" est documenté avec son content model complet et ses 3 exemples d'instanciation directement accessibles aux designers.

2. **Dans Zeroheight :** Une section "Content" est créée au même niveau que "Components" et "Foundations". Elle contient : le glossaire officiel, le guide de ton (version synthétique), les content models par composant, et les règles de localisation (RTL pour l'arabe).

3. **Processus de validation :** Tout nouveau texte produit est soumis au canal Slack `#content-review` avant merge. Le Content Designer a 48h pour valider. Les critères d'acceptation des tickets incluent explicitement : "Les termes utilisés correspondent au glossaire officiel du design system."

**d) Priorisation — 3 surfaces en 6 mois**

**Priorité 1 : Les messages d'erreur (Mois 1-2)**
Impact critique (contexte médical), effort moyen. Un content model unique pour tous les messages d'erreur, intégré au design system. Élimine le risque d'erreurs terminologiques sur des informations médicales critiques.

**Priorité 2 : La navigation et les labels de section (Mois 2-4)**
Impact élevé (cause directe de la confusion terminologique identifiée en test), effort élevé (implique de coordonner toutes les équipes produit). Aligner le glossaire sur les termes de navigation donne un levier transversal.

**Priorité 3 : Les états vides (Mois 4-6)**
Impact moyen, effort faible. Les états vides sont des composants récurrents, très visibles pour les nouveaux utilisateurs, et souvent négligés (formulations laissées par les développeurs). Un content model unique produit un résultat visible rapidement.

**e) KPIs pour un contexte B2B médical**

La direction d'un SaaS B2B est sensible aux KPIs business directs. Formuler les KPIs UX en termes business :

| KPI UX | Formulation business |
|---|---|
| Task success rate sur les actions critiques (ajout de patient, accès à l'ordonnance) | "Réduction du temps moyen pour compléter une tâche critique" — se traduit en productivité récupérée pour les soignants |
| Volume de tickets support liés à la confusion terminologique | "Réduction du coût de support de X % sur le périmètre systémique" |
| SUS avant/après déploiement du content system | "Amélioration de la satisfaction utilisateur mesurée (SUS)" — argument de rétention des comptes |
| Vélocité de livraison (temps de validation du contenu par sprint) | "Accélération de la mise sur le marché des nouvelles fonctionnalités" |

**Argument ROI synthétique :** "Chaque minute gagnée par un soignant sur la navigation dans MediConnect est une minute restituée au soin du patient. Sur 47 000 utilisateurs actifs, une réduction de 2 minutes par jour représente 94 000 minutes/jour de productivité médicale récupérée."

**Améliorations possibles :** Intégrer un testing utilisateur rapide (guerilla testing de 5 utilisateurs) avant et après le déploiement de chaque content model pour objectiver l'impact sur le task success rate.

---

## Concept 3 — Triangle faisabilité / désirabilité / viabilité

**Contexte :** GlobalBasket est un e-commerce alimentaire international opérant en Europe, Afrique de l'Ouest et Asie du Sud-Est. Un chef de produit propose une fonctionnalité de "liste de courses collaborative" permettant à une famille ou un foyer de construire ensemble leur panier en temps réel depuis plusieurs appareils. La fonctionnalité est désirée par 78 % des utilisateurs interrogés en discovery. L'équipe de développement estime 12 semaines de développement minimum. Le head of product doit livrer la roadmap du prochain trimestre dans 3 semaines.

---

### Bloc 1 — Exercices (sans correction)

#### Exercice 1 — Traduction mentale

Comment aborderais-tu ce problème avec ta compréhension actuelle ?

Le PM présente la fonctionnalité de liste collaborative à la direction avec le slide suivant :

> "78 % des utilisateurs veulent cette fonctionnalité. L'équipe peut la développer. On doit la faire."

**Question :** Cette présentation est-elle suffisante pour décider ? Qu'est-ce qui manque dans ce raisonnement ? Formule 3 questions que tu poserais au PM avant de valider la mise en backlog prioritaire de cette fonctionnalité.

---

#### Exercice 2 — Piège de paradigme

Qu'est-ce qui ne va pas ici ? Quels KPI seraient affectés ?

Le PM, convaincu de l'intérêt de la fonctionnalité, décide de la mettre en développement sans formaliser les contraintes. À mi-parcours (semaine 6), les problèmes suivants émergent :

- L'API de synchronisation en temps réel coûte 3x le budget infra prévu
- La fonctionnalité ne fonctionne pas correctement sur les connexions 3G (marché prioritaire en Afrique de l'Ouest)
- Les retours légaux indiquent qu'un compte partagé entre plusieurs adultes pose des problèmes de responsabilité sur les achats dans 3 pays de déploiement
- L'équipe design réalise que l'UX de collaboration en temps réel nécessite 3 semaines supplémentaires de conception

**Questions :**
1. Lesquels de ces problèmes auraient pu être détectés avant le début du développement ? Comment ?
2. Quel est le coût réel de cette découverte tardive ? (Pas uniquement financier — considère l'impact sur l'équipe, les KPIs, la roadmap)
3. Propose le contenu d'un Design Decision Record (DDR) pour documenter la décision qui aurait dû être prise en semaine 0.

---

#### Exercice 3 — Mini-cas réel

**Contexte :** Tu es UX Designer chez GlobalBasket. Le head of product te demande de "sauver" la fonctionnalité de liste collaborative : trouver la version qui peut être livrée dans 6 semaines (le délai restant), qui respecte les contraintes légales et infra, et qui reste désirable pour les utilisateurs.

**Dimension éthique à intégrer obligatoirement :** En Afrique de l'Ouest, GlobalBasket est utilisé par des foyers dont les décisions d'achat alimentaire sont souvent collectives mais avec une dynamique de genre complexe (femme principale gestionnaire du budget alimentaire dans certains contextes, prise de décision partagée dans d'autres). Ta fonctionnalité ne doit pas renforcer des stéréotypes de rôles genrés dans la gestion du foyer.

**Questions :**

a) **Modèle mental AVANT :** Comment comprends-tu le triangle faisabilité/désirabilité/viabilité intuitivement ? Avais-tu tendance à prioriser l'un des trois axes ?

b) **Arbitrage documenté :** Construis la matrice des contraintes pour la version "sauvée" de la fonctionnalité. Pour chaque axe (faisabilité, désirabilité, viabilité), identifie les contraintes non négociables et les éléments sur lesquels un compromis est possible.

c) **MoSCoW du contenu :** Applique le framework MoSCoW aux éléments de la fonctionnalité (pas au développement technique, mais aux éléments d'expérience utilisateur). Qu'est-ce qui est Must have / Should have / Could have / Won't have pour la version livrée dans 6 semaines ?

d) **DDR :** Rédige le Design Decision Record complet pour la décision de scope retenue.

e) **KPIs :** Quels KPIs utilises-tu pour valider (ou invalider) l'hypothèse que la version réduite reste désirable pour les utilisateurs ?

---

### Bloc 2 — Corrections

#### Correction Exercice 1

**Ce qui manque dans le raisonnement du PM :**

Le raisonnement ignore deux des trois axes du triangle :

1. **La désirabilité est partielle.** "78 % veulent la fonctionnalité" mesure l'intention déclarée, pas l'usage réel. Combien d'utilisateurs utiliseront réellement la liste collaborative de façon régulière ? Avec qui (conjoint, colocataires, famille élargie) ? Dans quel contexte (préparation d'une commande hebdomadaire, achat impulsif, courses d'urgence) ?

2. **La faisabilité n'est pas qualifiée.** "L'équipe peut la développer" : à quel coût infra ? Avec quelles dépendances ? Sur quelles plateformes (iOS, Android, web, connexions lentes) ? En combien de temps réel (12 semaines "minimum" peut signifier 18 semaines en pratique) ?

3. **La viabilité est absente.** Quel est le retour sur investissement attendu ? La fonctionnalité augmente-t-elle la fréquence d'achat ? Le panier moyen ? La rétention ? Y a-t-il des implications légales (compte partagé, responsabilité sur les achats) ?

**3 questions à poser au PM :**
1. "Parmi ces 78 %, quelle proportion a effectivement effectué des achats collaboratifs par un autre moyen récemment ? Quel est le comportement actuel ?" (valide la désirabilité comportementale)
2. "Quelle est l'estimation du coût infra mensuel récurrent de la synchronisation en temps réel, et quel impact sur nos marges ?" (valide la viabilité financière)
3. "Cette fonctionnalité a-t-elle été évaluée par notre équipe légale pour les marchés Afrique de l'Ouest et Asie du Sud-Est ?" (valide la viabilité réglementaire)

---

#### Correction Exercice 2

**Problèmes détectables en semaine 0 :**

| Problème | Détectable en amont ? | Comment ? |
|---|---|---|
| Coût API de synchronisation 3x | Oui | Évaluation technique préliminaire (spike technique de 2-3 jours) |
| Non-fonctionnement sur 3G | Oui | Test de performance sur réseau dégradé en phase de conception — contrainte connue sur ce marché |
| Problèmes légaux compte partagé | Oui | Consultation légale préalable au développement — standard pour toute fonctionnalité impliquant des données partagées |
| UX collaboration insuffisamment conçue | Oui | Conception à la bonne profondeur avant le développement (les 3 semaines manquantes auraient dû précéder le sprint de dev) |

**Coût réel de la découverte tardive :**
- **Financier :** 6 semaines de développement "perdues" + coût des décisions à reconstruire + surcoût infra imprevu
- **Équipe :** Frustration et perte de confiance (les devs ont travaillé 6 semaines sur quelque chose qui doit être revu). Risque de désengagement et d'érosion de la collaboration design-dev.
- **Roadmap :** Les 6 semaines restantes sont sous pression maximale pour livrer une version appauvrie. Les fonctionnalités qui auraient dû démarrer au trimestre 2 sont repoussées.
- **KPIs :** Vélocité de sprint dégradée pour ce trimestre. Satisfaction de l'équipe (eNPS interne) potentiellement affectée.

**DDR — Décision semaine 0 :**

```
DESIGN DECISION RECORD #42
Date : Semaine 0
Fonctionnalité : Liste de courses collaborative
Décideurs : Head of Product, UX Lead, Tech Lead, Legal

CONTEXTE
78 % des utilisateurs expriment un intérêt pour la liste collaborative. 
Délai demandé : 12 semaines. Marchés : Europe, Afrique de l'Ouest, Asie du Sud-Est.

OPTIONS CONSIDÉRÉES
Option A : Liste collaborative temps réel (synchronisation en temps réel)
Option B : Liste collaborative asynchrone (invitation + partage de liste, mise à jour 
           manuelle, sans synchronisation en temps réel)
Option C : Report à trimestre 3 après résolution des contraintes

CONTRAINTES IDENTIFIÉES
- Faisabilité : Option A nécessite une API de synchronisation dont le coût récurrent 
  est en cours d'évaluation (spike technique : 2-3 jours). Option B faisable en 8 semaines.
- Faisabilité : La connexion 3G est la norme en Afrique de l'Ouest. 
  Option A non fonctionnelle dans ce contexte sans optimisation dédiée (+4 semaines).
- Viabilité : L'équipe légale doit valider la gestion des comptes partagés dans 
  12 pays (délai estimé : 2 semaines).
- Désirabilité : La recherche utilisateur n'a pas testé la distinction 
  temps réel vs asynchrone. Hypothèse à valider.

DÉCISION
Option B — Liste collaborative asynchrone — dans 8 semaines.
Rationale : Faisable dans le délai, compatible avec les contraintes réseau, 
viabilité légale plus simple. La désirabilité de la version asynchrone sera 
validée par un test utilisateur en semaine 4.

CE QU'ON N'INCLUT PAS
Synchronisation temps réel. Cette fonctionnalité est mise en backlog pour T3 
après résolution des contraintes infra et légales.

INDICATEURS DE RÉVISION
Si le taux d'utilisation de la liste asynchrone dépasse 40 % des utilisateurs actifs 
à 30 jours, prioriser la version temps réel au trimestre suivant.
```

---

#### Correction Exercice 3

**a) Modèle mental typique**
La majorité des designers ont tendance à sur-pondérer la désirabilité (ce que les utilisateurs veulent) au détriment de la faisabilité et de la viabilité. Ce biais est naturel : la formation UX met l'accent sur la centricité utilisateur. L'apprentissage clé est que défendre les utilisateurs, c'est aussi s'assurer que le produit est viable et livrable — sinon, les utilisateurs n'ont rien du tout.

**b) Matrice des contraintes**

| Axe | Contraintes non négociables | Compromis possibles |
|---|---|---|
| Faisabilité | Compatible 3G / pas de synchronisation temps réel / délai 6 semaines max | Périmètre fonctionnel (certaines fonctions reportées) |
| Désirabilité | Le partage de liste doit être perceptible comme "collaboratif" | Le temps réel n'est pas obligatoire si la valeur perçue reste présente |
| Viabilité | Conformité légale dans tous les marchés de déploiement | Lancement progressif par marché si la validation légale n'est pas universellement prête |

**c) MoSCoW de l'expérience utilisateur**

**Must have :**
- Créer une liste et la partager avec une ou plusieurs personnes via lien ou invitation
- Ajouter, supprimer, modifier des articles dans la liste partagée
- Voir qui a ajouté quoi (attribution des articles)
- Notification quand la liste est modifiée par un autre membre

**Should have :**
- Historique des modifications (qui a changé quoi, quand)
- Marquer un article comme "acheté" visible par tous
- Commentaire court sur un article

**Could have :**
- Synchronisation en temps réel (si la contrainte infra est résolue en T3)
- Suggestions intelligentes basées sur les habitudes de la liste

**Won't have (dans cette version) :**
- Chat intégré à la liste
- Gestion de plusieurs listes simultanées par foyer
- Intégration avec agenda ou planificateur de repas

**Dimension éthique :** L'invitation à rejoindre une liste est envoyée via lien partageable (pas via un rôle prédéfini). Il n'y a pas de notion de "gestionnaire" vs "contributeur" avec des droits différents — tous les membres ont les mêmes droits sur la liste. Cela évite de coder une hiérarchie de décision dans la fonctionnalité, qui pourrait renforcer des dynamiques de genre non souhaitées. Le libellé de l'invitation est neutre : "Rejoindre la liste de courses" (pas "Aider à faire les courses").

**d) DDR version livrée en 6 semaines**

```
DESIGN DECISION RECORD #43
Date : Semaine 6 (version de sauvetage)
Fonctionnalité : Liste de courses collaborative — version asynchrone
Décideurs : Head of Product, UX Designer, Tech Lead

CONTEXTE
Découverte tardive de contraintes (infra, réseau, légal) en semaine 6 
sur la version temps réel initialement spécifiée.

DÉCISION
Livraison d'une version asynchrone dans les 6 semaines restantes.
Le scope a été réduit selon un MoSCoW documenté (voir #content-model-42).

CE QU'ON ACCEPTE
- Pas de synchronisation temps réel dans cette version
- Lancement en Europe uniquement (validation légale Afrique de l'Ouest en cours)

IMPLICATIONS CONNUES
- 22 % des utilisateurs interrogés attendaient une synchronisation en temps réel. 
  Risque de déception mesuré et accepté car la valeur principale (partage et 
  coordination asynchrone) reste présente.
- Lancement différé en Afrique de l'Ouest : impact sur NPS local à surveiller.

INDICATEURS DE RÉVISION
- Taux d'utilisation > 35 % à 30 jours : prioriser la version temps réel en T3
- NPS feature < 7/10 : rouvrir la recherche utilisateur sur les besoins non satisfaits
```

**e) KPIs de validation de la désirabilité**

**KPIs UX :**
- Taux d'adoption de la fonctionnalité à 7 jours (% d'utilisateurs actifs ayant créé au moins une liste partagée)
- Taux de rétention de la fonctionnalité à 30 jours (% d'utilisateurs ayant utilisé la liste au moins 2 fois)
- NPS fonctionnalité (question in-app post-première utilisation : "Cette fonctionnalité a-t-elle répondu à votre besoin ?")

**KPIs Business :**
- Panier moyen des commandes issues d'une liste collaborative vs panier moyen sans liste
- Fréquence d'achat des utilisateurs de la liste vs les non-utilisateurs (la collaboration facilite-t-elle la planification ?)
- Taux de rétention à 90 jours (la fonctionnalité contribue-t-elle à la rétention globale ?)

---

## Concept 4 — Dette UX & collaboration dev

**Contexte :** WorkPulse est un SaaS B2B de gestion RH utilisé par des PME de 50 à 500 employés. Le produit a 8 ans et a été construit par des équipes successives sans design system jusqu'en 2023. Il existe aujourd'hui 3 bibliothèques de composants parallèles (l'ancienne, la "nouvelle" de 2021, et la "vraie nouvelle" de 2023), 2 systèmes de navigation différents selon les modules, et 27 formulations différentes pour les boutons d'action principale. L'équipe actuelle (2 designers, 6 développeurs front-end, 3 PMs) veut rembourser la dette mais n'a pas de plan structuré.

---

### Bloc 1 — Exercices (sans correction)

#### Exercice 1 — Traduction mentale

Comment aborderais-tu ce problème avec ta compréhension actuelle ?

Un responsable RH qui utilise WorkPulse depuis 4 ans dit lors d'un entretien utilisateur : "Je sais utiliser WorkPulse, mais chaque fois qu'on a une nouvelle personne dans l'équipe, ça prend du temps de leur expliquer. C'est pas logique d'un module à l'autre. Et parfois même moi, après les vacances, je cherche où est le bouton."

**Question :** Sans chercher de solution immédiate, décris ce que cette observation révèle sur la nature et les couches de la dette UX de WorkPulse. Qui, dans l'organisation, est impacté — et comment — par cette dette accumulée ?

---

#### Exercice 2 — Piège de paradigme

Qu'est-ce qui ne va pas ici ? Quels KPI seraient affectés ?

L'équipe décide de traiter la dette UX en dédiant un sprint complet de 3 semaines à la "refonte de la cohérence visuelle". Les 2 designers travaillent pendant 3 semaines à harmoniser les couleurs, les bordures de boutons, et les tailles de police à travers l'ensemble du produit. À la fin du sprint, ils présentent les maquettes à la direction et aux développeurs.

Les développeurs estiment alors le coût de l'implémentation : 14 semaines de développement pour modifier toutes les instances.

La direction refuse. Le projet est abandonné. La dette reste intacte.

**Questions :**
1. Identifie les 3 erreurs de méthode qui ont conduit à cet échec.
2. Pourquoi le chiffrage de 14 semaines était-il prévisible ? Que fallait-il évaluer avant de lancer le sprint ?
3. Comment aurait-il fallu aborder cette situation pour arriver à un résultat différent ?

---

#### Exercice 3 — Mini-cas réel

**Contexte :** Tu es UX Designer senior chez WorkPulse. La direction t'a donné carte blanche pour proposer un plan de remboursement de dette UX réaliste sur 12 mois, avec comme contrainte de ne pas bloquer les nouvelles fonctionnalités (la roadmap produit continue en parallèle).

**Dimension éthique à intégrer obligatoirement :** WorkPulse est utilisé par des équipes RH qui gèrent des dossiers d'employés sensibles (congés maladie, augmentations, évaluations de performance). Une interface incohérente ou une navigation ambiguë dans ces modules peut conduire à des erreurs RH (mauvaise saisie d'un congé, accès à un dossier non autorisé par erreur de navigation). Par ailleurs, WorkPulse est utilisé dans plusieurs entreprises ayant des équipes internationales : l'interface doit être accessible et compréhensible pour des utilisateurs dont le français n'est pas la langue maternelle.

**Questions :**

a) **Modèle mental AVANT :** Qu'est-ce que tu entendais par "dette UX" avant de lire la section théorique ? Pensais-tu uniquement aux problèmes visuels ou à quelque chose de plus large ?

b) **Audit structuré :** Décris comment tu conduirais un audit UX de dette sur WorkPulse en 4 semaines avec 2 designers. Quelles surfaces priorises-tu ? Quelle méthode d'évaluation utilises-tu ? Comment documentes-tu les résultats pour les rendre actionnables ?

c) **Négociation avec l'équipe dev :** Comment présentes-tu le plan de remboursement à l'équipe de développement pour obtenir leur adhésion ? Quels arguments utilises-tu ? Comment intègres-tu la dette dans le backlog sans bloquer les nouvelles fonctionnalités ?

d) **Prévention :** Quels mécanismes mets-tu en place pour éviter que la dette se reconstitue pendant les 12 mois du plan ?

e) **KPIs :** Comment mesures-tu le succès du remboursement de dette sur un horizon de 12 mois ? Quels indicateurs présentent-tu à la direction pour justifier l'investissement continu ?

---

### Bloc 2 — Corrections

#### Correction Exercice 1

**Ce que l'observation révèle :**

L'observation du responsable RH décrit trois couches de dette distinctes :

1. **Dette de navigation :** "Pas logique d'un module à l'autre" = deux systèmes de navigation coexistent. La dette structurelle est la plus coûteuse à rembourser car elle touche l'architecture même du produit.

2. **Dette de cohérence des composants :** "Je cherche où est le bouton" = 27 formulations de boutons d'action principale créent une imprévisibilité qui contraint même les utilisateurs expérimentés à revalider leur modèle mental après une pause.

3. **Dette d'apprentissage organisationnel :** "Ça prend du temps d'expliquer aux nouvelles personnes" = la dette UX a un coût d'onboarding caché. Chaque nouvelle recrue nécessite une formation informelle de pair à pair, ce qui consomme du temps de l'équipe RH.

**Qui est impacté et comment :**

| Partie prenante | Impact de la dette UX |
|---|---|
| Utilisateurs RH expérimentés | Friction cognitive résiduelle, erreurs après interruption |
| Nouvelles recrues | Courbe d'apprentissage allongée, dépendance aux collègues |
| Managers de PME | Perte de temps = perte directe de productivité RH |
| Équipe design | Difficulté à livrer de nouvelles fonctionnalités cohérentes sur base incohérente |
| Équipe dev | Chaque nouvelle fonctionnalité nécessite de naviguer entre 3 bibliothèques |
| Direction | Risque de churn client si un concurrent propose une UX plus claire |

**KPI immédiatement impacté :** Taux de rétention client B2B — dans le SaaS B2B, la complexité perçue du produit est l'une des premières raisons de non-renouvellement de contrat (source : études SaaS churn analysis).

---

#### Correction Exercice 2

**3 erreurs de méthode :**

1. **Absence d'évaluation de l'effort d'implémentation avant la conception.** Concevoir 3 semaines sans demander à l'équipe dev d'estimer le coût d'implémentation, c'est construire un plan sans budget. La règle : avant tout sprint de remboursement de dette, réaliser une évaluation technique rapide (2-3 jours) du coût d'implémentation des axes identifiés.

2. **Scope trop large pour un premier cycle.** Traiter "toute la cohérence visuelle" de l'ensemble du produit en un sprint est irréaliste sur un produit de 8 ans. Le remboursement de dette doit être incrémental : choisir un composant ou une surface, le traiter complètement, mesurer l'impact, répéter.

3. **Absence d'implication des devs dans la conception de la solution.** Les designers ont conçu seuls et présenté à la fin. Si les développeurs avaient été impliqués dès le début du sprint (pair design), l'estimation de 14 semaines aurait été connue en semaine 1 — permettant d'ajuster le scope avant d'investir 3 semaines de conception.

**Pourquoi 14 semaines étaient prévisibles :**
Un produit de 8 ans avec 3 bibliothèques parallèles a des centaines ou des milliers d'instances de composants non standardisés. Changer tous les boutons, toutes les typographies et tous les espacements nécessite de toucher potentiellement chaque page de l'application. L'évaluation d'impact devait précéder la conception : combien d'instances de chaque composant existe-t-il ? Quels composants sont centralisés vs dupliqués ?

**Approche alternative :**
1. Semaine 0-1 : Spike technique (évaluation de l'impact) — combien d'instances de chaque composant ? Lesquels sont centralisés dans une bibliothèque (coût de correction faible) vs dupliqués dans le code (coût élevé) ?
2. Semaine 1-2 : Sélectionner le composant le plus fréquent ET le moins coûteux à centraliser (ex. : le bouton principal)
3. Semaine 2-3 : Conception de la version canonique du bouton avec les devs en pair design
4. Semaine 4-6 : Implémentation et migration progressive
5. Mesurer l'impact, communiquer, et répéter sur le composant suivant

---

#### Correction Exercice 3

**a) Modèle mental typique**
La dette UX est souvent assimilée uniquement aux problèmes visuels (couleurs incohérentes, espacements différents). Ce modèle est partiel. La dette UX inclut aussi : les flux mal conçus (navigation incohérente), les contenus obsolètes (labels qui ne correspondent plus aux fonctionnalités), les composants dupliqués (même fonctionnalité, deux interfaces différentes), et l'accessibilité non adressée.

**b) Audit structuré en 4 semaines**

**Semaine 1 — Recensement :**
- Surface 1 : Navigation (2 systèmes identifiés → cartographier les 2 patterns et leurs contextes)
- Surface 2 : Boutons d'action principale (27 formulations → inventaire exhaustif avec capture d'écran et contexte)
- Surface 3 : Messages d'erreur et de confirmation (contexte critique RH)
- Outil : Tableau Airtable avec colonnes : surface / composant / problème identifié / type de dette (visuel, contenu, flux, accessibilité) / sévérité (1-3) / nombre d'utilisateurs touchés estimé

**Semaine 2 — Qualification et impact :**
- Pour chaque anomalie : évaluer le type, la sévérité, et le KPI impacté
- Priorisation : matrice 2x2 impact utilisateur (vertical) × effort de correction (horizontal)
- Critère éthique ajouté : les anomalies sur les modules de données sensibles (congés maladie, évaluations) sont automatiquement montées en sévérité 3 (critique), quelle que soit leur fréquence

**Semaine 3 — Estimation de l'effort :**
- Session de 2 jours avec l'équipe dev (spike technique) : pour chaque item prioritaire, estimer le coût de correction en jours/dev
- Résultat : backlog de dette UX priorisé avec coût estimé par item

**Semaine 4 — Plan et communication :**
- Regrouper les items en "packs" de remboursement (ex. : "Pack Navigation" = harmoniser les 2 systèmes de navigation sur le module RH de base)
- Présenter le plan à la direction avec l'impact KPI de chaque pack

**c) Négociation avec l'équipe dev**

L'adhésion des développeurs se construit sur trois arguments :

1. **"La dette vous ralentit aussi."** Chaque nouvelle fonctionnalité nécessite de choisir entre 3 bibliothèques, de décider quelle convention suivre, et potentiellement de maintenir 3 versions du même composant. Le remboursement de dette réduit leur charge cognitive sur chaque sprint futur.

2. **"On intègre la dette dans le backlog, on ne bloque pas la roadmap."** Proposer 20 % de la vélocité de sprint allouée à la dette (règle du 80/20). Sur un sprint de 10 points, 2 points vont systématiquement à la dette. Cette règle est transparente, prévisible, et n'empêche pas les nouvelles fonctionnalités.

3. **"On commence par les victoires rapides."** Les premiers items à traiter sont ceux avec le ratio impact/effort le plus favorable — des corrections visibles pour les utilisateurs, implémentables en 1 à 2 jours de développement. Ces succès rapides créent la dynamique et justifient la continuation.

**Format de présentation au dev :**
Utiliser un backlog de dette visible dans l'outil de gestion de projet (Jira, Linear) au même niveau que le backlog de fonctionnalités — pas dans un document séparé. Les items de dette ont les mêmes attributs qu'un ticket de fonctionnalité : contexte, critères d'acceptation, KPI impacté, effort estimé.

**d) Prévention**

1. **Critère d'acceptation "Design System compliance"** : tout nouveau ticket de développement inclut un critère d'acceptation explicite : "Les composants utilisés proviennent exclusivement de la bibliothèque de référence 2023. Aucun nouveau composant ad hoc ne doit être créé sans validation du design team."

2. **Design critique (critique de design) avant chaque sprint :** Session de 30 minutes en début de sprint où le designer valide que les nouvelles fonctionnalités n'introduisent pas de nouveaux patterns de dette (composants dupliqués, nouvelles exceptions non documentées).

3. **Indicateur de dette dans le reporting mensuel :** Un score de cohérence (% de surfaces conformes au design system de référence) est reporté mensuellement à la direction. Il augmente avec le remboursement, et doit ne pas diminuer avec les nouvelles fonctionnalités.

**e) KPIs sur 12 mois**

**Pour la direction (impact business) :**
- Taux de rétention client à 12 mois : l'amélioration de l'UX réduit le churn sur les PME qui comparent avec des concurrents plus modernes
- Volume de tickets support liés à la navigation et aux erreurs d'utilisation : indicateur direct de l'amélioration de la clarté du produit
- Vélocité de livraison (story points par sprint) : le remboursement de dette doit se traduire par une vélocité accrue sur les sprints futurs

**Pour l'équipe produit (suivi de la dette) :**
- Score de conformité design system : % des composants actifs en production provenant de la bibliothèque de référence 2023 (cible : passer de 40 % à 80 % en 12 mois)
- Nombre de patterns de navigation distincts : réduire de 2 à 1 sur le périmètre core
- SUS avant/après les packs de remboursement : mesure de l'impact perçu sur l'utilisabilité

**Argument ROI synthétique :** "Chaque point de churn annuel évité représente X euros de revenu récurrent annuel (ARR) préservé. L'investissement de 20 % de vélocité de sprint sur 12 mois pour rembourser la dette est amorti dès la prévention du premier churn client attribuable à des problèmes d'UX."

**Améliorations possibles :** Mettre en place un panel utilisateur de 5 à 8 responsables RH qui testent les nouvelles versions des modules après chaque pack de remboursement — les données qualitatives renforcent les KPIs quantitatifs auprès de la direction.

**Biais cognitif à corriger :** Le "biais du coût irrécupérable" pousse les équipes à conserver des composants ou des patterns hérités ("on a mis du temps à les faire") même s'ils génèrent de la dette. Le remboursement de dette requiert d'accepter de "défaire" du travail passé — ce n'est pas un échec, c'est de la maintenance productive.

**Changement de paradigme :** La dette UX n'est pas un problème de qualité à résoudre une fois pour toutes — c'est une force physique constante à contre-balancer par des rituels réguliers.

---

*Fin de la Section 13 — Exercices. La théorie associée est disponible dans le fichier `13-uxwriting-delivery-theorie.md`.*
