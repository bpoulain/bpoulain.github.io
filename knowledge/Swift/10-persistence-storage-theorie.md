# 10. Persistence & Storage

## 10.1 Modèle mental central

**`@AppStorage` est le binding direct entre `UserDefaults` et ton état SwiftUI.**

En SwiftUI, la persistance légère passe par `@AppStorage`. C'est une propriété qui se comporte exactement comme `@State` pour le rendu, mais dont la valeur survit aux relances de l'app. Il n'y a pas de `save()` manuel — la synchronisation avec `UserDefaults` est automatique.

> *Analogie Reef : en Reef, `save()` persiste manuellement dans localStorage. En SwiftUI, `@AppStorage` fait l'équivalent automatiquement — à chaque écriture, la valeur est synchronisée avec `UserDefaults`.*

---

## 10.2 `@AppStorage` — persistance légère

### 10.2.1 Usage de base

```swift
struct SettingsView: View {
    @AppStorage("isDarkMode") private var isDarkMode = false
    @AppStorage("userName") private var userName = "Benoit"
    @AppStorage("launchCount") private var launchCount = 0

    var body: some View {
        Form {
            Toggle("Mode sombre", isOn: $isDarkMode)
            TextField("Nom", text: $userName)
            Text("Lancé \(launchCount) fois")
        }
        .onAppear {
            launchCount += 1
        }
    }
}
```

### 10.2.2 Comment ça fonctionne

- La clé string (`"isDarkMode"`) est la clé `UserDefaults`
- La valeur par défaut (après `=`) est utilisée si rien n'est encore stocké
- Chaque modification déclenche une recomposition (comme `@State`)
- La valeur persiste entre les relances de l'app

### 10.2.3 Types supportés nativement

`@AppStorage` supporte directement : `Bool`, `Int`, `Double`, `String`, `URL`, `Data`

Pour des types personnalisés, il faut encoder en `Data` (via `Codable`).

---

## 10.3 Séparation état UI vs état persistant

### 10.3.1 La règle

Tous les états ne méritent pas d'être persistés. Il y a deux catégories :

| Catégorie | Description | Outil |
|-----------|-------------|-------|
| **État UI éphémère** | Contenu du champ de recherche, expansion d'un accordion, scroll position | `@State` |
| **État persistant** | Préférences, données utilisateur, paramètres, thème | `@AppStorage` |

### 10.3.2 Exemple — ne pas tout persister

```swift
struct SearchView: View {
    @State private var query = ""          // ← éphémère, pas besoin de persister
    @AppStorage("lastSearch") private var lastSearch = ""  // ← persisté

    var body: some View {
        TextField("Recherche", text: $query)
            .onSubmit {
                lastSearch = query  // ← sauvegarder la dernière recherche
            }
    }
}
```

---

## 10.4 Binding storage ↔ UI state

`@AppStorage` se comporte comme `@State` — tu peux passer `$isDarkMode` à des composants qui attendent un `Binding<Bool>` :

```swift
struct AppearanceView: View {
    @AppStorage("colorSchemePreference") private var isDark = false

    var body: some View {
        // $isDark produit un Binding<Bool> comme @State
        Toggle("Mode sombre", isOn: $isDark)
    }
}
```

---

## 10.5 Absence de persistance automatique globale

SwiftUI ne persiste pas automatiquement tout l'état de l'app. C'est explicite :
- Tu décides quelles valeurs méritent `@AppStorage`
- Les autres valeurs vivent dans `@State` (éphémères)

*Contrairement à Reef où `save()` est optionnel et explicite pour localStorage, en SwiftUI la décision est dans le wrapper : `@State` = éphémère, `@AppStorage` = persistant.*

---

## 10.6 Modèles persistants complexes — options

### 10.6.1 `@AppStorage` + `Codable`

Pour persister un modèle complexe :

```swift
struct UserPreferences: Codable {
    var theme: String = "system"
    var fontSize: Double = 16
    var notifications: Bool = true
}

struct SettingsView: View {
    @AppStorage("preferences") private var prefsData: Data = Data()

    private var preferences: UserPreferences {
        get {
            (try? JSONDecoder().decode(UserPreferences.self, from: prefsData))
            ?? UserPreferences()
        }
    }

    // Pour modifier, encoder et stocker dans prefsData
}
```

### 10.6.2 Alternatives pour la persistence avancée

| Besoin | Solution iOS 26 |
|--------|-----------------|
| Données simples | `@AppStorage` |
| Modèles Codable | `@AppStorage` + `Data` |
| Base de données relationnelle | SwiftData (framework Apple) |
| Fichiers custom | FileManager + `URL.documentsDirectory` |
| Synchronisation iCloud | CloudKit / SwiftData avec CloudKit |

---

## 10.7 Comparaison Reef vs SwiftUI

| Concept | Reef.js v13 | SwiftUI 6 |
|---------|-------------|-----------|
| State éphémère | `signal()` | `@State` |
| State persistant | `signal()` + `save('key', value)` | `@AppStorage("key")` |
| Lecture | `signal.value` | `propertyName` direct |
| Synchronisation | `save()` manuel | Automatique |
| Re-render après lecture storage | Oui (Reef gère) | Oui (SwiftUI gère) |
| Type supporté | Tout (JSON.stringify) | Types primitifs natifs + Data |

**Différence clé :**

En Reef, `save()` et le state réactif (`signal()`) sont deux choses séparées. Tu mets à jour le signal ET tu sauvegardes. En SwiftUI, `@AppStorage` combine les deux : une seule propriété, réactive ET persistante.

---

## 10.8 `UserDefaults` vs `@AppStorage`

`@AppStorage` est une abstraction sur `UserDefaults`. Tu peux accéder à `UserDefaults` directement, mais `@AppStorage` est recommandé dans SwiftUI car :
- Il déclenche automatiquement la recomposition des vues
- Il s'intègre avec `$binding`
- Code plus concis

```swift
// ❌ UserDefaults direct (pas réactif, pas de recomposition)
UserDefaults.standard.set(true, forKey: "isDarkMode")

// ✅ @AppStorage (réactif, recomposition automatique)
@AppStorage("isDarkMode") private var isDarkMode = false
```
