---
id: CMP-OVR-002
title: Dialog
family: overlays
platforms: [macos, ios]
status: specification
reference: true
---

# Dialog

Reference specification for overlays. It covers modal dialogs, alert dialogs and non-modal dialogs. [Modal Dialog](modal.md) overlaps with it and is to be merged into this specification.

Every step separates three things: the **tester action**, the **expected behavior**, and the **validation criterion** that decides Pass or Fail. Spoken examples are illustrative: wording, word order and punctuation vary with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** show content or ask for a decision in a layer above the page. A modal dialog blocks the rest of the page until it is closed; a non-modal dialog leaves the page usable.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Modal dialog|Focus enters, stays inside, returns to the trigger; the page behind is unreachable|001–005, 101–104|
|Alert dialog (confirmation, destructive action)|Message is read; initial focus is on the safe action; Escape follows the documented contract|006, 106|
|Dialog containing a form with an error|Error is announced; focus stays in the dialog|007|
|Nested dialog|Only the top dialog is active; closing returns to the parent|008|
|Non-modal dialog|Page stays reachable; the user can move between page and dialog|009|
|Long, scrollable content|All content reachable; the page behind does not scroll|105|
|Trigger removed by the action|Focus goes to a logical fallback|010|

Mark a variant the design system does not support as **Not applicable**, with the reason.

### Main accessibility risks

- Focus stays on the page behind when the dialog opens: the user does not know it exists.
- The VoiceOver cursor, or touch exploration, reaches the page behind a modal dialog.
- No accessible name: only "dialog" is spoken.
- No keyboard or gesture way to close: a trap.
- Focus lost on close: the user is sent to the top of the page.
- Initial focus on the destructive action of an alert dialog.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-DLG-001|macOS|Keyboard contract without VoiceOver|Critical|WCAG 2.1.1, 2.1.2, 2.4.3|
|TEST-DLG-002|macOS|Opening: name, role, focus placement|Critical|WCAG 4.1.2, 2.4.3|
|TEST-DLG-003|macOS|Reading order inside the dialog|High|WCAG 1.3.2|
|TEST-DLG-004|macOS|Page behind is unreachable|Critical|APG, A11Y-33|
|TEST-DLG-005|macOS|Closing and focus restoration|Critical|WCAG 2.4.3, 2.1.2|
|TEST-DLG-006|macOS|Alert dialog|High|WCAG 4.1.2, APG|
|TEST-DLG-007|macOS|Form error inside the dialog|High|WCAG 3.3.1, 4.1.3|
|TEST-DLG-008|macOS|Nested dialog|Medium|WCAG 2.4.3|
|TEST-DLG-009|macOS|Non-modal dialog|Medium|WCAG 2.4.3|
|TEST-DLG-010|macOS|Trigger removed by the action|Medium|WCAG 2.4.3|
|TEST-DLG-101|iOS|Opening and VoiceOver focus|Critical|WCAG 4.1.2, 2.4.3|
|TEST-DLG-102|iOS|Swiping stays inside the dialog|Critical|APG, A11Y-33|
|TEST-DLG-103|iOS|Touch exploration of the page behind|Critical|APG, A11Y-33|
|TEST-DLG-104|iOS|Closing and focus restoration|Critical|WCAG 2.4.3|
|TEST-DLG-105|iOS|Long content and scrolling|Medium|WCAG 1.3.2|
|TEST-DLG-106|iOS|Alert dialog|High|WCAG 4.1.2, APG|
|TEST-DLG-107|iOS|Two-finger scrub|Medium|AT behavior|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-DLG-001, enable **System Settings › Keyboard › Keyboard navigation**, and in Safari enable **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

A stable demo page containing:

1. Page content before and after the triggers: a heading, a paragraph, a link and a button, so that leaking out of the dialog is easy to hear.
2. A trigger "Edit profile" opening a modal dialog with a title, a description, two text fields (one required), a "Cancel" button, a "Save" button and a close button with an icon.
3. A trigger "Delete project" opening an alert dialog with a title, a message, "Cancel" and "Delete".
4. A trigger, inside the first dialog, opening a nested dialog, if supported.
5. A trigger opening a non-modal dialog, if supported.
6. A dialog whose content is taller than the screen.
7. A list item with a "Remove" button that opens a confirmation and removes the item, and therefore its own trigger.

### Initial state

All dialogs closed, page scrolled to the top, VoiceOver cursor and keyboard focus at the start of the page.

## 3. VoiceOver tests on macOS

`VO` is the VoiceOver modifier, Control-Option by default. See [macOS commands](../../02-voiceover/macos/voiceover-commands.md).

### TEST-DLG-001 — Keyboard contract without VoiceOver

VoiceOver is **off**. This test checks the contract in [Keyboard Interactions §10](../../../04-interaction-quality/keyboard-interactions.md).

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Tab to "Edit profile" and press Return|The dialog opens; focus is inside it, on a visible element|Fail if focus stays on the trigger or on the page|
|2|Press Tab repeatedly|Focus moves through the dialog's controls and returns to the first after the last|Fail if focus reaches the page behind or the browser toolbar|
|3|Press Shift-Tab from the first control|Focus goes to the last control of the dialog|Fail if focus leaves the dialog|
|4|Press Escape|The dialog closes|Fail if it does not close and the dialog is documented as dismissible|
|5|Check focus|Focus is on "Edit profile", visible|Fail if focus is at the top of the page or invisible|

### TEST-DLG-002 — Opening: name, role, focus placement

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Turn VoiceOver on (Command-F5). `VO + Right Arrow` to "Edit profile"|Spoken as a button|Setup only|
|2|Press `VO + Space`|The dialog opens; VoiceOver speaks its name and role, e.g. "Edit profile, dialog", possibly followed by its description or by the focused control|Fail if no dialog name or role is spoken|
|3|Listen to what is spoken next|The focused element inside the dialog: the first field, or a static introduction for long content|Fail if VoiceOver keeps reading the page behind|
|4|Compare the spoken name with the visible title|Same words|Fail if the name is missing, generic or different|

### TEST-DLG-003 — Reading order inside the dialog

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Press `VO + Right Arrow` from the first item of the dialog to the last|Title, description, fields with their labels, then buttons, in visual order|Fail if a visible element is skipped or read out of order|
|2|Press `VO + A` from the title|The whole dialog is read, then reading stops or continues inside the dialog only|Fail if reading continues into the page behind|
|3|For each field, check that its label is spoken with it|"First name, edit text" or similar|Fail if a field is spoken without its label|

### TEST-DLG-004 — Page behind is unreachable

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` past the last element of the dialog|VoiceOver stays inside the dialog: it stops, or wraps to the first element|Fail if the page's heading, link or button is spoken|
|2|`VO + Left Arrow` past the first element|Same|Fail if page content is spoken|
|3|Press `VO + U` and browse the **Headings**, **Links** and **Form Controls** lists|Only the dialog's content is listed|Fail if items of the page behind are listed|
|4|Press Escape to close the rotor|—|—|

A modal dialog that leaks to the VoiceOver cursor but traps the keyboard is still a Fail: the VoiceOver user can act on content that the sighted user cannot reach.

### TEST-DLG-005 — Closing and focus restoration

Run each row from a freshly opened dialog.

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Press Escape|The dialog closes; VoiceOver speaks "Edit profile, button" or the trigger's name|Fail if VoiceOver goes silent, speaks the page title or starts at the top|
|2|`VO + Right Arrow` to the icon close button|Spoken with a name, e.g. "Close, button"|Fail if only "button" is spoken|
|3|Press `VO + Space` on it|Closes; focus returns to the trigger|Fail if focus is lost|
|4|Press `VO + Space` on "Cancel"|Same|Fail if focus is lost|
|5|Fill the fields and press `VO + Space` on "Save"|Closes; focus returns to the trigger, or to the updated content if documented; the result is announced or reachable|Fail if focus is lost or the result is silent and far away|
|6|After closing, press `VO + Right Arrow`|The item after the trigger is spoken|Fail if the order of the page changed|

### TEST-DLG-006 — Alert dialog

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Space` on "Delete project"|Name and role are spoken; the role may be spoken as an alert or a dialog; the message is read|Fail if the message is not read and is not the next item|
|2|Listen to the focused element|The safe action, e.g. "Cancel, button"|Fail if focus starts on "Delete"|
|3|Press Escape|The behavior matches the design system's documented contract: close and return to the trigger, or stay open|Fail if the behavior differs from the documentation, or if nothing is documented|
|4|Press `VO + Space` on "Cancel"|Closes; focus returns to "Delete project"|Fail if focus is lost|

### TEST-DLG-007 — Form error inside the dialog

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Open "Edit profile", leave the required field empty, press `VO + Space` on "Save"|The dialog stays open; the error is announced, or focus moves to the invalid field|Fail if nothing is spoken and focus stays on "Save" with no indication|
|2|`VO + Right Arrow` to the invalid field|Label, invalid state and error text are spoken|Fail if the error text is not tied to the field (WCAG 3.3.1)|
|3|Check that focus is still in the dialog|Yes|Fail if focus went to the page behind|

### TEST-DLG-008 — Nested dialog

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|From the first dialog, open the nested one|The nested dialog's name and role are spoken; focus is inside it|Fail if the parent dialog stays reachable with the VoiceOver cursor|
|2|Press Escape once|Only the nested dialog closes; focus returns to its trigger in the parent|Fail if both close or focus is lost|
|3|Press Escape again|The parent closes; focus returns to "Edit profile"|Fail if focus is lost|

### TEST-DLG-009 — Non-modal dialog

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Open the non-modal dialog|Name and role are spoken; focus moves into it, or the design system documents why it does not|Fail if the dialog appears silently and cannot be found|
|2|`VO + Right Arrow` past its last item|The page content is reachable; this is intended|Not a Fail for this variant|
|3|Return to the dialog with the VoiceOver cursor or Tab|Possible in a predictable place in the order|Fail if the dialog can no longer be reached|
|4|Close it|Focus returns to the trigger|Fail if focus is lost|

### TEST-DLG-010 — Trigger removed by the action

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Space` on "Remove" in the list, then confirm|The item disappears; focus goes to a logical element: next item, previous item or list heading|Fail if focus goes to the top of the page or nowhere|
|2|Listen|The removal is announced, or the new focused element makes it obvious|Minor if the removal is silent but focus is correct|

## 4. VoiceOver tests on iOS

See [iOS gestures](../../02-voiceover/ios/gestures.md). iOS has no Tab key and usually no Escape key: the user leaves a dialog through a visible control, or through the two-finger scrub gesture when the page supports it. Touch exploration can reach any visible point of the screen, which exposes leaks that swiping does not.

### TEST-DLG-101 — Opening and VoiceOver focus

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to "Edit profile" and double tap|The dialog opens; its name and role, or its first element, are spoken|Fail if VoiceOver stays on the trigger or goes silent|
|2|Swipe right once|The next item is inside the dialog|Fail if it is page content|

### TEST-DLG-102 — Swiping stays inside the dialog

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe right through every item of the dialog|Title, description, labelled fields and buttons, in visual order|Fail if an item is skipped or out of order|
|2|Swipe right past the last item|VoiceOver stays inside the dialog (stops with a boundary sound, or wraps)|Fail if page content is spoken|
|3|Swipe left past the first item|Same|Fail if page content is spoken|

### TEST-DLG-103 — Touch exploration of the page behind

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Drag one finger over areas of the screen outside the dialog, where page content is visible behind the overlay|Nothing from the page is spoken; the overlay or nothing is announced|Fail if a page heading, link or button is spoken|
|2|If something is spoken, double tap it|Nothing happens on the page|Blocker if a page control behind the dialog is activated|

### TEST-DLG-104 — Closing and focus restoration

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to the icon close button|Spoken with a name, e.g. "Close, button"|Fail if only "button" is spoken|
|2|Double tap|The dialog closes; VoiceOver focus is on the trigger or next to it|Fail if focus goes to the top of the page|
|3|Reopen, then double tap "Cancel", then reopen and double tap "Save" with valid data|Same restoration each time|Fail if any path loses focus|

### TEST-DLG-105 — Long content and scrolling

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Open the long dialog; swipe right through all its content|The dialog scrolls automatically and every item is spoken|Fail if items below the fold are unreachable|
|2|Swipe up with three fingers inside the dialog|The dialog content scrolls; the page behind does not|Minor if the page behind scrolls; Fail if content becomes unreachable|
|3|Tap with three fingers|A position, e.g. a page number, is spoken|Observation|

### TEST-DLG-106 — Alert dialog

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap "Delete project"|Name, role and message are spoken, or the message is the next item|Fail if the message is not perceivable|
|2|Check the first focused item|Title or safe action; not "Delete"|Fail if VoiceOver focus starts on "Delete"|
|3|Double tap "Cancel"|Closes; VoiceOver focus returns to the trigger|Fail if focus is lost|

### TEST-DLG-107 — Two-finger scrub

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|In the open modal dialog, move two fingers quickly back and forth in a "Z" shape|Record what happens: the dialog closes, nothing happens, or Safari goes back in history|Observation; a visible close control reachable by swiping is the requirement|
|2|If the dialog closed, check VoiceOver focus|On the trigger or next to it|Fail if focus was lost|
|3|If Safari went back in history|The user left the page|Major: the expected exit gesture causes data loss|

Web content does not always receive this gesture. Report the observed behavior with the environment; do not require that it closes the dialog.

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Closing|Escape, close button, Cancel|Close button or Cancel; scrub depends on the implementation|
|Containment|Keyboard (TEST-DLG-001) and VoiceOver cursor (004)|Swiping (102) and touch exploration (103), tested separately|
|Leak detection|Rotor lists show leaked content|Touch exploration reaches any visible area|
|Scrolling|Moves with the VoiceOver cursor|Automatic while swiping; three-finger swipe|

## 5. Expected results

Examples are illustrative. Validate the information, not the wording.

|Scenario|Accessible name|Role|State or value|Navigation order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Modal, opening|Visible title|Dialog|Modal|Title, description, content, actions|—|Inside, first relevant element|Name and role|
|Modal, open|—|—|—|Contained in the dialog|Tab / Shift-Tab cycle, Escape, buttons|Never on the page behind|—|
|Modal, closing|—|—|—|Page order unchanged|Escape, close, Cancel, Save|Back on the trigger|Trigger name; result if any|
|Alert dialog|Visible title|Alert dialog|Modal|Title, message, actions|Documented Escape contract|Safe action or title|Name, role, message|
|Form error|Field label|Field|Invalid, with message|Unchanged|Correct and submit again|Inside the dialog|Error text|
|Nested|Nested title|Dialog|Modal|Nested dialog only|Escape closes one level|Back to the parent's trigger|Name and role|
|Non-modal|Visible title|Dialog|Not modal|Dialog and page|Movement between both|Inside on opening, if documented|Name and role|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Opening|"Edit profile, dialog"|
|macOS|Close button|"Close, button"|
|macOS|After closing|"Edit profile, button"|
|iOS|Opening|"Edit profile, dialog" or the first element|
|iOS|After closing|"Edit profile, button"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Name and role exposed|WCAG 4.1.2 Name, Role, Value (A); A11Y-30|Normative|002, 006, 101, 106|
|Operable with the keyboard|WCAG 2.1.1 Keyboard (A)|Normative|001|
|A way out with the keyboard|WCAG 2.1.2 No Keyboard Trap (A)|Normative|001, 005|
|Focus enters the dialog and returns to the trigger|WCAG 2.4.3 Focus Order (A)|Normative|001, 002, 005, 008–010, 104|
|Reading order follows the visual order|WCAG 1.3.2 Meaningful Sequence (A)|Normative|003, 102, 105|
|Labels and structure exposed|WCAG 1.3.1 Info and Relationships (A)|Normative|003, 102|
|Error identified in text|WCAG 3.3.1 Error Identification (A)|Normative|007|
|Status announced without moving focus|WCAG 4.1.3 Status Messages (AA); A11Y-31|Normative|005, 007, 010|
|Page behind hidden from assistive technology|A11Y-33; [APG Dialog (Modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)|Best practice; a leak usually also breaks 2.4.3|004, 102, 103|
|Initial focus on the safe action of an alert dialog|[APG Alert Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/); Keyboard Interactions §10.5|Best practice|006, 106|
|Portal keeps a logical relationship with its trigger|A11Y-35|Best practice|005, 104|
|Focus not hidden by the overlay|WCAG 2.4.11 Focus Not Obscured (Minimum) (AA)|Normative, checked visually, outside VoiceOver|—|
|Scrub closes the dialog|VoiceOver behavior|AT behavior, recorded as observation|107|

A Pass on this specification does not establish WCAG conformance. Contrast, motion, zoom and target size are tested elsewhere.

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Nothing is spoken on opening|The user does not know a dialog opened|Focus not moved into the dialog|Move focus to the first relevant element on opening|
|Only "dialog" is spoken|Purpose unknown|No `aria-labelledby` pointing to the title|Name the dialog from its visible title|
|Page content reachable with VoiceOver or by touch|The user acts on hidden content and gets lost|No `aria-modal`, no `inert` on the page, or a non-native overlay|Use the native modal `dialog`, or make the rest of the page `inert`|
|Focus at the top of the page after closing|The user loses their place|Trigger not stored, or re-rendered|Store the trigger and focus it again; fall back to a logical element|
|Escape does nothing|Keyboard users must find the close button|Key not handled|Handle Escape according to the documented contract|
|Focus starts on "Delete"|Accidental destruction|Focus on the first button|Focus the safe action|
|Error visible but silent|The user does not know why "Save" failed|Error not associated with the field, no live region|Associate the message with the field; announce it or move focus to the field|
|Scrub goes back in history|Data loss|Gesture not handled by the page|Provide a visible close control; handle the gesture if the platform allows it|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Never edit this specification with results: copy the table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard contract: entry, containment, Escape, restoration|001|Not tested|Not applicable||
|Name and role spoken on opening|002, 101|Not tested|Not tested||
|Focus placed inside on opening|002, 101|Not tested|Not tested||
|Reading order inside the dialog|003, 102|Not tested|Not tested||
|Page behind unreachable (cursor, rotor, swipe, touch)|004, 102, 103|Not tested|Not tested||
|Every close path restores focus|005, 104|Not tested|Not tested||
|Alert dialog: message, safe initial focus, Escape contract|006, 106|Not tested|Not tested||
|Form error announced, focus kept inside|007|Not tested|Not applicable||
|Nested dialog closes one level at a time|008|Not tested|Not applicable||
|Non-modal dialog reachable both ways|009|Not tested|Not applicable||
|Logical fallback when the trigger is removed|010|Not tested|Not applicable||
|Long content reachable, page behind does not scroll|105|Not applicable|Not tested||
|Scrub behavior recorded|107|Not applicable|Not tested||

Rows marked Not applicable on iOS are covered by the macOS tests; repeat them on iOS when the campaign requires it.

**Defects found:** list issue IDs created with the [Issue Template](../../06-templates/issue-template.md).

**Evidence:** recording or transcript of the speech, environment, date (TEST-32).

## Related guidance

[Keyboard Interactions §10](../../../04-interaction-quality/keyboard-interactions.md) · [Accessibility requirements](../../../05-technical-quality/accessibility.md) · [macOS focus](../../02-voiceover/macos/focus-management.md) · [iOS focus](../../02-voiceover/ios/focus-management.md) · [Modal Dialog](modal.md) · [Button](../actions/button.md)
