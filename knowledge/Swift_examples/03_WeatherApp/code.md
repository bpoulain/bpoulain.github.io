# FILETREE
- WeatherApp/WeatherApp.swift
- WeatherApp/Models/WeatherData.swift
- WeatherApp/Services/WeatherService.swift
- WeatherApp/ViewModels/WeatherViewModel.swift
- WeatherApp/Views/WeatherView.swift

# FILES

## FILE

PATH: WeatherApp/WeatherApp.swift

META: {"path": "WeatherApp/WeatherApp.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

@main
struct WeatherApp: App {
    var body: some Scene {
        WindowGroup {
            WeatherView()
        }
    }
}
```

## FILE

PATH: WeatherApp/Models/WeatherData.swift

META: {"path": "WeatherApp/Models/WeatherData.swift", "sha256": "", "size": 0}

```swift
import Foundation

// Codable = Encodable + Decodable — décodage JSON automatique
struct WeatherResponse: Codable {
    let city: CityInfo
    let current: CurrentWeather
    let forecast: [DailyForecast]

    enum CodingKeys: String, CodingKey {
        case city = "location"
        case current
        case forecast
    }
}

struct CityInfo: Codable {
    let name: String
    let country: String
}

struct CurrentWeather: Codable {
    let temperatureCelsius: Double
    let conditionText: String
    // Code numérique de la condition météo (1000 = soleil, etc.)
    let conditionCode: Int
    let humidity: Int
    let feelsLikeCelsius: Double

    // CodingKeys remmappe les clés JSON snake_case vers camelCase Swift
    enum CodingKeys: String, CodingKey {
        case temperatureCelsius = "temp_c"
        case conditionText = "condition_text"
        case conditionCode = "condition_code"
        case humidity
        case feelsLikeCelsius = "feelslike_c"
    }

    // Computed property : dérive le nom du SF Symbol depuis le code condition
    var sfSymbol: String {
        switch conditionCode {
        case 1000: return "sun.max.fill"
        case 1003: return "cloud.sun.fill"
        case 1006, 1009: return "cloud.fill"
        case 1030, 1135: return "cloud.fog.fill"
        case 1063, 1180...1201: return "cloud.rain.fill"
        case 1066, 1210...1225: return "cloud.snow.fill"
        default: return "cloud.fill"
        }
    }
}

struct DailyForecast: Codable, Identifiable {
    // id dérivé de la date — unique dans la liste
    var id: String { date }
    let date: String
    let maxTempCelsius: Double
    let minTempCelsius: Double
    let conditionCode: Int

    enum CodingKeys: String, CodingKey {
        case date
        case maxTempCelsius = "maxtemp_c"
        case minTempCelsius = "mintemp_c"
        case conditionCode = "condition_code"
    }
}
```

## FILE

PATH: WeatherApp/Services/WeatherService.swift

META: {"path": "WeatherApp/Services/WeatherService.swift", "sha256": "", "size": 0}

```swift
import Foundation

// Erreurs métier typées — plus précises que le Error générique
enum WeatherError: Error, LocalizedError {
    case invalidURL
    case cityNotFound
    case networkError(Error)
    case decodingError(Error)

    var errorDescription: String? {
        switch self {
        case .invalidURL: return "Configuration invalide."
        case .cityNotFound: return "Ville introuvable. Vérifiez le nom."
        case .networkError(let e): return "Erreur réseau : \(e.localizedDescription)"
        case .decodingError: return "Données météo non lisibles."
        }
    }
}

// Protocol : permet d'injecter un mock dans les tests sans réseau réel
protocol WeatherServiceProtocol {
    func fetchWeather(for city: String) async throws -> WeatherResponse
}

struct WeatherService: WeatherServiceProtocol {
    // En production : stocker dans une config ou variable d'environnement, jamais en dur
    private let apiKey = "VOTRE_CLE_API"
    private let baseURL = "https://api.weatherapi.com/v1/forecast.json"

    func fetchWeather(for city: String) async throws -> WeatherResponse {
        // URLComponents : construction d'URL sécurisée, gère l'encodage automatiquement
        var components = URLComponents(string: baseURL)
        components?.queryItems = [
            URLQueryItem(name: "key", value: apiKey),
            URLQueryItem(name: "q", value: city),
            URLQueryItem(name: "days", value: "5"),
            URLQueryItem(name: "lang", value: "fr"),
        ]

        guard let url = components?.url else { throw WeatherError.invalidURL }

        // await suspend la Task — le thread est libéré pendant la requête
        let (data, response) = try await URLSession.shared.data(from: url)

        // Vérifier le statut HTTP avant de décoder
        guard (response as? HTTPURLResponse)?.statusCode == 200 else {
            throw WeatherError.cityNotFound
        }

        do {
            return try JSONDecoder().decode(WeatherResponse.self, from: data)
        } catch {
            throw WeatherError.decodingError(error)
        }
    }
}
```

## FILE

PATH: WeatherApp/ViewModels/WeatherViewModel.swift

META: {"path": "WeatherApp/ViewModels/WeatherViewModel.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

// @Observable remplace ObservableObject + @Published (iOS 17+)
// SwiftUI observe uniquement les propriétés effectivement lues dans body
@Observable
final class WeatherViewModel {
    var weather: WeatherResponse?
    var isLoading = false
    var errorMessage: String?
    var searchText = ""

    private let service: WeatherServiceProtocol

    // Injection de dépendance : WeatherService par défaut, mock possible en test
    init(service: WeatherServiceProtocol = WeatherService()) {
        self.service = service
    }

    func search() async {
        let city = searchText.trimmingCharacters(in: .whitespaces)
        guard !city.isEmpty else { return }

        isLoading = true
        errorMessage = nil
        // defer : s'exécute toujours à la sortie du scope, même en cas d'erreur
        defer { isLoading = false }

        do {
            weather = try await service.fetchWeather(for: city)
        } catch {
            errorMessage = error.localizedDescription
            weather = nil
        }
    }
}
```

## FILE

PATH: WeatherApp/Views/WeatherView.swift

META: {"path": "WeatherApp/Views/WeatherView.swift", "sha256": "", "size": 0}

```swift
import SwiftUI

struct WeatherView: View {
    // @State sur un @Observable — SwiftUI gère le cycle de vie
    @State private var viewModel = WeatherViewModel()

    var body: some View {
        NavigationStack {
            // Chaque état (loading/error/empty/success) a une UI dédiée
            Group {
                if viewModel.isLoading {
                    ProgressView("Chargement...")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if let error = viewModel.errorMessage {
                    // ContentUnavailableView : composant natif pour les états vides/erreur
                    ContentUnavailableView(
                        error,
                        systemImage: "cloud.slash",
                        description: Text("Vérifiez le nom de la ville")
                    )
                } else if let weather = viewModel.weather {
                    WeatherContentView(weather: weather)
                } else {
                    ContentUnavailableView(
                        "Recherchez une ville",
                        systemImage: "magnifyingglass",
                        description: Text("Entrez un nom de ville ci-dessus")
                    )
                }
            }
            .navigationTitle("Météo")
            // searchable ajoute la barre de recherche native dans la NavigationStack
            .searchable(text: $viewModel.searchText, prompt: "Paris, Lyon, Tokyo…")
            // onSubmit déclenche la recherche quand l'utilisateur valide
            .onSubmit(of: .search) {
                Task { await viewModel.search() }
            }
        }
    }
}

struct WeatherContentView: View {
    let weather: WeatherResponse

    var body: some View {
        ScrollView {
            VStack(spacing: 32) {
                // Température principale
                VStack(spacing: 8) {
                    Image(systemName: weather.current.sfSymbol)
                        .font(.system(size: 72))
                        .symbolEffect(.bounce, value: weather.current.conditionCode)
                        .foregroundStyle(.yellow)

                    Text("\(Int(weather.current.temperatureCelsius))°C")
                        .font(.system(size: 72, weight: .thin))

                    Text(weather.current.conditionText)
                        .font(.title3)
                        .foregroundStyle(.secondary)

                    Text("Ressenti \(Int(weather.current.feelsLikeCelsius))°")
                        .foregroundStyle(.secondary)
                }
                .padding(.top, 24)

                // Prévisions en scroll horizontal
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(weather.forecast) { day in
                            ForecastDayCard(day: day)
                        }
                    }
                    .padding(.horizontal)
                }
            }
            .padding(.bottom, 32)
        }
        .navigationTitle(weather.city.name)
        .navigationBarTitleDisplayMode(.large)
    }
}

struct ForecastDayCard: View {
    let day: DailyForecast

    var body: some View {
        VStack(spacing: 6) {
            Text(day.date)
                .font(.caption)
                .foregroundStyle(.secondary)
            Text("\(Int(day.maxTempCelsius))°")
                .font(.headline)
            Text("\(Int(day.minTempCelsius))°")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding(12)
        .background(.regularMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}

#Preview {
    WeatherView()
}
```
