---
id: CMP-FDB-001
title: Alert
family: feedback
platforms: [macos, ios]
status: specification
---

# Alert

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** a message block in the page (info, success, warning, error), static or inserted after an event. A temporary floating message is a [Notification](notification.md); a message requiring a decision is an alert dialog, tested with [Dialog](../overlays/dialog.md).

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Present at page load|Read in order; type perceivable|002, 101|
|Inserted after an event|Announced once|003, 102|
|Info, success, warning, error|Type conveyed in text, not only by color or icon|004|
|Dismissible|Close button named; focus after closing|005, 103|

### Main accessibility risks

- Severity conveyed only by color or icon.
- `role="alert"` on content present at load: announced unexpectedly, or not at all.
- Inserted alert not announced.
- Focus lost after dismissal.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-ALT-001|macOS|Keyboard operation without VoiceOver|Medium|WCAG 2.1.1|
|TEST-ALT-002|macOS|Static alert in reading order|High|WCAG 1.3.2|
|TEST-ALT-003|macOS|Inserted alert announced|Critical|WCAG 4.1.3|
|TEST-ALT-004|macOS|Severity conveyed in text|High|WCAG 1.4.1, 1.1.1|
|TEST-ALT-005|macOS|Dismissing|Medium|WCAG 4.1.2, 2.4.3|
|TEST-ALT-101|iOS|Static alert|High|WCAG 1.3.2|
|TEST-ALT-102|iOS|Inserted alert|Critical|WCAG 4.1.3|
|TEST-ALT-103|iOS|Dismissing|Medium|WCAG 4.1.2|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-ALT-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

1. A static warning alert under the page heading.
2. A button inserting an error alert "Connection lost".
3. A dismissible info alert with a link.
4. One alert of each type.

### Initial state

Only static alerts visible.

## 3. VoiceOver tests on macOS

### TEST-ALT-001 — Keyboard operation without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab through an alert with a link and a close button|Both receive visible focus|Fail if skipped|
|2|Press Return on the close button|Alert closed; focus to a logical element|Fail if focus is lost|

### TEST-ALT-002 — Static alert in reading order

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. Reload; `VO + Right Arrow` from the page heading|The alert is read in its visual position|Fail if read elsewhere or skipped|
|2|Listen at page load|A static alert should not interrupt the page load announcement|Minor if announced as an alert on load without reason|

### TEST-ALT-003 — Inserted alert announced

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Space` on the trigger|"Connection lost" is spoken promptly, once|Fail if silent (WCAG 4.1.3)|
|2|Check focus|Unchanged|Fail if moved without reason|

### TEST-ALT-004 — Severity conveyed in text

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Read each alert|The type is in the text or the icon's name, e.g. "Warning: …"|Fail if only color or an unnamed icon conveys it|

### TEST-ALT-005 — Dismissing

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to the close button|Named, e.g. "Dismiss, button"|Fail if only "button"|
|2|`VO + Space`|Closed; VoiceOver speaks the new focused element|Fail if focus is lost|

## 4. VoiceOver tests on iOS

### TEST-ALT-101 — Static alert

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe from the heading|The alert is read in order, with its type|Fail if skipped or type missing|

### TEST-ALT-102 — Inserted alert

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap the trigger|Message spoken; VoiceOver focus unchanged|Fail if silent|

### TEST-ALT-103 — Dismissing

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to the close button, double tap|Named; closed; focus not at the top of the page|Fail if unnamed or lost|

### Differences from macOS

No specific difference beyond activation and navigation gestures.

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Static|—|None or note|—|Visual position|Links, close|—|—|
|Inserted error|—|Alert|—|Insertion point|—|Unchanged|Message, once|
|Close button|"Dismiss"|Button|—|Inside the alert|Return, Space, double tap|Logical element|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Inserted|"Error: Connection lost"|
|iOS|Close|"Dismiss, button"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Inserted message announced|WCAG 4.1.3 (AA); A11Y-31|Normative|003, 102|
|Reading order|WCAG 1.3.2 (A)|Normative|002, 101|
|Not by color alone; icon alternative|WCAG 1.4.1 (A), 1.1.1 (A)|Normative|004|
|Close button named|WCAG 4.1.2 (A)|Normative|005, 103|
|Focus after dismissal|WCAG 2.4.3 (A)|Normative|001, 005|
|`role="alert"` only for inserted urgent messages|[APG Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)|Best practice|002, 003|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Inserted alert silent|Critical information missed|Region inserted with content|Pre-render the region or use `role="alert"` on insertion|
|Type only in color|Severity missed|Color or icon only|Add a text prefix or icon label|
|Focus lost on close|Disorientation|Element removed with focus|Move focus before removal|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard reach of alert controls|001|Not tested|Not applicable||
|Static alert in order|002, 101|Not tested|Not tested||
|Inserted alert announced|003, 102|Not tested|Not tested||
|Severity in text|004|Not tested|Not tested||
|Dismiss named, focus logical|005, 103|Not tested|Not tested||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Notification](notification.md) · [Error Message](error-message.md) · [Dialog](../overlays/dialog.md)
