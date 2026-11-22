---
id: CMP-NAV-003
title: Breadcrumb
family: navigation
platforms: [macos, ios]
status: specification
---

# Breadcrumb

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** show where the current page sits in the hierarchy, with links to its ancestors.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Short trail|Landmark, list, links, current page|002, 101|
|Long trail collapsed with an ellipsis button|Button named; expansion; focus|003|
|Current page as text or link|Current state; not a needless link|002|

### Main accessibility risks

- Separators ("/", "›") read as content.
- Current page not identified.
- No landmark name, so it is confused with the main navigation.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-BRC-001|macOS|Keyboard operation without VoiceOver|Medium|WCAG 2.1.1|
|TEST-BRC-002|macOS|Structure, separators, current page|High|WCAG 1.3.1, 2.4.8|
|TEST-BRC-003|macOS|Collapsed trail|Medium|WCAG 4.1.2|
|TEST-BRC-101|iOS|Structure and current page|High|WCAG 1.3.1|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-BRC-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

A breadcrumb "Home › Products › Chairs › Office chair" in a `nav` labelled "Breadcrumb"; a long variant collapsed with an ellipsis button, if supported.

### Initial state

Collapsed variant collapsed.

## 3. VoiceOver tests on macOS

Contract: [Keyboard Interactions §13.2](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-BRC-001 — Keyboard operation without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab through|Each ancestor link focusable; separators not; current page not focusable unless it is a link|Fail if separators take focus|

### TEST-BRC-002 — Structure, separators, current page

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` into it|"Breadcrumb, navigation", a list with a count|Observation if no landmark name|
|2|Continue|Links in order; separators silent|Minor if separators are read ("slash", "greater than")|
|3|Reach "Office chair"|Current state spoken, e.g. "current page"|Fail if the current page is not identifiable|

### TEST-BRC-003 — Collapsed trail

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to the ellipsis|Named, e.g. "Show full path, button", with state|Fail if "…" or "button" only|
|2|`VO + Space`|Hidden links appear and follow in order; focus stays or moves to the first new link|Fail if focus lost|

## 4. VoiceOver tests on iOS

### TEST-BRC-101 — Structure and current page

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Rotor **Landmarks** to the breadcrumb; swipe through|Links, no separators, current page identified|Same criteria as 002|

### Differences from macOS

No specific difference beyond activation and navigation gestures.

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Container|"Breadcrumb"|Navigation, ordered list|—|Before main content|—|—|—|
|Ancestor|Page name|Link|—|Hierarchy order|Return, double tap|New page|—|
|Current|Page name|Text or link|Current|Last|—|—|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Container|"Breadcrumb, navigation"|
|iOS|Current|"Office chair, current page"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Structure and current page|WCAG 1.3.1 (A)|Normative|002, 101|
|Ellipsis button named and stateful|WCAG 4.1.2 (A)|Normative|003|
|Keyboard operation|WCAG 2.1.1 (A)|Normative|001|
|Location within a set of pages|WCAG 2.4.8 (AAA)|Best practice at A/AA|002|
|Breadcrumb pattern|[APG Breadcrumb](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/)|Best practice|002|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|"greater than" between items|Noise|Text separators|CSS or hidden decorative separators|
|Current page unknown|Disorientation|No `aria-current`|`aria-current="page"`|
|Two unnamed navigations|Landmarks indistinguishable|No label|`aria-label="Breadcrumb"`|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Separators not focusable|001|Not tested|Not applicable||
|Landmark, list, silent separators|002, 101|Not tested|Not tested||
|Current page identified|002, 101|Not tested|Not tested||
|Collapsed trail|003|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Link](../actions/link.md) · [Navigation Menu](menu.md)
