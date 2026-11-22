---
id: CMP-FRM-002
title: Checkbox
family: forms
platforms: [macos, ios]
status: specification
---

# Checkbox

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** turn an independent option on or off, or select several items from a group.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Single checkbox, unchecked / checked|Name and state; state updated|002, 003, 101, 102|
|Group of checkboxes with a legend|Group name spoken on entry|004, 103|
|Mixed (indeterminate) parent|Mixed state; effect on children|005, 104|
|Disabled|Disabled state; cannot change|006, 105|
|Required or invalid|State and error tied to the checkbox or group|007|

### Main accessibility risks

- Custom checkbox (`div`) without role or state.
- Label not associated: clicking or naming fails.
- Mixed state shown visually only.
- Group question ("Notifications") not exposed.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-CHK-001|macOS|Keyboard operation without VoiceOver|Critical|WCAG 2.1.1, 2.4.7|
|TEST-CHK-002|macOS|Name, role and state|Critical|WCAG 4.1.2|
|TEST-CHK-003|macOS|Toggling|Critical|WCAG 4.1.2|
|TEST-CHK-004|macOS|Group|High|WCAG 1.3.1|
|TEST-CHK-005|macOS|Mixed state|High|WCAG 4.1.2|
|TEST-CHK-006|macOS|Disabled|Medium|WCAG 4.1.2|
|TEST-CHK-007|macOS|Required and error|High|WCAG 3.3.1, 3.3.2|
|TEST-CHK-101|iOS|Discovery|Critical|WCAG 4.1.2|
|TEST-CHK-102|iOS|Toggling by double tap|Critical|WCAG 4.1.2|
|TEST-CHK-103|iOS|Group|High|WCAG 1.3.1|
|TEST-CHK-104|iOS|Mixed state|High|WCAG 4.1.2|
|TEST-CHK-105|iOS|Disabled|Medium|WCAG 4.1.2|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-CHK-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

1. "I accept the terms": single, unchecked, required, with an error shown when submitting unchecked.
2. A group with the legend "Notifications": "Email", "SMS", "Push".
3. A "Select all" parent in mixed state when some children are checked, if supported.
4. A disabled checkbox, checked.
5. A submit button.

### Initial state

Everything unchecked except the disabled one; "Email" checked so the parent is mixed, if supported.

## 3. VoiceOver tests on macOS

Contract: [Keyboard Interactions §5.3](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-CHK-001 — Keyboard operation without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab through the checkboxes|Each one receives a visible focus; the disabled one is skipped or reached without effect|Fail if a checkbox is skipped or focus is invisible|
|2|Press Space|The state toggles|Fail if nothing happens|
|3|Press Return|Does not toggle; may submit the form|Observation if Return toggles: not native behavior|

### TEST-CHK-002 — Name, role and state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` to "I accept the terms"|Name, role and state, e.g. "I accept the terms, unchecked, checkbox"|Fail if the role or the state is missing|
|2|Compare the name with the visible label|Same words|Fail if the name is absent or different (WCAG 2.5.3)|

### TEST-CHK-003 — Toggling

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Space`|Checked; the new state is spoken|Fail if the spoken state differs from the screen|
|2|`VO + Space` again|Unchecked; spoken|Same|
|3|Tab to the checkbox and press Space with VoiceOver on|Toggles and speaks|Fail if Space works only without VoiceOver|
|4|Check focus|Stays on the checkbox|Fail if focus moves|

### TEST-CHK-004 — Group

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` from before the group to "Email"|The group name "Notifications" is spoken on entry, before or with the first checkbox|Fail if the question is visible but never exposed (WCAG 1.3.1)|
|2|Tab into the group from outside|Same|Same|

### TEST-CHK-005 — Mixed state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to "Select all"|Mixed state, e.g. "mixed" or "partially checked"|Fail if spoken as checked or unchecked|
|2|`VO + Space`|All children follow the documented rule; the parent state is spoken|Fail if children change silently and differ from what is spoken on re-reading|

### TEST-CHK-006 — Disabled

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to the disabled checkbox|State "checked" and "dimmed" or equivalent|Fail if disabled is not spoken|
|2|`VO + Space`|No change|Fail if it toggles|

### TEST-CHK-007 — Required and error

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to "I accept the terms"|"required" or an instruction is perceivable|Fail if the requirement is only visual (WCAG 3.3.2)|
|2|Submit without checking|The error is announced or focus moves to it|Fail if silent|
|3|Re-read the checkbox|Invalid state and error text|Fail if the error is not tied to it (WCAG 3.3.1)|

## 4. VoiceOver tests on iOS

### TEST-CHK-101 — Discovery

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe right to each checkbox|Name, role and state|Fail if role or state is missing|
|2|Touch the visible label|The checkbox is announced, or the label is spoken and leads to it|Observation|

### TEST-CHK-102 — Toggling by double tap

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap|State toggles and is spoken|Fail if not spoken or wrong|
|2|Swipe left then right|The updated state is spoken|Fail if stale|

### TEST-CHK-103 — Group

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe into the group|The legend is spoken as a separate item or with the first checkbox|Fail if never exposed|

### TEST-CHK-104 — Mixed state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to "Select all"|Mixed state|Fail if wrong|
|2|Double tap|Children and parent update; spoken state matches|Fail if mismatch|

### TEST-CHK-105 — Disabled

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to it, double tap|Disabled spoken; no change|Fail if it toggles|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Toggle|Space, `VO + Space`|Double tap|
|Group name|Often spoken on entry|Often a separate item before the first checkbox|

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Single|Label|Checkbox|Checked / unchecked|Visual order|Space, `VO + Space`, double tap|Stays|New state|
|In group|Label (+ group name on entry)|Checkbox|Same|Group order|Same|Stays|New state|
|Mixed parent|Label|Checkbox|Mixed|First in group|Same|Stays|New state|
|Disabled|Label|Checkbox|Disabled + state|Skipped by Tab|None|—|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Unchecked|"I accept the terms, unchecked, checkbox"|
|macOS|Mixed|"Select all, mixed, checkbox"|
|iOS|Checked|"Email, checkbox, checked"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Name, role, state|WCAG 4.1.2 (A); A11Y-30|Normative|002, 003, 005, 006, 101–105|
|Group relationship|WCAG 1.3.1 (A)|Normative|004, 103|
|Keyboard operation, visible focus|WCAG 2.1.1 (A), 2.4.7 (AA)|Normative|001, 003|
|Visible label in the name|WCAG 2.5.3 (A)|Normative|002|
|Required instruction; error identified|WCAG 3.3.2 (A), 3.3.1 (A)|Normative|007|
|Native `input type="checkbox"`, `fieldset`/`legend`|Keyboard Interactions §5.3; [APG Checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)|Best practice|001, 004|
|Where the group name is spoken|VoiceOver behavior|AT behavior|004, 103|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|No role or state spoken|The user cannot tell it is a choice|Custom `div`|Native checkbox, or `role="checkbox"` with `aria-checked`|
|State spoken does not change|Wrong decision|State not synchronized|Update `checked` / `aria-checked`|
|Question not spoken|Options lose meaning ("Email" for what?)|No `fieldset`/`legend` or group label|Group with a name|
|Mixed shown as unchecked|Misleading|`indeterminate` not set|Set `indeterminate` or `aria-checked="mixed"`|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard: Tab and Space, visible focus|001|Not tested|Not applicable||
|Name, role and state|002, 101|Not tested|Not tested||
|Toggling updates the spoken state|003, 102|Not tested|Not tested||
|Group name exposed|004, 103|Not tested|Not tested||
|Mixed state|005, 104|Not tested|Not tested||
|Disabled|006, 105|Not tested|Not tested||
|Required and error|007|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Keyboard Interactions §5.3](../../../04-interaction-quality/keyboard-interactions.md) · [Switch](switch.md) · [Radio Group](radio.md) · [Error Message](../feedback/error-message.md)
