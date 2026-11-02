# macOS vs iOS: Testing Differences

| Dimension | macOS | iOS |
|---|---|---|
| Primary traversal | VO arrow commands; keyboard Tab | One-finger swipes; touch exploration |
| Activation | VO-Space; native keyboard activation | Double tap |
| Structure navigation | VoiceOver rotor and navigation commands | Rotor and swipe up/down |
| Focus | DOM, keyboard and VO cursor may differ | VO focus and touch target may differ |
| Scroll | Keyboard/trackpad/VO | Three-finger swipe |

Do not demand identical spoken strings. Confirm equivalent discoverability, semantics, and operability. Native iOS views use UIKit/SwiftUI accessibility semantics rather than web ARIA attributes.
