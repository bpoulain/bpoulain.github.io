---
id: CMP-FRM-003
title: Radio Group
family: forms
platforms: [macos, ios]
status: specification
---

# Radio Group

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** choose exactly one option from a short set.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Group with a legend, nothing selected|Group name; Tab lands on the first option|001, 002, 101|
|Group with a selected option|Tab lands on the selected option; position spoken|001, 003|
|Option disabled|Skipped by arrows; state spoken|005, 104|
|Required, with error|Requirement and error tied to the group|006|
|Horizontal layout (segmented look)|Same semantics as vertical|003|

### Main accessibility risks

- Every option is a Tab stop, or arrows do not work: not the radio pattern.
- Group question not exposed.
- Custom radios without role or checked state.
- Selection follows focus unexpectedly when a change triggers an action.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-RAD-001|macOS|Keyboard operation without VoiceOver|Critical|WCAG 2.1.1|
|TEST-RAD-002|macOS|Group name|Critical|WCAG 1.3.1|
|TEST-RAD-003|macOS|Name, role, state and position|Critical|WCAG 4.1.2|
|TEST-RAD-004|macOS|Changing the selection|Critical|WCAG 4.1.2, 3.2.2|
|TEST-RAD-005|macOS|Disabled option|Medium|WCAG 4.1.2|
|TEST-RAD-006|macOS|Required and error|High|WCAG 3.3.1, 3.3.2|
|TEST-RAD-101|iOS|Discovery and position|Critical|WCAG 4.1.2|
|TEST-RAD-102|iOS|Selection by double tap|Critical|WCAG 4.1.2|
|TEST-RAD-103|iOS|Group name|High|WCAG 1.3.1|
|TEST-RAD-104|iOS|Disabled option|Medium|WCAG 4.1.2|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-RAD-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

1. Group "Delivery" (legend): "Standard", "Express", "Pickup" (disabled), nothing selected, required.
2. Group "Size": "Small", "Medium" (selected), "Large", horizontal layout.
3. A submit button, with an error shown when "Delivery" is empty.

### Initial state

"Delivery" empty, "Size" set to "Medium".

## 3. VoiceOver tests on macOS

Contract: [Keyboard Interactions §5.5](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-RAD-001 — Keyboard operation without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab into "Delivery"|Focus on the first enabled option, visible|Fail if focus is invisible|
|2|Press Tab again|Focus leaves the group|Fail if Tab stops on each option|
|3|Shift-Tab back, press Down Arrow|The next enabled option is focused and selected; "Pickup" is skipped|Fail if arrows do nothing or reach the disabled option|
|4|Tab into "Size"|Focus lands on "Medium", the selected option|Fail if it lands elsewhere|
|5|Press Space on a focused, unselected option|It is selected|Fail if nothing happens|

### TEST-RAD-002 — Group name

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` into "Delivery"|"Delivery" is spoken on entry, with the group role or before the first option|Fail if the question is never exposed|

### TEST-RAD-003 — Name, role, state and position

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to "Express"|Name, role, state and position, e.g. "Express, radio button, 2 of 3"|Fail if role or state is missing|
|2|Same in "Size"|Same semantics, although displayed horizontally|Fail if spoken as buttons or tabs|

Position ("2 of 3") is helpful but not required by WCAG; record it as an observation if missing.

### TEST-RAD-004 — Changing the selection

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Focus "Standard" with Tab, press Down Arrow with VoiceOver on|"Express" is selected; name and selected state are spoken|Fail if the spoken state differs from the screen|
|2|`VO + Space` on "Standard"|"Standard" selected, "Express" unselected|Fail if two options are selected|
|3|Watch the page|Selecting does not cause a change of context (navigation, submission)|Fail if it does without warning (WCAG 3.2.2)|

### TEST-RAD-005 — Disabled option

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to "Pickup"|Disabled state spoken|Fail if not spoken|
|2|`VO + Space`|No selection|Fail if selected|

### TEST-RAD-006 — Required and error

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Enter the group|Requirement perceivable|Fail if only visual|
|2|Submit with nothing selected|Error announced, or focus moved to the group or the error|Fail if silent|
|3|Re-enter the group|Error text spoken with the group or the first option|Fail if not tied|

## 4. VoiceOver tests on iOS

### TEST-RAD-101 — Discovery and position

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe right through "Delivery"|Each option: name, role, state, possibly position|Fail if role or state is missing|

### TEST-RAD-102 — Selection by double tap

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap "Express"|Selected; state spoken|Fail if not spoken|
|2|Swipe to "Standard"|Spoken as not selected|Fail if two are selected|

### TEST-RAD-103 — Group name

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe into the group|The legend is spoken before or with the first option|Fail if never exposed|

### TEST-RAD-104 — Disabled option

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to "Pickup", double tap|Disabled spoken; not selected|Fail if selected|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Moving between options|Arrow keys select as they move|Swipe moves without selecting; double tap selects|
|Tab stops|One per group|Not applicable|

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Entering the group|Option label + group name|Radio button|Selected / not selected, position|Group order|Tab enters, arrows move|One Tab stop|Group name|
|Changing|Option label|Radio button|Selected|Same|Arrows, Space, `VO + Space`, double tap|On the new option|New state|
|Disabled option|Label|Radio button|Disabled|Skipped by arrows|None|—|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Entering|"Delivery, group" then "Standard, radio button, 1 of 3"|
|iOS|Selected|"Express, radio button, selected, 2 of 3"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Name, role, state|WCAG 4.1.2 (A); A11Y-30|Normative|003–005, 101, 102, 104|
|Group relationship|WCAG 1.3.1 (A)|Normative|002, 103|
|Keyboard operation|WCAG 2.1.1 (A)|Normative|001, 004|
|No change of context on selection|WCAG 3.2.2 On Input (A)|Normative|004|
|Instructions and error|WCAG 3.3.2 (A), 3.3.1 (A)|Normative|006|
|One Tab stop, arrows inside|Keyboard Interactions §5.5; [APG Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)|Best practice|001|
|Position "n of m" spoken|VoiceOver behavior|AT behavior|003|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Each option is a Tab stop|Slow, not the expected pattern|Buttons styled as radios|Native radios sharing a `name`, or roving tabindex|
|Arrows do nothing|Keyboard users cannot change|Custom widget without key handling|Native radios|
|Group question missing|Options lose meaning|No `fieldset`/`legend` or `radiogroup` name|Name the group|
|Two options spoken as selected|Misleading|State not synchronized|Single source of truth|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|One Tab stop, arrows move and select|001|Not tested|Not applicable||
|Group name exposed|002, 103|Not tested|Not tested||
|Name, role, state|003, 101|Not tested|Not tested||
|Changing updates the spoken state|004, 102|Not tested|Not tested||
|No change of context|004|Not tested|Not applicable||
|Disabled option|005, 104|Not tested|Not tested||
|Required and error|006|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Keyboard Interactions §5.5](../../../04-interaction-quality/keyboard-interactions.md) · [Checkbox](checkbox.md) · [Select](select.md)
