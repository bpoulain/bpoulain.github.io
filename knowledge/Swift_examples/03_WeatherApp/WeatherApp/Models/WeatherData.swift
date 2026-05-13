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
