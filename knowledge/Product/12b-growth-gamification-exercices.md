# Section 12 — Growth, Gamification & Engagement — Exercices

> **Mode d'emploi** : Pour chaque concept, effectue d'abord les trois exercices *sans lire les corrections*. Note tes réponses par écrit. L'efficacité pédagogique repose sur cet effort de formulation préalable — même une réponse imparfaite active les bons schémas mentaux.

---

## Sommaire

- [Concept 1 — Growth loops & activation](#concept-1--growth-loops--activation)
- [Concept 2 — Onboarding stratégique](#concept-2--onboarding-stratégique)
- [Concept 3 — Gamification éthique](#concept-3--gamification-éthique)
- [Concept 4 — Habit loops & rétention](#concept-4--habit-loops--rétention)

---

## Concept 1 — Growth loops & activation

### Contexte

**Flowly** est un SaaS de gestion de projet pour équipes créatives (agences, studios de design, équipes marketing). Le produit a été lancé il y a 6 mois. Les métriques actuelles :

- Inscriptions : 3 200 comptes
- Utilisateurs actifs à J30 : 480 (15 %)
- Coefficient viral K : 0,08
- Time-to-value estimé : 4 jours (délai moyen avant qu'un utilisateur crée son premier projet collaboratif)
- NPS global : +12
- Principal canal d'acquisition : bouche-à-oreille (42 %), SEO (31 %), LinkedIn Ads (27 %)

L'équipe constate que les utilisateurs qui ont créé un projet collaboratif avec au moins 2 collègues dans les 48h suivant l'inscription ont une rétention à J30 de 67 % — contre 8 % pour ceux qui ne l'ont pas fait.

---

### BLOC 1 — Exercices (sans correction)

**Exercice 1 — Traduction mentale**

> "Comment aborderais-tu ce problème avec ta compréhension actuelle ?"

Le taux de rétention à J30 est de 15 % — bien en dessous des standards SaaS B2B (attendu > 40 % pour ce segment). L'équipe veut construire une growth loop plutôt que d'augmenter le budget publicitaire.

Comment identifierais-tu le moment "aha" de Flowly ? Quels seraient les éléments de ta démarche pour passer d'un funnel classique à une boucle de croissance composée ? Quels KPIs suivrais-tu pour valider que la boucle fonctionne ?

---

**Exercice 2 — Piège de paradigme**

> "Qu'est-ce qui ne va pas ici ? Quels KPI seraient affectés ?"

Le CPO de Flowly lit les données et conclut :

> "Notre NPS de +12 est correct mais nos inscriptions ralentissent. La solution est claire : on doit lancer une campagne LinkedIn Ads plus agressive et offrir un mois gratuit à tout nouvel inscrit. On va également ajouter une page de features complète dans l'onboarding pour que les gens comprennent tout ce que Flowly peut faire."

Identifie au moins 3 erreurs de raisonnement dans cette décision. Pour chaque erreur, précise quel KPI serait négativement impacté et pourquoi.

---

**Exercice 3 — Mini-cas réel**

> "Décris ton modèle mental AVANT de commencer. Comment implémenterais-tu la solution ? Quels KPI suivrais-tu ?"

**Situation** : L'équipe de Flowly a validé que le moment "aha" est "inviter au moins 2 collègues sur un projet dans les 48h". Le time-to-value actuel est de 4 jours — trop long.

La donnée supplémentaire révèle que 68 % des utilisateurs qui abandonnent avant J7 n'ont jamais invité de collègue. Parmi eux, 41 % ont créé un projet mais seul. Parmi ces derniers, 78 % travaillent dans des équipes de 3 personnes ou plus.

**Dimension inclusive** : L'équipe réalise que les utilisateurs issus de petites structures indépendantes (freelances, solopreneurs) ne peuvent pas atteindre le moment "aha" tel qu'il est défini — ils n'ont pas de collègues à inviter.

Décris ton modèle mental initial. Propose un plan d'action complet pour réduire le time-to-value de 4 jours à moins de 24h, intégrant les deux segments (équipes ET solopreneurs). Quels KPIs mesurerais-tu à J7, J14 et J30 pour valider l'impact ?

---

### BLOC 2 — Corrections

---

#### Correction — Exercice 1

**Modèle mental attendu**

Le premier réflexe doit être de chercher le comportement corrélé à la rétention dans les données existantes — pas d'inventer un "aha moment" depuis un bureau. Ici, la donnée est déjà disponible : "projet collaboratif avec 2 collègues en 48h → rétention J30 de 67 %". C'est le signal.

**Raisonnement UX/Product**

Le moment "aha" de Flowly est identifié empiriquement : c'est le premier projet collaboratif. Cela signifie que la valeur du produit est fondamentalement **sociale** — Flowly vaut plus quand plusieurs personnes l'utilisent ensemble. C'est le fondement d'une **boucle de croissance par réseau** : chaque utilisateur satisfait entraîne ses collègues, qui deviennent utilisateurs, qui entraînent les leurs.

**Solution détaillée**

*Étape 1 — Confirmer le moment "aha"*
- Mener 10 entretiens avec des utilisateurs retenus à J30 : quand ont-ils "compris" la valeur de Flowly ?
- Croiser avec les logs comportementaux : l'action "invitation d'un collègue" précède-t-elle systématiquement la rétention ?

*Étape 2 — Construire la growth loop*
La boucle potentielle : Nouvel utilisateur → crée un projet → invite des collègues → les collègues s'inscrivent → créent leurs propres projets → invitent leurs collègues → ...

Pour que cette boucle fonctionne, il faut :
- Rendre l'invitation aussi simple et rapide que possible (< 30 secondes)
- Donner une raison claire à l'invité de rejoindre immédiatement (valeur visible avant même l'inscription)
- Réduire la friction d'inscription pour l'invité (SSO, accès direct au projet partagé)

*Étape 3 — Mesurer la boucle*
- Coefficient K = (nombre moyen d'invitations envoyées par utilisateur activé) × (taux de conversion invitation → inscription)
- Objectif intermédiaire : K > 0,3 (le K actuel de 0,08 est très faible)
- Si K > 1, la boucle est auto-suffisante

**KPIs impactés**

| KPI | Valeur actuelle | Objectif |
|-----|----------------|---------|
| Taux de rétention J30 | 15 % | > 40 % |
| Coefficient K | 0,08 | > 0,3 (puis > 1) |
| Time-to-value | 4 jours | < 48h |
| Taux d'activation (projet collaboratif J2) | Inconnu | À mesurer, cible > 35 % |

**Erreurs classiques**
- Chercher le moment "aha" par intuition plutôt que par données comportementales
- Définir le moment "aha" autour d'une action solo (créer un projet seul) alors que la valeur est collaborative
- Négliger le coefficient K — une growth loop non mesurée ne peut pas être optimisée

**Correction des biais cognitifs**
- Biais de disponibilité : l'équipe pense à l'acquisition (ce qu'elle voit) plutôt qu'à la rétention (ce qu'elle oublie de voir)
- Biais de confirmation : interpréter un NPS de +12 comme "tout va bien" alors qu'il masque un problème d'activation sévère

**Améliorations possibles**
- Tester plusieurs "aha moments" en parallèle sur des cohortes séparées
- Analyser les utilisateurs qui churner après avoir atteint le moment "aha" pour comprendre pourquoi même l'activation ne suffit pas toujours

**Feedback itératif — changement de paradigme en 1 phrase**
> Avant d'investir en acquisition, répare la passoire : un taux de rétention de 15 % signifie que 85 % de ton budget marketing est jeté.

---

#### Correction — Exercice 2

**Modèle mental attendu**

Quand une métrique d'acquisition baisse, le réflexe "plus de budget" est quasi-automatique. Mais il faut d'abord s'assurer que ce qu'on acquiert a de la valeur. Ici, avec 15 % de rétention à J30, augmenter les inscriptions sans corriger l'activation revient à verser de l'eau dans un seau percé.

**Les 3 erreurs de raisonnement (minimum)**

*Erreur 1 — Augmenter le budget publicitaire sans corriger la rétention*
Le taux de rétention de 15 % signifie que pour chaque 100 € investis en acquisition, 85 € sont perdus après 30 jours. Augmenter le budget LinkedIn Ads amplifie le problème sans le résoudre. Le CAC va augmenter, la LTV reste faible, le ratio LTV/CAC se dégrade.

KPI affecté : **Ratio LTV/CAC** (s'effondre), **CAC** (augmente sans retour proportionnel), **Marge brute** (pression croissante).

*Erreur 2 — Le mois gratuit comme réponse à un problème d'activation*
Un mois gratuit prolonge la période de test mais ne corrige pas la raison pour laquelle les utilisateurs n'atteignent pas le moment "aha". Si le problème est un time-to-value trop long et un onboarding insuffisant, plus de temps gratuit ne change rien — les utilisateurs passeront juste plus de temps avant d'abandonner.

KPI affecté : **Taux de conversion trial → payant** (pas amélioré), **Taux de complétion de l'onboarding** (inchangé), **Coût de la période d'essai** (augmente sans retour).

*Erreur 3 — Ajouter une page de features complète dans l'onboarding*
C'est l'erreur classique de surcharge cognitive. Montrer toutes les fonctionnalités au démarrage déclenche la paralysie du choix et augmente le taux d'abandon à J1. Le moment "aha" de Flowly est le projet collaboratif — tout ce qui retarde l'arrivée à cette action est contre-productif.

KPI affecté : **Taux de complétion de l'onboarding** (chute), **Time-to-value** (augmente), **Taux d'abandon à J1** (augmente).

*Erreur bonus — Négliger le NPS comme signal ambigu*
Un NPS de +12 est faible pour un SaaS B2B (la cible standard est > 30-40). Le CPO l'interprète comme "correct" — c'est une lecture trop complaisante. Ce NPS indique que les utilisateurs ne sont pas enthousiastes au point de recommander activement, ce qui explique aussi le faible coefficient viral K.

KPI affecté : **Coefficient K** (corrélé au NPS), **Croissance organique** (limitée par un NPS insuffisant).

**Feedback itératif — changement de paradigme en 1 phrase**
> Investir en acquisition avec un produit sous-activé, c'est accélérer en voyant le mur — il faut d'abord tourner.

---

#### Correction — Exercice 3

**Modèle mental attendu**

La donnée est précieuse : 41 % des abandons sont des utilisateurs qui ont créé un projet solo. Ce sont des utilisateurs "presque convertis" — ils ont compris une partie de la valeur mais n'ont pas franchi l'étape de collaboration. Et 78 % d'entre eux travaillent en équipe. Le problème n'est pas la valeur du produit — c'est la friction à l'invitation.

La dimension solopreneur révèle un problème de définition du moment "aha" : il est trop étroit. Pour un freelance, la valeur de Flowly ne peut pas être collaborative — elle doit être personnelle (gestion de ses propres projets clients, présentation à ses clients, etc.).

**Raisonnement UX/Product**

Il y a deux segments distincts avec deux aha moments différents :
- **Segment équipes** : "Inviter au moins 2 collègues sur un projet dans les 48h"
- **Segment solopreneurs** : à définir — probablement "partager un projet avec un client en moins de 24h" ou "créer son premier projet avec template dans les 30 premières minutes"

**Solution détaillée**

*Pour le segment équipes (réduire le time-to-value de 4 jours à < 48h)*

1. Onboarding segmenté : dès l'inscription, demander "Utilisez-vous Flowly seul ou en équipe ?" → branche le parcours
2. Chemin court vers l'invitation : dès la création du premier projet, déclencher une incitation à inviter ("Flowly est plus puissant à plusieurs — invitez vos collègues maintenant, 30 secondes suffisent")
3. Réduire la friction d'invitation : auto-suggestion d'emails basée sur le domaine de l'email d'inscription (si l'utilisateur s'inscrit avec @agencecreative.fr, suggérer d'inviter d'autres @agencecreative.fr)
4. Email de re-engagement à H+24 : pour les utilisateurs ayant créé un projet solo, envoyer un email personnalisé "Votre projet [nom du projet] est prêt — invitez votre équipe pour l'activer vraiment"
5. Empty state informatif : l'écran "projet vide" montre ce à quoi ressemble le projet avec des collaborateurs (aperçu animé)

*Pour le segment solopreneurs (définir et atteindre un aha moment alternatif)*

1. Identifier par entretiens ce que les solopreneurs veulent accomplir (présenter à leurs clients ? gérer plusieurs projets ? créer des livrables ?)
2. Hypothèse à tester : "Partager un lien de projet public avec un client dans les 24h" comme aha moment alternatif
3. Mettre en avant cette fonctionnalité dès le premier écran post-inscription pour ce segment

*Dimension éthique et inclusive*

- Ne pas pénaliser les solopreneurs en leur proposant un produit "dégradé" faute de collègues — leur parcours doit avoir une valeur pleine et entière
- La segmentation doit être basée sur la déclaration volontaire et l'usage réel, pas sur une inférence algorithmique qui pourrait discriminer (ex. : inférer qu'une petite entreprise = moins de valeur)
- L'email de re-engagement doit proposer de la valeur, pas de la culpabilité — éviter "Vos collègues avancent sans vous"

**KPIs à mesurer**

| Moment | KPI | Cible |
|--------|-----|-------|
| J7 | Taux d'activation (projet collaboratif pour équipes / projet partagé pour solopreneurs) | > 45 % |
| J7 | Time-to-value moyen | < 24h |
| J7 | Taux de complétion de l'onboarding segmenté | > 60 % |
| J14 | Rétention (cohorte test vs cohorte contrôle) | +15 points vs baseline |
| J30 | Taux de rétention global | > 30 % (vs 15 % actuel) |
| J30 | Coefficient K | > 0,25 (vs 0,08 actuel) |
| J30 | NPS différentiel solopreneurs vs équipes | Mesure de l'effet du parcours alternatif |

**Erreurs classiques**
- Chercher une solution unique pour tous les segments → taux d'activation médiocre pour les deux
- Se concentrer sur la réduction des étapes sans identifier pourquoi l'invitation n'est pas faite (friction ? manque de compréhension de la valeur ? contexte organisationnel ?)
- Négliger le test de la solution sur une cohorte contrôle — impossible de mesurer l'impact sans comparaison

**Feedback itératif — changement de paradigme en 1 phrase**
> Un seul aha moment pour tous les utilisateurs, c'est une porte d'entrée trop étroite — la croissance se joue dans la diversité des chemins vers la valeur.

---

## Concept 2 — Onboarding stratégique

### Contexte

**Mentora** est une plateforme d'apprentissage en ligne pour adultes en reconversion professionnelle. Elle propose des parcours certifiants en data, design et développement produit. L'accès de base est gratuit (3 modules), l'accès complet est à 29 €/mois.

Métriques actuelles :
- Inscriptions mensuelles : 8 400
- Taux de complétion de l'onboarding (7 étapes) : 22 %
- Conversion vers abonnement payant : 4,1 %
- Rétention à J7 : 18 %
- NPS à J3 : +6
- Temps moyen pour accéder au premier module : 11 minutes après inscription
- Principal obstacle déclaré (enquête sortie) : "Je ne savais pas par où commencer" (53 %), "Trop de choix" (31 %)

La plateforme cible des adultes de 28 à 52 ans, souvent avec un rapport complexe à l'apprentissage (peur de l'échec scolaire passé, manque de temps, doute sur leurs capacités).

---

### BLOC 1 — Exercices (sans correction)

**Exercice 1 — Traduction mentale**

> "Comment aborderais-tu ce problème avec ta compréhension actuelle ?"

Le NPS de +6 et le taux de complétion de l'onboarding de 22 % signalent une expérience de premier contact ratée. La plateforme a une offre de valeur forte (reconversion certifiante) mais ne parvient pas à la transmettre dès le départ.

Comment redesignerais-tu l'onboarding de Mentora pour réduire la friction et augmenter le taux de complétion ? Quels principes de progressive disclosure et de personnalisation de parcours appliquerais-tu en priorité ?

---

**Exercice 2 — Piège de paradigme**

> "Qu'est-ce qui ne va pas ici ? Quels KPI seraient affectés ?"

L'équipe Mentora réunit les résultats de l'enquête de sortie et conclut :

> "Les utilisateurs disent 'trop de choix'. La solution est simple : on va réduire notre catalogue de 120 à 20 parcours pour simplifier. On va aussi rendre l'onboarding plus court en supprimant 4 des 7 étapes — on gardera juste email + mot de passe. Et on va afficher le prix de 29 €/mois dès la page d'inscription pour être plus transparents."

Identifie les erreurs de raisonnement. Quels KPIs seraient affectés et dans quel sens ?

---

**Exercice 3 — Mini-cas réel**

> "Décris ton modèle mental AVANT de commencer. Comment implémenterais-tu la solution ? Quels KPI suivrais-tu ?"

**Situation** : L'équipe décide de refondre l'onboarding. Elle dispose des données suivantes :

- Les utilisateurs qui répondent à 2 questions de segmentation ("Votre objectif ?" + "Votre niveau actuel ?") ont un taux de complétion de l'onboarding de 61 % vs 22 % pour ceux qui ne les voient pas
- Les utilisateurs qui accèdent à leur premier module dans les 10 minutes post-inscription ont une rétention J7 de 44 %
- 34 % des inscrits sont en situation d'insécurité financière déclarée (cherchent une reconversion par nécessité, pas par choix)
- 18 % des utilisateurs déclarent avoir "peur de ne pas être assez compétents pour finir"

**Dimension inclusive et éthique** : La plateforme touche des personnes en situation de fragilité (reconversion forcée, insécurité financière, faible estime de soi liée à des échecs scolaires passés). Certaines mécaniques d'onboarding standard (mise en avant de la concurrence, urgence artificielle, affichage immédiat du prix) pourraient être particulièrement délétères pour ce public.

Décris ton modèle mental. Propose un onboarding en 5 étapes maximum qui atteint le premier module en moins de 10 minutes, tout en étant adapté aux profils vulnérables. Quels KPIs suivrais-tu pour valider l'impact sur ce public spécifique ?

---

### BLOC 2 — Corrections

---

#### Correction — Exercice 1

**Modèle mental attendu**

Un NPS de +6 signifie que la plateforme ne génère pas d'enthousiasme. Le taux de complétion de l'onboarding de 22 % signifie que 78 % des nouveaux inscrits abandonnent avant d'avoir vu la valeur. Le problème n'est pas le catalogue — c'est que les utilisateurs n'arrivent jamais à leur première victoire.

**Raisonnement UX/Product**

L'obstacle déclaré ("je ne savais pas par où commencer") pointe vers un problème de **surcharge de choix** et de **manque de guidance personnalisée**. L'onboarding doit réduire drastiquement l'espace de décision dès le départ — au lieu de proposer 120 parcours, guider l'utilisateur vers UN parcours qui lui correspond.

**Solution détaillée**

*Principe 1 — Segmentation à l'entrée*
Poser 2 questions maximum : "Votre objectif de reconversion ?" (liste de 5 options) + "Votre niveau actuel dans ce domaine ?" (débutant / quelques bases / intermédiaire). Ces 2 questions permettent de recommander 1 parcours personnalisé — pas 120.

*Principe 2 — Progressive disclosure*
- Niveau 1 (J1) : accès à 1 seul module recommandé, tout le reste est masqué
- Niveau 2 (J3-J7) : introduction des modules suivants du même parcours
- Niveau 3 (J14+) : découverte des parcours complémentaires, de la communauté, des certifications

*Principe 3 — Quick win immédiate*
Le premier module doit produire un apprentissage visible en moins de 15 minutes. Pas un texte introductif — une compétence micro-applicable. "Après ce module, vous saurez faire X."

*Principe 4 — Empty states motivants*
Les écrans vides affichent non pas "Commencez maintenant" mais une projection concrète : "Dans 3 mois, vous aurez les bases pour postuler à un poste de [métier cible]."

**KPIs à suivre**

- Taux de complétion de l'onboarding segmenté (objectif : > 55 %)
- Time-to-first-module (objectif : < 10 minutes)
- NPS à J3 (objectif : > +25)
- Rétention à J7 (objectif : > 35 %)

**Feedback itératif — changement de paradigme en 1 phrase**
> Un onboarding qui guide n'est pas un onboarding qui restreint — c'est un onboarding qui libère de la paralysie du choix.

---

#### Correction — Exercice 2

**Modèle mental attendu**

Réduire le catalogue et simplifier l'inscription sont de bonnes intuitions — mais les solutions proposées sont des remèdes à côté du problème réel, voire contreproductives.

**Analyse des erreurs**

*Erreur 1 — Réduire le catalogue de 120 à 20 parcours*
Le problème n'est pas la taille du catalogue — c'est que l'utilisateur voit tout le catalogue en même temps sans guidance. Supprimer 100 parcours appauvrit l'offre et peut exclure des profils de reconversion légitimes. La solution est la personnalisation à l'affichage, pas la suppression à la source.

KPI affecté : **Taux de conversion des profils de niche** (chute), **NPS des anciens utilisateurs** (perçu comme dégradation), **Part de marché** (recul face aux concurrents avec catalogues complets).

*Erreur 2 — Réduire l'onboarding à "email + mot de passe" seulement*
Supprimer les étapes de segmentation supprime la capacité à personnaliser le parcours — ce qui est précisément ce qui génère les 61 % de complétion. Les 7 étapes actuelles sont peut-être trop nombreuses, mais les supprimer toutes crée un onboarding sans valeur qui laisse l'utilisateur face à 120 choix sans guide.

KPI affecté : **Taux de complétion de l'onboarding** (paradoxalement en baisse malgré la "simplification"), **Time-to-value** (augmente car l'utilisateur erre sans direction), **Rétention J7** (baisse).

*Erreur 3 — Afficher le prix dès la page d'inscription*
La transparence est une valeur, mais le timing compte. Afficher 29 €/mois avant que l'utilisateur ait eu la moindre démonstration de valeur crée une objection financière à froid. Pour un public en reconversion avec des contraintes financières réelles, c'est un frein majeur.

KPI affecté : **Taux de conversion inscription → essai gratuit** (chute), **Taux d'abandon à l'inscription** (hausse), **Équité d'accès** (les profils en insécurité financière — 34 % de la cible — sont les plus impactés).

**Feedback itératif — changement de paradigme en 1 phrase**
> Simplifier l'apparence d'un onboarding sans en comprendre la structure, c'est enlever les rails d'un train pour qu'il aille plus vite.

---

#### Correction — Exercice 3

**Modèle mental attendu**

Les données donnent un chemin clair : la segmentation (2 questions) triple le taux de complétion, et l'accès au premier module en 10 minutes multiplie par 2,4 la rétention J7. Le design de l'onboarding doit mettre ces deux leviers au centre.

La dimension éthique est critique : 34 % des utilisateurs sont en insécurité financière, 18 % ont peur d'échouer. Ces profils nécessitent un design bienveillant — pas anxiogène, pas culpabilisant, pas précipitant vers un paiement.

**Raisonnement UX/Product**

L'onboarding doit être conçu autour de trois priorités :
1. Arriver au premier module en moins de 10 minutes
2. Créer un sentiment de compétence et de légitimité dès le départ
3. Ne jamais créer d'anxiété financière ou d'intimidation intellectuelle pendant l'onboarding

**Solution détaillée — Onboarding en 5 étapes**

*Étape 1 — Inscription simplifiée (< 1 minute)*
- SSO Google ou email uniquement
- Pas de mot de passe complexe imposé d'emblée
- Message d'accueil rassurant : "Bienvenue sur Mentora. Vous avez pris la bonne décision — on va vous guider."
- Aucune mention du prix à cette étape

*Étape 2 — Segmentation bienveillante (< 2 minutes)*
- Question 1 : "Vers quel domaine souhaitez-vous vous reconvertir ?" (5 options + "Je ne sais pas encore")
- Question 2 : "Comment vous sentez-vous par rapport à ce domaine ?" (Parfait débutant / J'ai quelques notions / Je connais les bases)
- Pour les "Je ne sais pas encore" : parcours de découverte guidé, pas d'exclusion
- Ton : encourageant, pas évaluatif. Jamais "Quel est votre niveau ?" — formulation qui peut réactiver une peur de l'évaluation

*Étape 3 — Recommandation personnalisée (< 30 secondes)*
- Afficher 1 seul parcours recommandé avec une phrase explicative : "Pour vous, nous recommandons [parcours] — adapté aux débutants complets, pour une reconversion vers [métier cible] en [durée réaliste]."
- Bouton unique : "Commencer ce parcours"
- Pas de catalogue complet à cette étape

*Étape 4 — Promesse concrète et premier module (< 1 minute d'introduction)*
- Afficher : "Dans ce premier module (12 min), vous apprendrez à [compétence spécifique et pratique]."
- Lancer le premier module immédiatement — sans intermédiaire
- ⏱ À ce stade, moins de 5 minutes se sont écoulées depuis l'inscription

*Étape 5 — Célébration du premier module complété*
- Message de validation positif et spécifique : "Vous venez de maîtriser [compétence]. C'est une base concrète que des professionnels utilisent chaque jour."
- Proposition de continuer avec le module 2 — sans pression sur l'abonnement
- L'invitation à passer à l'abonnement payant n'arrive qu'APRÈS le premier module complété, sur un mode informatif : "Pour continuer ce parcours, découvrez l'abonnement complet."

**Pour les profils vulnérables — mesures spécifiques**
- Éviter tout message comparatif ("Vos camarades ont déjà complété 3 modules")
- Intégrer des micro-messages de normalisation de l'erreur : "Il est normal de devoir revoir un concept — les meilleurs professionnels relisent régulièrement."
- Proposer un "mode pause" : "Ce parcours est à votre rythme. Revenez quand vous voulez, votre progression est sauvegardée."
- Ne jamais afficher d'urgence artificielle ("Offre expirée dans 2h") pour une population déjà sous pression psychologique

**KPIs à mesurer — avec focus sur les profils vulnérables**

| KPI | Population générale | Population vulnérable spécifique |
|-----|--------------------|---------------------------------|
| Taux de complétion de l'onboarding | > 55 % (vs 22 %) | Mesurer séparément pour les profils "insécurité financière" |
| Time-to-first-module | < 10 minutes | Identique — le standard doit être universel |
| Rétention J7 | > 35 % (vs 18 %) | Surveiller l'écart avec la population générale |
| NPS à J3 | > +25 (vs +6) | Mesurer le sentiment de "légitimité" déclaré |
| Taux de conversion gratuit → payant | > 8 % (vs 4,1 %) | Mesurer sans pression sur les profils déclarés en insécurité |
| Taux d'abandon post-affichage prix | À mesurer | Alert si > 2x le taux moyen pour les profils vulnérables |

**Erreurs classiques**
- Optimiser uniquement pour le taux de conversion sans mesurer l'équité d'accès
- Supposer qu'un onboarding court est toujours meilleur — ici, 2 questions de segmentation valent de l'or
- Afficher le prix avant la première valeur perçue

**Feedback itératif — changement de paradigme en 1 phrase**
> Un bon onboarding pour des personnes en fragilité ne réduit pas la friction — il remplace la peur par la confiance.

---

## Concept 3 — Gamification éthique

### Contexte

**MindPath** est une application de soutien en santé mentale pour adultes (18-65 ans). Elle propose des exercices de pleine conscience, des journaux guidés, des séances de respiration et du contenu psycho-éducatif. Elle est utilisée en autonomie mais aussi recommandée par des professionnels de santé (psychologues, médecins généralistes).

Métriques actuelles :
- Utilisateurs actifs : 210 000
- DAU/MAU : 0,14 (engagement quotidien faible)
- Rétention à J30 : 21 %
- NPS global : +18
- Principal motif d'abandon (enquête sortie) : "J'oubliais d'ouvrir l'application" (48 %), "Je me suis senti(e) jugé(e) quand je n'avançais pas" (22 %)

L'équipe produit envisage d'introduire des mécaniques de gamification pour améliorer l'engagement. Elle hésite entre plusieurs approches.

---

### BLOC 1 — Exercices (sans correction)

**Exercice 1 — Traduction mentale**

> "Comment aborderais-tu ce problème avec ta compréhension actuelle ?"

MindPath veut augmenter son DAU/MAU de 0,14 à 0,25 en 6 mois via la gamification. Tu es consultant(e) UX. La directrice produit te demande de proposer une stratégie de gamification.

Comment commencerais-tu ta réflexion ? Quelles questions poserais-tu avant de concevoir quoi que ce soit ? Quelles mécaniques envisagerais-tu en première intention et pourquoi ?

---

**Exercice 2 — Piège de paradigme**

> "Qu'est-ce qui ne va pas ici ? Quels KPI seraient affectés ?"

Un Product Manager de MindPath propose le design suivant :

> "On va introduire :
> - Un streak quotidien : chaque jour d'utilisation donne 10 points de 'santé mentale'. En cas de jour manqué, on perd 20 points.
> - Un classement hebdomadaire des utilisateurs les plus actifs.
> - Une notification à 21h chaque soir : 'Prenez soin de votre santé mentale — vos amis ont déjà complété leur session aujourd'hui !'
> - Un badge 'Warrior Mind' pour les utilisateurs ayant maintenu un streak de 30 jours."

Identifie les dérives éthiques et les dark patterns dans cette proposition. Pour chaque élément, explique le dommage potentiel sur les utilisateurs et le KPI impacté.

---

**Exercice 3 — Mini-cas réel**

> "Décris ton modèle mental AVANT de commencer. Comment implémenterais-tu la solution ? Quels KPI suivrais-tu ?"

**Situation** : L'équipe produit décide de concevoir une gamification responsable pour MindPath. Elle part des données suivantes :

- Les utilisateurs qui fixent un "intention hebdomadaire" (ex. : "cette semaine, je veux pratiquer 3 séances de respiration") ont une rétention J30 de 41 % vs 21 % pour les autres
- 22 % des utilisateurs ont déclaré s'être sentis "jugés" quand ils n'avançaient pas
- Les utilisateurs recommandés par un professionnel de santé représentent 31 % de la base — ils ont un usage moins fréquent mais plus régulier (sessions plus longues, moins de jours d'usage mais plus d'usage quand ils ouvrent l'app)

**Dimension éthique et inclusive** : MindPath est utilisée par des personnes en situation de vulnérabilité psychologique (dépression légère à modérée, anxiété, burn-out, deuil). Certaines mécaniques de gamification standard pourraient aggraver leur état (culpabilité, sentiment d'échec, comparaison sociale). Les professionnels de santé qui recommandent l'app ont exprimé des inquiétudes sur ce point lors d'une consultation.

Décris ton modèle mental. Conçois une stratégie de gamification complète pour MindPath, éthique et inclusive, visant le DAU/MAU de 0,25. Précise quelles mécaniques tu utilises, lesquelles tu évites, et comment tu mesures l'impact sur le bien-être réel (et pas seulement sur l'engagement brut).

---

### BLOC 2 — Corrections

---

#### Correction — Exercice 1

**Modèle mental attendu**

Avant de concevoir quoi que ce soit dans une app de santé mentale, il faut comprendre le contexte des utilisateurs, les risques spécifiques au domaine, et valider que la gamification ne peut pas nuire. La question n'est pas "quelle mécanique choisir ?" mais "quelles mécaniques sont compatibles avec le bien-être de ce public ?"

**Questions à poser avant de concevoir**

1. Quels sont les profils de vulnérabilité de nos utilisateurs ? (dépression, anxiété, addiction passée, fragilité émotionnelle)
2. Les professionnels de santé qui recommandent l'app ont-ils été consultés sur la gamification ?
3. Avons-nous des données sur les situations qui provoquent des abandons liés à la honte ou à l'échec ?
4. Quels comportements voulons-nous encourager ? (la régularité ? la profondeur de pratique ? l'auto-compassion ?)
5. Quels comportements voulons-nous éviter d'encourager ? (l'usage compulsif, la comparaison sociale anxiogène)

**Mécaniques envisageables en première intention**

- **Intention personnelle hebdomadaire** (données : +20 points de rétention J30) : l'utilisateur fixe lui-même son objectif — c'est de la motivation intrinsèque, pas de la pression externe
- **Progrès personnel relatif** : montrer à l'utilisateur son propre chemin, jamais une comparaison avec d'autres
- **Célébration des retours** : si l'utilisateur revient après une absence, le féliciter d'être là — pas le punir d'avoir été absent
- **Rappels optionnels et personnalisables** : l'utilisateur choisit quand et comment être rappelé

**Mécaniques à éviter d'emblée**
- Streaks avec punition du non-usage
- Classements entre utilisateurs
- Comparaisons sociales

**Feedback itératif — changement de paradigme en 1 phrase**
> Dans une app de santé mentale, la première question n'est pas "qu'est-ce qui engage ?" mais "qu'est-ce qui aide sans nuire ?"

---

#### Correction — Exercice 2

**Modèle mental attendu**

Chaque élément de la proposition est un dark pattern appliqué à un contexte où il peut causer un préjudice réel. La gravité est décuplée par le public cible (personnes vulnérables) et par la nature du produit (santé mentale).

**Analyse détaillée des dérives**

*Dérive 1 — Streak quotidien avec pénalité (perte de 20 points)*

Problème : La punition du non-usage crée un mécanisme d'anxiété — l'utilisateur est conditionné à revenir par peur, pas par désir. Pour une personne en dépression ou en burn-out, rater une journée (souvent par manque d'énergie, symptôme même de la maladie) génère de la culpabilité. Cette culpabilité peut aggraver l'état et provoquer un abandon définitif.

La mécanique "perte de 20 points" pour un jour manqué est particulièrement problématique : la punition est supérieure à la récompense quotidienne (10 points). C'est conçu pour créer de la pression, pas de la motivation.

Dommage utilisateur : Aggravation potentielle d'une détresse existante (cercle vicieux dépression → incapacité → culpabilité → plus de dépression)

KPI impacté : **NPS** (chute chez les utilisateurs qui vivent la punition), **Taux de désinstallation post-streak brisé** (pic attendu), **Bien-être déclaré** (métrique à créer si absente)

*Dérive 2 — Classement hebdomadaire des plus actifs*

Problème : Un classement de santé mentale est une contradiction dans les termes. Il crée une compétition dans un domaine où la comparaison sociale est un facteur aggravant connu de l'anxiété et de la dépression. Les utilisateurs en bas du classement — souvent ceux qui en ont le plus besoin — reçoivent un signal de "tu es moins bien que les autres."

De plus, un usage élevé de l'app de santé mentale n'est pas nécessairement signe de bonne santé — il peut être signe de crise (utilisation intensive en période de détresse aiguë).

Dommage utilisateur : Stigmatisation des profils à faible usage, aggravation de la comparaison sociale anxiogène

KPI impacté : **NPS** (effondrement pour les utilisateurs en bas de tableau), **Taux d'abandon** (pic chez les utilisateurs classés bas), **Risque réputationnel et médiatique** (potentiellement grave)

*Dérive 3 — Notification à 21h avec comparaison sociale ("vos amis ont déjà complété")*

Problème : La notification de soirée peut interrompre une phase de décompression, perturber le sommeil des personnes en traitement, et créer de l'anxiété de performance. La formulation "vos amis ont déjà complété" est un dark pattern de FOMO social délibéré — particulièrement toxique pour les profils anxieux (comparaison → sentiment d'infériorité → anxiété).

Dommage utilisateur : Perturbation du sommeil (facteur aggravant de nombreux troubles), anxiété de performance

KPI impacté : **Taux d'opt-out des notifications** (hausse), **NPS** (baisse chez les profils anxieux), **Plaintes et signalements** (risque légal avec le DSA)

*Dérive 4 — Badge "Warrior Mind" pour 30 jours de streak*

Problème : Le terme "Warrior" valorise la persévérance forcée dans un contexte où la santé mentale nécessite parfois exactement l'opposé : du repos, de l'acceptation, de la flexibilité. Il récompense l'endurance sur la régularité choisie, et implique que ceux qui n'ont pas le badge ne sont pas des "warriors" — soit pas assez forts.

Dommage utilisateur : Renforcement d'une vision performative de la santé mentale, stigmatisation des profils qui n'atteignent pas le badge

KPI impacté : **Sentiment de compétence perçue** (baisse chez les non-éligibles), **Rétention des profils fragiles** (paradoxalement plus faible malgré la mécanique d'engagement)

**Feedback itératif — changement de paradigme en 1 phrase**
> Une mécanique de gamification standard peut être une fonctionnalité utile dans un SaaS et un dispositif dangereux dans une app de santé mentale — le contexte change tout.

---

#### Correction — Exercice 3

**Modèle mental attendu**

La gamification éthique pour MindPath doit être au service du bien-être de l'utilisateur, pas des métriques d'engagement de l'entreprise. Si les deux convergent, tant mieux. Si un conflit apparaît, le bien-être prime.

La donnée sur les "intentions hebdomadaires" (+20 points de rétention J30) est le signal le plus fort : la motivation intrinsèque (se fixer son propre objectif) surpasse toute mécanique externe. Le design doit amplifier ce levier.

**Raisonnement UX/Product**

La Théorie de l'Autodétermination (Deci & Ryan) est le cadre de référence :
- **Autonomie** : l'utilisateur choisit ses objectifs, son rythme, ses mécaniques
- **Compétence** : l'utilisateur se voit progresser selon SES critères, pas un standard externe
- **Appartenance** : possibilité de partager avec une communauté bienveillante, sans compétition

**Solution détaillée**

*Mécanique 1 — Intention hebdomadaire personnalisée (GARDER ET RENFORCER)*
- Chaque lundi (ou jour choisi par l'utilisateur), invitation à fixer une intention : "Cette semaine, je veux..." (liste de suggestions + champ libre)
- L'intention est privée, jamais visible par d'autres
- En fin de semaine, réflexion guidée : "Avez-vous atteint votre intention ? Sinon, qu'est-ce qui a rendu cela difficile ?" — sans jugement de valeur
- Aucune pénalité si l'intention n'est pas atteinte — au contraire, message de compassion : "C'est normal de ne pas toujours y arriver. Qu'est-ce que vous voulez essayer la semaine prochaine ?"

*Mécanique 2 — Progrès personnel visible (PAS de comparaison)*
- Afficher le "chemin parcouru" sous forme de ligne du temps personnelle : "Depuis que vous utilisez MindPath, vous avez fait X séances de respiration, Y entrées de journal..."
- Jamais de chiffre comparatif avec d'autres utilisateurs
- Célébrer les petites constances : "Vous avez ouvert l'app 3 fois cette semaine — c'est ce qui compte."

*Mécanique 3 — Rappels entièrement optionnels et personnalisables*
- L'utilisateur choisit : heure, fréquence, ton du message (doux / neutre / motivant)
- Option "Pas de rappels" sans friction ni culpabilisation
- Les rappels sont des invitations, jamais des alertes d'urgence ou des comparaisons sociales

*Mécanique 4 — Célébration du retour (anti-streak coercitif)*
- Si l'utilisateur n'a pas ouvert l'app depuis 5+ jours, le message de retour est : "Bienvenue de retour. Votre progression est là où vous l'avez laissée. Prenez le temps qu'il vous faut."
- Jamais de mention de ce qui a été "perdu" pendant l'absence

*Mécanique 5 — Communauté optionnelle bienveillante (pour le besoin d'appartenance)*
- Espace communautaire opt-in, sans classement
- Possibilité de partager une intention anonymement et de recevoir des encouragements
- Modération stricte : tout contenu comparatif ou compétitif est supprimé

**Mécaniques explicitement exclues**
- ❌ Streaks avec pénalité
- ❌ Classements de tout type
- ❌ Comparaisons sociales dans les notifications
- ❌ Badges valorisant l'endurance forcée
- ❌ Messages culpabilisants en cas d'absence

**Adaptation pour le segment "recommandé par professionnel de santé" (31 % de la base)**
- Parcours distinct avec objectifs thérapeutiques (définis avec le professionnel, pas par l'app)
- Aucune mécanique gamifiée visible dans ce parcours sauf accord explicite du professionnel référent
- Rapport de progression disponible pour le professionnel (avec consentement de l'utilisateur)

**KPIs — mesurer l'engagement ET le bien-être**

| KPI d'engagement | KPI de bien-être | Objectif global |
|-----------------|-----------------|----------------|
| DAU/MAU | Bien-être perçu (échelle GAD-7 ou PHQ-2 mensuel, intégré in-app) | Les deux doivent progresser ensemble |
| Rétention J30 | % d'utilisateurs déclarant "je me sens mieux depuis que j'utilise l'app" | Alerte si DAU/MAU monte mais bien-être stagne |
| Taux d'adoption des intentions hebdomadaires | NPS segmenté "je me sens jugé vs soutenu" | NPS "soutenu" > 80 % |
| Taux de retour après absence | Taux d'opt-out des notifications | Opt-out < 15 % |

**Règle de sécurité**
Si DAU/MAU augmente mais que le bien-être perçu stagne ou diminue, suspendre toutes les mécaniques de gamification et mener un audit éthique.

**Feedback itératif — changement de paradigme en 1 phrase**
> Dans une app de santé mentale, un utilisateur qui revient moins souvent mais qui va mieux est un succès — pas un échec.

---

## Concept 4 — Habit loops & rétention

### Contexte

**Stridely** est une application de running et d'entraînement sportif pour coureurs amateurs (5 km à marathon). Elle propose des plans d'entraînement personnalisés, le tracking des sorties, et une communauté de coureurs. Freemium (gratuit) avec abonnement "Pro" à 12,99 €/mois.

Métriques actuelles :
- Utilisateurs actifs : 890 000
- DAU/MAU : 0,22
- Rétention à J30 : 34 %, à J90 : 19 %
- Taux de conversion gratuit → Pro : 6,8 %
- NPS global : +31
- Durée de session moyenne : 8 minutes (hors tracking de sortie)

Observations comportementales :
- Les utilisateurs qui complètent leur plan d'entraînement de la semaine ont une rétention J90 de 48 %
- Les utilisateurs qui ont au moins un ami sur l'app ont une rétention J90 de 52 %
- Le "mur de la 3e semaine" : 41 % des utilisateurs qui abandonnent le font entre J14 et J21

---

### BLOC 1 — Exercices (sans correction)

**Exercice 1 — Traduction mentale**

> "Comment aborderais-tu ce problème avec ta compréhension actuelle ?"

Stridely veut passer sa rétention à J90 de 19 % à 30 %. L'équipe pense que la réponse est dans le design des habit loops.

Comment analyserais-tu les boucles d'engagement existantes de Stridely ? Comment identifierais-tu le cue principal de l'utilisateur, la routine et la récompense ? Quels éléments du Hook Model (Nir Eyal) appliquerais-tu ?

---

**Exercice 2 — Piège de paradigme**

> "Qu'est-ce qui ne va pas ici ? Quels KPI seraient affectés ?"

L'équipe décide de lutter contre le "mur de la 3e semaine" avec la stratégie suivante :

> "On va envoyer une notification à J14 : 'Ne lâchez pas maintenant — vous êtes à mi-chemin ! Vos amis courent pendant que vous lisez ceci.' On va aussi introduire un streak de sortie (un flamme pour chaque semaine complète) et on va bloquer l'accès aux statistiques avancées si l'utilisateur n'a pas complété au moins 70 % de son plan de la semaine."

Identifie les problèmes de cette stratégie. Quels KPIs seraient affectés et comment ?

---

**Exercice 3 — Mini-cas réel**

> "Décris ton modèle mental AVANT de commencer. Comment implémenterais-tu la solution ? Quels KPI suivrais-tu ?"

**Situation** : Stridely veut concevoir un design de rétention long terme basé sur les habit loops, en s'attaquant spécifiquement au "mur de la 3e semaine". L'équipe dispose de données supplémentaires :

- Les utilisateurs qui reçoivent un message personnalisé de leur "coach virtuel" à J10 ("Super, vous avez complété 2 semaines — voilà ce que ça représente en termes de progression") ont un taux d'abandon J14-J21 de 18 % vs 41 % pour les autres
- Les utilisateurs qui ont modifié leur plan d'entraînement au moins une fois (adapté à leur emploi du temps) ont une rétention J90 de 61 %
- 28 % des utilisateurs qui abandonnent à J14-J21 ont vécu une semaine sans sortie due à une contrainte externe (météo, maladie, travail) — et interprètent cette semaine comme un "échec" qui justifie d'abandonner

**Dimension inclusive et éthique** : Stridely est utilisée par des personnes de tous niveaux, y compris des débutants qui courent pour des raisons médicales (reprise d'activité après maladie, gestion du diabète, prescription médicale). Pour ces profils, la pression de performance peut être contre-productive voire dangereuse. Une notification anxiogène envoyée à un coureur en reprise post-infarctus peut déclencher une décision médicale risquée (forcer une sortie malgré une douleur).

Décris ton modèle mental. Conçois un plan de rétention complet pour le "mur de la 3e semaine" basé sur des habit loops saines, incluant des protocoles spécifiques pour les profils médicaux et les débutants. Quels KPIs mesurerais-tu pour distinguer rétention saine et rétention forcée ?

---

### BLOC 2 — Corrections

---

#### Correction — Exercice 1

**Modèle mental attendu**

Pour analyser les habit loops d'une app sportive, il faut partir du comportement réel des utilisateurs retenus — pas de ce que le produit veut qu'ils fassent, mais de ce qu'ils font spontanément quand ils reviennent.

**Raisonnement UX/Product — Analyse des boucles existantes**

*Application du modèle Cue / Routine / Reward*

Pour les utilisateurs retenus à J90 (48 % pour les plans compléteurs) :
- **Cue probable** : l'heure de sortie habituelle (mardi matin 6h30, samedi 9h) — un cue temporel et contextuel
- **Routine** : ouvrir l'app → vérifier le plan du jour → partir courir → tracker la sortie → consulter les stats
- **Reward** : voir sa progression (distance, allure, calories), le graphique qui se remplit, le sentiment de compétence post-effort

*Application du Hook Model*

- **Trigger externe initial** : notification de rappel d'entraînement ou email hebdomadaire
- **Trigger interne (objectif)** : à J30+, l'utilisateur ouvre l'app spontanément avant même la notification — il anticipe la récompense (voir ses stats, préparer sa sortie)
- **Action** : ouvrir l'app, consulter le plan, démarrer le tracking
- **Variable Reward** : les stats de performance varient (bonne journée / mauvaise journée), les achievements débloqués, les données surprenantes ("Votre allure a progressé de 8 % ce mois")
- **Investment** : chaque sortie trackée enrichit le profil, les données historiques deviennent précieuses → coût de sortie élevé

**Signal clé**

La donnée "utilisateurs avec au moins un ami sur l'app → rétention J90 de 52 %" indique que la boucle sociale (appartenance) est le renforcement le plus puissant. Il faut intégrer une boucle de feedback social dans le design des habit loops.

**KPIs à suivre**
- Fréquence de démarrage spontané (sans notification) — mesure du trigger interne formé
- Taux d'usage hebdomadaire régulier (2+ fois/semaine) à J30
- Nombre de connexions sociales actives par utilisateur

**Feedback itératif — changement de paradigme en 1 phrase**
> Une habit loop bien conçue ne se voit plus : l'utilisateur ouvre l'app avant même de savoir pourquoi — le déclencheur est devenu interne.

---

#### Correction — Exercice 2

**Modèle mental attendu**

La stratégie proposée mélange une bonne intuition (intervenir au bon moment) avec des exécutions qui créent de la pression plutôt que de la motivation. Le résultat probable est un pic d'engagement forcé suivi d'un churn amplifié.

**Analyse des problèmes**

*Problème 1 — Notification "Ne lâchez pas — vos amis courent pendant que vous lisez ceci"*

Cette formulation combine trois dark patterns : la culpabilisation, la comparaison sociale anxiogène, et l'urgence artificielle. Pour un coureur amateur qui a raté une semaine à cause d'une grippe ou d'un surmenage, ce message est humiliant plutôt que motivant.

KPI affecté : **Taux d'opt-out des notifications** (hausse immédiate), **NPS** (baisse chez les profils qui reçoivent ce message), **Taux de désinstallation à J14-J21** (peut augmenter plutôt que diminuer)

*Problème 2 — Streak de sortie (flamme par semaine complète)*

Un streak sportif sans flexibilité punit les imprévus de la vie réelle (maladie, météo, surcharge de travail) qui sont précisément les causes du "mur de la 3e semaine". L'utilisateur qui a raté une semaine pour une bonne raison se voit retirer sa flamme — ce signal négatif peut confirmer son sentiment d'échec et précipiter l'abandon.

KPI affecté : **Taux d'abandon post-streak brisé** (pic attendu), **Rétention J30** (paradoxalement en baisse malgré la mécanique)

*Problème 3 — Bloquer les statistiques avancées si < 70 % du plan complété*

C'est un dark pattern de paywall déguisé en mécanique de motivation. L'utilisateur qui a eu une semaine difficile — et qui a peut-être le plus besoin de voir ses statistiques pour rester motivé — se voit puni exactement au moment où il est le plus fragile. C'est fonctionnellement l'opposé de ce qu'il faudrait faire.

KPI affecté : **Frustration utilisateur** (mesurable par enquêtes in-app), **NPS** (chute chez les utilisateurs en difficulté), **Conversion gratuit → Pro** (baisse si les utilisateurs associent la fonctionnalité Pro à une punition)

**Feedback itératif — changement de paradigme en 1 phrase**
> Intervenir au bon moment avec le bon message peut doubler la rétention — intervenir avec le mauvais message au même moment peut couper le lien définitivement.

---

#### Correction — Exercice 3

**Modèle mental attendu**

Le "mur de la 3e semaine" est un phénomène documenté en psychologie du comportement : c'est la période où la motivation initiale ("effet nouveauté") s'épuise et où l'habitude n'est pas encore assez ancrée pour se soutenir elle-même. C'est aussi le moment où le premier obstacle réel (semaine sans sortie) est interprété comme un échec.

La donnée sur les messages personnalisés à J10 (réduction de 23 points du taux d'abandon) est le levier le plus fort. La donnée sur les utilisateurs ayant modifié leur plan (rétention J90 de 61 %) indique que la flexibilité est un facteur de rétention plus puissant que l'observance stricte.

**Raisonnement UX/Product**

Deux leviers principaux :
1. **Prévenir le sentiment d'échec** avant qu'il s'installe (message à J10 sur la progression réelle)
2. **Offrir de la flexibilité** plutôt que de la rigidité (un plan adapté vaut mieux qu'un plan abandonné)

**Solution détaillée**

*Levier 1 — Message de progression personnalisé à J10*
- Timing : J10 exactement, avant l'apparition typique du mur
- Contenu : données concrètes de progression ("En 2 semaines, vous avez couru 28 km. Votre allure moyenne a progressé de 5 %. C'est une amélioration physiologique réelle.")
- Ton : coach positif, jamais comparatif
- Pour les profils médicaux : message validé par un professionnel de santé ou formulé en termes de bien-être (fréquence cardiaque, endurance, confort à l'effort) plutôt que de performance

*Levier 2 — Invitation proactive à modifier le plan*
- À J12-J14, si l'utilisateur n'a pas complété la semaine : "Votre emploi du temps a changé ? Modifiez votre plan en 2 touches — mieux vaut un plan adapté qu'un plan parfait sur le papier."
- Interface de modification en 3 clics maximum
- Message de validation après modification : "Plan ajusté. Votre progression continue — l'important c'est le mouvement, pas le plan."

*Levier 3 — Réencadrement de la semaine sans sortie (pour les 28 % qui abandonnent après une semaine blanche)*
- Détection automatique : si l'utilisateur n'a pas de sortie trackée en 7 jours, déclencher un message de type "Check-in" (pas de notification push agressive)
- Message : "Vous avez eu une semaine chargée. Ça arrive à tous les coureurs — même les élites. Votre prochaine sortie peut être aussi courte que 15 minutes. Le but est de renouer avec le mouvement, pas de rattraper."
- Pour les profils médicaux : "Si vous avez ressenti des douleurs ou une gêne, n'hésitez pas à consulter votre médecin avant de reprendre."

*Levier 4 — Renforcement de la boucle sociale (rétention J90 : 52 % avec au moins un ami)*
- À J7, invitation douce à connecter avec d'autres coureurs : "Trouvez votre partenaire de motivation — les coureurs qui s'entraînent avec des amis sur Stridely courent 40 % plus longtemps."
- Créer des "défis amicaux" (pas des classements) : "Défi de la semaine avec [ami] : 3 sorties chacun."
- Partage de progression optionnel et contrôlé par l'utilisateur (privacy-first)

**Protocoles spécifiques — profils médicaux et débutants**

- Option "mode médical" activable (suggestion lors de l'onboarding : "Reprenez-vous le sport après une maladie ou pour des raisons médicales ?")
- Dans ce mode : aucune notification de performance, aucun classement, aucune comparaison
- Les objectifs sont formulés en confort d'effort (1-10) plutôt qu'en allure (km/h)
- Message systématique si le rythme cardiaque tracké dépasse un seuil (si montre connectée) : "Votre fréquence cardiaque est élevée. Ralentissez et écoutez votre corps."
- Les plans médicaux sont bloqués par défaut au niveau "débutant" et ne progressent que si l'utilisateur valide explicitement qu'il se sent à l'aise

**KPIs — distinguer rétention saine et rétention forcée**

| KPI d'engagement | KPI de qualité d'engagement |
|-----------------|---------------------------|
| Rétention J30 | Satisfaction déclarée post-sortie (note 1-5) |
| Rétention J90 | Taux de modification du plan (signal de flexibilité active) |
| DAU/MAU | Rapport sorties complétées / sorties prévues (si < 0,6, plan trop ambitieux) |
| Taux d'abandon J14-J21 | % d'utilisateurs qui reviennent après une semaine blanche |
| Conversion gratuit → Pro | NPS des profils médicaux et débutants (segment à risque) |

**Signal d'alerte éthique**
Si le taux d'abandon post-semaine blanche augmente malgré les interventions → revoir les messages de re-engagement (peut-être trop anxiogènes).

Si des incidents médicaux sont signalés en corrélation avec des notifications de performance → suspension immédiate des notifications de ce type pour les profils médicaux.

**Feedback itératif — changement de paradigme en 1 phrase**
> Un coureur qui adapte son plan et continue à son rythme construit une habitude durable — un coureur qui abandonne parce qu'il n'a pas suivi le plan parfaitement n'a simplement pas eu le bon message au bon moment.

---

## Synthèse des apprentissages — Section 12

| Concept | Biais corrigé | KPI clé | Levier éthique principal |
|---------|--------------|---------|------------------------|
| Growth loops & activation | "Plus d'acquisition = plus de croissance" | LTV/CAC, coefficient K | Referral opt-in, aha moment inclusif |
| Onboarding stratégique | "Plus d'infos = plus de valeur perçue" | Taux de complétion, NPS J3 | Minimisation des données, accessibilité |
| Gamification éthique | "Les mécaniques standard s'appliquent partout" | DAU/MAU, bien-être déclaré | SDT, opt-out des mécaniques |
| Habit loops & rétention | "L'engagement élevé = l'utilisateur satisfait" | Rétention J90, satisfaction déclarée | Flexibilité, pas de punition du non-usage |

---

*Pour la théorie complète, voir `12-growth-gamification-theorie.md`.*
