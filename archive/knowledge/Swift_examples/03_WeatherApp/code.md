# FILETREE
- WeatherApp/WeatherApp.swift
- WeatherApp/Models/WeatherData.swift
- WeatherApp/Services/WeatherService.swift
- WeatherApp/Services/MockWeatherService.swift
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

// --- Modèles domaine (utilisés par les vues et le ViewModel) ---
// Ces structs sont indépendants de l'API — elles ne changent pas si on change de fournisseur

struct WeatherResponse {
    let city: CityInfo
    let current: CurrentWeather
    let forecast: [DailyForecast]
}

struct CityInfo {
    let name: String
    let country: String
}

struct CurrentWeather {
    let temperatureCelsius: Double
    let conditionText: String
    // Code WMO (World Meteorological Organization) — standard Open-Meteo
    let conditionCode: Int
    let humidity: Int
    let feelsLikeCelsius: Double

    // Mapping code WMO → SF Symbol
    // Codes WMO : 0=dégagé, 1-3=nuages, 45/48=brouillard,
    // 51-55=bruine, 61-65=pluie, 71-75=neige, 80-82=averses, 95=orage
    var sfSymbol: String {
        switch conditionCode {
        case 0:       return "sun.max.fill"
        case 1:       return "sun.max.fill"
        case 2:       return "cloud.sun.fill"
        case 3:       return "cloud.fill"
        case 45, 48:  return "cloud.fog.fill"
        case 51...55: return "cloud.drizzle.fill"
        case 61...65: return "cloud.rain.fill"
        case 71...75: return "cloud.snow.fill"
        case 80...82: return "cloud.heavyrain.fill"
        case 95:      return "cloud.bolt.rain.fill"
        default:      return "cloud.fill"
        }
    }
}

struct DailyForecast: Identifiable {
    // id dérivé de la date — unique dans la liste
    var id: String { date }
    let date: String
    let maxTempCelsius: Double
    let minTempCelsius: Double
    let conditionCode: Int
}

// --- DTOs Open-Meteo (internes au service, jamais exposés aux vues) ---
// Reflètent exactement la structure JSON de l'API

struct GeocodingResponse: Codable {
    let results: [GeocodingResult]?
}

struct GeocodingResult: Codable {
    let name: String
    let latitude: Double
    let longitude: Double
    let country: String?
}

struct OpenMeteoForecastResponse: Codable {
    let current: OpenMeteoCurrent
    let daily: OpenMeteoDaily

    struct OpenMeteoCurrent: Codable {
        let temperature2m: Double
        let weathercode: Int
        let apparentTemperature: Double
        let relativeHumidity2m: Int

        enum CodingKeys: String, CodingKey {
            case temperature2m = "temperature_2m"
            case weathercode
            case apparentTemperature = "apparent_temperature"
            case relativeHumidity2m = "relative_humidity_2m"
        }
    }

    // Open-Meteo retourne les prévisions sous forme d'arrays parallèles
    // (pas un tableau d'objets) — à reconstruire manuellement
    struct OpenMeteoDaily: Codable {
        let time: [String]
        let temperature2mMax: [Double]
        let temperature2mMin: [Double]
        let weathercode: [Int]

        enum CodingKeys: String, CodingKey {
            case time
            case temperature2mMax = "temperature_2m_max"
            case temperature2mMin = "temperature_2m_min"
            case weathercode
        }
    }
}

// Extension utilitaire : mapping code WMO → texte lisible (en français)
extension Int {
    var wmoDescription: String {
        switch self {
        case 0:       return "Ciel dégagé"
        case 1:       return "Légèrement nuageux"
        case 2:       return "Partiellement nuageux"
        case 3:       return "Couvert"
        case 45, 48:  return "Brouillard"
        case 51...55: return "Bruine"
        case 61...65: return "Pluie"
        case 71...75: return "Neige"
        case 80...82: return "Averses"
        case 95:      return "Orage"
        default:      return "Nuageux"
        }
    }
}
```

## FILE

PATH: WeatherApp/Services/WeatherService.swift

META: {"path": "WeatherApp/Services/WeatherService.swift", "sha256": "", "size": 0}

```swift
import Foundation

// Erreurs métier typées — plus précises que Error générique
enum WeatherError: Error, LocalizedError {
    case invalidURL
    case cityNotFound
    case networkError(Error)
    case decodingError(Error)

    var errorDescription: String? {
        switch self {
        case .invalidURL: return "URL invalide."
        case .cityNotFound: return "Ville introuvable. Vérifiez le nom."
        case .networkError(let e): return "Erreur réseau : \(e.localizedDescription)"
        case .decodingError(let e): return "Données illisibles : \(e.localizedDescription)"
        }
    }
}

// Protocol : permet de substituer MockWeatherService sans toucher au ViewModel
protocol WeatherServiceProtocol {
    func fetchWeather(for city: String) async throws -> WeatherResponse
}

// WeatherService — utilise Open-Meteo
// Avantages : 100% gratuit, sans inscription, sans clé API, données réelles
// Docs : https://open-meteo.com/en/docs
struct WeatherService: WeatherServiceProtocol {

    func fetchWeather(for city: String) async throws -> WeatherResponse {
        // Étape 1 : Géocodage — convertir le nom de ville en coordonnées GPS
        let location = try await geocode(city: city)

        // Étape 2 : Météo — récupérer les données à partir des coordonnées
        return try await fetchForecast(for: location)
    }

    // MARK: - Étape 1 : Géocodage

    private func geocode(city: String) async throws -> GeocodingResult {
        var components = URLComponents(string: "https://geocoding-api.open-meteo.com/v1/search")
        components?.queryItems = [
            URLQueryItem(name: "name", value: city),
            URLQueryItem(name: "count", value: "1"),
            URLQueryItem(name: "language", value: "fr"),
            URLQueryItem(name: "format", value: "json"),
        ]
        guard let url = components?.url else { throw WeatherError.invalidURL }

        let (data, _) = try await URLSession.shared.data(from: url)

        let response = try JSONDecoder().decode(GeocodingResponse.self, from: data)

        // results peut être nil ou vide si la ville n'existe pas
        guard let location = response.results?.first else {
            throw WeatherError.cityNotFound
        }
        return location
    }

    // MARK: - Étape 2 : Prévisions météo

    private func fetchForecast(for location: GeocodingResult) async throws -> WeatherResponse {
        var components = URLComponents(string: "https://api.open-meteo.com/v1/forecast")
        components?.queryItems = [
            URLQueryItem(name: "latitude", value: String(location.latitude)),
            URLQueryItem(name: "longitude", value: String(location.longitude)),
            // current : données immédiates
            URLQueryItem(name: "current", value: "temperature_2m,weathercode,apparent_temperature,relative_humidity_2m"),
            // daily : prévisions sur 5 jours (arrays parallèles)
            URLQueryItem(name: "daily", value: "temperature_2m_max,temperature_2m_min,weathercode"),
            URLQueryItem(name: "timezone", value: "auto"),
            URLQueryItem(name: "forecast_days", value: "5"),
        ]
        guard let url = components?.url else { throw WeatherError.invalidURL }

        let (data, response) = try await URLSession.shared.data(from: url)
        guard (response as? HTTPURLResponse)?.statusCode == 200 else {
            throw WeatherError.networkError(URLError(.badServerResponse))
        }

        do {
            let dto = try JSONDecoder().decode(OpenMeteoForecastResponse.self, from: data)
            return mapToWeatherResponse(location: location, dto: dto)
        } catch {
            throw WeatherError.decodingError(error)
        }
    }

    // MARK: - Mapping DTO → modèle domaine

    // Cette fonction isole la transformation : si l'API change, seul ce mapping change.
    // Les vues et le ViewModel ne savent pas qu'on utilise Open-Meteo.
    private func mapToWeatherResponse(location: GeocodingResult, dto: OpenMeteoForecastResponse) -> WeatherResponse {
        let current = CurrentWeather(
            temperatureCelsius: dto.current.temperature2m,
            conditionText: dto.current.weathercode.wmoDescription,
            conditionCode: dto.current.weathercode,
            humidity: dto.current.relativeHumidity2m,
            feelsLikeCelsius: dto.current.apparentTemperature
        )

        // Open-Meteo retourne des arrays parallèles — zip() pour reconstruire les objets
        let forecasts = zip(
            dto.daily.time,
            zip(dto.daily.temperature2mMax,
                zip(dto.daily.temperature2mMin, dto.daily.weathercode))
        ).map { time, rest in
            let (maxTemp, (minTemp, code)) = rest
            return DailyForecast(
                date: time,
                maxTempCelsius: maxTemp,
                minTempCelsius: minTemp,
                conditionCode: code
            )
        }

        return WeatherResponse(
            city: CityInfo(name: location.name, country: location.country ?? ""),
            current: current,
            forecast: forecasts
        )
    }
}
```

## FILE

PATH: WeatherApp/Services/MockWeatherService.swift

META: {"path": "WeatherApp/Services/MockWeatherService.swift", "sha256": "", "size": 0}

```swift
import Foundation

// MockWeatherService — données statiques, aucun réseau requis
// Utilisations :
//   1. Previews Xcode (fonctionnent sans réseau)
//   2. Tests unitaires (rapides et déterministes)
//   3. Développement UI sans attendre le réseau
//
// Activation : WeatherViewModel(service: MockWeatherService())
struct MockWeatherService: WeatherServiceProtocol {

    // Délai simulé configurable — permet de tester les états de chargement
    var simulatedDelay: Duration = .milliseconds(400)
    // Erreur simulable — permet de tester le rendu de l'état d'erreur
    var simulatedError: WeatherError? = nil

    func fetchWeather(for city: String) async throws -> WeatherResponse {
        // Simuler la latence réseau pour voir le spinner de chargement
        try await Task.sleep(for: simulatedDelay)

        // Lever une erreur si configuré (pour tester les error states)
        if let error = simulatedError { throw error }

        // Construire une réponse réaliste pour la ville demandée
        return WeatherResponse(
            city: CityInfo(name: city.isEmpty ? "Paris" : city, country: "France"),
            current: CurrentWeather(
                temperatureCelsius: 18.5,
                conditionText: "Partiellement nuageux",
                conditionCode: 2,      // code WMO 2 = partiellement nuageux
                humidity: 62,
                feelsLikeCelsius: 17.0
            ),
            forecast: [
                DailyForecast(date: "2026-05-14", maxTempCelsius: 21, minTempCelsius: 13, conditionCode: 0),
                DailyForecast(date: "2026-05-15", maxTempCelsius: 19, minTempCelsius: 12, conditionCode: 2),
                DailyForecast(date: "2026-05-16", maxTempCelsius: 16, minTempCelsius: 11, conditionCode: 61),
                DailyForecast(date: "2026-05-17", maxTempCelsius: 14, minTempCelsius: 10, conditionCode: 63),
                DailyForecast(date: "2026-05-18", maxTempCelsius: 20, minTempCelsius: 13, conditionCode: 1),
            ]
        )
    }
}

// --- Previews avec MockWeatherService ---

// Usage dans une Preview :
//
// #Preview {
//     WeatherView()
//         .environment(...)  // injecter via ViewModel custom si besoin
// }
//
// Ou directement en passant le mock au ViewModel :
// @State private var viewModel = WeatherViewModel(service: MockWeatherService())
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
    // Le ViewModel est injecté — WeatherService() par défaut, MockWeatherService() en preview/test
    @State private var viewModel: WeatherViewModel

    init(viewModel: WeatherViewModel = WeatherViewModel()) {
        _viewModel = State(initialValue: viewModel)
    }

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

// Preview avec données réelles simulées — fonctionne sans réseau ni clé API
#Preview("Résultat") {
    // WeatherView utilise WeatherService() par défaut
    // Pour forcer le mock en preview, passer le service au ViewModel
    WeatherView()
}

#Preview("Erreur simulée") {
    // Tester le rendu de l'état d'erreur
    WeatherView(viewModel: WeatherViewModel(
        service: MockWeatherService(simulatedError: .cityNotFound)
    ))
}
```
