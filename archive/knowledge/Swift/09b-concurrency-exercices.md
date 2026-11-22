# 9. Concurrency — Exercices

---

## Exercice 9.1 — Traduction mentale (JS → SwiftUI)

### Énoncé

En JS vanilla, voici un fetch avec gestion de l'état de chargement :

```js
async function loadWeather(city) {
    const btn = document.querySelector('#btn')
    const status = document.querySelector('#status')

    btn.disabled = true
    status.textContent = 'Chargement...'

    try {
        const response = await fetch(`/api/weather/${city}`)
        const data = await response.json()
        status.textContent = `${data.city} : ${data.temp}°C`
    } catch (err) {
        status.textContent = 'Erreur de chargement'
    } finally {
        btn.disabled = false
    }
}
```

**Questions :**

→ Comment gérer `btn.disabled = true` en SwiftUI (sans accéder au bouton directement) ?
→ Comment traduire `try/catch` dans un `.task {}` SwiftUI ?
→ La gestion du `finally` (re-activer le bouton) — comment la traduire ?

*Tente de répondre avant de lire la correction.*

---

### Correction 9.1

**Modèle mental :**

En JS tu manipules le DOM (`.disabled`, `.textContent`). En SwiftUI, tu changes l'état, et le rendu en découle. `isLoading` pilote le bouton ET le texte de statut.

```swift
struct WeatherView: View {
    let city = "Paris"
    @State private var statusText = "Prêt"
    @State private var isLoading = false

    var body: some View {
        VStack(spacing: 20) {
            Text(statusText)
                .font(.headline)

            Button("Charger météo") {
                Task {
                    await loadWeather()
                }
            }
            .disabled(isLoading)   // ← piloté par l'état, pas manipulé directement
        }
        .padding()
    }

    func loadWeather() async {
        isLoading = true
        statusText = "Chargement..."

        defer { isLoading = false }  // ← équivalent de finally

        do {
            let data = try await fetchWeather(city: city)
            statusText = "\(data.city) : \(data.temp)°C"
        } catch {
            statusText = "Erreur de chargement"
        }
    }
}

struct WeatherData {
    let city: String
    let temp: Int
}

func fetchWeather(city: String) async throws -> WeatherData {
    try await Task.sleep(for: .seconds(1))
    return WeatherData(city: city, temp: 22)
}
```

**Points clés :**
- `.disabled(isLoading)` = équivalent de `btn.disabled = true` mais déclaratif
- `defer { isLoading = false }` = équivalent de `finally` (s'exécute toujours, même si erreur)
- `Task { await loadWeather() }` = créer un contexte async depuis une action synchrone (bouton)
- SwiftUI garantit que `.task {}` est sur `@MainActor` — ici on utilise `Task {}` manuellement, c'est aussi ok car `@State` est sur `@MainActor` par défaut dans iOS 26

---

## Exercice 9.2 — Piège de paradigme

### Énoncé

Voici deux versions d'un chargement de données. Laquelle est meilleure ?

**Version A :**

```swift
struct DashboardView: View {
    @State private var user: User?
    @State private var posts: [Post] = []

    var body: some View {
        VStack { ... }
            .task {
                user = try? await fetchUser()
                posts = try? await fetchPosts()  // ← attend que user soit chargé
            }
    }
}
```

**Version B :**

```swift
struct DashboardView: View {
    @State private var user: User?
    @State private var posts: [Post] = []

    var body: some View {
        VStack { ... }
            .task {
                async let fetchedUser = fetchUser()
                async let fetchedPosts = fetchPosts()
                user = try? await fetchedUser
                posts = try? await fetchedPosts
            }
    }
}
```

**Questions :**
→ Quelle est la différence de performance entre A et B ?
→ Dans quel cas A serait-il préférable à B ?
→ Que se passe-t-il si `fetchUser()` prend 2s et `fetchPosts()` prend 3s dans chaque version ?

---

### Correction 9.2

**Différence de performance :**

| Version | fetchUser | fetchPosts | Durée totale |
|---------|-----------|------------|--------------|
| A (séquentiel) | 2s | 3s (démarre après user) | **5 secondes** |
| B (parallèle) | 2s | 3s (démarre en même temps) | **3 secondes** |

La version B est **plus rapide** car les deux fetches se font en parallèle avec `async let`.

```
❌ Version A (séquentiel implicite) :
   await fetchUser() → attend 2s → await fetchPosts() → attend 3s = 5s

✅ Version B (parallèle) :
   async let lance les deux immédiatement
   await attend le plus lent = 3s
```

**Quand la version A est préférable :**

Quand les opérations sont **dépendantes** — ex : tu as besoin de l'`userId` du user pour fetcher ses posts :

```swift
.task {
    // Séquentiel nécessaire ici — posts dépend de user
    let fetchedUser = try? await fetchUser()
    if let userId = fetchedUser?.id {
        posts = try? await fetchPosts(userId: userId)
    }
    user = fetchedUser
}
```

**Règle :**
- Opérations **indépendantes** → `async let` (parallèle)
- Opérations **dépendantes** → séquentiel avec `await`

---

## Exercice 9.3 — Mini cas réel

### Énoncé

Tu construis un écran "Dashboard" qui charge simultanément :
- Le profil utilisateur (nom, avatar)
- Les statistiques (nombre d'articles, vues totales)
- Les notifications non lues

Tout doit charger en parallèle. Si une des requêtes échoue, afficher une erreur partielle (les autres données toujours visibles).

**Avant de coder :**
→ Comment structurer l'état pour gérer les erreurs partielles ?
→ Comment lancer les 3 fetches en parallèle ?
→ Comment afficher les données disponibles même si une est manquante ?

*Décris d'abord, code ensuite.*

---

### Correction 9.3

**Modèle mental :**

Chaque donnée peut être nil (pas encore chargée) ou disponible. On utilise `async let` pour le parallélisme. Les erreurs partielles sont gérées avec `try?` — si une échoue, sa valeur reste `nil`.

```swift
struct UserProfile {
    let name: String
    let avatarSystemName: String
}

struct UserStats {
    let articleCount: Int
    let totalViews: Int
}

struct DashboardView: View {
    @State private var profile: UserProfile?
    @State private var stats: UserStats?
    @State private var unreadCount: Int?
    @State private var isLoading = true

    var body: some View {
        Group {
            if isLoading {
                ProgressView("Chargement du dashboard...")
            } else {
                ScrollView {
                    VStack(spacing: 24) {
                        // Profil
                        if let profile {
                            HStack {
                                Image(systemName: profile.avatarSystemName)
                                    .font(.largeTitle)
                                Text(profile.name).font(.title2).bold()
                            }
                        } else {
                            Text("Profil indisponible")
                                .foregroundStyle(.secondary)
                        }

                        // Stats
                        if let stats {
                            HStack(spacing: 32) {
                                StatCard(label: "Articles", value: stats.articleCount)
                                StatCard(label: "Vues", value: stats.totalViews)
                            }
                        } else {
                            Text("Statistiques indisponibles")
                                .foregroundStyle(.secondary)
                        }

                        // Notifications
                        if let count = unreadCount {
                            Label("\(count) notifications", systemImage: "bell.badge")
                        } else {
                            Label("Notifications indisponibles", systemImage: "bell.slash")
                                .foregroundStyle(.secondary)
                        }
                    }
                    .padding()
                }
            }
        }
        .task {
            // Lancement en parallèle
            async let fetchedProfile = fetchProfile()
            async let fetchedStats = fetchStats()
            async let fetchedNotifs = fetchUnreadCount()

            // Attendre les 3, erreurs partielles tolérées avec try?
            profile = try? await fetchedProfile
            stats = try? await fetchedStats
            unreadCount = try? await fetchedNotifs

            isLoading = false
        }
    }
}

struct StatCard: View {
    let label: String
    let value: Int

    var body: some View {
        VStack {
            Text("\(value)").font(.title).bold()
            Text(label).foregroundStyle(.secondary).font(.caption)
        }
        .frame(width: 100, height: 70)
        .background(.regularMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

// Simulations
func fetchProfile() async throws -> UserProfile {
    try await Task.sleep(for: .seconds(1))
    return UserProfile(name: "Benoit Poulain", avatarSystemName: "person.circle.fill")
}

func fetchStats() async throws -> UserStats {
    try await Task.sleep(for: .seconds(2))
    return UserStats(articleCount: 42, totalViews: 1337)
}

func fetchUnreadCount() async throws -> Int {
    try await Task.sleep(for: .seconds(1.5))
    return 7
}

#Preview {
    DashboardView()
}
```

**Points clés :**
- `async let` lance les 3 fetches immédiatement (parallèle)
- `try? await` → `nil` si erreur (tolérance aux pannes partielles)
- `isLoading = false` après les 3 `await` → spinner jusqu'à ce que tout soit résolu
- Les `if let` dans `body` gèrent l'affichage conditionnel selon disponibilité des données

**Erreurs classiques :**
- ❌ Trois `.task {}` séparés pour les 3 fetches → comportement indéfini (3 tâches séparées)
- ❌ Séquentiel avec `await` × 3 → temps additionné (1 + 2 + 1.5 = 4.5s au lieu de 2s)
- ✅ Un seul `.task {}` avec 3 `async let` → parallèle, résolu au bout du plus lent (2s)
