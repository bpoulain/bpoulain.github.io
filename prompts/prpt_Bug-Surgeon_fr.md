```markdown
# Analyse et correction de bugs (application web)
## Contexte
Tu disposes des éléments suivants (fournis dans les messages suivants) :
- Une **application web contenue dans un seul fichier HTML**  
    (HTML, CSS et JavaScript inclus dans le même fichier).
- Un fichier **Markdown** décrivant :
    - les **JTBD (Jobs To Be Done)**,
    - le **feature mapping** associé.
    - Les **logs d’erreurs de la console du navigateur**.
Les **JTBD et le feature mapping constituent la source de vérité fonctionnelle**.
---
## Objectif
- Identifier et corriger **tous les bugs existants** dans l’application.
- **Ne pas ajouter de nouvelles fonctionnalités**, ni modifier le périmètre fonctionnel.
- Corriger uniquement ce qui est nécessaire pour :
    - éviter les crashs,
    - supprimer les erreurs console,
    - assurer un comportement conforme aux JTBD et au feature mapping.
- Fournir une **version corrigée et fonctionnelle du fichier HTML**.
---
## Définition d’un bug
Un bug est défini comme :
- Une **erreur JavaScript** ou exception visible dans la console.
- Un comportement qui :
    - empêche l’accomplissement d’un JTBD,
    - ou ne correspond pas au feature mapping.
- Un comportement inattendu ou instable (ex. : état incohérent, action qui ne répond pas, crash).
- Une erreur HTML, CSS ou logique qui provoque un dysfonctionnement réel.
⚠️ Ne sont **pas** considérés comme des bugs :
    - Les optimisations de performance non bloquantes.
    - Le refactoring esthétique ou structurel.
    - Les améliorations UX non explicitement requises par les JTBD.
---
## Contraintes strictes
- ❌ Ne pas ajouter de fonctionnalités.
- ❌ Ne pas refactorer ou réorganiser le code sauf si **strictement nécessaire** pour corriger un bug identifié.
- ❌ Ne pas renommer des variables ou fonctions sans justification liée à un bug.
- ✅ Se concentrer uniquement sur la **stabilité et le fonctionnement correct**.
---
## Étapes demandées
### 1️⃣ Diagnostic détaillé (avant toute correction)
- Analyser :
    - les logs d’erreurs de la console,
    - le fichier HTML,
    - les JTBD et le feature mapping.
- Identifier **tous les bugs existants**.
- Pour chaque bug, préciser :
    - Type d’erreur (JavaScript, HTML, CSS, logique)
    - Localisation approximative dans le fichier HTML
    - Impact sur le fonctionnement ou les JTBD
- Fournir un **résumé clair et exhaustif** de tous les bugs détectés.
⚠️ Aucune correction ne doit être appliquée dans cette étape.
---
### 2️⃣ Correction des bugs
- Corriger **uniquement** les bugs identifiés lors du diagnostic.
- Fournir une **version complète et prête à l’emploi du fichier HTML corrigé**.
- Ne pas introduire de changements non justifiés par un bug.
---
### 3️⃣ Explications des corrections
Pour chaque correction effectuée :
- Expliquer :
    - Quelle était l’erreur
    - Pourquoi elle se produisait
    - Comment elle a été corrigée
- Relier chaque correction au bug correspondant identifié en section 1.
---
## Format de réponse attendu
### Section 1 – Diagnostic détaillé
Liste complète des bugs identifiés, avec analyse et impact.
### Section 2 – Fichier HTML corrigé
Fichier HTML complet, fonctionnel, prêt à être utilisé.
### Section 3 – Explications des corrections
Détails clairs et concis pour chaque correction.
```