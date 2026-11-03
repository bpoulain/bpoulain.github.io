---
id: CMP-CPX-002
title: Combobox
family: complex
platforms: [macos, ios]
status: specification
---

# Combobox

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** type to filter a list of predefined options and choose one. A select without typing is tested with [Select](../forms/select.md); free text with suggestions is tested with [Autocomplete](autocomplete.md).

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Collapsed, empty|Name, role, collapsed state|002, 101|
|Expanded with filtered options|Expanded state; number of results; highlighted option|003, 004, 102|
|No match|Empty result announced|005|
|Value committed|Value spoken; popup closed|004, 102|
|Multiple selection (chips)|Selected values listed and removable|007|
|Disabled, read-only|States|008|

### Main accessibility risks

- Highlighted option not exposed: VoiceOver says nothing while the user presses arrows.
- Typing interrupted or query lost when moving through options.
- Enter submits the form instead of committing.
- Escape behavior undocumented.
- Popup unreachable by swiping on iOS.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-CBX-001|macOS|Keyboard contract without VoiceOver|Critical|WCAG 2.1.1, 2.1.2|
|TEST-CBX-002|macOS|Name, role, collapsed state|Critical|WCAG 4.1.2|
|TEST-CBX-003|macOS|Filtering and result count|High|WCAG 4.1.3|
|TEST-CBX-004|macOS|Highlight and commit|Critical|WCAG 4.1.2|
|TEST-CBX-005|macOS|No match|Medium|WCAG 4.1.3|
|TEST-CBX-006|macOS|Escape and Tab|High|WCAG 2.1.2|
|TEST-CBX-007|macOS|Multiple selection|Medium|WCAG 4.1.2|
|TEST-CBX-008|macOS|Disabled and read-only|Low|WCAG 4.1.2|
|TEST-CBX-101|iOS|Discovery|Critical|WCAG 4.1.2|
|TEST-CBX-102|iOS|Typing and choosing|Critical|WCAG 2.1.1, 4.1.2|
|TEST-CBX-103|iOS|Closing without choosing|High|WCAG 2.1.2|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-CBX-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level, and the documented Escape and Tab contract.

### Test page

1. "Country": combobox with about 50 options, one disabled, inside a form with a submit button.
2. "Tags": multiple selection, if supported.
3. A disabled combobox.

### Initial state

Empty, collapsed.

## 3. VoiceOver tests on macOS

Contract: [Keyboard Interactions §9](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-CBX-001 — Keyboard contract without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab to "Country", type "fr"|The popup opens with matching options; the text stays "fr"|Fail if typing is blocked|
|2|Press Down Arrow, Up Arrow|The highlight moves; the text cursor and query are kept|Fail if the query is replaced while browsing, unless documented|
|3|Press Return on a highlighted option|The value is committed; the popup closes; the form is not submitted|Fail if the form is submitted|
|4|Use Left/Right Arrow, Home, End in the field|The text cursor moves|Fail if the keys are captured by the list|
|5|Press Escape with the popup open|Behavior matches the documentation (close, then clear on second press, for instance)|Fail if undocumented or inconsistent|
|6|Press Tab with the popup open|Focus moves on; the popup closes; no trap|Fail on a trap|

### TEST-CBX-002 — Name, role, collapsed state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` to "Country"|Label, role and collapsed state, e.g. "Country, combo box, collapsed"|Fail if the role or the label is missing|

### TEST-CBX-003 — Filtering and result count

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Focus the field, type "un"|The expanded state is perceivable; the number of results may be announced, e.g. "5 results available"|Observation if the count is missing but options are reachable; Fail if the popup opens silently and cannot be found|
|2|Continue typing|Announcements are not repeated for every keystroke in a disruptive way|Minor if disruptive (A11Y-32)|

### TEST-CBX-004 — Highlight and commit

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Press Down Arrow|The highlighted option is spoken, with position, e.g. "United Kingdom, 2 of 5"|Fail if silent (A11Y-30; active descendant not exposed)|
|2|Press Down Arrow to the disabled option|Skipped or spoken as disabled|Fail if spoken as available|
|3|Press Return|The value is committed and spoken; the popup closes; focus stays in the field|Fail if the value is not spoken on re-reading|

### TEST-CBX-005 — No match

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Type "zzz"|"No results" is announced or reachable|Fail if the empty state is only visible|

### TEST-CBX-006 — Escape and Tab

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|With VoiceOver on and the popup open, press Escape|The documented behavior happens; the collapsed state is spoken on re-reading|Fail if the popup stays open with no way to close it|
|2|Reopen, press Tab|Focus leaves; VoiceOver speaks the next control|Fail on a trap|

### TEST-CBX-007 — Multiple selection

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Choose two tags|Each selection is spoken; selected options show a selected state in the list|Fail if selected state is missing|
|2|`VO + Right Arrow` to the chips|Each value and its remove button, e.g. "Remove Design, button"|Fail if the remove button has no name|
|3|Remove one|The removal is perceivable; focus goes to a logical element|Fail if focus is lost|

### TEST-CBX-008 — Disabled and read-only

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to the disabled combobox|Disabled spoken; cannot open|Fail if it opens|

## 4. VoiceOver tests on iOS

### TEST-CBX-101 — Discovery

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to "Country"|Label, role, collapsed state|Fail if role or label is missing|

### TEST-CBX-102 — Typing and choosing

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap, type "un" with the on-screen keyboard|Options appear; the change is announced or perceivable|Fail if silent and unfindable|
|2|Swipe right from the field|The options are reached, in order|Fail if the options cannot be reached by swiping|
|3|Double tap an option|The value is committed and spoken; VoiceOver focus returns to the field or stays nearby|Fail if focus jumps to the top of the page|

### TEST-CBX-103 — Closing without choosing

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Open the popup, then swipe on past the options|The popup closes or stays without blocking the next content|Fail if the user is stuck in the options|
|2|Dismiss the keyboard|The popup state is coherent with what VoiceOver says|Observation|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Moving through options|Arrows, keyboard focus stays in the field|Swipes move VoiceOver focus into the list|
|Commit|Return|Double tap on the option|
|Escape|Key|No key; closing depends on the design|

## 5. Expected results

|Scenario|Accessible name|Role|State or value|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Collapsed|Label|Combobox|Collapsed; value|Visual order|Typing, Down Arrow|In the field|—|
|Expanded|Label|Combobox + listbox|Expanded; highlighted option; position|Options after the field|Arrows, Return, Escape, Tab|In the field (macOS)|Result count, highlighted option|
|Committed|Label|Combobox|Value; collapsed|—|—|In the field|Value|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Collapsed|"Country, combo box, collapsed"|
|macOS|Highlight|"United Kingdom, 2 of 5"|
|iOS|Option|"United Kingdom"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Name, role, expanded state, value, highlighted option|WCAG 4.1.2 (A); A11Y-30|Normative|002, 004, 007, 008, 101, 102|
|Keyboard operation; no trap|WCAG 2.1.1 (A), 2.1.2 (A)|Normative|001, 006, 103|
|Result count and empty state as status|WCAG 4.1.3 (AA); A11Y-31|Normative|003, 005|
|No disruptive repeats|A11Y-32|Best practice|003|
|Query preserved, Enter does not submit, Escape documented|Keyboard Interactions §9; [APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)|Best practice|001|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Silence while pressing arrows|Blind choice|`aria-activedescendant` missing or pointing to a missing id|Synchronize the active descendant with the highlight|
|Enter submits the form|Lost input|Default not prevented when committing|Commit first; submit only when collapsed|
|Results appear silently|The user does not know options exist|No status region|Announce the result count politely|
|Options unreachable on iOS|Cannot choose|Popup in a distant portal|Keep the popup next to the field in reading order, or move focus|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard contract|001|Not tested|Not applicable||
|Name, role, collapsed state|002, 101|Not tested|Not tested||
|Results announced, empty state perceivable|003, 005|Not tested|Not applicable||
|Highlighted option spoken; commit spoken|004, 102|Not tested|Not tested||
|Escape and Tab; no trap|006, 103|Not tested|Not tested||
|Multiple selection|007|Not tested|Not applicable||
|Disabled|008|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Keyboard Interactions §9](../../../04-interaction-quality/keyboard-interactions.md) · [Select](../forms/select.md) · [Autocomplete](autocomplete.md) · [Search Field](../forms/search.md)
