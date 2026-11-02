---
id: CMP-NAV-003
title: Breadcrumb
family: navigation
platforms: [macos, ios]
status: specification
---

# Breadcrumb

## 1. Purpose and scope

Show hierarchical location. Test these variants/states: Current page, long trail.

## 2. Prerequisites

- Use a stable demo page containing a labeled example and all supported states.
- Record component version, browser, OS, and VoiceOver configuration.
- Follow [macOS setup](../../02-voiceover/macos/setup.md) and [iOS setup](../../02-voiceover/ios/setup.md).
- Verify keyboard-only interaction separately from VoiceOver navigation.

## 3. Test cases

### TEST-BRC-001 — Discovery, name and role

**macOS steps:** 1. Enable VoiceOver. 2. Move through the page using `VO + Right Arrow` until reaching the component. 3. Listen for its name, role, and surrounding context. 4. Navigate backward to confirm order.

**iOS steps:** 1. Enable VoiceOver. 2. Swipe right until reaching the component. 3. Listen for its name, role, and context. 4. Swipe left to confirm order; explore by touch.

**Expected:** Hierarchy and current location are understandable. Accessible information must agree with the visible purpose; exact speech may vary.

**Result fields:** macOS [Not tested]; iOS [Not tested]. Record observed announcements.

### TEST-BRC-002 — Operation and state changes

**macOS steps:** 1. Focus the component. 2. Activate it with `VO + Space` where applicable, or use the pattern's documented keyboard interaction. 3. Observe the result and new state. 4. Test reverse/close/reset action if available.

**iOS steps:** 1. Focus via swipe or touch exploration. 2. Double tap to activate where applicable. 3. Inspect updated state by swiping or re-focusing. 4. Reverse/close/reset if available.

**Expected:** The intended operation is available, the state is correctly exposed, and the user can continue without losing context. Noninteractive content is evaluated for navigation and semantics rather than activation.

### TEST-BRC-003 — Edge states and focus

**macOS steps:** Visit each supported state (Current page, long trail); inspect announcements and browser keyboard focus before/after any transition.

**iOS steps:** Visit the same states; verify VoiceOver focus and next/previous swipe order after updates.

**Expected:** No unreachable content, misleading state, unexpected focus trap, or silent critical change. For dynamic status messages, check whether an announcement is appropriate without moving focus.

## 4. Component-specific assertions

- Purpose: Show hierarchical location.
- States to verify: Current page, long trail.
- Primary success condition: Hierarchy and current location are understandable.
- If a state is unsupported, mark it **Not applicable** with a reason.

## 5. Applicable references

WCAG 1.3.1, WCAG 2.4.4. Consult [WCAG mapping](../../03-standards/wcag-2.2.md) and [WAI-ARIA guidance](../../03-standards/wai-aria.md); these are candidate criteria, not an exhaustive conformance claim.

## 6. Common failures and remediation

- Missing or ambiguous accessible name → use native labeling or a programmatically associated label.
- Incorrect role/state → prefer semantic controls and synchronize accessible state with the UI.
- Poor reading/focus order → fix DOM/order and focus management rather than relying on speech hints.
- Inaccessible changes → provide discoverable feedback appropriate to the interaction.

## 7. Checklist

- [ ] Accessible name and role are appropriate.
- [ ] Reading order and relationships are understandable.
- [ ] Supported operation works on macOS and iOS.
- [ ] Relevant values, states and errors are conveyed.
- [ ] Focus and navigation remain usable after transitions.
- [ ] Findings, evidence and WCAG mappings are recorded.

## 8. Related guidance

[macOS commands](../../02-voiceover/macos/voiceover-commands.md) · [iOS gestures](../../02-voiceover/ios/gestures.md) · [Test case template](../../06-templates/test-case-template.md)
