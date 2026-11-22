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
