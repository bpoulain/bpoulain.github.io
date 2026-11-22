---
id: CMP-FRM-001
title: Text Input
family: forms
platforms: [macos, ios]
status: specification
---

# Text Input

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** let the user type a single line of text. Multiline fields follow the same tests, with the textarea differences in TEST-TXT-008.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Empty, with a visible label|Name from the label, not from the placeholder|002, 101|
|Filled|Value spoken|002, 003, 102|
|With help text|Help text spoken with the field|004, 103|
|Required|Required state exposed|005, 103|
|Invalid, with error message|Invalid state and message tied to the field|006, 104|
|Disabled, read-only|States exposed, distinct from each other|007, 105|
|Password, with show/hide button|Value not spoken; toggle button named|003, 102|
|Multiline (textarea)|Return inserts a line|008|

### Main accessibility risks

- Placeholder used as the only label: it disappears when typing and is often not a reliable name.
- Label not associated with the field.
- Help and error text visible but not tied to the field.
- Required shown only by an asterisk or a color.
- Custom autocompletion that interferes with typing.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-TXT-001|macOS|Keyboard operation without VoiceOver|Critical|WCAG 2.1.1, 2.4.7|
|TEST-TXT-002|macOS|Name, role and value|Critical|WCAG 4.1.2, 1.3.1|
|TEST-TXT-003|macOS|Typing and editing feedback|Critical|WCAG 2.1.1|
|TEST-TXT-004|macOS|Help text|High|WCAG 1.3.1, 3.3.2|
|TEST-TXT-005|macOS|Required state|High|WCAG 3.3.2, 1.3.1|
|TEST-TXT-006|macOS|Invalid state and error|Critical|WCAG 3.3.1, 4.1.2|
|TEST-TXT-007|macOS|Disabled and read-only|Medium|WCAG 4.1.2|
|TEST-TXT-008|macOS|Multiline field|Medium|WCAG 2.1.1|
|TEST-TXT-009|macOS|Visible label included in the name|High|WCAG 2.5.3|
|TEST-TXT-101|iOS|Discovery and name|Critical|WCAG 4.1.2|
|TEST-TXT-102|iOS|Editing with the on-screen keyboard|Critical|WCAG 2.1.1|
|TEST-TXT-103|iOS|Help text and required state|High|WCAG 3.3.2|
|TEST-TXT-104|iOS|Error|Critical|WCAG 3.3.1|
|TEST-TXT-105|iOS|Disabled and read-only|Medium|WCAG 4.1.2|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-TXT-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md). Note the keyboard typing feedback setting.
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

1. A form heading.
2. "First name": empty, with a visible label and a placeholder different from the label.
3. "Email": required, with help text "We never share it", and an error shown after submission when the value is invalid.
4. "Password": with a show/hide button.
5. "Customer ID": read-only, filled. "Company": disabled.
6. "Message": multiline.
7. A submit button.

### Initial state

All fields empty except the read-only one; no error shown.

## 3. VoiceOver tests on macOS

`VO` is Control-Option by default. Contract: [Keyboard Interactions §5.1–5.2](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-TXT-001 — Keyboard operation without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab through the form|Each editable field receives focus with a visible indicator; the disabled field is skipped; the read-only field is reachable|Fail if an editable field is skipped or focus is invisible|
|2|Type text, then use Left/Right Arrow, Command-A, Backspace|Native editing works|Fail if a key is intercepted|
|3|Press Return in a single-line field|Submits only if the form documents it|Fail if Return triggers an undocumented action|

### TEST-TXT-002 — Name, role and value

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` to "First name"|Label and role, e.g. "First name, edit text"|Fail if only the placeholder or nothing is spoken as the name|
|2|Check whether the label is also spoken as a separate item before the field|Acceptable; the field itself must carry the name|Fail only if the field has no name|
|3|Type "Ada", then move away and back|The value "Ada" is spoken with the name|Fail if the value is not spoken|

### TEST-TXT-003 — Typing and editing feedback

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|With the field focused, type a word|Characters or words are echoed according to the VoiceOver settings|Observation|
|2|Use Left Arrow|The character crossed is spoken|Fail if the cursor moves silently because of a custom widget|
|3|In "Password", type|Characters are not spoken in clear; VoiceOver may say a generic sound or "bullet"|Fail if the password is spoken|
|4|`VO + Space` on the show/hide button|Name and state, e.g. "Show password, button", change after activation|Fail if the button has no name or the state is not updated|

### TEST-TXT-004 — Help text

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to "Email"|Name, role, then the help text, possibly after a pause|Fail if the help text is only reachable as separate text and not tied to the field, when it is needed to fill the field|

### TEST-TXT-005 — Required state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to "Email"|"required" is spoken|Fail if required is shown only by an asterisk or a color|

### TEST-TXT-006 — Invalid state and error

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Type "ada@" in Email and submit|The error is announced, or focus moves to the field or to an error summary|Fail if nothing is announced and focus stays on the button|
|2|`VO + Right Arrow` to Email|Name, value, invalid state (e.g. "invalid data") and error text|Fail if the error text is not tied to the field|
|3|Correct the value and submit|The error disappears; the invalid state is no longer spoken|Fail if the field is still spoken as invalid|

See also [Error Message](../feedback/error-message.md).

### TEST-TXT-007 — Disabled and read-only

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to "Company"|Disabled state, e.g. "dimmed"|Fail if no state is spoken|
|2|`VO + Right Arrow` to "Customer ID"|Value and a read-only state|Fail if it is spoken as editable or disabled|

### TEST-TXT-008 — Multiline field

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Focus "Message", type two lines with Return|Return inserts a line, without submitting|Fail if Return submits|
|2|Press Tab|Focus moves to the next control, without inserting a tab|Fail if focus is trapped|
|3|Listen to the role|A multiline edit role|Observation|

### TEST-TXT-009 — Visible label included in the name

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Compare the spoken name of each field with its visible label|The name contains the label|Fail if absent (WCAG 2.5.3)|

## 4. VoiceOver tests on iOS

See [iOS gestures](../../02-voiceover/ios/gestures.md).

### TEST-TXT-101 — Discovery and name

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe right to "First name"|Label and a text field role, e.g. "First name, text field"|Fail if the placeholder is the only name|
|2|Touch the field directly|Same announcement|Fail if the label and the field are announced as unrelated items only|

### TEST-TXT-102 — Editing with the on-screen keyboard

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap the field|The keyboard appears; VoiceOver says the field is editing|Fail if the keyboard does not appear|
|2|Type letters by touching keys and lifting the finger|Characters are entered and echoed|Observation|
|3|Swipe up or down with the **Characters** rotor|The insertion point moves|Observation|
|4|In "Password", type|Characters are not spoken in clear|Fail if the password is spoken|
|5|Dismiss the keyboard, swipe to the next item|The next field or text, in visual order|Fail if the order jumps|

### TEST-TXT-103 — Help text and required state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to "Email" and wait|Required state and help text are spoken, possibly as a hint after a pause|Fail if either is missing and not tied to the field|

### TEST-TXT-104 — Error

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Submit with an invalid email|The error is announced or VoiceOver focus moves to it|Fail if nothing perceivable happens|
|2|Swipe to the field|Invalid state and error text|Fail if not tied to the field|

### TEST-TXT-105 — Disabled and read-only

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to "Company", double tap|Disabled state spoken; no keyboard|Fail if editable|
|2|Swipe to "Customer ID", double tap|Value spoken; no editing possible|Fail if editable or spoken as disabled|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Entering edit mode|Focus is enough|Double tap opens the keyboard|
|Cursor movement|Arrow keys|Rotor **Characters** or **Words**, swipe up/down|
|Help text|Often spoken after a pause|Spoken as a hint if hints are on; record the setting|

## 5. Expected results

|Scenario|Accessible name|Role|State or value|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Empty field|Visible label|Text field|Empty|Visual order|Typing, editing keys|Stays on the field|—|
|Required with help|Label|Text field|Required; help as description|Same|Same|Same|—|
|Invalid|Label|Text field|Invalid; error as description|Same|Correct and resubmit|Field or summary|Error on submission|
|Disabled|Label|Text field|Disabled|Skipped by Tab|None|—|—|
|Read-only|Label|Text field|Read-only; value|Reached by Tab|Read, copy|—|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Empty field|"First name, edit text"|
|macOS|Invalid required field|"Email, ada@, invalid data, required, edit text, Enter a valid email"|
|iOS|Empty field|"First name, text field, double tap to edit"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Name, role, value, state|WCAG 4.1.2 (A); A11Y-30|Normative|002, 007, 101, 105|
|Label and help associated|WCAG 1.3.1 (A)|Normative|002, 004|
|Labels or instructions provided|WCAG 3.3.2 (A)|Normative|004, 005, 103|
|Error identified in text|WCAG 3.3.1 (A)|Normative|006, 104|
|Visible label in the name|WCAG 2.5.3 (A)|Normative|009|
|Keyboard operation, visible focus|WCAG 2.1.1 (A), 2.4.7 (AA)|Normative|001, 003, 008|
|Input purpose for personal data (`autocomplete`)|WCAG 1.3.5 (AA)|Normative, checked in the markup, not with VoiceOver|—|
|Native editing preserved|Keyboard Interactions §5.1|Best practice|001, 003|
|Speaking of help as a hint|VoiceOver behavior|AT behavior|103|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Name is the placeholder, or nothing|The user does not know what to type|No `label` associated|Associate a visible `label`|
|Help text read elsewhere|Instructions missed|Not referenced by the field|`aria-describedby` to the help text|
|Required only by asterisk|Submission fails unexpectedly|Visual marker only|`required` or `aria-required`, and text|
|Error not spoken|The user does not know what failed|No association, no announcement|Associate the error; move focus or announce on submission|
|Password spoken|Disclosure|Custom masking|Native `type="password"`|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard operation and native editing|001, 003|Not tested|Not applicable||
|Name from the visible label, role, value|002, 101|Not tested|Not tested||
|Editing feedback, password not spoken|003, 102|Not tested|Not tested||
|Help text tied to the field|004, 103|Not tested|Not tested||
|Required state exposed|005, 103|Not tested|Not tested||
|Error announced and tied to the field|006, 104|Not tested|Not tested||
|Disabled and read-only distinct|007, 105|Not tested|Not tested||
|Multiline behavior|008|Not tested|Not applicable||
|Visible label in the name|009|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Keyboard Interactions §5](../../../04-interaction-quality/keyboard-interactions.md) · [Error Message](../feedback/error-message.md) · [Search Field](search.md)
