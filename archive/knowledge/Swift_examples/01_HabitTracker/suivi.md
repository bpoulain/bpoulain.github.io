# Suivi — Projet 1 : Habit Tracker

## Progression globale
- [ ] Projet créé dans Xcode (SwiftUI App, iOS 18+)
- [ ] Modèle de données défini
- [ ] Liste d'habitudes affichée
- [ ] Ajout d'une habitude (sheet)
- [ ] Suppression par swipe
- [ ] Coche / décoche avec animation
- [ ] Streak affiché
- [ ] Previews multi-device configurées
- [ ] Dark Mode vérifié
- [ ] Dynamic Type vérifié

## Compétences Swift / SwiftUI
- [ ] `var` / `let` / `String` / `Int` / `Bool` / `Array`
- [ ] Struct — modèle de données en value type
- [ ] `@State` — modifier une valeur déclenche un re-render
- [ ] `@Binding` — sous-vue peut modifier le state du parent
- [ ] `ForEach` + `Identifiable`
- [ ] `List` avec `.onDelete` et `.swipeActions`
- [ ] `NavigationStack` + `.navigationTitle`
- [ ] Composants réutilisables (au moins 2 vues séparées)
- [ ] Modifiers : `.font`, `.foregroundStyle`, `.padding`, `.background`
- [ ] `#Preview` macro
- [ ] Previews avec `.constant()` pour les @Binding

## Concepts techniques
- [ ] Reactive UI — l'UI se recalcule quand @State change
- [ ] Data flow unidirectionnel — state descend, events remontent
- [ ] Value types — struct copiée, SwiftUI détecte le changement
- [ ] `Identifiable` — protocole requis par ForEach
- [ ] `withAnimation` — animation de la coche
- [ ] Xcode Previews workflow — prototyper sans lancer le simulateur

## Architecture
- [ ] State local (@State dans la vue racine)
- [ ] Binding passé aux sous-vues (@Binding)
- [ ] Décomposition en composants (au moins 3 vues)

## Bonnes pratiques Apple
- [ ] SF Symbols — icônes système nommées
- [ ] Dynamic Type — taille de texte adaptative
- [ ] Dark Mode — vérifier les couleurs en mode sombre
- [ ] Native spacing — espacements cohérents iOS
- [ ] HIG — lire la section Lists et Navigation

## Notes personnelles
<!-- Tes observations, blocages, questions -->
