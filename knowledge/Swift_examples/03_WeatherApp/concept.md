# Concepts — Projet 3 : Weather App

## 1. async/await — la concurrence moderne

`async/await` permet d'écrire du code asynchrone de façon lisible, sans callbacks ni completion handlers.

```swift
// Avant (callback hell)
URLSession.shared.dataTask(with: url) { data, response, error in
    DispatchQueue.main.async {
        // traitement...
    }
}.resume()

// Avec async/await
let (data, _) = try await URLSession.shared.data(from: url)
// La ligne suivante n'est exécutée qu'une fois les données reçues
let weather = try JSONDecoder().decode(WeatherResponse.self, from: data)
```

**Principe** : `await` suspend la Task courante (libère le thread), et reprend quand le résultat est disponible. Le thread n'est jamais bloqué.

---

## 2. Task — lancer du code async

Une `Task` est une unité de travail asynchrone. Elle est nécessaire pour appeler du code `async` depuis un contexte synchrone (comme un bouton SwiftUI).

```swift
Button("Rechercher") {
    // Le handler de bouton est synchrone — Task lance un contexte async
    Task {
        await viewModel.search()
    }
}

// .task{} : Task liée au cycle de vie de la vue
// Annulée automatiquement quand la vue disparaît
.task {
    await viewModel.loadInitialData()
}
```

---

## 3. Codable — décodage JSON automatique

`Codable` (= `Encodable + Decodable`) génère automatiquement le code de sérialisation/désérialisation JSON.

```swift
struct CurrentWeather: Codable {
    let temperatureCelsius: Double
    let conditionText: String

    // CodingKeys : remapper les clés JSON (snake_case) vers les propriétés Swift (camelCase)
    enum CodingKeys: String, CodingKey {
        case temperatureCelsius = "temp_c"
        case conditionText = "condition_text"
    }
}

// Décodage en une ligne
let weather = try JSONDecoder().decode(CurrentWeather.self, from: data)
```

---

## 4. Erreurs typées

Définir des erreurs spécifiques à ton domaine permet d'afficher des messages précis à l'utilisateur.

```swift
enum WeatherError: Error, LocalizedError {
    case cityNotFound
    case networkUnavailable
    case decodingFailed(Error)

    var errorDescription: String? {
        switch self {
        case .cityNotFound: return "Ville introuvable. Vérifiez le nom."
        case .networkUnavailable: return "Pas de connexion internet."
        case .decodingFailed: return "Données météo non lisibles."
        }
    }
}
```

---

## 5. @Observable ViewModel

`@Observable` (iOS 17+) remplace `ObservableObject + @Published`. Plus simple, plus performant — SwiftUI observe uniquement les propriétés effectivement lues.

```swift
@Observable
final class WeatherViewModel {
    // Plus besoin de @Published — @Observable gère ça automatiquement
    var weather: WeatherResponse?
    var isLoading = false
    var errorMessage: String?

    func search(for city: String) async {
        isLoading = true
        defer { isLoading = false }  // garantit l'exécution même en cas d'erreur
        do {
            weather = try await WeatherService().fetchWeather(for: city)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
```

---

## 6. États UI asynchrones

Tout appel réseau passe par 4 états. Chaque état doit avoir une UI dédiée.

```swift
Group {
    if viewModel.isLoading {
        // Skeleton loading — feedback immédiat, pas de spinner basique
        ProgressView("Chargement...")
    } else if let error = viewModel.errorMessage {
        // Error state — avec action de retry
        ContentUnavailableView(error, systemImage: "wifi.slash") {
            Button("Réessayer") { Task { await viewModel.retry() } }
        }
    } else if let weather = viewModel.weather {
        // Success state
        WeatherContentView(weather: weather)
    } else {
        // Empty state — invitation à agir
        ContentUnavailableView("Recherchez une ville",
            systemImage: "magnifyingglass")
    }
}
```

---

## 7. Dependency injection

Injecter le service via un protocole permet de le remplacer facilement dans les tests.

```swift
protocol WeatherServiceProtocol {
    func fetchWeather(for city: String) async throws -> WeatherResponse
}

// Production : vrai service réseau
struct WeatherService: WeatherServiceProtocol { ... }

// Test : fausse réponse sans réseau
struct MockWeatherService: WeatherServiceProtocol {
    func fetchWeather(for city: String) async throws -> WeatherResponse {
        return WeatherResponse.mock
    }
}

// ViewModel : accepte n'importe quelle implémentation
final class WeatherViewModel {
    init(service: WeatherServiceProtocol = WeatherService()) { ... }
}
```
