---
id: CMP-FRM-005
title: Switch
family: forms
platforms: [macos, ios]
status: specification
---

# Switch

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** turn a setting on or off with immediate effect. A choice submitted later with a form is better served by a [Checkbox](checkbox.md).

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Off / on|Role and state; state updated|002, 003, 101, 102|
|With a description|Description tied to the switch|004|
|Disabled|State; no change|005, 103|
|With asynchronous effect|Result perceivable; state reverts with an error if it fails|006|

### Main accessibility risks

- Custom switch without role or state.
- State conveyed by color or thumb position only.
- Visible "On/Off" text changing the name instead of the state.
- Asynchronous failure silent.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-SWT-001|macOS|Keyboard operation without VoiceOver|Critical|WCAG 2.1.1, 2.4.7|
|TEST-SWT-002|macOS|Name, role, state|Critical|WCAG 4.1.2|
|TEST-SWT-003|macOS|Toggling|Critical|WCAG 4.1.2|
|TEST-SWT-004|macOS|Description|Medium|WCAG 1.3.1|
|TEST-SWT-005|macOS|Disabled|Medium|WCAG 4.1.2|
|TEST-SWT-006|macOS|Asynchronous effect|High|WCAG 4.1.3|
|TEST-SWT-101|iOS|Discovery|Critical|WCAG 4.1.2|
|TEST-SWT-102|iOS|Toggling|Critical|WCAG 4.1.2|
|TEST-SWT-103|iOS|Disabled|Medium|WCAG 4.1.2|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-SWT-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

"Wi-Fi" (off), "Notifications" (on, with description "Get an email for each comment"), a disabled switch, and a switch whose change is saved to a server and can be made to fail.

### Initial state

As listed.

## 3. VoiceOver tests on macOS

Contract: [Keyboard Interactions §5.4](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-SWT-001 — Keyboard operation without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab to "Wi-Fi"|Visible focus|Fail if skipped or invisible|
|2|Press Space|Toggles|Fail if not|
|3|Press Return|Toggles or does nothing, as documented|Observation|

### TEST-SWT-002 — Name, role, state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` to "Wi-Fi"|Name, switch role, off state, e.g. "Wi-Fi, off, switch"|Fail if no state; Minor if spoken as a checkbox with a correct state|

### TEST-SWT-003 — Toggling

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Space`|On; new state spoken; name unchanged|Fail if the spoken state differs from the screen, or the name changes ("Wi-Fi on")|

### TEST-SWT-004 — Description

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to "Notifications"|Description spoken with the switch, possibly after a pause|Minor if only reachable as separate text next to it|

### TEST-SWT-005 — Disabled

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow`, `VO + Space`|Disabled spoken; no change|Fail if it toggles|

### TEST-SWT-006 — Asynchronous effect

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Toggle the server switch with the failure enabled|The error is announced; the switch returns to its real state; re-reading speaks the real state|Fail if the switch shows a state that was not saved, or the failure is silent|

## 4. VoiceOver tests on iOS

### TEST-SWT-101 — Discovery

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to "Wi-Fi"|Name, switch role, state, e.g. "Wi-Fi, switch button, off"|Fail if no state|

### TEST-SWT-102 — Toggling

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap|State toggles and is spoken|Fail if not spoken|

### TEST-SWT-103 — Disabled

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe, double tap|Disabled; no change|Fail if it toggles|

### Differences from macOS

No specific difference beyond activation and navigation gestures.

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Switch|Stable label|Switch|On / off|Visual order|Space, `VO + Space`, double tap|Stays|New state|
|Failure|Label|Switch|Real state|—|—|Stays|Error|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Off|"Wi-Fi, off, switch"|
|iOS|On|"Wi-Fi, switch button, on"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Name, role, state|WCAG 4.1.2 (A); A11Y-30|Normative|002, 003, 005, 101–103|
|Keyboard, visible focus|WCAG 2.1.1 (A), 2.4.7 (AA)|Normative|001|
|Description associated|WCAG 1.3.1 (A)|Normative|004|
|Failure announced|WCAG 4.1.3 (AA); A11Y-31|Normative|006|
|`role="switch"` with `aria-checked`|[APG Switch](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)|Best practice|002|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|No state spoken|Setting unknown|Custom `div`|`role="switch"` + `aria-checked`, or a native checkbox|
|Name changes with state|Confusing|"On/Off" text inside the label|Keep the name stable; show state separately and hide it from AT|
|Failure silent|Wrong belief that the setting is saved|Optimistic update|Revert and announce|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard operation|001|Not tested|Not applicable||
|Name, role, state|002, 101|Not tested|Not tested||
|Toggle updates state; stable name|003, 102|Not tested|Not tested||
|Description|004|Not tested|Not applicable||
|Disabled|005, 103|Not tested|Not tested||
|Asynchronous failure|006|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Checkbox](checkbox.md) · [Keyboard Interactions §5.4](../../../04-interaction-quality/keyboard-interactions.md)
