---
id: CMP-OVR-003
title: Popover
family: overlays
platforms: [macos, ios]
status: specification
---

# Popover

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** a non-modal panel opened from a trigger, containing information or controls (filters, a share form). Focus is not trapped. A panel that blocks the page is a modal [Dialog](dialog.md); a text-only hint on hover or focus is a [Tooltip](tooltip.md).

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Open / closed|Trigger state; content reachable right after|002, 003, 101|
|Interactive content|Focus moves in, Tab continues out|004|
|Read-only content|Reachable without moving focus|003|
|Closing|Escape, outside click, close button; focus|005, 102|

### Main accessibility risks

- Content rendered at the end of the page (portal), far from its trigger in reading order.
- Expanded state missing.
- Focus trapped although the popover is non-modal.
- Opens on hover only.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-POP-001|macOS|Keyboard contract without VoiceOver|Critical|WCAG 2.1.1, 2.1.2|
|TEST-POP-002|macOS|Trigger name, role, state|Critical|WCAG 4.1.2|
|TEST-POP-003|macOS|Content in reading order|Critical|WCAG 1.3.2, A11Y-35|
|TEST-POP-004|macOS|Interactive content|High|WCAG 2.4.3|
|TEST-POP-005|macOS|Closing and focus|High|WCAG 2.4.3|
|TEST-POP-101|iOS|Opening and reaching content|Critical|WCAG 1.3.2|
|TEST-POP-102|iOS|Closing|High|WCAG 2.4.3|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-POP-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

A "Filters" button opening a popover with two checkboxes and an "Apply" button; an "Info" button opening a read-only popover; content after both triggers.

### Initial state

Closed.

## 3. VoiceOver tests on macOS

Contract: [Keyboard Interactions §11.1](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-POP-001 — Keyboard contract without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab to "Filters", press Return|Opens; focus moves into it or the next Tab reaches it|Fail if it opens only on hover|
|2|Tab through and past the last control|Focus leaves to the content after the trigger; the popover may close|Fail on a trap, or if Tab jumps to the end of the page|
|3|Reopen, press Escape|Closes; focus on the trigger|Fail if focus lost|

### TEST-POP-002 — Trigger name, role, state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` to "Filters"|Name, button role, collapsed state|Fail if no state|
|2|`VO + Space`|Expanded spoken|Fail if not|

### TEST-POP-003 — Content in reading order

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Open "Info"; `VO + Right Arrow` from the trigger|The popover content is read next|Fail if the content is only reachable at the end of the page (A11Y-35)|

### TEST-POP-004 — Interactive content

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Open "Filters"; operate the checkboxes and "Apply"|Each control behaves per its own specification|Fail if controls are unreachable|
|2|After "Apply"|Popover closes; focus on the trigger or the updated results|Fail if lost|

### TEST-POP-005 — Closing and focus

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Close with Escape, with a close button if any|Collapsed spoken on the trigger; focus back on it|Fail if lost|

## 4. VoiceOver tests on iOS

### TEST-POP-101 — Opening and reaching content

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap "Filters"; swipe right|Expanded spoken; next swipe reaches the content|Fail if content is elsewhere|

### TEST-POP-102 — Closing

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Close with the close control, or double tap the trigger again|Closed; VoiceOver focus on the trigger|Fail if it cannot be closed or focus jumps|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Closing|Escape, Tab out|Visible control or trigger; outside tap is not discoverable|

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Trigger|"Filters"|Button|Expanded / collapsed|Visual order|Return, Space, double tap|—|New state|
|Content|Optional dialog name|Group or non-modal dialog|—|Right after trigger|Tab in and out, Escape|Inside or next|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Trigger|"Filters, collapsed, button"|
|iOS|Trigger|"Filters, button, expanded"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Name, role, expanded state|WCAG 4.1.2 (A); A11Y-30|Normative|002, 101|
|Reading order|WCAG 1.3.2 (A); A11Y-35|Normative|003, 101|
|Keyboard; no trap|WCAG 2.1.1 (A), 2.1.2 (A)|Normative|001|
|Focus order and return|WCAG 2.4.3 (A)|Normative|004, 005, 102|
|Hover/focus content dismissible|WCAG 1.4.13 (AA)|Normative when opened on hover or focus|001|
|Non-modal: no trap|Keyboard Interactions §11.1|Best practice|001|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Content read at page end|Not found|Portal at end of `body`|Keep in DOM after trigger, or move focus in and out|
|No expanded state|Unknown if open|Missing `aria-expanded`|Add it|
|Trapped focus|Stuck in a non-modal panel|Modal focus trap reused|Remove the trap|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard; no trap|001|Not tested|Not applicable||
|Trigger state|002, 101|Not tested|Not tested||
|Content right after trigger|003, 101|Not tested|Not tested||
|Interactive content usable|004|Not tested|Not applicable||
|Closing restores focus|005, 102|Not tested|Not tested||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Dialog](dialog.md) · [Tooltip](tooltip.md) · [Keyboard Interactions §11](../../../04-interaction-quality/keyboard-interactions.md)
