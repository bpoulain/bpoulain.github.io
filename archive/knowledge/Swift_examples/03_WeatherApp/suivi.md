# Suivi — Projet 3 : Weather App

## Progression globale
- [ ] Projet créé
- [ ] Modèles Codable définis (WeatherResponse, CurrentWeather, Forecast)
- [ ] Service réseau avec URLSession
- [ ] ViewModel avec @Observable et async/await
- [ ] États de chargement (loading, error, empty, success)
- [ ] Recherche de ville fonctionnelle
- [ ] Prévisions affichées
- [ ] Gestion des erreurs affichée à l'utilisateur
- [ ] Skeleton loading implémenté
- [ ] Empty state soigné
- [ ] Dark Mode et Dynamic Type vérifiés

## Compétences Swift / SwiftUI
- [ ] `async/await` — syntaxe de la concurrence moderne
- [ ] `Task { }` — lancer du code async depuis une vue synchrone
- [ ] `URLSession.shared.data(from:)` — requête HTTP async
- [ ] `JSONDecoder` + `Codable` — décodage JSON typé
- [ ] `CodingKeys` — remapper les clés JSON
- [ ] Gestion d'erreurs typées (`enum WeatherError: Error`)
- [ ] `@Observable` — ViewModel moderne sans ObservableObject
- [ ] `.task { }` modifier — async lié au cycle de vie de la vue
- [ ] `ContentUnavailableView` — empty/error states natifs

## Concepts techniques
- [ ] REST APIs — requête GET avec paramètres
- [ ] Codable — décodage automatique depuis JSON
- [ ] Swift Concurrency — async/await, Task, actor
- [ ] Loading states — feedback pendant les requêtes
- [ ] Error states — afficher les erreurs utilisateur
- [ ] Dependency injection — injecter le service dans le ViewModel

## Architecture
- [ ] ViewModel async (@Observable)
- [ ] Dependency injection légère (protocol + struct)
- [ ] Services réseau isolés

## Bonnes pratiques Apple
- [ ] Permissions localisation (CLLocationManager)
- [ ] Skeleton loading
- [ ] Empty states (ContentUnavailableView)
- [ ] Gestion offline minimale

## Notes personnelles
<!-- Tes observations, blocages, questions -->
