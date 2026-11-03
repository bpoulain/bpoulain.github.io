---
id: CMP-FDB-003
title: Error Message
family: feedback
platforms: [macos, ios]
status: specification
---

# Error Message

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** tell the user that an input is wrong, where, and how to fix it. This specification tests the message and its link to the field; the field itself is tested with [Text Input](../forms/text-input.md), [Checkbox](../forms/checkbox.md) and the other form specifications.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Inline error under a field|Tied to the field; invalid state|002, 101|
|Error summary at the top of the form|Announced or focused; links lead to fields|003, 102|
|Error shown on blur (live validation)|Announced without disrupting typing|004|
|Error resolved|Message and invalid state removed|005, 103|
|Error with a suggestion|Suggestion included in the text|002|

### Main accessibility risks

- Error shown in red text only, not tied to the field.
- Error visible but not announced on submission.
- Summary links that move the page but not the focus.
- Live validation that interrupts after every keystroke.
- Invalid state left after correction.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-ERR-001|macOS|Submission feedback|Critical|WCAG 3.3.1, 4.1.3|
|TEST-ERR-002|macOS|Inline error tied to the field|Critical|WCAG 3.3.1, 1.3.1|
|TEST-ERR-003|macOS|Error summary|High|WCAG 3.3.1, 2.4.3|
|TEST-ERR-004|macOS|Live validation|Medium|WCAG 4.1.3|
|TEST-ERR-005|macOS|Resolution|High|WCAG 4.1.2|
|TEST-ERR-006|macOS|Suggestion|Medium|WCAG 3.3.3|
|TEST-ERR-101|iOS|Inline error|Critical|WCAG 3.3.1|
|TEST-ERR-102|iOS|Error summary|High|WCAG 3.3.1|
|TEST-ERR-103|iOS|Resolution|High|WCAG 4.1.2|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md).
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

A form with: "Email" (required, format checked), "Date of birth" (format DD/MM/YYYY), "Terms" checkbox (required), a submit button, and an error summary shown on submission, if the design system offers one. Optionally a field validated on blur.

### Initial state

Fields empty, no error displayed.

## 3. VoiceOver tests on macOS

### TEST-ERR-001 — Submission feedback

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Leave everything empty; `VO + Space` on submit|One of: focus moves to the summary, focus moves to the first invalid field, or a message is announced|Fail if nothing is spoken and focus stays on the button with no indication|
|2|Listen|The number or the list of errors is perceivable|Minor if only "error" is spoken without detail, when the detail is reachable next|

### TEST-ERR-002 — Inline error tied to the field

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to "Email"|Name, invalid state and the error text, possibly after a pause|Fail if the error text is not spoken with the field (WCAG 3.3.1, 1.3.1)|
|2|Continue with `VO + Right Arrow`|The error text may also be read as its own item; not twice in a confusing way|Minor if duplicated|
|3|Check the error does not rely on color|Text, possibly with an icon whose meaning is in the text|Fail if only color or an unnamed icon carries the error|

### TEST-ERR-003 — Error summary

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|After submission, listen|The summary heading or the summary is spoken first|Fail if the summary appears without focus or announcement|
|2|`VO + Right Arrow` through it|Each error is a link naming the field and the problem|Fail if the items are plain text without a way to reach the field|
|3|`VO + Space` on an error link|Keyboard focus and VoiceOver cursor move to the field|Fail if the page scrolls but focus stays on the link|

### TEST-ERR-004 — Live validation

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Type an invalid date one character at a time|No announcement after each keystroke|Minor if announced on every keystroke|
|2|Leave the field with Tab|The error is announced once, or spoken when returning to the field|Fail if the error appears silently and is not tied to the field|

### TEST-ERR-005 — Resolution

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Fix "Email", leave it, return to it|No invalid state; no error text|Fail if still spoken as invalid|
|2|Resubmit with all fields valid|Success is announced or the next page loads|Fail if silent|

### TEST-ERR-006 — Suggestion

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Listen to the date error|The text says how to fix it, e.g. "Use the format DD/MM/YYYY"|Fail if a fix is known but not given (WCAG 3.3.3), unless it compromises security|

## 4. VoiceOver tests on iOS

### TEST-ERR-101 — Inline error

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap submit with empty fields|Focus moves or a message is spoken|Fail if nothing perceivable|
|2|Swipe to "Email"|Invalid state and error text|Fail if not tied|

### TEST-ERR-102 — Error summary

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|After submission, swipe from the top|The summary is reached first, or VoiceOver focus is already on it|Observation|
|2|Double tap an error link|VoiceOver focus moves to the field; the next swipe reads what follows the field|Fail if focus stays on the link|

### TEST-ERR-103 — Resolution

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Fix the field, swipe away and back|No invalid state|Fail if stale|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Summary link|Moves keyboard focus and VoiceOver cursor|Moves VoiceOver focus; check the next swipe|
|Error spoken with the field|Often after a pause|As a hint if hints are on; record the setting|

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Inline|Field label|Field role|Invalid; error as description|Error near the field|Fix and resubmit|Field|On submission or blur|
|Summary|Summary heading|Heading, list of links|—|Top of the form|Links to fields|Summary on submission|Count or list|
|Resolved|Field label|Field role|Valid|—|—|—|Success on resubmission|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Inline error|"Email, invalid data, required, edit text, Enter an email like name@example.com"|
|iOS|Summary heading|"There are 3 errors, heading level 2"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Error identified and described in text|WCAG 3.3.1 Error Identification (A)|Normative|001, 002, 101|
|Error associated with the field|WCAG 1.3.1 (A)|Normative|002, 101|
|Suggestion provided|WCAG 3.3.3 Error Suggestion (AA)|Normative|006|
|Status announced without moving focus, when focus is not moved|WCAG 4.1.3 (AA); A11Y-31|Normative|001, 004|
|Invalid state accurate|WCAG 4.1.2 (A)|Normative|005, 103|
|Not by color alone|WCAG 1.4.1 (A)|Normative|002|
|Summary links move focus|WCAG 2.4.3 (A)|Normative|003, 102|
|No announcement per keystroke|A11Y-32|Best practice|004|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Error not spoken with the field|The user does not know what is wrong|No `aria-describedby` / `aria-errormessage`|Reference the message from the field|
|Nothing happens on submission|The user thinks the form was sent|No focus move, no live region|Focus the summary or the first invalid field|
|Summary link scrolls only|Focus stays at the top|Anchor to a non-focusable element|Target the field itself|
|Error stays after fixing|Confusion|`aria-invalid` not reset|Reset state with the message|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Submission gives perceivable feedback|001, 101|Not tested|Not tested||
|Error tied to the field, not by color alone|002, 101|Not tested|Not tested||
|Summary announced, links move focus|003, 102|Not tested|Not tested||
|Live validation not disruptive|004|Not tested|Not applicable||
|Resolution clears state|005, 103|Not tested|Not tested||
|Suggestion given|006|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Text Input](../forms/text-input.md) · [Alert](alert.md) · [Notification](notification.md)
