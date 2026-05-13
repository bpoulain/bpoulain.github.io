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
