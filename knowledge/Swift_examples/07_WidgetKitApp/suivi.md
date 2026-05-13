# Suivi — Projet 7 : WidgetKit App

## Progression globale
- [ ] Projet créé avec Widget Extension target
- [ ] App Groups configuré (partage de données app ↔ widget)
- [ ] Small widget fonctionnel
- [ ] Medium widget fonctionnel
- [ ] Lock Screen widget (accessory)
- [ ] Timeline provider avec rafraîchissement
- [ ] Deep link depuis widget vers la vue correspondante dans l'app
- [ ] App Intent configuré (action depuis widget interactif)
- [ ] Action Siri / Spotlight fonctionnelle
- [ ] Privacy placeholder configuré

## Compétences Swift / SwiftUI
- [ ] `WidgetKit` — framework widgets iOS
- [ ] `TimelineProvider` — fournisseur d'entrées de timeline
- [ ] `TimelineEntry` — snapshot d'état à un instant T
- [ ] `Widget` + `WidgetConfiguration` — configuration du widget
- [ ] `@AppStorage` avec App Group suite — partage de données
- [ ] `widgetURL` / `Link` — deep linking depuis widget
- [ ] `AppIntent` — action exécutable depuis widget/Siri/Shortcuts
- [ ] `AppIntentConfiguration` — widget configurable par l'utilisateur
- [ ] `WidgetBundle` — regrouper plusieurs widgets

## Concepts techniques
- [ ] Modèle snapshot stateless — le widget ne peut pas être réactif
- [ ] Timeline et politique de rafraîchissement (atEnd, after, never)
- [ ] Deep linking (URL schemes, openURL)
- [ ] Widget configuration interactive (iOS 17+)
- [ ] App Groups — partage de données entre targets

## Architecture
- [ ] App Groups (UserDefaults suite partagée)
- [ ] SwiftData entre app et widget extension
- [ ] Intent parameters (widget configurable)

## Bonnes pratiques Apple
- [ ] Widget families (systemSmall, systemMedium, systemLarge, accessoryCircular)
- [ ] Lock Screen widgets (accessoryRectangular, accessoryCircular)
- [ ] Privacy placeholder (masquer les données sensibles sur l'écran de verrouillage)
- [ ] Performances — le widget est rendu comme une image statique

## Notes personnelles
<!-- Tes observations sur WidgetKit, App Groups, App Intents -->
