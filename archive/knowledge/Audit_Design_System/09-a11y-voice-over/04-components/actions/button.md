---
id: CMP-ACT-001
title: Button
family: actions
platforms: [macos, ios]
status: specification
reference: true
---

# Button

Reference specification. Other component specifications follow this structure.

Every step separates three things: the **tester action**, the **expected behavior**, and the **validation criterion** that decides Pass or Fail. Spoken examples are illustrative: wording, word order and punctuation vary with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** trigger an action on the current page: submit, open, save, delete, toggle. A control that navigates to another URL is a link, tested with [Link](link.md).

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Text button|Name matches the visible label|001–004, 009, 101–104|
|Icon-only button|Name exists although no text is visible|006, 106|
|Disabled, native `disabled`|State is announced; activation is impossible|005, 105|
|Disabled, `aria-disabled="true"`|Stays focusable; state is announced; activation does nothing|005, 105|
|Toggle button (pressed / not pressed)|State is announced and updated after activation|007, 107|
|Loading|Progress and completion are perceivable; focus is not lost|008, 108|

Mark a state the design system does not support as **Not applicable**, with the reason.

### Main accessibility risks

- No accessible name, mostly on icon-only buttons.
- A `div` or `span` styled as a button: no role, not reachable with Tab, not activated by Space.
- Accessible name that differs from the visible label.
- Disabled state shown only by color or opacity.
- Loading state that removes the button or its focus, or that is silent.
- Toggle state shown only visually.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-BTN-001|macOS|Keyboard operation without VoiceOver|Critical|WCAG 2.1.1, 2.4.7|
|TEST-BTN-002|macOS|Discovery, name and role|Critical|WCAG 4.1.2|
|TEST-BTN-003|macOS|Discovery through the rotor|Medium|AT behavior|
|TEST-BTN-004|macOS|Activation with VoiceOver|Critical|WCAG 2.1.1, 4.1.2|
|TEST-BTN-005|macOS|Disabled state|High|WCAG 4.1.2|
|TEST-BTN-006|macOS|Icon-only name|Critical|WCAG 1.1.1, 4.1.2|
|TEST-BTN-007|macOS|Toggle state|High|WCAG 4.1.2|
|TEST-BTN-008|macOS|Loading state|High|WCAG 4.1.3|
|TEST-BTN-009|macOS|Visible label included in the name|High|WCAG 2.5.3|
|TEST-BTN-101|iOS|Discovery by swiping|Critical|WCAG 4.1.2|
|TEST-BTN-102|iOS|Touch exploration|High|AT behavior|
|TEST-BTN-103|iOS|Discovery through the rotor|Low|AT behavior|
|TEST-BTN-104|iOS|Activation by double tap|Critical|WCAG 4.1.2|
|TEST-BTN-105|iOS|Disabled state|High|WCAG 4.1.2|
|TEST-BTN-106|iOS|Icon-only name|Critical|WCAG 1.1.1, 4.1.2|
|TEST-BTN-107|iOS|Toggle state|High|WCAG 4.1.2|
|TEST-BTN-108|iOS|Loading state|High|WCAG 4.1.3|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-BTN-001, enable **System Settings › Keyboard › Keyboard navigation**, and in Safari enable **Settings › Advanced › Press Tab to highlight each item on a webpage**. Without the Safari option, Tab skips some elements; use Option-Tab instead and record which one you used.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md). Check in the rotor settings whether **Form Controls** is available; TEST-BTN-103 depends on it.
- Record OS build, Safari version, VoiceOver language, verbosity level and whether hints are spoken.

### Test page

A stable demo page containing, in this order, with no other control between them:

1. A heading, used as a starting point.
2. A text button, for example "Save", whose action shows a visible result (a counter or a message).
3. An icon-only button, for example a trash icon meaning "Delete".
4. A disabled button with native `disabled`, and one with `aria-disabled="true"`, if supported.
5. A toggle button, for example "Bold", initially not pressed.
6. A button whose action takes at least 2 seconds and shows a loading state.
7. A text control after the buttons, used to check where focus goes.

### Initial state

Page freshly loaded, nothing pressed, no loading in progress, VoiceOver cursor and keyboard focus at the top of the page.

## 3. VoiceOver tests on macOS

`VO` is the VoiceOver modifier, Control-Option by default. See [macOS commands](../../02-voiceover/macos/voiceover-commands.md).

### TEST-BTN-001 — Keyboard operation without VoiceOver

VoiceOver is **off**. This test checks the keyboard contract in [Keyboard Interactions §4](../../../04-interaction-quality/keyboard-interactions.md).

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Press Tab from the heading until the text button|Focus reaches the button; a focus indicator is visible|Fail if the button is skipped or the focus is invisible|
|2|Press Return|The action runs once|Fail if nothing happens or the action runs twice|
|3|Press Space|The action runs once, on key release|Fail if nothing happens|
|4|Continue with Tab through every button|Order follows the visual order; native `disabled` is skipped; `aria-disabled` is reached|Fail if the order differs from the visual order|
|5|Press Shift-Tab back to the heading|Focus moves backward in reverse order, without getting stuck|Fail on any trap|

### TEST-BTN-002 — Discovery, name and role

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Turn VoiceOver on (Command-F5). Place the VoiceOver cursor on the heading|The heading is read|Setup only|
|2|Press `VO + Right Arrow` until the text button|The button's name and the role "button" are spoken, e.g. "Save, button"|Fail if the role is missing or another role is spoken (e.g. "group", "text")|
|3|Compare the spoken name with the visible label|Same words|Fail if the name is missing, generic ("button") or different|
|4|Press `VO + Left Arrow` back to the heading|Items are spoken in reverse order|Fail if items are missing or out of order|
|5|Check that the button is a single item|One stop for the whole button|Fail if the label is split into several stops or read twice|

### TEST-BTN-003 — Discovery through the rotor

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Press `VO + U`, then Left or Right Arrow until the **Form Controls** list|The list contains the page's buttons, with their names|Observation: buttons absent from the list point to a missing role|
|2|Select the text button and press Return|The VoiceOver cursor moves to the button|Observation|
|3|Press Escape|The rotor closes|—|

This test records AT behavior. A missing entry is a Fail only when TEST-BTN-002 also shows a wrong role.

### TEST-BTN-004 — Activation with VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|With the VoiceOver cursor on the text button, press `VO + Space`|The action runs once; its visible result appears|Fail if nothing happens|
|2|Listen after activation|If the action shows a message, it is announced or reachable as the next item|Fail if a critical result is visible but impossible to find|
|3|Check where focus is|The button keeps the keyboard focus, unless the action intentionally moves it (e.g. opens a dialog)|Fail if focus jumps to the top of the page or disappears|
|4|Move focus with Tab onto the button, press Return, then Space|Each key runs the action once with VoiceOver on|Fail if a key works without VoiceOver but not with it|

### TEST-BTN-005 — Disabled state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to the native disabled button|Name, role and a disabled state, e.g. "Publish, dimmed, button"|Fail if no disabled state is spoken|
|2|Press `VO + Space`|Nothing happens|Fail if the action runs|
|3|`VO + Right Arrow` to the `aria-disabled` button and press `VO + Space`|Disabled state spoken; nothing happens|Fail if the action runs|
|4|Without VoiceOver, check whether the design system explains why the button is disabled, when the reason matters|A visible, nearby explanation exists|Improvement if missing; not a WCAG failure by itself|

A native disabled button is skipped by Tab but must stay reachable with the VoiceOver cursor, so the user can discover it.

### TEST-BTN-006 — Icon-only name

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to the icon-only button|A name describing the action and the role, e.g. "Delete, button"|Fail if only "button" is spoken, or the icon file name, or a glyph|
|2|Check that the icon itself is not read separately|One stop, no extra "image"|Fail if the icon adds a separate item (A11Y-34)|
|3|Move the pointer away and check the name again, if a tooltip exists|The name does not depend on the tooltip being shown|Fail if the name exists only while the tooltip is visible|

### TEST-BTN-007 — Toggle state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to the toggle button|Name, a toggle role or the role "button", and the current state|Fail if no state is spoken|
|2|Press `VO + Space`|The state changes visually and the new state is announced or spoken on re-focus|Fail if the spoken state differs from the visible state|
|3|Press `VO + Left Arrow` then `VO + Right Arrow` to re-read|The updated state is spoken|Fail if the old state is spoken|
|4|Check the name|The name stays the same; only the state changes|Fail if the name changes with the state ("Bold" becoming "Not bold") while a pressed state is also exposed|

The exact state word varies with the OS version (for example "selected"). Assert that a state exists and matches the screen.

### TEST-BTN-008 — Loading state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Space` on the slow button|The loading state starts visually|—|
|2|Listen without moving|A status such as "Saving" is announced, or the button's state is spoken when re-read|Fail if the loading state is visible but cannot be perceived at all (A11Y-31)|
|3|Press Tab, then Shift-Tab|Focus is still on the button or on a documented element|Fail if focus was lost to the page body|
|4|Press `VO + Space` again while loading|The action does not run a second time|Fail if the action is duplicated|
|5|Wait for completion|Completion or failure is announced or reachable without searching|Fail if the result is silent and not next to the button|
|6|Count announcements|One announcement per change|Minor if the status repeats or interrupts constantly (A11Y-32)|

### TEST-BTN-009 — Visible label included in the name

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|For each button with visible text, compare the spoken name with the visible text|The spoken name contains the visible words, ideally at the start|Fail if the visible words are absent from the name (WCAG 2.5.3)|

A speech-input user says the visible words to activate the control. VoiceOver reveals the name; Voice Control is the definitive check and is outside this repository's scope.

## 4. VoiceOver tests on iOS

See [iOS gestures](../../02-voiceover/ios/gestures.md). iOS has no Tab key and no `VO + Space`: the user moves by swiping or by touch, and activates by double tap anywhere on the screen. Focus moved by VoiceOver is not the same as keyboard focus.

### TEST-BTN-101 — Discovery by swiping

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Tap the heading once|The heading is read|Setup only|
|2|Swipe right with one finger until the text button|Name and role, e.g. "Save, button"|Fail if the role is missing or the name differs from the label|
|3|Swipe left back to the heading|Same items, reverse order|Fail if items are missing or out of order|
|4|Count stops on the button|One stop|Fail if the label is split|

### TEST-BTN-102 — Touch exploration

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Drag one finger slowly across each button|Each button is spoken when the finger enters its visible area|Observation if a button is found only on part of its visible area|
|2|Lift the finger on the icon-only button|Its name is spoken|Fail if the area is silent or reads "image"|

### TEST-BTN-103 — Discovery through the rotor

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Rotate two fingers until **Form Controls**|The setting is announced|Not applicable if unavailable in rotor settings|
|2|Swipe down with one finger|VoiceOver moves to the next form control, including buttons|Observation|

### TEST-BTN-104 — Activation by double tap

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|With VoiceOver focus on the text button, double tap anywhere|The action runs once; its visible result appears|Fail if nothing happens|
|2|Swipe right once|The next item is the one after the button, or the result message if inserted right after it|Fail if VoiceOver focus jumped to the top of the page|
|3|Repeat from the icon-only button|Same result|Fail if the action needs a direct tap on the icon|

### TEST-BTN-105 — Disabled state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to each disabled button|Name, role and disabled state, e.g. "Publish, dimmed, button"|Fail if no disabled state is spoken|
|2|Double tap|Nothing happens|Fail if the action runs|

### TEST-BTN-106 — Icon-only name

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to the icon-only button|Meaningful name and role, e.g. "Delete, button"|Fail if only "button", a file name or nothing is spoken|
|2|Swipe right once|The next stop is the next control, not the icon alone|Fail on an extra "image" stop|

There is no hover on iOS: a name provided only by a tooltip is never available.

### TEST-BTN-107 — Toggle state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to the toggle button|Name and current state|Fail if no state is spoken|
|2|Double tap|The state changes and the new state is spoken|Fail if the spoken state differs from the visible state|
|3|Swipe left then right to re-read|The updated state is spoken|Fail if the old state is spoken|

### TEST-BTN-108 — Loading state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap the slow button and wait without touching the screen|A loading status is spoken, or can be found by swiping right once|Fail if the loading state is visible but cannot be perceived|
|2|Double tap again while loading|The action does not run twice|Fail if duplicated|
|3|Wait for completion, then swipe left and right|The result is spoken or reachable next to the button; VoiceOver focus has not jumped|Fail if focus jumped or the result is silent and far away|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Keyboard check|TEST-BTN-001, with Tab, Return and Space|Not covered; an external keyboard test is optional|
|Activation|`VO + Space`, or Return / Space with keyboard focus|Double tap anywhere, whichever element has VoiceOver focus|
|Tooltip-only name|Sometimes perceivable by hovering with the pointer|Never perceivable|
|Focus after activation|Keyboard focus and VoiceOver cursor are checked separately|Only VoiceOver focus is observed|

## 5. Expected results

Examples are illustrative. Validate the information, not the wording.

|Scenario|Accessible name|Role|State or value|Navigation order|Interactions|Focus after action|Announcement|
|---|---|---|---|---|---|---|---|
|Text button|Visible label|Button|—|DOM order = visual order|Return, Space, `VO + Space`, double tap|Stays on the button|Result if relevant|
|Icon-only button|Action, e.g. "Delete"|Button|—|Same|Same|Stays on the button|—|
|Disabled (native)|Visible label|Button|Disabled|Skipped by Tab, reached by VoiceOver|None|—|—|
|Disabled (`aria-disabled`)|Visible label|Button|Disabled|Reached by Tab and VoiceOver|None|—|—|
|Toggle|Stable label|Toggle or button|Pressed / not pressed|Same|Same|Stays on the button|New state|
|Loading|Visible label|Button|Busy or disabled while loading|Same|Not re-activatable|Stays on the button|Loading, then result|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Text button|"Save, button"|
|macOS|Disabled|"Publish, dimmed, button"|
|iOS|Text button|"Save, button"|
|iOS|Disabled|"Publish, dimmed, button"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Name, role and state are exposed|WCAG 4.1.2 Name, Role, Value (A); A11Y-30|Normative|002, 005–007, 101, 104–107|
|Icon-only button has a text alternative|WCAG 1.1.1 Non-text Content (A)|Normative|006, 106|
|Operable with the keyboard|WCAG 2.1.1 Keyboard (A)|Normative|001, 004|
|Focus is visible|WCAG 2.4.7 Focus Visible (AA)|Normative, checked without VoiceOver|001|
|Visible label is part of the name|WCAG 2.5.3 Label in Name (A)|Normative|009|
|Loading status is perceivable without moving focus|WCAG 4.1.3 Status Messages (AA); A11Y-31|Normative|008, 108|
|Status is not repeated excessively|A11Y-32|Best practice|008|
|Decorative icon hidden from assistive technology|A11Y-34|Best practice|006, 106|
|Use a native `button`; `aria-pressed` for toggles|[WAI-ARIA APG Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)|Best practice|002, 007|
|Buttons listed in the rotor; spoken state words|VoiceOver behavior|AT behavior, recorded as observation|003, 103|

A Pass on this specification does not establish WCAG conformance. Contrast, target size and Voice Control are tested elsewhere.

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|"Button" with no name|The action is unknown|Icon without `aria-label` or hidden text|Add an accessible name describing the action|
|Spoken as "group" or plain text; Space does nothing|Not recognized or not operable|`div`/`span` with a click handler|Use a native `button`|
|Spoken name differs from the label|Speech-input users cannot activate it; confusion|`aria-label` overriding the visible text|Remove the `aria-label` or start it with the visible text|
|Disabled looks grey but is not announced|The user tries again and nothing happens|Styling only|Use `disabled` or `aria-disabled="true"`|
|Focus lost after loading|The user must find their place again|Button replaced or re-rendered during loading|Keep the element; change its content and state|
|Toggle state silent|The user cannot tell whether the option is on|State shown only by color|Expose `aria-pressed`|
|Icon read as a separate "image"|Noise, extra stops|Icon not hidden|Hide decorative icons from assistive technology|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Never edit this specification with results: copy the table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard reach, activation and visible focus|001|Not tested|Not applicable||
|Name and role match the visible purpose|002, 101|Not tested|Not tested||
|Navigation order matches the visual order|001, 002, 101|Not tested|Not tested||
|Activation runs the action once|004, 104|Not tested|Not tested||
|Focus is kept after activation|004, 104|Not tested|Not tested||
|Disabled state announced and blocking|005, 105|Not tested|Not tested||
|Icon-only button named|006, 106|Not tested|Not tested||
|Toggle state announced and updated|007, 107|Not tested|Not tested||
|Loading perceivable, focus kept, no duplicate action|008, 108|Not tested|Not tested||
|Visible label included in the name|009|Not tested|Not applicable||
|Rotor observations recorded|003, 103|Not tested|Not tested||

**Defects found:** list issue IDs created with the [Issue Template](../../06-templates/issue-template.md).

**Evidence:** recording or transcript of the speech, environment, date (TEST-32).

## Related guidance

[Keyboard Interactions](../../../04-interaction-quality/keyboard-interactions.md) · [Accessibility requirements](../../../05-technical-quality/accessibility.md) · [macOS commands](../../02-voiceover/macos/voiceover-commands.md) · [iOS gestures](../../02-voiceover/ios/gestures.md) · [Icon Button](icon-button.md) · [Link](link.md)
