---
id: CMP-FDB-005
title: Loading State
family: feedback
platforms: [macos, ios]
status: specification
---

# Loading State

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** show that content is loading: spinner, skeleton placeholders, a region updating. A button in loading state is tested in [Button](../actions/button.md) TEST-BTN-008.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Spinner with a label|Status perceivable|002, 101|
|Skeleton placeholders|Not read as content|003, 102|
|Region loading (busy)|Content not read half-loaded; completion perceivable|004|
|Completed|New content perceivable; focus kept|004, 103|
|Failed|Error announced; retry reachable|005|

### Main accessibility risks

- Silent loading: the user thinks nothing happens.
- Skeleton shapes read as empty items, or the spinner read as an image.
- Focus lost when the content replaces the loader.
- Failure shown only visually.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-LOD-001|macOS|Keyboard and focus during loading|High|WCAG 2.4.3|
|TEST-LOD-002|macOS|Loading status|High|WCAG 4.1.3|
|TEST-LOD-003|macOS|Skeletons hidden|Medium|A11Y-33|
|TEST-LOD-004|macOS|Completion|High|WCAG 4.1.3, 2.4.3|
|TEST-LOD-005|macOS|Failure|High|WCAG 4.1.3|
|TEST-LOD-101|iOS|Loading status|High|WCAG 4.1.3|
|TEST-LOD-102|iOS|Skeletons hidden|Medium|A11Y-33|
|TEST-LOD-103|iOS|Completion and focus|High|WCAG 2.4.3|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-LOD-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

A "Load orders" button filling a list after about 3 seconds, with skeleton rows while loading; a variant that fails with a "Retry" button.

### Initial state

List empty.

## 3. VoiceOver tests on macOS

### TEST-LOD-001 — Keyboard and focus during loading

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Press Return on "Load orders"|Focus stays on the button or a documented element|Fail if focus is lost to the page body|
|2|Press Tab during loading|Skeletons are not focusable|Fail if they take focus|

### TEST-LOD-002 — Loading status

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Space` on "Load orders"; listen|"Loading orders" or similar is spoken, or reachable as the next item|Fail if nothing is perceivable|
|2|`VO + Right Arrow` to the spinner|Spoken with a name, not as an unlabeled image|Fail if "image" alone|

### TEST-LOD-003 — Skeletons hidden

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` through the loading list|Skeletons not read, or the region is read as busy|Fail if empty items or "group" stops are read for each skeleton|

### TEST-LOD-004 — Completion

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Wait without moving|Completion announced, e.g. "12 orders loaded"|Fail if silent|
|2|`VO + Right Arrow`|The loaded content follows, in order|Fail if the cursor was reset to the top|

### TEST-LOD-005 — Failure

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Trigger the failing variant|Error announced|Fail if silent|
|2|Reach "Retry"|Named button next to the message|Fail if unreachable|

## 4. VoiceOver tests on iOS

### TEST-LOD-101 — Loading status

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap "Load orders"|Loading spoken or reachable|Fail if not|

### TEST-LOD-102 — Skeletons hidden

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Touch the skeleton area during loading|Nothing read, or a single busy status|Fail if each skeleton is a stop|

### TEST-LOD-103 — Completion and focus

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Wait for completion; swipe right|Completion announced; loaded content follows; VoiceOver focus did not jump|Fail if focus jumped to the top|

### Differences from macOS

No specific difference beyond navigation gestures.

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Loading|"Loading orders"|Status|Busy|Where content will appear|None|Unchanged|Loading|
|Skeleton|—|Hidden|—|—|None|Not focusable|—|
|Completed|Content|Content roles|—|Same place|Normal|Unchanged|Completion|
|Failed|Message|Alert|—|Same place|Retry|Unchanged|Error|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Loading|"Loading orders"|
|iOS|Completed|"12 orders loaded"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Status messages|WCAG 4.1.3 (AA); A11Y-31|Normative|002, 004, 005, 101, 103|
|Focus order preserved|WCAG 2.4.3 (A)|Normative|001, 004, 103|
|Spinner name if exposed|WCAG 1.1.1 (A)|Normative|002|
|Placeholders hidden from AT|A11Y-33|Best practice|003, 102|
|No repeated announcements|A11Y-32|Best practice|002|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Silent loading|User repeats the action|No status|Polite status message|
|Skeletons read|Noise|Visible placeholders exposed|`aria-hidden="true"` on skeletons; `aria-busy` on the region|
|Focus reset|Context lost|Container replaced|Update content inside a stable container|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Focus kept; skeletons not focusable|001|Not tested|Not applicable||
|Loading perceivable|002, 101|Not tested|Not tested||
|Skeletons hidden|003, 102|Not tested|Not tested||
|Completion announced, focus kept|004, 103|Not tested|Not tested||
|Failure announced, retry reachable|005|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Progress Indicator](progress.md) · [Button](../actions/button.md) · [Notification](notification.md)
