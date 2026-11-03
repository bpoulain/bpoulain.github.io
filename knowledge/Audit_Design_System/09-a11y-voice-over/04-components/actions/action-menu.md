---
id: CMP-ACT-004
title: Action Menu
family: actions
platforms: [macos, ios]
status: specification
---

# Action Menu

Follows the structure of the reference specifications [Button](button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** a button that opens a list of actions (Edit, Duplicate, Delete). Site navigation is a [Navigation Menu](../navigation/menu.md), not an action menu. Context menus opened by right-click follow the same tests once open, plus a keyboard way to open them.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Closed / open|Trigger state; focus in the menu|002, 003, 101|
|Items, disabled item|Roles; disabled state|004|
|Checkable items (checkbox, radio)|Checked state|005|
|Submenu|Open/close with arrows|006|
|Destructive item|Clear name|004|

### Main accessibility risks

- Trigger without popup or expanded state.
- Focus stays on the trigger when the menu opens.
- Escape does not close or does not return focus.
- Menu items spoken as links or plain text.
- Context menu with no keyboard way to open it.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-AMN-001|macOS|Keyboard contract without VoiceOver|Critical|WCAG 2.1.1, 2.1.2|
|TEST-AMN-002|macOS|Trigger name, role, popup, state|Critical|WCAG 4.1.2|
|TEST-AMN-003|macOS|Opening and focus|Critical|WCAG 2.4.3|
|TEST-AMN-004|macOS|Items and disabled item|High|WCAG 4.1.2|
|TEST-AMN-005|macOS|Checkable items|Medium|WCAG 4.1.2|
|TEST-AMN-006|macOS|Submenu|Medium|WCAG 2.1.1|
|TEST-AMN-007|macOS|Activation and focus return|Critical|WCAG 2.4.3|
|TEST-AMN-101|iOS|Opening and reaching items|Critical|WCAG 4.1.2|
|TEST-AMN-102|iOS|Activating and closing|Critical|WCAG 2.4.3|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-AMN-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

A "More actions" button opening: "Edit", "Duplicate", "Archive" (disabled), "Show hidden files" (checkable), "Move to" (submenu with 2 items), "Delete". Optionally an element with a context menu.

### Initial state

Menu closed.

## 3. VoiceOver tests on macOS

Contract: [Keyboard Interactions §7](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-AMN-001 — Keyboard contract without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab to "More actions", press Return, Space or Down Arrow|Menu opens; focus on the first item|Fail if focus stays on the trigger|
|2|Down/Up Arrow, Home/End|Focus moves; disabled item skipped or focusable with disabled state, as documented|Fail if arrows do nothing|
|3|Type "d"|Focus jumps to "Duplicate"|Observation if no typeahead|
|4|Press Escape|Menu closes; focus on the trigger|Fail if focus is lost|
|5|Reopen, press Tab|Menu closes; focus moves on|Fail on a trap|
|6|On the context-menu element, press the documented keyboard shortcut|The context menu opens|Fail if only right-click opens it and no visible trigger offers the same actions|

### TEST-AMN-002 — Trigger name, role, popup, state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` to the trigger|Name, button role, popup indication and collapsed state, e.g. "More actions, menu button" or "More actions, pop-up button, collapsed"|Fail if no popup or state information|

### TEST-AMN-003 — Opening and focus

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Space`|Menu opened; first item spoken with role and position, e.g. "Edit, menu item, 1 of 6"|Fail if VoiceOver stays on the trigger|

### TEST-AMN-004 — Items and disabled item

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Down Arrow through items|Each item: name, menu item role|Fail if spoken as links or text|
|2|Reach "Archive"|Disabled spoken|Fail if spoken as available|
|3|"Delete" is clearly destructive by its name|Name says "Delete", not only an icon or color|Fail if meaning carried only by color|

### TEST-AMN-005 — Checkable items

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Reach "Show hidden files"; press Return|Checked state spoken; menu closes or stays as documented|Fail if no state|

### TEST-AMN-006 — Submenu

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Reach "Move to"|Spoken as having a submenu|Fail if not indicated|
|2|Right Arrow|Submenu opens; first item spoken|Fail if it does not open by keyboard|
|3|Left Arrow or Escape|Submenu closes; focus back on "Move to"|Fail if both menus close or focus is lost|

### TEST-AMN-007 — Activation and focus return

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Press Return on "Duplicate"|Action runs; menu closes; focus on the trigger, or on the result if documented|Fail if focus is lost|

## 4. VoiceOver tests on iOS

### TEST-AMN-101 — Opening and reaching items

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to the trigger; double tap|Expanded; VoiceOver focus moves into the menu, or the next swipe reaches it|Fail if items cannot be reached by swiping|
|2|Swipe through items|Names, roles, disabled and checked states|Fail if states are missing|

### TEST-AMN-102 — Activating and closing

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap "Duplicate"|Action runs; VoiceOver focus back on the trigger or nearby|Fail if focus lost|
|2|Reopen; close without choosing (close control, two-finger scrub if supported, or touching outside)|Menu closes; record the method that works|Fail if the menu cannot be closed without choosing|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Moving|Arrows, typeahead|Swipes|
|Closing|Escape, Tab|Visible control, scrub, outside touch|
|Context menu|Documented shortcut; Shift-F10 is a Windows convention and may not apply in Safari|Long press may be unavailable to VoiceOver users; provide a visible trigger|

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Trigger|"More actions"|Button with popup|Expanded / collapsed|Visual order|Return, Space, Down Arrow|—|—|
|Menu|—|Menu|—|After trigger|Arrows, Home/End, typeahead, Escape, Tab|First item|Item and position|
|Item|Action|Menu item (checkbox / radio)|Disabled, checked|Menu order|Return, Space, double tap|Back to trigger|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Trigger|"More actions, menu button"|
|macOS|Item|"Edit, menu item, 1 of 6"|
|iOS|Item|"Duplicate, menu item"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Name, role, state of trigger and items|WCAG 4.1.2 (A); A11Y-30|Normative|002, 004, 005, 101|
|Keyboard operation; no trap|WCAG 2.1.1 (A), 2.1.2 (A)|Normative|001, 006|
|Focus into menu and back|WCAG 2.4.3 (A)|Normative|003, 007, 102|
|Not by color alone|WCAG 1.4.1 (A)|Normative|004|
|Menu button keys, typeahead|Keyboard Interactions §7; [APG Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)|Best practice|001|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Focus stays on trigger|Items not found|No focus management|Focus first item on open|
|Escape does nothing|Stuck|Key not handled|Close and return focus|
|Items read as links|Wrong expectations|Links inside a menu without roles|`menuitem` roles, or plain buttons in a disclosure|
|Context menu mouse-only|Actions unreachable|Right-click only|Keyboard shortcut and visible trigger|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard contract|001|Not tested|Not applicable||
|Trigger popup and state|002, 101|Not tested|Not tested||
|Focus into menu|003, 101|Not tested|Not tested||
|Item roles and states|004, 005, 101|Not tested|Not tested||
|Submenu|006|Not tested|Not applicable||
|Focus after action or close|007, 102|Not tested|Not tested||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Keyboard Interactions §7](../../../04-interaction-quality/keyboard-interactions.md) · [Button](button.md) · [Navigation Menu](../navigation/menu.md) · [Popover](../overlays/popover.md)
