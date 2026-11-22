---
id: CMP-FDB-004
title: Progress Indicator
family: feedback
platforms: [macos, ios]
status: specification
---

# Progress Indicator

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** show how far a task has progressed (upload, installation). A loading state without measurable progress is tested with [Loading State](loading.md). Multi-step forms (steppers) show position in a process: their current step must also be exposed, see TEST-PRG-005.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Determinate|Name, role, value|002, 101|
|Indeterminate|Busy without value|003|
|Updating|Updates perceivable without flooding|004|
|Complete or failed|Result announced|004, 102|
|Step indicator|Current step and total|005|

### Main accessibility risks

- No name: "progress indicator" without saying what progresses.
- Value only as a visual bar.
- Every percentage change announced.
- Completion silent.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-PRG-001|macOS|Name, role, value|Critical|WCAG 4.1.2|
|TEST-PRG-002|macOS|Value text|High|WCAG 1.3.1|
|TEST-PRG-003|macOS|Indeterminate|Medium|WCAG 4.1.2|
|TEST-PRG-004|macOS|Updates and completion|High|WCAG 4.1.3|
|TEST-PRG-005|macOS|Step indicator|Medium|WCAG 1.3.1|
|TEST-PRG-101|iOS|Name, role, value|Critical|WCAG 4.1.2|
|TEST-PRG-102|iOS|Completion|High|WCAG 4.1.3|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md).
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

"Uploading report.pdf" determinate bar that progresses over about 20 seconds then completes; an indeterminate variant; a 4-step indicator on step 2, if supported.

### Initial state

Upload not started.

## 3. VoiceOver tests on macOS

### TEST-PRG-001 — Name, role, value

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Start the upload. `VO + Right Arrow` to the bar|Name, progress role and value, e.g. "Uploading report.pdf, 40%, progress indicator"|Fail if name or value is missing|

### TEST-PRG-002 — Value text

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Compare with visible text, e.g. "4 of 10 MB"|The spoken value matches, or a meaningful value text is exposed|Minor if only a percentage is spoken while the screen shows a more useful text|

### TEST-PRG-003 — Indeterminate

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to the indeterminate bar|Name and role, no fake value|Fail if a misleading value is spoken (e.g. "0%" forever)|

### TEST-PRG-004 — Updates and completion

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Move the VoiceOver cursor elsewhere; wait|No announcement for every change; occasional milestones are acceptable|Minor if every change is announced (A11Y-32)|
|2|Wait for completion|"Upload complete" announced, or the failure|Fail if completion is silent and the bar disappears (WCAG 4.1.3)|

### TEST-PRG-005 — Step indicator

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` through the steps|Each step name, completed/current state, position, e.g. "Step 2 of 4, Shipping, current"|Fail if the current step is visual only|

## 4. VoiceOver tests on iOS

### TEST-PRG-101 — Name, role, value

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to the bar during upload|Name, role, value|Fail if missing|

### TEST-PRG-102 — Completion

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Wait on another element|Completion announced|Fail if silent|

### Differences from macOS

No specific difference; iOS may announce value changes of the focused bar automatically. Record it.

## 5. Expected results

|Scenario|Accessible name|Role|State or value|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Determinate|Task|Progress bar|Value, value text|Near the task|None|Unchanged|Completion|
|Indeterminate|Task|Progress bar|No value; busy|Same|None|Unchanged|Completion|
|Step|Step name|List item or link|Current, completed|Step order|If links|—|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Determinate|"Uploading report.pdf, 40 percent, progress indicator"|
|iOS|Complete|"Upload complete"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Name, role, value|WCAG 4.1.2 (A); A11Y-30|Normative|001, 003, 101|
|Value and steps exposed|WCAG 1.3.1 (A)|Normative|002, 005|
|Completion as status|WCAG 4.1.3 (AA); A11Y-31|Normative|004, 102|
|No flood of updates|A11Y-32|Best practice|004|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|No name|Unknown task|Bar without label|`aria-label` or `aria-labelledby`|
|Value missing|Progress unknown|Width-only bar|`role="progressbar"` with `aria-valuenow`, or native `progress`|
|Completion silent|User waits|Bar removed|Announce completion|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Name, role, value|001, 101|Not tested|Not tested||
|Value text matches screen|002|Not tested|Not applicable||
|Indeterminate honest|003|Not tested|Not applicable||
|Updates not flooding; completion announced|004, 102|Not tested|Not tested||
|Step indicator|005|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Loading State](loading.md) · [Notification](notification.md)
