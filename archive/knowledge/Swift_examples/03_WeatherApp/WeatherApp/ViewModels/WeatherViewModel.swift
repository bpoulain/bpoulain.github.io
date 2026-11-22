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
