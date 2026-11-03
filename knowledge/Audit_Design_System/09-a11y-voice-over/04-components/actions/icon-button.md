---
id: CMP-ACT-003
title: Icon Button
family: actions
platforms: [macos, ios]
status: specification
---

# Icon Button

Follows the structure of the reference specifications [Button](button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** a button showing only an icon. All [Button](button.md) tests apply; this specification adds what is specific to the missing visible text.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Icon only, with accessible name|Name describes the action, not the icon|002, 101|
|With a tooltip|Tooltip is not the only name; name and tooltip agree|003, 102|
|Toggle (pressed)|State, stable name|004, 103|
|Disabled|State|005|
|Same icon, different actions in a list (e.g. "Delete" per row)|Names distinguishable|006|

### Main accessibility risks

- No name: "button" only.
- Name describing the icon ("trash") instead of the action ("Delete").
- Name only in a tooltip, absent on iOS.
- Icon announced as a separate image.
- Repeated identical names in a list.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-ICB-001|macOS|Keyboard operation without VoiceOver|Critical|WCAG 2.1.1, 2.4.7|
|TEST-ICB-002|macOS|Name and role|Critical|WCAG 1.1.1, 4.1.2|
|TEST-ICB-003|macOS|Tooltip and name|High|WCAG 1.4.13, 4.1.2|
|TEST-ICB-004|macOS|Toggle state|High|WCAG 4.1.2|
|TEST-ICB-005|macOS|Disabled|Medium|WCAG 4.1.2|
|TEST-ICB-006|macOS|Repeated actions in a list|High|WCAG 2.4.6, 4.1.2|
|TEST-ICB-101|iOS|Name and role|Critical|WCAG 1.1.1, 4.1.2|
|TEST-ICB-102|iOS|No tooltip dependency|Critical|WCAG 4.1.2|
|TEST-ICB-103|iOS|Toggle state|High|WCAG 4.1.2|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-ICB-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

"Settings" (gear icon) with a tooltip; "Bold" toggle; a disabled "Share"; a list of three files each with a "Delete" icon button.

### Initial state

Nothing pressed; tooltips hidden.

## 3. VoiceOver tests on macOS

Contract: [Keyboard Interactions §4.3–4.4](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-ICB-001 — Keyboard operation without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab to each icon button|Visible focus; tooltip appears on focus if it exists|Fail if focus is invisible|
|2|Press Return and Space|Action runs once|Fail if not|
|3|Press Escape with the tooltip shown|Tooltip hides; focus stays|Fail if it cannot be dismissed (WCAG 1.4.13)|

### TEST-ICB-002 — Name and role

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` to "Settings"|Action name and role, e.g. "Settings, button"|Fail if only "button", an icon name ("gear") or a file name|
|2|Check stops|One stop, icon not read separately|Fail on an extra "image" (A11Y-34)|

### TEST-ICB-003 — Tooltip and name

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Focus "Settings"; listen|Name, possibly followed by the tooltip as description; not twice the same text in a disturbing way|Minor if duplicated|
|2|Compare tooltip text and name|Same words, or the name starts with the tooltip words|Fail if they differ (users of speech input say the tooltip words, WCAG 2.5.3)|

### TEST-ICB-004 — Toggle state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Space` on "Bold"|Pressed state spoken; name unchanged|Fail if no state, or the name changes while a state is also exposed|

### TEST-ICB-005 — Disabled

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to "Share", `VO + Space`|Disabled spoken; no action|Fail if it acts|

### TEST-ICB-006 — Repeated actions in a list

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + U`, **Form Controls** list|The three delete buttons are distinguishable, e.g. "Delete report.pdf"|Minor if identical but the context is clear when navigating linearly; Fail if the target cannot be determined|

## 4. VoiceOver tests on iOS

### TEST-ICB-101 — Name and role

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to each icon button|Action name and role|Fail if only "button"|

### TEST-ICB-102 — No tooltip dependency

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to "Settings" without any hover|Full name spoken|Fail if the name needs the tooltip|

### TEST-ICB-103 — Toggle state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap "Bold"|State spoken|Fail if not|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Tooltip|Shown on focus and hover|Never shown to VoiceOver users|

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Icon button|Action|Button|—|Visual order|Return, Space, `VO + Space`, double tap|Stays|—|
|Toggle|Stable action name|Toggle or button|Pressed|Same|Same|Stays|New state|
|In a list|Action + object|Button|—|Row order|Same|Stays|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Icon button|"Settings, button"|
|iOS|In a list|"Delete report.pdf, button"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Text alternative|WCAG 1.1.1 (A)|Normative|002, 101, 102|
|Name, role, state|WCAG 4.1.2 (A); A11Y-30|Normative|002, 004, 005, 101, 103|
|Tooltip dismissible|WCAG 1.4.13 (AA)|Normative|001|
|Tooltip text in the name|WCAG 2.5.3 (A)|Normative|003|
|Descriptive labels|WCAG 2.4.6 (AA)|Normative|006|
|Decorative icon hidden|A11Y-34|Best practice|002|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|"button" only|Action unknown|No `aria-label`|Add a name describing the action|
|Name only via tooltip|Unnamed on iOS|`title` or tooltip used as name|Explicit accessible name|
|"Delete" ×3|Wrong file deleted|Same name|Include the object in the name|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard operation; tooltip dismissible|001|Not tested|Not applicable||
|Action name and role; icon hidden|002, 101|Not tested|Not tested||
|Name independent of tooltip and consistent with it|003, 102|Not tested|Not tested||
|Toggle state|004, 103|Not tested|Not tested||
|Disabled|005|Not tested|Not applicable||
|Repeated actions distinguishable|006|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Button](button.md) · [Tooltip](../overlays/tooltip.md) · [Icon](../content/icon.md)
