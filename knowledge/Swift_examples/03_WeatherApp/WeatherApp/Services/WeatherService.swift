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
