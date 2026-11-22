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
