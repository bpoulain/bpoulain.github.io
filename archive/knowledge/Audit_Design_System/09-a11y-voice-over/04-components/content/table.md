---
id: CMP-CNT-001
title: Data Table
family: content
platforms: [macos, ios]
status: specification
---

# Data Table

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** present data in rows and columns for reading. Tables whose cells are operated as a widget (editing, cell selection) are tested with [Interactive Table](../complex/interactive-table.md). Layout grids are not tables.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Simple table with column headers|Caption, size, headers spoken while moving|002, 003, 101|
|Row headers|Row header spoken|003|
|Sortable columns|Sort control named; sort state|004|
|Empty|Empty state perceivable|005|
|Horizontally scrollable|Region reachable by keyboard; name|006|

### Main accessibility risks

- `div` grids without table semantics.
- Headers in `td` instead of `th`.
- No caption or name.
- Sort state only shown by an arrow icon.
- Scroll container not keyboard-reachable.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-TBL-001|macOS|Keyboard operation without VoiceOver|Medium|WCAG 2.1.1|
|TEST-TBL-002|macOS|Table name and size|High|WCAG 1.3.1|
|TEST-TBL-003|macOS|Cell navigation with headers|Critical|WCAG 1.3.1|
|TEST-TBL-004|macOS|Sorting|High|WCAG 4.1.2, 4.1.3|
|TEST-TBL-005|macOS|Empty table|Medium|WCAG 1.3.1|
|TEST-TBL-006|macOS|Scrollable table|Medium|WCAG 2.1.1|
|TEST-TBL-101|iOS|Table discovery and cells|Critical|WCAG 1.3.1|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-TBL-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md). Check that **Tables** or vertical navigation is available in the rotor.
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

A table "Orders" (caption) with columns Order, Date, Customer, Total; the Order column as row headers; sortable Date and Total columns; an empty variant; a narrow, horizontally scrollable variant.

### Initial state

Sorted by Date descending.

## 3. VoiceOver tests on macOS

Contract: [Keyboard Interactions §15](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-TBL-001 — Keyboard operation without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab through the table|Only interactive elements (sort buttons, links) take focus; cells do not|Fail if every cell is a Tab stop in a read-only table|

### TEST-TBL-002 — Table name and size

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Command + T`, or `VO + Right Arrow` to the table|Name and size, e.g. "Orders, table, 4 columns, 10 rows"|Fail if not spoken as a table|

### TEST-TBL-003 — Cell navigation with headers

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Shift + Down Arrow` to interact with the table; move with `VO` and arrow keys|Each cell spoken with its column header when the column changes, and its row header when the row changes|Fail if headers are never spoken (WCAG 1.3.1)|
|2|Move down a column|Value and row header|Fail if row context is missing where row headers exist|
|3|`VO + Shift + Up Arrow`|Stop interacting|Setup only|

### TEST-TBL-004 — Sorting

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Reach the "Date" header|Sort button named, sort state spoken, e.g. "Date, sorted descending"|Fail if the state is only an icon|
|2|`VO + Space` on "Total"|Sort changes; the new state is announced or spoken on re-reading|Fail if the order changes but the state is not exposed|

### TEST-TBL-005 — Empty table

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Reach the empty variant|An explicit message such as "No orders", inside or near the table|Fail if an empty table is spoken without explanation|

### TEST-TBL-006 — Scrollable table

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Without VoiceOver, Tab to the scroll container|It takes focus if it has no focusable content, and arrows scroll it|Fail if hidden columns cannot be reached by keyboard|
|2|With VoiceOver, move to a hidden column|The cell is spoken; the container scrolls|Fail if unreachable|

## 4. VoiceOver tests on iOS

### TEST-TBL-101 — Table discovery and cells

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to the table|Table name and size|Fail if not exposed as a table|
|2|Swipe through cells|Values with column header context when changing column|Fail if headers are never available|
|3|Rotor **Tables** (or vertical navigation), swipe down|Moves between rows or tables|Observation|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Moving by cell|Interact, then `VO` + arrows|Swipe cell by cell; rotor for rows|
|Header speech|Controlled by VoiceOver Utility verbosity|Spoken when context changes|

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Table|Caption|Table|Size|Visual order|Interact, arrows|—|Name and size|
|Header|Column name|Column header|Sort state|First row|Sort button|—|—|
|Cell|Value|Cell|—|Row by row|—|—|Headers on change|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Table|"Orders, table, 4 columns, 10 rows"|
|macOS|Cell|"Total, 42 euros, row 3"|
|iOS|Cell|"Customer, Ada Lovelace"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Table structure and headers|WCAG 1.3.1 (A)|Normative|002, 003, 005, 101|
|Reading order|WCAG 1.3.2 (A)|Normative|003|
|Sort state|WCAG 4.1.2 (A)|Normative|004|
|Sort change status|WCAG 4.1.3 (AA)|Normative when focus stays|004|
|Scroll region keyboard-reachable|WCAG 2.1.1 (A)|Normative|006|
|Caption, `th` with `scope`, `aria-sort`|[APG Table](https://www.w3.org/WAI/ARIA/apg/patterns/table/)|Best practice|002, 004|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Not spoken as a table|No row/column navigation|`div` layout|Native `table`|
|Headers not spoken|Values without meaning|`td` styled as headers|`th` with `scope`|
|Sort icon only|Order unknown|No `aria-sort`|Set `aria-sort` on the header|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|No needless Tab stops|001|Not tested|Not applicable||
|Table name and size|002, 101|Not tested|Not tested||
|Headers spoken while moving|003, 101|Not tested|Not tested||
|Sort state|004|Not tested|Not applicable||
|Empty state|005|Not tested|Not applicable||
|Scroll region reachable|006|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Interactive Table](../complex/interactive-table.md) · [Pagination](../navigation/pagination.md)
