---
id: CMP-FRM-007
title: Date Picker
family: forms
platforms: [macos, ios]
status: specification
---

# Date Picker

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** enter a date by typing or by choosing in a calendar. Typing must remain possible: a calendar alone is slow with a screen reader.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Text field with format hint|Name, format, value|002, 101|
|Calendar popup (dialog with a grid)|Name; grid navigation; selected and today states|003, 004, 102|
|Date out of range or unavailable|Spoken as unavailable|005|
|Invalid typed date|Error tied to the field|006|
|Disabled|State|007|
|Native `input type="date"`|System control; record behavior|103|

### Main accessibility risks

- Typing blocked: calendar is the only way.
- Format not exposed.
- Days spoken as numbers without month, weekday or state.
- Calendar opens without focus, or focus lost on close.
- Month change silent.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-DTP-001|macOS|Keyboard contract without VoiceOver|Critical|WCAG 2.1.1|
|TEST-DTP-002|macOS|Field: name, format, value|Critical|WCAG 3.3.2, 4.1.2|
|TEST-DTP-003|macOS|Opening the calendar|Critical|WCAG 4.1.2, 2.4.3|
|TEST-DTP-004|macOS|Moving through days and months|Critical|WCAG 2.1.1, 1.3.1|
|TEST-DTP-005|macOS|Unavailable dates|High|WCAG 4.1.2|
|TEST-DTP-006|macOS|Invalid typed date|High|WCAG 3.3.1, 3.3.3|
|TEST-DTP-007|macOS|Disabled|Low|WCAG 4.1.2|
|TEST-DTP-101|iOS|Field|Critical|WCAG 4.1.2|
|TEST-DTP-102|iOS|Calendar by swiping|Critical|WCAG 1.3.1, 4.1.2|
|TEST-DTP-103|iOS|Native date input|Medium|AT behavior|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-DTP-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level, and the locale (date format depends on it).

### Test page

1. "Departure date": text field with a visible format hint, a calendar button, min date today, weekends unavailable.
2. A disabled date picker.
3. A native date input, for comparison, if the design system offers it.

### Initial state

Empty; calendar closed; today's date known to the tester.

## 3. VoiceOver tests on macOS

### TEST-DTP-001 — Keyboard contract without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab to the field and type a valid date|Accepted|Fail if typing is impossible|
|2|Tab to the calendar button, press Return|The calendar opens; focus on the selected date or today|Fail if focus stays on the button or is lost|
|3|Arrows, Page Up/Page Down, Home/End|Day, week, month, start/end of week move as documented|Fail if arrows do nothing|
|4|Press Return on a day|The date is set; the calendar closes; focus on the button or the field|Fail if focus is lost|
|5|Reopen, press Escape|Closed; value unchanged; focus back|Fail if value changed or focus lost|

### TEST-DTP-002 — Field: name, format, value

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` to the field|Name and format, e.g. "Departure date, DD/MM/YYYY, edit text"|Fail if the format is only in a placeholder that disappears, or absent|
|2|Calendar button|Named, ideally with the current value, e.g. "Choose date, button"|Fail if only "button"|

### TEST-DTP-003 — Opening the calendar

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Space` on the calendar button|Dialog or calendar name and the current month spoken; focus on a day|Fail if silent|
|2|Listen to the focused day|Full date and state, e.g. "Monday 3 November 2026, today"|Fail if only "3" is spoken|

### TEST-DTP-004 — Moving through days and months

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Press Right Arrow several times|Each day spoken with its date|Fail if silent or number only|
|2|Press Page Down|The new month is spoken|Fail if the month changes silently|
|3|Use the previous/next month buttons|Named, e.g. "Next month, button"; month change announced|Fail if unnamed|
|4|`VO + Right Arrow` past the last day|VoiceOver stays in the calendar, if it is modal|Fail if the page behind is read while the modal calendar is open|

### TEST-DTP-005 — Unavailable dates

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Reach a past date or a weekend|Spoken as unavailable or dimmed|Fail if spoken as available|
|2|Try to select it|Nothing happens|Fail if selected|

### TEST-DTP-006 — Invalid typed date

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Type "31/02/2026" and leave the field or submit|Error announced or tied to the field, with the expected format|Fail if silent or without suggestion|

### TEST-DTP-007 — Disabled

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to it|Disabled; calendar button disabled|Fail if usable|

## 4. VoiceOver tests on iOS

### TEST-DTP-101 — Field

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to the field; double tap; type a date|Name and format spoken; typing accepted|Fail if typing impossible|

### TEST-DTP-102 — Calendar by swiping

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap the calendar button|The calendar is reached; month spoken|Fail if unreachable|
|2|Swipe right through days|Each day spoken as a full date with state|Fail if number only|
|3|Double tap a day|Date set; calendar closed; VoiceOver focus back near the field|Fail if lost|
|4|Touch the area outside a modal calendar|Page behind not read|Fail if read|

### TEST-DTP-103 — Native date input

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap the native input|The system picker appears; swiping up/down changes values|Observation: system behavior|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Moving in the grid|Arrows, Page Up/Down, Home/End|Swipe day by day; touch exploration|
|Native input|Segmented fields in Safari|System picker|

## 5. Expected results

|Scenario|Accessible name|Role|State or value|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Field|Label|Text field|Value; format as description|Visual order|Typing|Field|—|
|Calendar|Month and year|Dialog with grid|—|Header, grid, actions|Arrows, Page Up/Down, Return, Escape|Selected date or today|Month on change|
|Day|Full date|Button or grid cell|Selected, today, unavailable|Calendar order|Return, double tap|—|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Day|"Monday 3 November 2026, today, button"|
|iOS|Unavailable day|"Saturday 8 November 2026, dimmed"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Format given|WCAG 3.3.2 (A)|Normative|002, 101|
|Name, role, states of days and controls|WCAG 4.1.2 (A); A11Y-30|Normative|002–005, 007, 102|
|Keyboard operation|WCAG 2.1.1 (A)|Normative|001, 004|
|Grid structure (weekday headers)|WCAG 1.3.1 (A)|Normative|004, 102|
|Focus into the calendar and back|WCAG 2.4.3 (A)|Normative|001, 003, 102|
|Error and suggestion|WCAG 3.3.1 (A), 3.3.3 (AA)|Normative|006|
|Grid keys, typing allowed|[APG Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)|Best practice|001|
|Native picker|VoiceOver behavior|AT behavior|103|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Days spoken as "3"|The user does not know the month or weekday|Day name is the number only|Full date as accessible name|
|Typing blocked|Slow or impossible entry|Read-only field|Allow typing with a format hint|
|Month change silent|Lost in time|No live region|Announce the month heading|
|Focus lost on close|Restart from the top|No restoration|Return focus to the button|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Typing allowed; keyboard calendar contract|001, 101|Not tested|Not tested||
|Name and format|002, 101|Not tested|Not tested||
|Calendar opening, focus and full dates|003, 102|Not tested|Not tested||
|Month changes announced|004|Not tested|Not applicable||
|Unavailable dates|005, 102|Not tested|Not tested||
|Invalid date error|006|Not tested|Not applicable||
|Disabled|007|Not tested|Not applicable||
|Native input behavior recorded|103|Not applicable|Not tested||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Dialog](../overlays/dialog.md) · [Text Input](text-input.md) · [Error Message](../feedback/error-message.md)
