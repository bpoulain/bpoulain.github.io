---
id: CMP-FDB-002
title: Notification
family: feedback
platforms: [macos, ios]
status: specification
---

# Notification

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** a temporary message (toast) confirming or reporting the result of an action, shown away from the trigger. A persistent message in the page is an [Alert](alert.md).

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Success (polite)|Announced without moving focus|002, 101|
|Failure (urgent)|Announced promptly|003|
|With an action ("Undo")|Action reachable before it disappears|004, 102|
|Auto-dismissed after a delay|Enough time, or pause on focus|005|
|Dismissible|Close button named; focus after closing|006, 103|
|Several stacked|Each announced once, in order|007|

### Main accessibility risks

- Not announced: the region is created at the same time as the message.
- Focus stolen by the toast.
- Toast disappears before a VoiceOver user can reach its action.
- Repeated or duplicated announcements.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-NTF-001|macOS|Keyboard operation without VoiceOver|High|WCAG 2.1.1|
|TEST-NTF-002|macOS|Polite announcement|Critical|WCAG 4.1.3|
|TEST-NTF-003|macOS|Urgent announcement|High|WCAG 4.1.3|
|TEST-NTF-004|macOS|Reaching the action|High|WCAG 2.2.1, 2.1.1|
|TEST-NTF-005|macOS|Timing|High|WCAG 2.2.1|
|TEST-NTF-006|macOS|Dismissing|Medium|WCAG 4.1.2, 2.4.3|
|TEST-NTF-007|macOS|Stacked notifications|Medium|A11Y-32|
|TEST-NTF-101|iOS|Announcement|Critical|WCAG 4.1.3|
|TEST-NTF-102|iOS|Reaching the action|High|WCAG 2.2.1|
|TEST-NTF-103|iOS|Dismissing|Medium|WCAG 4.1.2|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-NTF-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level, and the notification delay.

### Test page

Buttons triggering: "Saved" (success), "Upload failed" (error), "Item deleted" with "Undo", a dismissible notification, and three notifications in quick succession. Note the documented display duration and whether hover or focus pauses it.

### Initial state

No notification visible. The notification region exists in the page before the first message.

## 3. VoiceOver tests on macOS

### TEST-NTF-001 — Keyboard operation without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Trigger "Item deleted"|Focus stays on the trigger|Fail if focus moves to the toast without reason|
|2|Reach "Undo" with the documented shortcut or with Tab|The action is reachable before the toast disappears|Fail if unreachable by keyboard|

### TEST-NTF-002 — Polite announcement

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Space` on "Save"|"Saved" is spoken after the current speech, once|Fail if not spoken (WCAG 4.1.3)|
|2|Check focus|Unchanged, on the trigger|Fail if focus moved|

### TEST-NTF-003 — Urgent announcement

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Trigger "Upload failed"|Spoken promptly, possibly interrupting|Fail if not spoken|

### TEST-NTF-004 — Reaching the action

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Trigger "Item deleted"; listen|The message and the existence of "Undo" are perceivable, or a shortcut is announced|Observation|
|2|Navigate to "Undo" with `VO + Right Arrow` or the documented shortcut|Reached before the toast disappears|Fail if it disappears first (WCAG 2.2.1)|
|3|`VO + Space` on "Undo"|The action runs; result announced; focus goes to a logical place|Fail if focus is lost|

### TEST-NTF-005 — Timing

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Measure the display time|Long enough to read and act, or paused while focus or the pointer is on the toast, or persistent until dismissed for toasts with actions|Fail if a toast with an action disappears without a way to extend or retrieve it|

### TEST-NTF-006 — Dismissing

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Reach the close button|Named, e.g. "Dismiss, button"|Fail if only "button"|
|2|`VO + Space`|Closed; focus goes back to where it was, or to a logical place|Fail if lost|

### TEST-NTF-007 — Stacked notifications

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Trigger three in quick succession|Each spoken once, in order, without one cutting off all the others|Minor if repeated or lost|

## 4. VoiceOver tests on iOS

### TEST-NTF-101 — Announcement

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap "Save"|"Saved" spoken; VoiceOver focus unchanged|Fail if silent or focus moved|

### TEST-NTF-102 — Reaching the action

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Trigger "Item deleted"; touch the toast or swipe to it|"Undo" is reached before the toast disappears|Fail if impossible|
|2|Double tap "Undo"|Action runs; result announced|Fail if silent|

### TEST-NTF-103 — Dismissing

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Reach and double tap the close button|Named; closed; VoiceOver focus does not jump to the top|Fail if unnamed or focus lost|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Reaching the toast|Keyboard shortcut or VoiceOver navigation|Touch exploration is the fastest way; swiping may be long|

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Success|—|Status|—|Region present from page load|—|Unchanged|Message, polite|
|Error|—|Alert|—|Same|—|Unchanged|Message, assertive|
|With action|Action label|Button|—|Inside the toast|Return, Space, double tap|Logical after action|Result|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Success|"Saved"|
|iOS|Action|"Undo, button"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Status messages announced without focus|WCAG 4.1.3 (AA); A11Y-31|Normative|002, 003, 101|
|Enough time to act|WCAG 2.2.1 Timing Adjustable (A)|Normative|004, 005, 102|
|Action keyboard operable|WCAG 2.1.1 (A)|Normative|001, 004|
|Close button named|WCAG 4.1.2 (A)|Normative|006, 103|
|Focus after action or dismissal|WCAG 2.4.3 (A)|Normative|004, 006|
|No repeated announcements|A11Y-32|Best practice|007|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Not announced|The user does not know the result|Live region inserted with the message|Render the region at load; insert the text later|
|Focus jumps to toast|Context lost|`focus()` on display|Do not move focus|
|Undo unreachable|Data loss|Short timeout|Pause on focus, extend, or keep until dismissed|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Focus not stolen; action keyboard-reachable|001|Not tested|Not applicable||
|Announced politely or urgently|002, 003, 101|Not tested|Not tested||
|Action reachable in time|004, 005, 102|Not tested|Not tested||
|Dismiss button named, focus logical|006, 103|Not tested|Not tested||
|Stacked messages manageable|007|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Alert](alert.md) · [Loading State](loading.md) · [Error Message](error-message.md)
