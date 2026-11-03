---
id: CMP-CPX-005
title: Interactive Table
family: complex
platforms: [macos, ios]
status: specification
---

# Interactive Table

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** a table whose cells or rows are operated: row selection, inline editing, cell navigation with arrows (`role="grid"`). Read-only tables are tested with [Data Table](../content/table.md); its tests apply here too.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Grid navigation|Arrows move between cells; headers spoken|001, 002|
|Row selection (checkboxes)|Selected state; "select all"|003|
|Inline editing|Edit mode entered, committed, cancelled|004|
|Sorting|See Data Table TEST-TBL-004|—|
|Validation error in a cell|Error tied to the cell|005|

### Main accessibility risks

- Grid role without the keyboard model, or the reverse.
- Edit mode not perceivable; arrows still move cells while editing.
- Selected rows only highlighted visually.
- Focus lost after editing.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-ITB-001|macOS|Keyboard contract without VoiceOver|Critical|WCAG 2.1.1|
|TEST-ITB-002|macOS|Cell navigation and headers|Critical|WCAG 1.3.1|
|TEST-ITB-003|macOS|Row selection|High|WCAG 4.1.2|
|TEST-ITB-004|macOS|Inline editing|Critical|WCAG 2.1.1, 4.1.2|
|TEST-ITB-005|macOS|Cell error|High|WCAG 3.3.1|
|TEST-ITB-101|iOS|Cells, selection, editing|Critical|WCAG 4.1.2|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-ITB-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level, and the documented grid keyboard model.

### Test page

A grid "Team" (Name, Role, Email) with 5 rows, row checkboxes and "Select all", the Email cell editable, and validation of the email format.

### Initial state

No row selected.

## 3. VoiceOver tests on macOS

Contract: [Keyboard Interactions §15](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-ITB-001 — Keyboard contract without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab into the grid|One Tab stop; focus on a cell|Fail if every cell is a Tab stop|
|2|Arrows, Home/End, Command-Home/End if documented|Move as documented|Fail if arrows do nothing|
|3|Return on an Email cell|Edit mode; arrows now move the text cursor|Fail if arrows still move cells|
|4|Escape|Edit cancelled; focus on the cell|Fail if lost|
|5|Return after editing|Committed; focus on the cell|Fail if lost|
|6|Tab from inside the grid|Leaves the grid|Fail on a trap|

### TEST-ITB-002 — Cell navigation and headers

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. Arrow between cells|Value with column header when the column changes, row context when the row changes|Fail if headers are never spoken|
|2|Listen for position|Row and column numbers may be spoken|Observation|

### TEST-ITB-003 — Row selection

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Toggle a row checkbox|Checked state spoken; the row is exposed as selected if the design system uses `aria-selected`|Fail if selection is visual only|
|2|Toggle "Select all"|All rows selected; mixed state when partial|Fail if state wrong|
|3|A selection count is shown|Announced or reachable|Minor if silent|

### TEST-ITB-004 — Inline editing

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Return on an Email cell|An edit field with its name (column and row) is spoken|Fail if the field has no name|
|2|Type, press Return|New value spoken on the cell|Fail if stale|
|3|Edit, press Escape|Old value restored and spoken|Fail if not|

### TEST-ITB-005 — Cell error

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Enter "ada@" and commit|Error announced; cell spoken as invalid with its message|Fail if visual only|

## 4. VoiceOver tests on iOS

### TEST-ITB-101 — Cells, selection, editing

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe through cells|Values with header context|Fail if headers never available|
|2|Double tap a row checkbox|State spoken|Fail if not|
|3|Double tap an Email cell|Edit field opens with a name; keyboard appears|Fail if editing is unreachable without arrow keys|
|4|Commit with the keyboard's return key; cancel through a visible control|Works; value spoken|Fail if cancel needs Escape only|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Cell navigation|Arrows (grid), `VO` + arrows (table)|Swipes|
|Cancel edit|Escape|Visible control needed|

## 5. Expected results

|Scenario|Accessible name|Role|State or value|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Grid|"Team"|Grid|Size|—|One Tab stop|Cell|—|
|Cell|Value|Grid cell|Selected, invalid|Row by row|Arrows, Return, Escape|Roving|Headers on change|
|Editor|Column + row|Text field|Value|Inside the cell|Typing, Return, Escape|In the field|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Cell|"Email, ada@example.com, row 2 of 5"|
|iOS|Selection|"Select Ada Lovelace, checkbox, checked"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Structure and headers|WCAG 1.3.1 (A)|Normative|002, 101|
|Keyboard; no trap|WCAG 2.1.1 (A), 2.1.2 (A)|Normative|001, 004|
|Names, states, values|WCAG 4.1.2 (A)|Normative|003, 004, 101|
|Error identified|WCAG 3.3.1 (A)|Normative|005|
|Grid keys, distinct edit mode|Keyboard Interactions §15; [APG Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)|Best practice|001, 004|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Arrows move cells while editing|Text editing impossible|No edit mode|Separate navigation and edit modes|
|Selection visual only|Unknown selection|Highlight only|Checkbox state, `aria-selected`|
|Focus lost after commit|Restart from top|Row re-rendered|Restore focus to the cell|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard contract and edit mode|001|Not tested|Not applicable||
|Headers while moving|002, 101|Not tested|Not tested||
|Row selection|003, 101|Not tested|Not tested||
|Inline editing|004, 101|Not tested|Not tested||
|Cell error|005|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Data Table](../content/table.md) · [Keyboard Interactions §15](../../../04-interaction-quality/keyboard-interactions.md) · [Checkbox](../forms/checkbox.md)
