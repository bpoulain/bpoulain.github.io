# Suivi — Projet 6 : Social Feed (optionnel)

> **Note** : Ce projet est optionnel dans la roadmap prototypage. Priorité si tu veux comprendre la performance de rendu et le chargement de listes longues.

## Progression globale
- [ ] Projet créé
- [ ] Feed de posts avec LazyVStack
- [ ] Chargement d'images avec AsyncImage
- [ ] Infinite scroll / pagination
- [ ] Pull to refresh
- [ ] Cache d'images (NSCache)
- [ ] Optimistic UI (like immédiat avant confirmation serveur)
- [ ] Performance testée (pas de lag au scroll)
- [ ] Dark Mode vérifié

## Compétences Swift / SwiftUI
- [ ] `LazyVStack` / `LazyHStack` — rendu paresseux
- [ ] `AsyncImage` — chargement et placeholder d'images async
- [ ] Infinite scroll (détecter la fin de liste)
- [ ] Pull to refresh (`.refreshable`)
- [ ] Image caching (NSCache ou bibliothèque externe)
- [ ] Debouncing (éviter les requêtes en rafale)
- [ ] `@MainActor` — garantir l'exécution sur le thread principal

## Concepts techniques
- [ ] Pagination (offset/cursor)
- [ ] Cache mémoire / disque
- [ ] Optimistic UI — mettre à jour l'UI avant la confirmation réseau
- [ ] Debouncing — limiter les appels API lors de la saisie

## Architecture
- [ ] Feature modularization
- [ ] Store pattern (FeedStore centralisé)
- [ ] Shared state entre composants

## Bonnes pratiques Apple
- [ ] Perceived performance — l'app semble réactive même si le réseau est lent
- [ ] Battery efficiency — ne pas charger ce qui n'est pas visible
- [ ] Memory management — libérer les images hors-écran

## Notes personnelles
<!-- Tes observations, blocages, questions -->
