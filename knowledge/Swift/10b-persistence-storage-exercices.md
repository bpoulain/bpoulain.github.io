# 10. Persistence & Storage — Exercices

---

## Exercice 10.1 — Traduction mentale (JS → SwiftUI)

### Énoncé

En Reef.js, voici une gestion de préférence persistée :

```js
// Reef.js v13 — state + persistence séparés
import { signal, component } from 'reef'

// State réactif (lecture depuis localStorage)
const isDark = signal(localStorage.getItem('theme') === 'dark')

function ThemeToggle() {
    return {
        template() {
            return `
                <label>
                    Mode sombre
                    <input type="checkbox"
                           data-action="toggle"
                           ${isDark.value ? 'checked' : ''}>
                </label>
                <div style="background:${isDark.value ? '#111' : '#fff'}; padding:20px">
                    Aperçu du thème
                </div>
            `
        },
        events: {
            toggle() {
                isDark.value = !isDark.value
                // save() séparé pour persister
                localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
            }
        }
    }
}
component('#app', ThemeToggle)
```

**Questions :**

→ En Reef, le state réactif et la persistance sont deux étapes distinctes. Comment SwiftUI unifie-t-il ça ?
→ Traduis ce code en SwiftUI avec `@AppStorage`.
→ Qu'est-ce qui disparaît dans la version SwiftUI par rapport à Reef ?

*Tente de répondre avant de lire la correction.*

---

### Correction 10.1

**Modèle mental :**

En Reef : `signal()` pour le réactif + `localStorage.setItem()` pour persister = 2 étapes.
En SwiftUI : `@AppStorage` = une seule propriété qui est réactive ET persistée.

```swift
struct ThemeToggleView: View {
    @AppStorage("isDarkMode") private var isDark = false

    var body: some View {
        VStack(spacing: 20) {
            Toggle("Mode sombre", isOn: $isDark)

            Text("Aperçu du thème")
                .padding(20)
                .frame(maxWidth: .infinity)
                .background(isDark ? Color.black : Color.white)
                .foregroundStyle(isDark ? Color.white : Color.black)
                .clipShape(RoundedRectangle(cornerRadius: 8))
        }
        .padding()
        .preferredColorScheme(isDark ? .dark : .light)
    }
}
```

**Ce qui disparaît par rapport à Reef :**
- ❌ Plus de `localStorage.setItem()` manuel
- ❌ Plus de lecture initiale depuis `localStorage`
- ❌ Plus de 2 étapes (signal + save)
- ✅ `@AppStorage` gère tout : valeur par défaut, persistance, réactivité

**Correspondances :**

| Reef.js v13 | SwiftUI |
|-------------|---------|
| `signal(localStorage.getItem('theme') === 'dark')` | `@AppStorage("isDarkMode") private var isDark = false` |
| `isDark.value = !isDark.value` | `isDark.toggle()` (via Toggle binding) |
| `localStorage.setItem(...)` | Automatique |

---

## Exercice 10.2 — Piège de paradigme

### Énoncé

Un développeur veut persister le nombre de fois que l'app a été ouverte. Il écrit ça :

```swift
struct LaunchCountView: View {
    @State private var count = 0  // ← @State, pas @AppStorage

    var body: some View {
        Text("Ouvertures : \(count)")
            .onAppear {
                count += 1
            }
    }
}
```

Et cette deuxième approche :

```swift
struct PreferencesView: View {
    @AppStorage("username") private var username = ""
    @AppStorage("isDark") private var isDark = false
    @AppStorage("fontSize") private var fontSize = 16.0
    @AppStorage("lastSession") private var lastSession = ""
    @AppStorage("searchHistory") private var searchHistory = ""
    @AppStorage("currentQuery") private var currentQuery = ""  // ← piège
    // + 10 autres @AppStorage...
}
```

**Questions :**
→ Pourquoi le compteur d'ouvertures revient à 0 à chaque lancement avec `@State` ?
→ `currentQuery` (le terme de recherche en cours) mérite-t-il `@AppStorage` ? Pourquoi ?
→ Quand est-ce qu'on fait trop de `@AppStorage` ?

---

### Correction 10.2

**Problème 1 — `@State` vs `@AppStorage` :**

```
❌ Ce que le cerveau fait :
   "@State conserve la valeur → count ne revient pas à 0"

✅ Comment ça fonctionne réellement :
   @State survit aux RECOMPOSITIONS, pas aux relances de l'app.
   À chaque nouveau lancement, @State repart de sa valeur initiale.
```

```swift
// ✅ Correct — @AppStorage persiste entre les lancements
struct LaunchCountView: View {
    @AppStorage("launchCount") private var count = 0

    var body: some View {
        Text("Ouvertures : \(count)")
            .onAppear {
                count += 1
            }
    }
}
```

**Problème 2 — trop de `@AppStorage` :**

`currentQuery` est de l'**état UI éphémère** — le terme de recherche en cours n'a pas besoin de survivre aux relances. Le persister est inutile et peut créer des UX étranges (l'app rouvre sur un champ pré-rempli avec la dernière recherche).

**Règle de sélection :**

| Mérite `@AppStorage` | Mérite `@State` |
|---------------------|----------------|
| Préférences utilisateur (thème, taille) | État de saisie temporaire |
| Données qui doivent survivre au relaunch | Données valides uniquement pendant la session |
| Paramètres de l'app | Position de scroll |
| Compteurs cumulatifs | État d'expansion/collapse |

---

## Exercice 10.3 — Mini cas réel

### Énoncé

Tu construis un écran de préférences pour une app de lecture :
- Taille de police (17 à 28, par pas de 1)
- Famille de police (Système / Serif / Mono)
- Mode nuit automatique (booléen)
- Marge de lecture (Étroite / Normale / Large)

Ces préférences doivent **survivre aux relances** et **s'appliquer immédiatement** à un texte de prévisualisation.

**Avant de coder :**
→ Quel type pour "famille de police" et "marge" ? `String` ? Enum ?
→ Comment afficher une prévisualisation en temps réel ?
→ Comment structurer les `@AppStorage` ?

*Décris d'abord, code ensuite.*

---

### Correction 10.3

**Modèle mental :**

`@AppStorage` supporte `String` — les enums peuvent être convertis via `RawRepresentable`. Les préférences sont directement bindées aux contrôles UI, la prévisualisation est un dérivé de l'état.

```swift
enum FontFamily: String, CaseIterable {
    case system = "system"
    case serif = "serif"
    case mono = "mono"

    var displayName: String {
        switch self {
        case .system: return "Système"
        case .serif: return "Serif"
        case .mono: return "Mono"
        }
    }

    var swiftUIFont: Font {
        switch self {
        case .system: return .system(size: 17)
        case .serif: return .custom("Georgia", size: 17)
        case .mono: return .system(size: 17, design: .monospaced)
        }
    }
}

enum ReadingMargin: String, CaseIterable {
    case narrow = "narrow"
    case normal = "normal"
    case wide = "wide"

    var displayName: String {
        switch self {
        case .narrow: return "Étroite"
        case .normal: return "Normale"
        case .wide: return "Large"
        }
    }

    var horizontalPadding: CGFloat {
        switch self {
        case .narrow: return 8
        case .normal: return 24
        case .wide: return 48
        }
    }
}

struct ReadingPreferencesView: View {
    @AppStorage("fontSize") private var fontSize: Double = 17
    @AppStorage("fontFamily") private var fontFamilyRaw: String = FontFamily.system.rawValue
    @AppStorage("nightMode") private var nightMode = false
    @AppStorage("readingMargin") private var marginRaw: String = ReadingMargin.normal.rawValue

    private var fontFamily: FontFamily {
        FontFamily(rawValue: fontFamilyRaw) ?? .system
    }

    private var margin: ReadingMargin {
        ReadingMargin(rawValue: marginRaw) ?? .normal
    }

    var body: some View {
        Form {
            Section("Texte") {
                HStack {
                    Text("Taille : \(Int(fontSize))")
                    Spacer()
                    Stepper("", value: $fontSize, in: 17...28, step: 1)
                }

                Picker("Police", selection: $fontFamilyRaw) {
                    ForEach(FontFamily.allCases, id: \.rawValue) { family in
                        Text(family.displayName).tag(family.rawValue)
                    }
                }
            }

            Section("Affichage") {
                Toggle("Mode nuit", isOn: $nightMode)

                Picker("Marges", selection: $marginRaw) {
                    ForEach(ReadingMargin.allCases, id: \.rawValue) { m in
                        Text(m.displayName).tag(m.rawValue)
                    }
                }
                .pickerStyle(.segmented)
            }

            Section("Aperçu") {
                Text("Le design est une façon de penser, pas juste de faire.")
                    .font(.system(size: fontSize, design: fontFamily == .mono ? .monospaced : fontFamily == .serif ? .serif : .default))
                    .padding(.horizontal, margin.horizontalPadding)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(nightMode ? Color.black.opacity(0.9) : Color.white)
                    .foregroundStyle(nightMode ? Color.white : Color.black)
            }
        }
        .navigationTitle("Préférences de lecture")
    }
}

#Preview {
    NavigationStack {
        ReadingPreferencesView()
    }
}
```

**Points clés :**
- `@AppStorage` stocke les `rawValue` des enums (String) — les enums sont reconstructs à la lecture
- Les propriétés calculées `fontFamily` et `margin` convertissent les strings en enums
- La section "Aperçu" reflète immédiatement les changements — elle lit les `@AppStorage` directement
- `$fontSize`, `$fontFamilyRaw`, etc. passent des `Binding` aux contrôles

**Erreurs classiques :**
- ❌ Essayer `@AppStorage` avec un type Enum directement (non supporté sans conformance)
- ✅ Stocker le `rawValue: String` + reconstruire l'enum via computed property
- ❌ Dupliquer les préférences dans `@State` local + `@AppStorage` → désynchronisation
- ✅ Lire directement depuis `@AppStorage` partout — source de vérité unique
