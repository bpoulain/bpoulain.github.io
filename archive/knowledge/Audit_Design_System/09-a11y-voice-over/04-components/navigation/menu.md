---
id: CMP-NAV-002
title: Navigation Menu
family: navigation
platforms: [macos, ios]
status: specification
---

# Navigation Menu

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** site or application navigation: a list of links, possibly grouped under disclosure buttons that show sub-lists. A list of actions (Edit, Delete) is an [Action Menu](../actions/action-menu.md). A navigation should not use `role="menu"`: it is a landmark with links and disclosure buttons.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Flat list of links|Landmark, list, links|002, 101|
|Section with a disclosure button (collapsed / expanded)|Expanded state; sub-links reachable|004, 102|
|Current page|Current state|005, 103|
|Mobile: menu behind a "Menu" button|Button state; focus; closing|006, 104|

### Main accessibility risks

- `role="menu"` on a site navigation: VoiceOver expects menu keys, links are not listed as links.
- Disclosure without expanded state.
- Sub-menu opening only on hover.
- Current page shown only visually.
- Mobile menu that leaves the page behind reachable or cannot be closed.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-MNU-001|macOS|Keyboard operation without VoiceOver|Critical|WCAG 2.1.1|
|TEST-MNU-002|macOS|Landmark, list and links|High|WCAG 1.3.1, 2.4.1|
|TEST-MNU-003|macOS|Landmarks in the rotor|Medium|WCAG 2.4.1|
|TEST-MNU-004|macOS|Disclosure sections|Critical|WCAG 4.1.2|
|TEST-MNU-005|macOS|Current page|Medium|WCAG 1.3.1|
|TEST-MNU-006|macOS|Collapsed mobile menu|High|WCAG 2.4.3|
|TEST-MNU-101|iOS|Discovery|High|WCAG 1.3.1|
|TEST-MNU-102|iOS|Disclosure sections|Critical|WCAG 4.1.2|
|TEST-MNU-103|iOS|Current page|Medium|WCAG 1.3.1|
|TEST-MNU-104|iOS|Mobile menu|Critical|WCAG 2.4.3|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-MNU-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md). Check that **Landmarks** is available in the rotor.
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

1. A `nav` labelled "Main" with: "Home" (current page), "Products" (disclosure with 3 links), "Pricing", "Contact".
2. The same navigation at a narrow width, behind a "Menu" button, if supported.
3. Page content after the navigation.

### Initial state

Sections collapsed, mobile menu closed.

## 3. VoiceOver tests on macOS

Contract: [Keyboard Interactions §12–13](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-MNU-001 — Keyboard operation without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab through the navigation|Links and disclosure buttons receive visible focus in visual order|Fail if skipped or invisible|
|2|On "Products", press Return or Space|The section expands; Tab then reaches its links|Fail if it opens only on hover|
|3|Press Escape inside the section, if supported|The section collapses; focus returns to "Products"|Observation if unsupported|
|4|Tab past the last sub-link|Focus continues to the next item; the section may close|Fail on a trap|

### TEST-MNU-002 — Landmark, list and links

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` into the navigation|A navigation landmark with its name, e.g. "Main, navigation"; a list with a count may follow|Fail if no navigation landmark exists (WCAG 1.3.1)|
|2|Continue|Each item spoken as a link, or as a button for disclosures|Fail if items are spoken as menu items or plain text|

### TEST-MNU-003 — Landmarks in the rotor

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + U`, move to **Landmarks**|"Main navigation" listed; distinct names if several navigations exist|Fail if two navigations have the same name or none|
|2|Select it, press Return|The cursor moves to the navigation|Observation|

### TEST-MNU-004 — Disclosure sections

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to "Products"|Name, role "button", collapsed state, e.g. "Products, collapsed, button"|Fail if no expanded/collapsed state|
|2|`VO + Space`|Expanded state spoken; sub-links follow next|Fail if the state does not change|
|3|`VO + Right Arrow`|The 3 sub-links are read right after the button|Fail if the sub-links are elsewhere in the reading order|
|4|Collapse it; `VO + Right Arrow`|The sub-links are no longer read|Fail if hidden links are still read (A11Y-33)|

### TEST-MNU-005 — Current page

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to "Home"|Current state spoken|Fail if only visual|

### TEST-MNU-006 — Collapsed mobile menu

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Narrow the window. `VO + Right Arrow` to "Menu"|Name, role, collapsed state|Fail if no state|
|2|`VO + Space`|Expanded; the links follow, or focus moves into the panel|Fail if the links cannot be found|
|3|If the panel covers the page, check the page behind|Unreachable, as in [Dialog](../overlays/dialog.md) TEST-DLG-004|Fail if reachable while covered|
|4|Close (Escape or close button)|Focus returns to "Menu"|Fail if lost|

## 4. VoiceOver tests on iOS

### TEST-MNU-101 — Discovery

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Rotor **Landmarks**, swipe down|The navigation is reached|Fail if absent|
|2|Swipe right through it|Links and disclosure buttons with roles|Fail if roles are missing|

### TEST-MNU-102 — Disclosure sections

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to "Products", double tap|Expanded state spoken|Fail if not spoken|
|2|Swipe right|Sub-links follow|Fail if elsewhere|

### TEST-MNU-103 — Current page

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to "Home"|Current state spoken|Fail if only visual|

### TEST-MNU-104 — Mobile menu

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap "Menu"|Expanded; next swipe reaches the links|Fail if links unreachable|
|2|Touch areas of the page behind the panel|Nothing from the page is read, when the panel covers it|Fail if the page is reachable|
|3|Double tap the close control|VoiceOver focus returns to "Menu"|Fail if lost|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Landmarks|Rotor `VO + U`|Rotor **Landmarks**|
|Leak detection for a covering panel|Cursor and rotor|Touch exploration|

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Navigation|"Main"|Navigation landmark, list|—|Before content|—|—|—|
|Link|Page name|Link|Current, if applicable|List order|Return, `VO + Space`, double tap|New page|—|
|Disclosure|Section name|Button|Expanded / collapsed|Sub-links right after|Return, Space, Escape|Stays|New state|
|Mobile menu button|"Menu"|Button|Expanded / collapsed|—|Same|Back on close|New state|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Disclosure|"Products, collapsed, button"|
|macOS|Current|"current page, link, Home"|
|iOS|Disclosure|"Products, button, expanded"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Name, role, expanded state|WCAG 4.1.2 (A); A11Y-30|Normative|004, 006, 102, 104|
|Structure: landmark, list, current page|WCAG 1.3.1 (A)|Normative|002, 005, 101, 103|
|Bypass blocks via landmarks|WCAG 2.4.1 (A)|Normative, with other means|003, 101|
|Keyboard operation|WCAG 2.1.1 (A)|Normative|001|
|Focus order for mobile panel|WCAG 2.4.3 (A)|Normative|006, 104|
|Disclosure pattern, not `role="menu"`|[APG Disclosure Navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/)|Best practice|002|
|Hidden sub-links hidden from AT|A11Y-33|Best practice|004|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Items spoken as menu items|Wrong keys expected; links absent from the links list|`role="menu"`|Remove menu roles; use links and buttons|
|Section opens on hover only|Keyboard and touch users miss it|CSS `:hover` only|Disclosure button with `aria-expanded`|
|Collapsed links still read|Noise and confusion|Hidden visually only|`hidden` or `display: none`|
|Current page not spoken|Disorientation|No `aria-current`|`aria-current="page"`|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard operation without hover|001|Not tested|Not applicable||
|Landmark, list, links|002, 003, 101|Not tested|Not tested||
|Disclosure state and order|004, 102|Not tested|Not tested||
|Current page|005, 103|Not tested|Not tested||
|Mobile menu focus and containment|006, 104|Not tested|Not tested||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Link](../actions/link.md) · [Breadcrumb](breadcrumb.md) · [Action Menu](../actions/action-menu.md) · [Dialog](../overlays/dialog.md)
