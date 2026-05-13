# Suivi — Projet 10 : Multiplatform App

## Progression globale
- [ ] Projet créé avec target multiplatform (iPhone + macOS)
- [ ] NavigationSplitView fonctionnel (sidebar macOS / stack iPhone)
- [ ] Layout adaptatif compact/regular
- [ ] Menu bar macOS (MenuBarExtra)
- [ ] Toolbar adaptatif (différent sur macOS et iOS)
- [ ] Keyboard shortcuts macOS
- [ ] CloudKit configuré (iCloud container)
- [ ] Sync automatique entre iPhone et Mac
- [ ] Résolution de conflits CloudKit
- [ ] Design system du P9 intégré
- [ ] Dark Mode vérifié sur les deux plateformes

## Compétences Swift / SwiftUI
- [ ] `NavigationSplitView` — sidebar + detail avec colonnes
- [ ] `#if os(macOS)` / `#if os(iOS)` — code conditionnel par plateforme
- [ ] `MenuBarExtra` — app dans la menu bar macOS
- [ ] `WindowGroup` + `Scene` management
- [ ] Toolbar adaptatif (`.toolbar` avec placements macOS)
- [ ] `keyboardShortcut` modifier
- [ ] `@Environment(\.horizontalSizeClass)` — compact vs regular
- [ ] `CloudKit` — `NSPersistentCloudKitContainer`
- [ ] `containerRelativeFrame` — layout responsive

## Concepts techniques
- [ ] SwiftUI multiplatform target (même codebase, deux plateformes)
- [ ] CloudKit + NSPersistentCloudKitContainer
- [ ] iCloud Drive (documents sync)
- [ ] Adaptive layouts (compact/regular size class)
- [ ] Différences touch vs clavier/souris

## Architecture
- [ ] App target multiplatform (SPM structure)
- [ ] Shared models iPhone/macOS
- [ ] Plateforme-specific views séparées avec `#if os()`

## Bonnes pratiques Apple
- [ ] Menu bar macOS conventions (items standard, raccourcis)
- [ ] Keyboard-first navigation macOS
- [ ] iPhone/iPad/macOS responsive
- [ ] Focus system macOS (Tab order)

## Notes personnelles
<!-- Tes observations sur les différences iOS/macOS, CloudKit -->
