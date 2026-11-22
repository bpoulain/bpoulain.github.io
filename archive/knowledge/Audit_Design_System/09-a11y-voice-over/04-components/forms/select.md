---
id: CMP-FRM-004
title: Select
family: forms
platforms: [macos, ios]
status: specification
---

# Select

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** choose one value from a list shown in a popup, without typing. A field where the user types to filter is a [Combobox](../complex/combobox.md).

Two implementations behave very differently and are tested separately:

- **Native** `select`: the OS draws the popup (a menu on macOS, a picker on iOS).
- **Custom** select: a trigger with `role="combobox"` (select-only) or a button, and a `listbox` drawn by the page.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Closed, no value|Name, role, empty value or placeholder|002, 101|
|Closed, with value|Value spoken|002, 101|
|Open|Expanded state; highlighted option; position|003, 004, 102|
|Option disabled|Skipped or spoken as disabled|005|
|Disabled select|Disabled state|006, 103|
|Required, invalid|State and error tied to the trigger|007|

### Main accessibility risks

- Custom trigger without a name: only the value is spoken.
- Expanded state not exposed.
- Highlighted option not followed by VoiceOver (missing `aria-activedescendant` or focus management).
- Escape commits instead of cancelling.
- Popup that VoiceOver users on iOS cannot reach or close.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-SEL-001|macOS|Keyboard contract without VoiceOver|Critical|WCAG 2.1.1|
|TEST-SEL-002|macOS|Name, role and value when closed|Critical|WCAG 4.1.2|
|TEST-SEL-003|macOS|Opening and expanded state|Critical|WCAG 4.1.2|
|TEST-SEL-004|macOS|Moving through options, committing, cancelling|Critical|WCAG 2.1.1, 4.1.2|
|TEST-SEL-005|macOS|Disabled option|Medium|WCAG 4.1.2|
|TEST-SEL-006|macOS|Disabled select|Medium|WCAG 4.1.2|
|TEST-SEL-007|macOS|Required and error|High|WCAG 3.3.1, 3.3.2|
|TEST-SEL-101|iOS|Discovery|Critical|WCAG 4.1.2|
|TEST-SEL-102|iOS|Choosing a value|Critical|WCAG 2.1.1, 4.1.2|
|TEST-SEL-103|iOS|Disabled select|Medium|WCAG 4.1.2|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-SEL-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level, and whether the select is native or custom.

### Test page

1. "Country": custom select with at least 10 options, one disabled, no value, required, with an error on empty submission.
2. "Currency": with a value, native or custom according to what the design system offers.
3. A disabled select.
4. A submit button.

### Initial state

Popups closed. "Country" empty, "Currency" set.

## 3. VoiceOver tests on macOS

Contract: [Keyboard Interactions §8](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-SEL-001 — Keyboard contract without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab to "Country"|Visible focus on the trigger|Fail if skipped or invisible|
|2|Press Space, Return or Down Arrow|The popup opens; an option is highlighted (the selected one, or the first)|Fail if no key opens it|
|3|Press Down/Up Arrow, Home, End|The highlight moves; the disabled option is skipped|Fail if the highlight does not move or lands on the disabled option without a disabled state|
|4|Type the first letters of an option|The highlight jumps to it|Observation if typeahead is missing|
|5|Press Escape|The popup closes; the value is unchanged; focus on the trigger|Fail if Escape commits the highlighted option|
|6|Reopen, move, press Return|The value is committed; the popup closes; focus on the trigger|Fail if focus is lost|
|7|With the popup open, press Tab|The popup closes; focus moves on; no trap|Fail on a trap|

### TEST-SEL-002 — Name, role and value when closed

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` to "Country"|Label, role (pop-up button or combobox), and the value or "no selection"|Fail if the label is not part of the name|
|2|Same on "Currency"|Label and current value|Fail if the value is not spoken|

### TEST-SEL-003 — Opening and expanded state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Space` on "Country"|The popup opens; VoiceOver speaks the expanded state or the highlighted option|Fail if nothing is spoken|
|2|Listen|Option name, selected state if any, position, e.g. "France, 3 of 10"|Fail if the highlighted option is not spoken|

On a native select, macOS shows a system menu: record its behavior, it is outside the design system's control.

### TEST-SEL-004 — Moving through options, committing, cancelling

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Press Down Arrow several times|Each highlighted option is spoken|Fail if VoiceOver stays silent or speaks a stale option|
|2|Press Return|The popup closes; the new value is spoken with the trigger|Fail if the value is not spoken on re-reading|
|3|Reopen, move, press Escape|The value is unchanged|Fail if changed|
|4|`VO + Right Arrow` from the open popup|VoiceOver stays in the list or the popup closes; it does not read the page behind the list while it is open|Observation, Fail if the popup stays open but becomes unreachable|

### TEST-SEL-005 — Disabled option

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Reach the disabled option with arrows or `VO + Right Arrow`|Skipped, or spoken as disabled|Fail if spoken as available|
|2|Try to commit it|Nothing changes|Fail if committed|

### TEST-SEL-006 — Disabled select

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to it, `VO + Space`|Disabled spoken; does not open|Fail if it opens|

### TEST-SEL-007 — Required and error

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to "Country"|Requirement perceivable|Fail if only visual|
|2|Submit with no value|Error announced or focus moved|Fail if silent|
|3|Re-read the trigger|Invalid state and error text|Fail if not tied|

## 4. VoiceOver tests on iOS

### TEST-SEL-101 — Discovery

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to "Country"|Label, role and value|Fail if the label is missing|

### TEST-SEL-102 — Choosing a value

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap the trigger|Native: a picker or menu appears. Custom: the listbox appears and VoiceOver focus moves into it, or the next swipe reaches it|Fail if the options cannot be reached by swiping|
|2|Native picker: swipe up or down on the picker|The value changes, spoken|Observation, system control|
|3|Custom: swipe to an option and double tap|The value is committed; the popup closes; VoiceOver focus returns to the trigger|Fail if focus is lost or the value is not spoken|
|4|Custom: open, then close without choosing (close control, or tap outside with touch exploration)|The value is unchanged|Fail if the popup cannot be closed without choosing|

### TEST-SEL-103 — Disabled select

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to it, double tap|Disabled spoken; nothing opens|Fail if it opens|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Native popup|System menu|Picker or menu at the bottom of the screen|
|Custom popup|Arrow keys move the highlight|Swipe moves VoiceOver focus; no highlight concept|
|Cancel|Escape|A visible close control, or no choice|

## 5. Expected results

|Scenario|Accessible name|Role|State or value|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Closed|Label|Pop-up button or combobox|Value or none; collapsed|Visual order|Space, Return, arrows|On the trigger|—|
|Open|—|Listbox with options|Expanded; highlighted option; position|Option order|Arrows, Home, End, typeahead, Return, Escape|Trigger or option|Highlighted option|
|Committed|Label|Same|New value; collapsed|—|—|Back on the trigger|New value|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Closed custom select|"Country, no selection, pop-up button"|
|macOS|Moving|"Germany, 2 of 10"|
|iOS|Closed|"Country, pop-up button, France"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Name, role, value, expanded state|WCAG 4.1.2 (A); A11Y-30|Normative|002–006, 101–103|
|Keyboard operation, no trap|WCAG 2.1.1 (A), 2.1.2 (A)|Normative|001, 004|
|Instructions and error|WCAG 3.3.2 (A), 3.3.1 (A)|Normative|007|
|Escape cancels; highlight separate from value|Keyboard Interactions §8.2; [APG Select-Only Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/)|Best practice|001, 004|
|Native picker speech|VoiceOver behavior|AT behavior, not the design system's|003, 102|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Only the value is spoken|The user does not know which field|Trigger not labelled|Associate the label with the trigger|
|Options silent while moving|Blind choice|Active option not exposed|`aria-activedescendant` or moving focus to options|
|Escape commits|Unwanted value|Commit on highlight|Commit only on Return or click|
|Popup unreachable on iOS|Cannot choose|Portal placed far in the DOM, no focus move|Move VoiceOver focus into the list on opening|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard contract: open, move, commit, Escape, Tab|001|Not tested|Not applicable||
|Name, role, value closed|002, 101|Not tested|Not tested||
|Expanded state and highlighted option spoken|003, 004|Not tested|Not applicable||
|Value committed and spoken; focus back on trigger|004, 102|Not tested|Not tested||
|Disabled option|005|Not tested|Not applicable||
|Disabled select|006, 103|Not tested|Not tested||
|Required and error|007|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Keyboard Interactions §8](../../../04-interaction-quality/keyboard-interactions.md) · [Combobox](../complex/combobox.md) · [Radio Group](radio.md)
