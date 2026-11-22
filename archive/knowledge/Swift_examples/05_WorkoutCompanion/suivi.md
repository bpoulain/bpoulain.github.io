# Suivi — Projet 5 : Workout Companion

## Progression globale
- [ ] Projet créé
- [ ] Liste d'exercices avec navigation
- [ ] Timer animé fonctionnel
- [ ] Animation d'entrée/sortie des exercices (MatchedGeometryEffect)
- [ ] DragGesture fonctionnel (swipe to complete type Clear)
- [ ] Spring physics — transition fluide
- [ ] Séquence d'animation complète (tap → expand → animate → close)
- [ ] Canvas pour visuel de progression circulaire
- [ ] Reduced Motion respecté
- [ ] Dark Mode vérifié

## Compétences Swift / SwiftUI
- [ ] `withAnimation(.spring(response:dampingFraction:))` — spring physics
- [ ] `MatchedGeometryEffect` — transition partagée entre deux vues
- [ ] `DragGesture` — valeur, translation, onEnded
- [ ] `GestureState` — état temporaire du gesture
- [ ] `Canvas` + `GraphicsContext` — dessin custom
- [ ] `TimelineView` — mise à jour à intervalles réguliers
- [ ] `.transition()` — animation d'insertion/suppression
- [ ] `.animation(.spring, value:)` — animation déclenchée par valeur
- [ ] `@Namespace` — espace de nommage pour MatchedGeometryEffect

## Concepts techniques
- [ ] Rendering pipeline SwiftUI (quand et pourquoi la vue est redessinée)
- [ ] Spring physics — réponse, amortissement, vitesse initiale
- [ ] Gesture + animation coordination (état intermédiaire pendant le drag)
- [ ] Interactions enchaînées (gesture → état → animation)
- [ ] State machines simples (exercice en cours → repos → terminé)

## Architecture
- [ ] State machines simples (enum pour les phases)
- [ ] Reactive flows (état du timer → UI animée)

## Bonnes pratiques Apple
- [ ] Motion design iOS — animations naturelles, pas mécaniques
- [ ] `@Environment(\.accessibilityReduceMotion)` — respecter Reduced Motion
- [ ] Watch-like interactions — tap zones généreuses
- [ ] Haptics aux moments clés (début, fin, complétion)

## Notes personnelles
<!-- Tes observations sur les animations, blocages, découvertes -->
