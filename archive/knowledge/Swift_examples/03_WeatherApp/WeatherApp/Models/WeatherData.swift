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
