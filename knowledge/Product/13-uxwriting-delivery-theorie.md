# Section 13 — UX Writing avancé & Delivery

> Objectif pédagogique : maîtriser le contenu comme discipline produit à part entière, comprendre les contraintes de delivery, et collaborer efficacement avec les équipes techniques sans écrire une ligne de code.

---

## Sommaire

1. [Stratégie de contenu globale](#1-stratégie-de-contenu-globale)
2. [Voice & tone à l'échelle produit](#2-voice--tone-à-léchelle-produit)
3. [Content design systémique](#3-content-design-systémique)
4. [Localisation stratégique](#4-localisation-stratégique)
5. [Triangle faisabilité / désirabilité / viabilité](#5-triangle-faisabilité--désirabilité--viabilité)
6. [Collaboration concrète avec les devs](#6-collaboration-concrète-avec-les-devs)
7. [Contraintes techniques et impact UX](#7-contraintes-techniques-et-impact-ux)
8. [Dette UX & dette technique](#8-dette-ux--dette-technique)
9. [IA appliquée à l'UX Writing et au Delivery](#9-ia-appliquée-à-lux-writing-et-au-delivery)

---

## 1. Stratégie de contenu globale

### 1.1 Modèle mental

Le contenu n'est pas un habillage que l'on pose sur une interface terminée : c'est une couche structurante du produit, au même titre que l'architecture d'information ou les interactions. Une stratégie de contenu définit ce qu'on dit, à qui, à quel moment, et pourquoi — avant même de penser à la formulation.

### 1.2 Analogie stable

Imaginez le contenu d'un produit comme le plan éditorial d'un journal. Un journaliste ne rédige pas des articles aléatoirement : il y a une ligne éditoriale, une hiérarchie des sujets, une fréquence de publication, des rubriques stables. Le produit fonctionne de la même manière : chaque écran est une rubrique, chaque message une information choisie délibérément dans une architecture éditoriale.

### 1.3 Méthodologie & Bonnes pratiques

**L'architecture éditoriale** organise les messages du produit selon leur priorité et leur rôle dans le parcours utilisateur. Elle répond à trois questions fondamentales :
- Quel est le message principal à retenir sur cet écran ou cette fonctionnalité ?
- Quels sont les messages secondaires d'appui (bénéfices, réassurance, aide contextuelle) ?
- Quels sont les messages d'action (labels de CTA, confirmations, messages d'erreur) ?

**La hiérarchie des messages** se construit du général au particulier. En pratique :
1. Définir le message de marque global (positionnement, promesse produit)
2. Décliner par parcours utilisateur (onboarding, activation, rétention, réengagement)
3. Décliner par écran et par état (état vide, état d'erreur, état de succès, état de chargement)
4. Documenter chaque niveau dans un tableau de hiérarchie accessible à toute l'équipe

**Le contenu comme composant produit** signifie que les textes sont versionnés, révisés et livrés avec la même rigueur qu'une fonctionnalité. Cela implique :
- Des tickets de contenu dans le backlog (pas des commentaires dans Figma)
- Des critères d'acceptation incluant la validation du contenu
- Un propriétaire du contenu identifié pour chaque surface produit

**Le content audit** est une photographie exhaustive du contenu existant. Il liste chaque texte visible par l'utilisateur (labels, messages, emails, notifications, tooltips, états d'erreur) et l'évalue sur quatre axes : pertinence (répond-il à un besoin réel ?), justesse (est-il exact et à jour ?), cohérence (respecte-t-il le voice & tone ?), efficacité (produit-il l'action souhaitée ?).

**Étapes d'un audit content :**
1. Inventaire exhaustif par surface (web, mobile, emails, notifications push, chatbot)
2. Cartographie des propriétaires actuels (qui a écrit quoi ?)
3. Notation sur les quatre axes (pertinence, justesse, cohérence, efficacité)
4. Priorisation des corrections selon l'impact business
5. Plan de mise à jour avec jalons

### 1.4 Comparaison d'approches

| Approche réactive | Approche stratégique |
|---|---|
| Le texte est ajouté en fin de sprint | Le contenu est planifié dès la phase discovery |
| Pas de documentation centralisée | Architecture éditoriale vivante et partagée |
| Chaque PM écrit ses propres messages | Un référentiel unique de messages produit |
| L'audit n'existe pas ou est ponctuel | L'audit est un rituel trimestriel |
| Impact sur les KPIs invisible | Impact mesuré (taux de complétion, conversion) |

### 1.5 Correction du modèle mental

❌ **Idée reçue** : "Le texte, c'est la dernière étape. On remplace les placeholders juste avant la livraison."

✅ **Réalité** : Le contenu influence l'architecture même de l'interface. Un label mal choisi force l'utilisateur à s'arrêter et dégrade la fluidité du parcours. Des textes pensés tardivement créent des dettes de contenu qui se cumulent sprint après sprint.

**KPI impacté** : Taux de complétion de tâche (task success rate) — des messages ambigus ou absents à des moments clés du parcours font chuter directement cet indicateur. Le taux de conversion est également affecté : des CTA génériques ("Valider", "Continuer") sous-performent systématiquement face à des CTA orientés bénéfice ("Recevoir mon devis gratuit").

### 1.6 KPIs liés

**KPIs UX :**
- Task success rate (taux de complétion de tâche) : mesure directe de la clarté des contenus sur les écrans critiques
- SUS (System Usability Scale) : le contenu opaque fait baisser le score perçu d'utilisabilité
- Taux d'abandon par étape : identifie les points de friction liés à des messages insuffisants

**KPIs Business :**
- Taux de conversion funnel : les messages de valeur et les CTA bien formulés augmentent la conversion
- Volume de tickets support : un contenu clair réduit les questions récurrentes au support
- Vélocité de livraison : une stratégie de contenu documentée accélère la rédaction et la validation

### 1.7 Points éthiques & inclusivité

- **Langage inclusif** : le content audit doit inclure une vérification systématique des formulations genrées ou excluantes (ex. : formules ne supposant pas un profil "par défaut" masculin, valide, connecté en permanence).
- **Accessibilité cognitive** : hiérarchiser les messages, c'est aussi penser aux utilisateurs en situation de surcharge cognitive (dyslexie, trouble de l'attention). Les messages courts, structurés et prévisibles réduisent la charge cognitive.
- **Représentation** : les exemples et illustrations textuelles dans le produit (noms fictifs, scénarios d'usage) doivent refléter la diversité réelle des utilisateurs, pas uniquement un profil dominant.
- **Transparence** : la stratégie de contenu ne doit pas être utilisée pour dissimuler des informations importantes dans des formulations vagues ou rassurantes trompeuses. ❌ Dark pattern : enterrer les conditions d'abonnement dans un paragraphe de texte secondaire formulé de manière neutre.

---

## 2. Voice & tone à l'échelle produit

### 2.1 Modèle mental

La voix d'un produit, c'est sa personnalité constante — elle ne change pas. Le ton, c'est l'humeur contextuelle — il s'adapte à la situation. Un ami proche garde la même personnalité qu'il vous annonce une bonne nouvelle ou vous accompagne dans un moment difficile : c'est exactement la logique voice & tone.

### 2.2 Analogie stable

Pensez à une personne que vous connaissez bien. Elle a une façon d'être reconnaissable : directe, chaleureuse, un peu décalée. Mais cette même personne parle différemment selon le contexte : elle ne vous félicite pas avec le même registre qu'elle vous consolide après un échec. La voix est l'identité ; le ton est la réponse émotionnelle adaptée au moment. Dans un produit, la voix est définie une fois pour toutes ; le ton est décliné par contexte fonctionnel.

### 2.3 Méthodologie & Bonnes pratiques

**Définition du registre de voix :**
La voix produit se définit à partir de trois à cinq attributs de personnalité, formulés en binômes contrastés pour en préciser les limites.

Exemple :
- Clair, mais pas simpliste
- Chaleureux, mais pas familier
- Expert, mais pas condescendant
- Direct, mais pas brusque

Ces attributs sont coconstruits avec les équipes produit, design et marketing pour garantir l'alignement.

**Documentation : le Tone of Voice Guide**
Ce document de référence contient :
1. Les attributs de voix avec leurs limites explicites (ce qu'on est / ce qu'on n'est pas)
2. Les principes d'écriture opérationnels (phrases courtes, voix active, termes métier évités, etc.)
3. Les variations de ton par contexte fonctionnel (voir ci-dessous)
4. Des exemples avant/après pour chaque principe
5. Un glossaire des termes maison (comment on appelle chaque fonctionnalité, chaque concept)

**Application cohérente sur toutes les surfaces :**
La cohérence ne se décrète pas, elle se gouverne. En pratique :
- Le Tone of Voice Guide est accessible dans le design system (pas dans un dossier partagé oublié)
- Chaque nouveau contenu est relu au prisme du guide avant validation
- Les écarts sont signalés lors des design reviews, pas corrigés en production

**Variation contextuelle :**
Le ton varie obligatoirement selon la charge émotionnelle du contexte :

| Contexte | Ton recommandé | Exemple |
|---|---|---|
| Onboarding | Encourageant, orienté bénéfice | "Bienvenue. Votre espace est prêt." |
| Erreur système | Calme, factuel, orienté solution | "Quelque chose s'est mal passé. Réessayez dans quelques instants." |
| Erreur utilisateur | Empathique, non culpabilisant | "Ce code ne correspond pas. Vérifiez les majuscules et réessayez." |
| Succès / célébration | Positif, mesuré (pas surjoué) | "C'est envoyé. Vous recevrez une réponse sous 24 h." |
| Avertissement légal | Neutre, précis, sans euphémisme | Libellé exact, sans reformulation édulcorée |
| Suppression / action irréversible | Sérieux, informatif | "Cette action est définitive. Vos données seront supprimées sous 30 jours." |

### 2.4 Comparaison d'approches

| Sans gouvernance voice & tone | Avec gouvernance voice & tone |
|---|---|
| Chaque contributeur écrit "comme il sent" | Guide partagé et intégré au design system |
| Ton incohérent entre onboarding et erreurs | Variation intentionnelle et documentée |
| Revue de contenu absente | Contenu validé comme une fonctionnalité |
| Marque perçue comme fragmentée | Expérience perçue comme cohérente et fiable |

### 2.5 Correction du modèle mental

❌ **Idée reçue** : "La voice & tone, c'est le travail du département marketing. Le produit, c'est fonctionnel avant tout."

✅ **Réalité** : Chaque mot dans l'interface est une interaction directe avec l'utilisateur. L'incohérence de ton entre une notification push enthousiaste et un message d'erreur glacial crée une dissonance qui dégrade la confiance perçue envers le produit.

**KPI impacté** : NPS (Net Promoter Score) — la cohérence et la pertinence émotionnelle du langage produit sont corrélées à la probabilité de recommandation. Un score NPS bas dans un secteur concurrent en matière de fonctionnalités s'explique souvent par une expérience de contenu appauvrie.

### 2.6 KPIs liés

**KPIs UX :**
- NPS : la cohérence du ton renforce la relation émotionnelle au produit
- Score de confiance perçue (questionnaire post-test) : un ton inadapté à la gravité du contexte (ex. : ton enjoué sur un message d'erreur critique) effondre la confiance
- Taux de relecture des messages d'erreur (eye-tracking) : un message bien tonalisé est lu, compris, et actionné

**KPIs Business :**
- Taux de rétention à 30 jours : la cohérence expérientielle contribue à l'attachement produit
- Taux de résolution au premier contact (support) : un ton adapté dans les messages d'erreur réduit les demandes d'assistance
- Brand equity score : la perception de la marque est directement alimentée par la cohérence éditoriale produit

### 2.7 Points éthiques & inclusivité

- **Registre non excluant** : un ton "cool" ou "startup" peut aliéner des utilisateurs plus âgés, moins technophiles, ou issus de cultures où le registre informel avec une entreprise est perçu comme irrespectueux. Le guide de ton doit inclure des garde-fous explicites.
- **Neutralité de genre dans le ton** : éviter les formulations qui supposent un genre (notamment dans les messages de célébration : "Bravo, Champion !" exclut de fait une partie des utilisateurs).
- **Messages d'erreur non culpabilisants** : les formulations qui imputent l'erreur à l'utilisateur ("Vous avez entré un mauvais mot de passe") sont à proscrire en faveur de formulations neutres ("Ce mot de passe ne correspond pas").
- ❌ **Dark pattern** : un ton délibérément anxiogène ou culpabilisant pour forcer une action (abonnement, achat impulsif, refus d'une option de désabonnement). Exemple : "Vous êtes sur le point de perdre tous vos avantages. Êtes-vous sûr ?" — formulé pour provoquer la peur plutôt qu'informer.

---

## 3. Content design systémique

### 3.1 Modèle mental

Le contenu systémique, c'est l'idée que les textes d'une interface ne sont pas des cas isolés mais des instances d'un modèle. Comme un composant de design system peut être instancié des dizaines de fois dans le produit, un "modèle de message d'erreur" peut être appliqué à toutes les erreurs de formulaire. Le contenu devient réutilisable, gouverné et scalable.

### 3.2 Analogie stable

Pensez aux briques LEGO : chaque brique est standardisée, compatible avec toutes les autres, et peut s'assembler pour créer des configurations infinies. Un design system de contenu fonctionne de la même façon : des composants textuels standardisés (titres, messages d'erreur, tooltips, états vides, confirmations) s'assemblent dans n'importe quel contexte produit tout en maintenant leur cohérence.

### 3.3 Méthodologie & Bonnes pratiques

**Contenu intégré au design system :**
Le contenu ne vit pas dans un fichier Word séparé du design system. Il est documenté dans les mêmes outils (Storybook, Zeroheight, Notion lié au design system) et versionné avec les composants visuels. Chaque composant a une section "Content guidelines" qui précise :
- La longueur maximale recommandée
- Le ton adapté à ce composant
- Les variantes de contenu selon l'état (vide, erreur, succès, chargement)
- Des exemples et des contre-exemples

**Les content models (modèles de contenu) :**
Un modèle de contenu est une structure de données éditoriale. Il définit les éléments constitutifs d'un type de message, sans présupposer leur formulation finale.

Exemple — Modèle de message d'erreur :
- `type` : erreur utilisateur / erreur système / erreur de validation
- `titre` : 5 mots maximum, orienté problème (pas "Erreur 404")
- `corps` : 1 phrase, cause + conséquence ou action à effectuer
- `CTA` : 1 action primaire claire ("Réessayer" / "Contacter le support" / "Revenir à l'accueil")
- `lien d'aide` : optionnel, renvoi vers documentation si contexte complexe

Ces modèles sont définis en collaboration avec l'UX writing, le design, et les développeurs front-end. Ils permettent d'automatiser partiellement la génération de contenu et d'assurer la cohérence à grande échelle.

**Gouvernance éditoriale :**
La gouvernance définit qui peut créer, modifier et valider du contenu dans le produit.

Modèle recommandé :
1. Propriétaire éditorial (UX Writer / Content Designer) : validation finale
2. Contributeurs (PMs, designers) : proposition soumise à validation
3. Comité de révision trimestrielle : audit de cohérence globale
4. Système de versioning : chaque modification est tracée (qui a changé quoi, quand, pourquoi)

**Contenu réutilisable et scalable :**
Les contenus les plus fréquents (messages de confirmation, notifications, états vides, labels de navigation) sont centralisés dans une bibliothèque de contenus. Avantage : une modification unique se propage à toutes les instances. Ce principe, dit de "single source of truth" pour le contenu, réduit massivement le risque d'incohérence lors des mises à jour.

### 3.4 Comparaison d'approches

| Contenu ad hoc | Contenu systémique |
|---|---|
| Chaque erreur est rédigée différemment | Modèle unique appliqué à toutes les erreurs |
| Mise à jour = corriger 40 écrans manuellement | Mise à jour = modifier 1 composant |
| Gouvernance informelle | Propriétaires et processus définis |
| Scalabilité nulle | Scalabilité native |
| Incohérence invisible mais coûteuse | Cohérence mesurable et maintenue |

### 3.5 Correction du modèle mental

❌ **Idée reçue** : "Les content models, c'est pour les CMS et les sites éditoriaux, pas pour un produit logiciel."

✅ **Réalité** : Tout produit numérique à l'échelle produit des contenus structurés : notifications, emails transactionnels, états vides, messages d'erreur, onboarding steps. Sans modèle, ces contenus dérivent. Avec un modèle, ils restent cohérents même quand l'équipe grandit ou change.

**KPI impacté** : Vélocité de livraison — les équipes qui disposent de content models rédigent et valident le contenu deux à trois fois plus vite car le cadre est posé. Le taux d'erreurs de contenu en production (messages incohérents, textes de placeholder non remplacés) chute également.

### 3.6 KPIs liés

**KPIs UX :**
- SUS : la cohérence des textes contribue directement à la prévisibilité perçue du système
- Task success rate : des labels et messages standardisés réduisent l'ambiguïté sur les actions à effectuer
- Taux d'erreurs utilisateur sur les formulaires : des modèles de messages d'erreur bien conçus guident la correction

**KPIs Business :**
- Vélocité de livraison : moins de temps en revue de contenu = plus de sprints livrés dans les délais
- Coût de maintenance éditoriale : la centralisation réduit le temps passé à corriger des incohérences
- ROI UX : un design system de contenu est un investissement initial qui génère des économies exponentielles à mesure que le produit scale

### 3.7 Points éthiques & inclusivité

- **Accessibilité du langage dans les modèles** : les modèles de contenu doivent inclure des contraintes de lisibilité (niveau CECRL B1 recommandé pour les interfaces grand public, soit un texte compréhensible par un lecteur de 12 ans en langue courante).
- **Inclusivité par défaut dans les templates** : les exemples insérés dans les composants (noms, prénoms, adresses, scénarios d'usage) doivent représenter des profils diversifiés.
- **Gouvernance et pouvoir éditorial** : concentrer le pouvoir de validation du contenu dans une seule fonction sans contre-pouvoir peut créer des biais systémiques (ton corporate imposé sur des populations marginalisées). Le comité de révision doit inclure des perspectives diverses.
- ❌ **Dark pattern** : un "content model" d'état vide formulé pour créer un sentiment d'urgence artificielle ("Votre espace est vide — ne manquez pas cette opportunité !") exploite la psychologie de la perte pour forcer l'action.

---

## 4. Localisation stratégique

### 4.1 Modèle mental

La localisation n'est pas une traduction. C'est une re-conception du contenu pour un contexte culturel différent. Adapter un produit au marché japonais en traduisant mot à mot l'interface anglaise, c'est comme servir un plat français dans une assiette en carton à Tokyo : le fond est là, mais l'expérience est ratée.

### 4.2 Analogie stable

Imaginez une même blague racontée par quelqu'un qui maîtrise parfaitement la langue mais pas les codes culturels de son auditoire. Elle est grammaticalement correcte, mais personne ne rit. La localisation stratégique, c'est comprendre l'humour local avant de rédiger la blague — reformuler le fond, pas seulement la forme.

### 4.3 Méthodologie & Bonnes pratiques

**Adaptation culturelle : les dimensions de Hofstede**
Le modèle de Geert Hofstede identifie six dimensions culturelles qui influencent directement la façon dont un utilisateur perçoit et interagit avec un produit :

| Dimension | Impact UX Writing |
|---|---|
| Individualisme vs Collectivisme | Messages centrés sur "vous" (individualiste) vs "votre équipe / votre communauté" (collectiviste) |
| Distance hiérarchique | Ton formel vs informel, vouvoiement systématique dans certains marchés |
| Contrôle de l'incertitude | Degré de réassurance nécessaire, importance des confirmations et des explications contextuelles |
| Orientation long terme | Messages de valeur immédiate vs messages d'investissement durable |
| Indulgence | Ton célébratoire acceptable vs sobre et retenu |
| Masculinité / Féminité | Compétition et performance vs qualité de vie et coopération dans les messages de valeur |

**Gestion des variantes de contenu :**
Un produit localisé dans cinq marchés gère potentiellement cinq versions de chaque texte. Sans architecture de variantes, la maintenance devient ingérable. La solution :
1. Identifiants de contenu uniques (content keys) pour chaque texte localisable
2. Tableau de variantes maintenu dans un outil dédié (Phrase, Lokalise, Crowdin)
3. Processus de mise à jour : modification en langue source + propagation automatique aux workflows de traduction
4. Validation in-context : les traducteurs voient le texte dans l'interface réelle, pas dans un tableau Excel

**Expansion textuelle et contraintes layout :**
Le texte allemand est en moyenne 30 % plus long que l'anglais. L'arabe se lit de droite à gauche (RTL). Le japonais peut s'écrire verticalement. Ces réalités doivent être anticipées dès la phase de conception des composants, pas découvertes lors de la recette de localisation.

Bonnes pratiques :
- Tester les composants avec des textes "worst case" dès la conception (texte le plus long probable)
- Prévoir des marges de 40 % d'expansion dans les layouts fixes
- Intégrer le support RTL dans le design system dès le début si la roadmap l'anticipe
- Éviter les textes incrustés dans les images (impossible à localiser sans recréer l'image)

**Processus de localisation recommandé :**
1. Geler le contenu source (string freeze) avant la livraison
2. Exporter les chaînes vers l'outil de traduction
3. Traduction par des natifs + révision culturelle (pas uniquement linguistique)
4. Validation in-context par des testeurs natifs
5. Recette de localisation : vérification des troncatures, des caractères spéciaux, des formats de date/monnaie/adresse

### 4.4 Comparaison d'approches

| Traduction basique | Localisation stratégique |
|---|---|
| Traduction mot à mot par un prestataire externe | Adaptation culturelle intégrée au processus produit |
| Textes figés dans les images | Textes externalisés et localisables |
| Découverte des problèmes de layout en recette | Composants conçus pour l'expansion textuelle |
| Validation inexistante | Testeurs natifs in-context |
| Coût de correction élevé | Coût de prévention faible |

### 4.5 Correction du modèle mental

❌ **Idée reçue** : "On localise à la fin, quand le produit est stable. On prend le texte anglais et on traduit."

✅ **Réalité** : La localisation est une contrainte d'architecture. Un bouton calibré pour "Submit" peut ne pas contenir "Absenden" (allemand) ou "Enregistrer et continuer" (français) si la largeur est fixe. Intégrer la localisation tardivement génère des refactos coûteuses de layout et de composants.

**KPI impacté** : Taux de complétion de tâche sur les marchés localisés — des utilisateurs confrontés à des textes tronqués, grammaticalement incorrects ou culturellement inadaptés abandonnent les parcours critiques. Le NPS local reflète directement la qualité de la localisation.

### 4.6 KPIs liés

**KPIs UX :**
- Task success rate par marché : détecte les frictions spécifiques à une localisation
- NPS par région : révèle la satisfaction liée à l'adaptation culturelle
- Taux d'abandon par étape et par locale : identifie les points de friction spécifiques

**KPIs Business :**
- Taux de conversion par marché : une localisation adaptée augmente la conversion locale
- Coût de support localisé : un contenu culturellement adapté réduit les incompréhensions et les tickets
- Time to market par locale : un processus de localisation industrialisé réduit les délais de lancement

### 4.7 Points éthiques & inclusivité

- **Respect des cultures non-occidentales** : la localisation ne consiste pas à "occidentaliser" les marchés cibles. Les métaphores, les icônes (ex. : le pouce levé n'a pas la même signification dans toutes les cultures), et les références culturelles doivent être validés localement.
- **Représentation dans les exemples localisés** : les noms fictifs, les exemples de transactions, les illustrations textuelles doivent être adaptés à la culture locale (pas "Jean Dupont" dans une interface localisée en arabe).
- **Accessibilité des langues à écriture complexe** : les langues comme l'arabe, le thaï ou le tamoul ont des exigences typographiques et de rendu spécifiques. Les négliger dégrade l'accessibilité pour des millions d'utilisateurs.
- ❌ **Dark pattern** : utiliser la localisation pour affaiblir des avertissements légaux dans certains marchés perçus comme moins regardants sur la réglementation. Les informations essentielles (conditions, données collectées) doivent être localisées avec la même rigueur que le contenu produit.

---

## 5. Triangle faisabilité / désirabilité / viabilité

### 5.1 Modèle mental

Tout projet de design vit à l'intersection de trois contraintes : est-ce que les utilisateurs en veulent (désirabilité) ? Est-ce que l'équipe peut le construire dans le délai et avec les ressources disponibles (faisabilité) ? Est-ce que ça fait sens pour l'entreprise à long terme (viabilité) ? Concevoir sans tenir compte de ces trois axes, c'est concevoir dans le vide.

### 5.2 Analogie stable

Un architecte peut rêver d'une maison entièrement vitrée suspendue au-dessus d'un lac. C'est désirable (magnifique), potentiellement faisable (techniquement possible avec les bons ingénieurs et le bon budget), mais peut-être pas viable (entretien colossal, résistance thermique insuffisante pour le budget du client). L'excellence en architecture, comme en design produit, c'est de trouver la solution optimale à l'intersection des trois contraintes — pas de maximiser une seule aux dépens des deux autres.

### 5.3 Méthodologie & Bonnes pratiques

**Cartographie des contraintes dès la phase de conception :**
Avant de partir en conception, formaliser les contraintes dans une matrice :

| Axe | Questions à poser | Sources d'information |
|---|---|---|
| Désirabilité | Les utilisateurs en ont-ils besoin ? Le problème est-il réel et fréquent ? | Recherche utilisateur, données d'analytics, interviews |
| Faisabilité | Quelles sont les contraintes techniques ? Quel est le coût de développement ? | Équipe tech, benchmarks, dépendances legacy |
| Viabilité | Quel est le retour sur investissement anticipé ? La réglementation le permet-elle ? | Finance, legal, product strategy |

**Documentation des décisions de compromis :**
Chaque arbitrage significatif doit être documenté. Un Design Decision Record (DDR) consigne :
1. Le contexte (quelle fonctionnalité, quel moment du projet)
2. Les options envisagées
3. Les contraintes identifiées sur chacun des trois axes
4. La décision retenue et son rationnel
5. Les implications connues (ce qu'on accepte de ne pas faire)
6. Les indicateurs qui signaleraient que la décision doit être revisitée

**Design sous contrainte — techniques pratiques :**
- **Timeboxing de la conception** : allouer un temps fixe par axe de contrainte pour éviter la sur-optimisation
- **MoSCoW appliqué au contenu** : identifier Must have / Should have / Could have / Won't have pour les éléments de contenu et les fonctionnalités
- **Prototypage rapide de l'alternative contrainte** : concevoir délibérément la version "si on n'avait que 20 % du budget" pour tester les hypothèses
- **Négociation de scope avec données** : quand une contrainte technique force un compromis, le documenter avec l'impact estimé sur les KPIs pour rendre la décision transparente

### 5.4 Comparaison d'approches

| Design sans arbitrage explicite | Design sous contrainte documenté |
|---|---|
| Compromis implicites, découverts en production | Compromis explicites, validés en amont |
| Frustration de l'équipe face aux "coupes" | Décisions comprises et acceptées collectivement |
| Retravail tardif et coûteux | Ajustements anticipés et intégrés |
| Responsabilité diffuse en cas de problème | Traçabilité des décisions |

### 5.5 Correction du modèle mental

❌ **Idée reçue** : "Le designer doit défendre la vision idéale et laisser les contraintes techniques et business s'ajuster."

✅ **Réalité** : Le designer est le pivot qui intègre les trois contraintes simultanément. Ignorer la faisabilité ou la viabilité ne protège pas les utilisateurs — cela produit des fonctionnalités jamais livrées, des promesses non tenues, ou des produits non rentables qui disparaissent du marché.

**KPI impacté** : Vélocité de livraison — les équipes qui documentent les arbitrages réduisent les allers-retours en phase de développement. Le ROI UX est directement lié à la capacité à livrer des solutions viables dans le temps imparti.

### 5.6 KPIs liés

**KPIs UX :**
- Task success rate : un scope bien arbitré produit une fonctionnalité complète et utilisable, plutôt qu'une fonctionnalité partielle qui crée de la frustration
- SUS : les interfaces conçues sous contrainte documentée évitent les demi-mesures confuses qui dégradent l'utilisabilité perçue

**KPIs Business :**
- Vélocité de livraison : moins de remises en question tardives = sprints mieux tenus
- ROI UX : la documentation des décisions permet de mesurer l'impact réel des compromis et de les valoriser auprès des parties prenantes
- Taux de fonctionnalités livrées dans les délais : corrélé à la qualité des arbitrages en amont

### 5.7 Points éthiques & inclusivité

- **Viabilité ne signifie pas exclusion** : quand la contrainte de faisabilité force à réduire le scope d'accessibilité (ex. : "on met le support lecteur d'écran en backlog"), cet arbitrage doit être explicitement documenté avec un engagement de date de livraison — pas enterré comme un "non-requis".
- **Désirabilité pour qui ?** : la recherche utilisateur qui alimente le pôle "désirabilité" doit représenter des populations diverses. Concevoir pour la majorité en ignorant les besoins des minorités est un biais de désirabilité systémique.
- **Viabilité et éthique des données** : les modèles économiques basés sur la collecte massive de données peuvent être "viables" au sens financier mais éthiquement discutables. Le triangle doit intégrer une quatrième dimension implicite : l'éthique.
- ❌ **Dark pattern** : réduire délibérément la faisabilité du processus de désinscription ou de suppression de compte ("trop complexe techniquement") pour maintenir artificiellement la rétention.

---

## 6. Collaboration concrète avec les devs

### 6.1 Modèle mental

La collaboration design-dev n'est pas un transfert de fichiers : c'est un dialogue continu. Le designer ne livre pas des écrans "terminés" — il co-construit une compréhension partagée du problème et de la solution avec les développeurs, dès le début, pas à la fin.

### 6.2 Analogie stable

Un chef cuisinier et son brigade ne fonctionnent pas sur le mode "le chef invente la recette seul dans son bureau et la brigade exécute sans poser de questions". La mise en place (préparation), la communication pendant le service, et le retour d'expérience après sont des moments de collaboration intense. Le design-dev, c'est la même cuisine partagée : les contraintes du fournisseur (tech) influencent le menu (design), et la créativité du chef (designer) inspire de nouvelles façons d'utiliser les ingrédients disponibles.

### 6.3 Méthodologie & Bonnes pratiques

**Pair design (ou design pairing) :**
Sur le modèle du pair programming, le pair design consiste à travailler en binôme designer-développeur sur une fonctionnalité spécifique. Le développeur apporte sa connaissance des contraintes techniques ; le designer apporte sa vision de l'expérience utilisateur. Le résultat est une solution qui tire parti des deux expertises sans surprise de part et d'autre.

Fonctionnement pratique :
- Sessions courtes (1 à 2 h) sur des fonctionnalités complexes ou à risque technique
- Questions posées en temps réel ("si on fait ça, quelle est la contrainte côté API ?")
- Décisions consignées immédiatement dans le ticket ou la documentation

**Vocabulaire partagé :**
La communication design-dev est souvent parasitée par des malentendus terminologiques. Quelques distinctions essentielles :
- **Token** : variable de design (couleur, espacement, typographie) stockée comme valeur nommée et partagée entre Figma et le code. Un token "color/primary" est la même valeur dans les deux environnements.
- **Composant** : unité réutilisable de UI, partagée entre le design system et le code. Un composant "Button" a les mêmes variantes dans Figma et dans la bibliothèque front-end.
- **État** : chaque composant a plusieurs états (normal, survol, focus, désactivé, chargement, erreur). Tous doivent être conçus et documentés, pas seulement l'état "happy path".
- **Annotation de spec** : document joint aux maquettes précisant les comportements non visuels (animations, gestion du focus clavier, comportement responsive, gestion des cas limites).

**Contraintes techniques intégrées dès la conception :**
Avant de commencer la conception détaillée, le designer doit connaître :
- Les contraintes API (champs disponibles, limites de caractères réelles côté back-end)
- Les contraintes de performance (si une opération prend 3 s, il faut un skeleton screen ou un loader)
- Les dépendances du système legacy (certaines données ne peuvent pas être affichées en temps réel)
- Les contraintes de plateforme (comportement différent iOS/Android pour certains composants natifs)

**Feedback loops courts :**
Les allers-retours design-dev doivent être fréquents et légers, pas massifs et rares. En pratique :
- Revue de design technique (design tech review) en début de sprint avec les devs
- Check-in à mi-sprint sur l'avancement de l'implémentation
- Recette design (design QA) avant la mise en production : le designer valide que l'implémentation est conforme aux specs

### 6.4 Comparaison d'approches

| Collaboration en silo | Collaboration intégrée |
|---|---|
| Handoff Figma → dev en fin de sprint | Pair design dès la phase de conception |
| Terminologie différente de part et d'autre | Vocabulaire partagé documenté |
| Contraintes techniques découvertes après le design | Contraintes intégrées dès la conception |
| Recette design absente | Design QA systématique avant mise en prod |
| Frustration mutuelle, retravail | Confiance et livraison accélérée |

### 6.5 Correction du modèle mental

❌ **Idée reçue** : "Les développeurs implémentent ce que le designer a conçu. Si ça ne ressemble pas aux maquettes, c'est un problème de développement."

✅ **Réalité** : Un gap entre maquettes et implémentation est presque toujours un problème de communication, pas de compétence. Le designer est responsable de la clarté des specs et de la qualité du dialogue avec l'équipe technique.

**KPI impacté** : Vélocité de livraison — les équipes qui pratiquent la collaboration intégrée réduisent de 20 à 40 % le temps de recette et le nombre de tickets de bug liés à des ambiguïtés de spec (source : études internes d'équipes produit agiles).

### 6.6 KPIs liés

**KPIs UX :**
- Taux de conformité implémentation vs spec : mesure la qualité du dialogue design-dev
- Nombre de bugs UX par release : révèle des lacunes dans les specs ou la recette design
- SUS : une implémentation non conforme aux intentions de design dégrade l'expérience perçue

**KPIs Business :**
- Vélocité de livraison : moins de retravail = plus de fonctionnalités livrées par sprint
- Coût de correction des bugs UX : un bug détecté avant la mise en prod coûte 10x moins qu'un bug détecté en production
- Satisfaction de l'équipe (eNPS) : la collaboration fluide améliore le bien-être des équipes design et dev

### 6.7 Points éthiques & inclusivité

- **Accessibilité comme contrainte technique partagée** : les critères WCAG (contraste, navigation clavier, compatibilité lecteur d'écran) doivent être des critères d'acceptation techniques intégrés dans les tickets de développement, pas des ajouts optionnels.
- **Responsabilité partagée de l'expérience** : si une contrainte technique force un compromis qui dégrade l'accessibilité, ce compromis doit être explicitement décidé et documenté — pas découvert par les utilisateurs en situation de handicap.
- **Documentation en langue accessible** : les specs et annotations doivent être compréhensibles par tous les membres de l'équipe, y compris les développeurs non natifs qui travaillent avec des équipes internationales.

---

## 7. Contraintes techniques et impact UX

### 7.1 Modèle mental

Les contraintes techniques ne sont pas des obstacles à l'UX : elles sont le terrain de jeu du designer. Comprendre les limites d'une API, d'un système legacy ou d'une infrastructure lente permet de concevoir des expériences adaptées à la réalité, pas à un idéal inaccessible.

### 7.2 Analogie stable

Un photographe de sport ne peut pas contrôler la lumière du stade, la vitesse des athlètes, ou la météo. Mais il choisit son objectif, son angle, et son moment de déclenchement en fonction de ces contraintes. Un designer UX face aux contraintes techniques fait de même : il ne peut pas changer le temps de réponse de l'API, mais il peut concevoir l'expérience d'attente pour qu'elle soit perçue comme fluide.

### 7.3 Méthodologie & Bonnes pratiques

**API : temps de réponse et états d'erreur**
Une API répond rarement instantanément et peut échouer. Le designer doit concevoir systématiquement pour chacun de ces états :

| État | Durée typique | Solution UX |
|---|---|---|
| Réponse rapide | < 300 ms | Pas de loader nécessaire (mais éviter le flash) |
| Réponse lente | 300 ms à 1 s | Spinner minimal, ne pas bloquer l'UI |
| Réponse très lente | > 1 s | Skeleton screen ou message de chargement contextualisé |
| Timeout / erreur | Variable | Message d'erreur actionnable + option de réessai |
| Erreur partielle | — | Afficher ce qui est disponible, signaler ce qui manque |

**Latence : skeleton screens et optimistic UI**
- **Skeleton screen** : affichage d'une version "fantôme" de l'interface (formes grises) pendant le chargement. Réduit la perception d'attente car l'utilisateur voit que quelque chose va apparaître. Plus efficace qu'un spinner pour les contenus structurés (listes, cartes, tableaux).
- **Optimistic UI** : l'interface affiche immédiatement le résultat attendu d'une action (ex. : un like, un ajout au panier) sans attendre la confirmation du serveur. En cas d'échec, l'interface revient en arrière avec un message d'erreur. Améliore massivement la fluidité perçue sur les actions courantes et rapides.

**Systèmes legacy : adapter vs refondre**
Face à un système existant avec des contraintes structurelles (données disponibles en lot et non en temps réel, pas d'API REST, architecture monolithique), deux options :

| Adapter | Refondre |
|---|---|
| Coût bas, risque bas | Coût élevé, risque élevé |
| Amélioration incrémentale de l'UX | Amélioration radicale possible |
| Contraintes conservées | Contraintes levées (potentiellement) |
| Approprié pour : Quick wins, priorités court terme | Approprié pour : transformation produit, blocages stratégiques |

La décision d'adapter ou de refondre doit être documentée dans un DDR (voir section 5) avec les impacts UX et business estimés.

**Performance perçue :**
La performance perçue n'est pas identique à la performance mesurée. Un chargement de 2 secondes avec un skeleton screen est perçu comme plus rapide qu'un chargement d'1 seconde avec un écran blanc. Les leviers de la performance perçue :
- Afficher quelque chose immédiatement (même incomplet)
- Donner de la progression (barre de chargement, étapes)
- Occuper cognitivement l'utilisateur pendant l'attente (onboarding, tutoriel inline)
- Éviter les écrans entièrement bloquants

### 7.4 Correction du modèle mental

❌ **Idée reçue** : "Si l'API est lente, c'est un problème d'infrastructure. Le designer n'a pas de rôle là-dedans."

✅ **Réalité** : La perception de la performance est entièrement sous la responsabilité du designer. L'infrastructure fixe le plancher de performance réelle ; le design fixe le plafond de performance perçue. Les skeleton screens et l'optimistic UI peuvent transformer une expérience frustrante en expérience fluide sans toucher à une ligne d'infrastructure.

**KPI impacté** : Taux de rétention — la performance perçue est l'un des prédicteurs les plus forts de la rétention à 7 et 30 jours. Une latence mal gérée augmente le taux de rebond et réduit l'engagement.

### 7.5 KPIs liés

**KPIs UX :**
- Taux de rebond (par page ou par étape du funnel) : révèle l'impact des temps d'attente non gérés
- Time on task : les états d'attente non conçus allongent mécaniquement le temps de complétion
- Taux d'erreur utilisateur : les états d'erreur techniques mal conçus font "blâmer" l'utilisateur sur lui-même

**KPIs Business :**
- Taux de rétention à 7 et 30 jours : fortement corrélé à la fluidité perçue
- Taux de conversion : les pages lentes perdent en moyenne 1 % de conversion par seconde supplémentaire de chargement (référence : études Google PageSpeed)
- Volume de tickets support liés à la performance : un état d'erreur bien conçu réduit les appels au support

### 7.6 Points éthiques & inclusivité

- **Performance sur appareils bas de gamme** : les skeleton screens et optimistic UI doivent être testés sur des appareils d'entrée de gamme et des connexions lentes (3G). Les marchés émergents utilisent majoritairement des appareils plus anciens et des réseaux moins stables.
- **États d'erreur non culpabilisants** : un message "Votre connexion est instable" accusateur envers l'utilisateur est à éviter. "Chargement interrompu — réessayez" est factuellement identique mais ne charge pas l'utilisateur de responsabilité.
- **Transparence sur les délais** : ne jamais afficher un indicateur de progression fictif (barre qui avance à vitesse fixe sans refléter la progression réelle). C'est un mensonge d'interface qui érode la confiance.

---

## 8. Dette UX & dette technique

### 8.1 Modèle mental

La dette UX, c'est l'accumulation de décisions de design sous-optimales prises par manque de temps, de ressources, ou de connaissance — et dont on paiera le coût plus tard, avec des intérêts. Comme une dette financière, elle ne disparaît pas d'elle-même : elle grossit si on ne la rembourse pas.

### 8.2 Analogie stable

Imaginez un appartement dans lequel chaque propriétaire successif a fait des "petites réparations rapides" plutôt que de vraiment résoudre les problèmes : un tuyau colmaté avec du chatterton, un circuit électrique bricolé, une porte qui ferme mal. Au bout de dix ans, l'appartement semble habitable mais tout travail de rénovation sérieux révèle des couches de problèmes cachés qui multiplient le coût initial. La dette UX s'accumule de la même façon : chaque raccourci de conception est une réparation au chatterton.

### 8.3 Méthodologie & Bonnes pratiques

**Définition et distinction :**
- **Dette technique** : choix d'implémentation sous-optimaux qui compliquent les évolutions futures (code dupliqué, architecture fragile, absence de tests).
- **Dette UX** : choix de design sous-optimaux qui dégradent l'expérience utilisateur dans le temps (incohérences visuelles, flux mal pensés, contenus obsolètes, composants dupliqués et divergents).

Ces deux dettes sont liées : la dette technique contraint les possibilités d'amélioration UX ; la dette UX crée des demandes de refactoring qui révèlent la dette technique.

**Identification par l'audit UX :**
Un audit UX de dette se structure en quatre phases :
1. **Recensement** : cartographier toutes les surfaces produit et identifier les anomalies (incohérences visuelles, messages obsolètes, composants dupliqués, flux non conformes aux standards actuels)
2. **Qualification** : pour chaque anomalie, documenter le type (contenu, visuel, flux, accessibilité), la sévérité (critique / majeure / mineure), et le nombre d'utilisateurs impactés
3. **Estimation de l'impact** : quel KPI est affecté et de combien ? (ex. : "Ce message d'erreur ambigu est responsable de 15 % des abandons sur cette étape")
4. **Priorisation** : matrice impact (KPI) vs effort (coût de correction)

**Arbitrage et plan de remboursement :**
La dette UX ne se rembourse pas tout d'un coup. Le plan de remboursement s'intègre au backlog produit :
- Allouer 15 à 20 % de la vélocité de sprint à la réduction de dette (ratio courant dans les équipes produit matures)
- Prioriser les dettes qui bloquent des évolutions futures (dependency debt) avant les dettes cosmétiques
- Lier chaque item de dette à un KPI impacté pour le négocier avec le product management

**Prévention par le design system :**
Le design system est le principal outil de prévention de la dette UX. En centralisant les composants, les tokens et les guidelines, il empêche la prolifération de solutions divergentes. Les rituels de prévention :
- Design critique (critique de design) systématique avant la livraison de chaque fonctionnalité
- Revue de design system trimestrielle : identifier les composants dupliqués, les variantes non documentées
- Critères d'acceptation incluant la conformité au design system pour chaque ticket

### 8.4 Comparaison d'approches

| Gestion réactive de la dette UX | Gestion proactive |
|---|---|
| La dette est invisible jusqu'à la crise | La dette est auditée et documentée régulièrement |
| Correction urgente et coûteuse | Remboursement planifié et intégré au backlog |
| Impact sur les KPIs non mesuré | Impact quantifié et utilisé pour prioriser |
| Pas de prévention | Design system et rituels de prévention actifs |
| Vélocité qui s'effondre avec le temps | Vélocité stable ou croissante |

### 8.5 Correction du modèle mental

❌ **Idée reçue** : "La dette UX, c'est juste des petites incohérences visuelles sans vrai impact. On s'en occupera quand on aura le temps."

✅ **Réalité** : La dette UX a un impact direct et mesurable sur les KPIs business. Des flux incohérents augmentent le taux d'abandon. Des messages obsolètes génèrent des tickets support. Des composants dupliqués ralentissent les futures évolutions. "On s'en occupera plus tard" est le mécanisme même par lequel la dette s'accumule et ses intérêts croissent.

**KPI impacté** : Vélocité de livraison — plus la dette UX est élevée, plus chaque nouvelle fonctionnalité nécessite de travail de contournement ou de correction de l'existant. Le ROI UX d'un investissement de remboursement de dette se mesure en vélocité récupérée.

### 8.6 KPIs liés

**KPIs UX :**
- SUS : la dette UX fait baisser le score d'utilisabilité car l'incohérence dégrade la prévisibilité du système
- Task success rate : les flux avec dette UX accumulée ont des taux d'abandon plus élevés
- Taux d'erreurs utilisateur : les composants divergents ou les messages ambigus génèrent des erreurs

**KPIs Business :**
- Vélocité de livraison : la dette UX ralentit les équipes sur chaque sprint
- ROI UX : le remboursement de dette génère un ROI différé mais prévisible (vélocité retrouvée, réduction du support)
- Volume de tickets support : directement corrélé au volume de dette UX sur les contenus et les flux

### 8.7 Points éthiques & inclusivité

- **La dette d'accessibilité est une dette UX prioritaire** : les fonctionnalités inaccessibles (absence d'alternative textuelle, navigation clavier impossible) excluent activement des utilisateurs. Cette dette n'est pas "cosmétique" — elle est légale (RGAA en France, ADA aux États-Unis) et éthique.
- **Documentation de la dette comme acte de transparence** : rendre visible la dette UX (audit partagé avec les parties prenantes) est un acte d'honnêteté envers les utilisateurs et l'équipe. Cacher la dette pour rassurer les stakeholders est une forme de management du risque irresponsable.
- **Priorisation inclusive du remboursement** : quand on priorise la dette à rembourser, les critères doivent inclure l'impact sur les populations les plus vulnérables ou les moins représentées dans les tests, pas uniquement l'impact sur la majorité des utilisateurs.

---

## 9. IA appliquée à l'UX Writing et au Delivery

### 9.1 Modèle mental

L'IA n'est pas un rédacteur automatique qui remplace l'UX Writer. C'est un assistant qui accélère les tâches répétitives (vérification de cohérence, détection d'obsolescences, aide à la traduction) et libère le professionnel du contenu pour les tâches à haute valeur ajoutée (stratégie, arbitrage, adaptation culturelle).

### 9.2 Analogie stable

Un correcteur orthographique ne remplace pas un relecteur humain : il capture les fautes mécaniques pour que le relecteur puisse concentrer son attention sur le sens, le style, et la cohérence. L'IA en UX Writing fonctionne de la même façon : elle gère les vérifications systématiques pour que le content designer puisse se concentrer sur les décisions éditoriales qui nécessitent du jugement humain.

### 9.3 Méthodologie & Bonnes pratiques

**Suggestions de contenu adaptatif :**
Les systèmes IA peuvent générer des suggestions de contenu contextualisées : variantes de CTA, formulations alternatives pour les messages d'erreur, suggestions de raccourcissement pour les textes trop longs. Le workflow recommandé :
1. Générer un ensemble de variantes via le modèle IA
2. Évaluer chaque variante au prisme du Tone of Voice Guide
3. Sélectionner ou hybrider la meilleure option
4. Valider avec un testeur utilisateur si l'enjeu est significatif

**Vérification automatique de cohérence voice & tone :**
Des outils (Writer, Acrolinx, ou des LLMs intégrés au design system) peuvent analyser un corpus de contenu existant et signaler :
- Les textes qui s'écartent du Tone of Voice défini
- Les termes blacklistés (jargon, anglicismes non validés, termes ambigus)
- Les formulations genrées ou non inclusives
- Les niveaux de lisibilité trop élevés (score Flesch-Kincaid, index Gunning Fog)

**Détection de contenus obsolètes :**
L'IA peut comparer un corpus de contenu produit à un référentiel de vérité (documentation produit à jour, nomenclature officielle) et signaler les textes qui référencent des fonctionnalités renommées, supprimées, ou modifiées. Ce cas d'usage est particulièrement utile après une refonte ou un rebranding.

**Aide à la localisation :**
Les LLMs multilingues peuvent produire des premières traductions de qualité suffisante pour réduire significativement le temps de traduction professionnelle (pré-traduction + révision native vs traduction intégrale). En revanche, la validation culturelle reste impérativement humaine.

**Limites et garde-fous :**
- L'IA peut reproduire des biais présents dans ses données d'entraînement (formulations stéréotypées, manque de représentation). Toute suggestion IA doit être relue par un humain.
- La génération automatique de contenu sans relecture crée un risque de mass production d'incohérences.
- Les modèles IA ne comprennent pas le contexte émotionnel fin d'une interaction (moment de deuil, stress financier, urgence médicale). Le tone-matching contextuel reste une compétence humaine.

### 9.4 Comparaison d'approches

| IA comme outil de remplacement | IA comme outil d'augmentation |
|---|---|
| Génération automatique sans relecture | Génération + validation humaine systématique |
| Uniformisation appauvrie du ton | Cohérence accrue avec créativité préservée |
| Risque de biais non détectés | Biais signalés et corrigés |
| UX Writer marginalisé | UX Writer repositionné sur la stratégie |
| Gain de temps court terme, dette long terme | Gain de temps court terme ET qualité long terme |

### 9.5 Correction du modèle mental

❌ **Idée reçue** : "L'IA va remplacer les UX Writers. Pourquoi investir dans cette compétence ?"

✅ **Réalité** : L'IA déplace la valeur de la rédaction vers la stratégie, l'arbitrage culturel, et la gouvernance du contenu — des compétences qui nécessitent du jugement humain. Les équipes qui intègrent l'IA dans leur workflow produisent plus de contenu, de meilleure qualité, avec les mêmes effectifs. Mais elles ont besoin d'UX Writers capables de piloter ces outils stratégiquement.

**KPI impacté** : Vélocité de livraison — les équipes qui utilisent l'IA pour la vérification de cohérence réduisent le temps de revue de contenu de 30 à 50 %. Le taux de NPS n'est pas automatiquement amélioré par l'IA ; il dépend de la qualité de la stratégie éditoriale qui la pilote.

### 9.6 KPIs liés

**KPIs UX :**
- Taux de cohérence voice & tone (mesuré par audit) : l'IA permet de mesurer et maintenir ce KPI à grande échelle
- Taux de lisibilité moyen du contenu produit : les outils IA peuvent calculer ce score sur l'ensemble du corpus

**KPIs Business :**
- Vélocité de livraison : réduction du temps de revue et de correction de contenu
- Coût de localisation : réduction du temps de traduction via pré-traduction IA
- ROI UX : l'IA comme levier de scalabilité de la qualité éditoriale sans augmentation proportionnelle des effectifs

### 9.7 Points éthiques & inclusivité

- **Biais algorithmiques** : les LLMs sont entraînés sur des corpus qui surreprésentent certaines langues, cultures et populations. Les suggestions de contenu doivent systématiquement être relues au prisme de l'inclusivité.
- **Transparence envers les utilisateurs** : si du contenu génératif est visible par les utilisateurs (chatbot, réponses automatiques), cela doit être signalé clairement. Faire passer du contenu IA pour du contenu humain sans indication est une pratique trompeuse.
- **IA et localisation** : les langues moins représentées dans les corpus d'entraînement (langues africaines, langues autochtones) produisent des résultats de moins bonne qualité. L'IA ne doit pas être le seul outil de localisation pour ces marchés.
- ❌ **Dark pattern** : utiliser l'IA pour générer du contenu manipulateur à grande échelle (dark patterns textuels automatisés, messages d'urgence fictifs générés dynamiquement, personnalisation destinée à exploiter les vulnérabilités émotionnelles des utilisateurs).

---

*Fin de la Section 13 — Théorie. Les exercices associés sont disponibles dans le fichier `13-uxwriting-delivery-exercices.md`.*
