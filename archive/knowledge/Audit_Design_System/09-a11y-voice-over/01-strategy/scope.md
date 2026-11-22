# Test Scope

## Included

Web UI components rendered in Safari on macOS and iOS, including variants, disabled/selected/expanded/error/loading states, and dynamic changes. Native iOS components require a separate implementation-specific pass; web ARIA expectations do not automatically apply to native controls.

## Excluded from VoiceOver-only conclusions

Color contrast, text resizing, pointer targets, motion preferences, speech input, and complete keyboard conformance must be checked separately. Automated checks complement but do not replace manual testing.

## Test dimensions

- Discovery and navigation
- Name, role, value, and state
- Activation and keyboard/touch operation
- Focus placement and restoration
- Dynamic announcements and error recovery
- Context, instructions, and content order
