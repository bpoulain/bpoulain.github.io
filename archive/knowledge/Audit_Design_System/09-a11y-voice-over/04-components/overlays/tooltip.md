---
id: CMP-OVR-004
title: Tooltip
family: overlays
platforms: [macos, ios]
status: specification
---

# Tooltip

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** a short text shown on hover or focus that supplements a control's name. It is never interactive and never the only source of essential information. Panels with controls are [Popovers](popover.md).

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Description of a control|Spoken as description|002, 101|
|Name of an icon button|Exists as accessible name without the tooltip|003, 102|
|Shown on keyboard focus|Appears; does not take focus|001|
|Dismissal|Escape hides; stays when hovered|001|

### Main accessibility risks

- Tooltip only on hover: keyboard and touch users never get it.
- Tooltip content not tied to the control.
- Essential information only in a tooltip, unavailable on iOS.
- Tooltip cannot be dismissed and hides content.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-TTP-001|macOS|Keyboard and pointer behavior without VoiceOver|High|WCAG 1.4.13, 2.1.1|
|TEST-TTP-002|macOS|Tooltip spoken as description|High|WCAG 1.3.1|
|TEST-TTP-003|macOS|Not the only name|Critical|WCAG 4.1.2|
|TEST-TTP-101|iOS|Information available without hover|Critical|WCAG 1.3.1|
|TEST-TTP-102|iOS|Icon button named|Critical|WCAG 4.1.2|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-TTP-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md). Record whether hints are spoken.
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

A "Save" button with tooltip "Saves a draft, not published"; an icon button "Settings" with tooltip "Settings"; a text field with a help icon tooltip.

### Initial state

No tooltip visible.

## 3. VoiceOver tests on macOS

Contract: [Keyboard Interactions §11.2](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-TTP-001 — Keyboard and pointer behavior without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab to "Save"|Tooltip appears; focus stays on the button|Fail if it does not appear on focus, or takes focus|
|2|Press Escape|Tooltip hides; focus stays|Fail if it cannot be dismissed (WCAG 1.4.13)|
|3|Hover the button, then move the pointer onto the tooltip|Tooltip stays visible|Fail if it disappears (WCAG 1.4.13)|
|4|Wait without moving|Tooltip stays until the pointer or focus leaves, or Escape|Fail if it disappears on a short timer|

### TEST-TTP-002 — Tooltip spoken as description

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` to "Save"; wait|Name, role, then the tooltip text, possibly after a pause|Fail if the tooltip text is never spoken for this control|
|2|Check duplication|Text not read twice in a row as separate items|Minor if duplicated|

### TEST-TTP-003 — Not the only name

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to "Settings" with the pointer away|Name spoken|Fail if the name depends on the tooltip being visible|

## 4. VoiceOver tests on iOS

### TEST-TTP-101 — Information available without hover

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to "Save"; wait|The tooltip text is spoken as a hint or description|Fail if the information is essential and unavailable|
|2|Swipe to the help icon; double tap|The help text is spoken or shown|Fail if unreachable|

### TEST-TTP-102 — Icon button named

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to "Settings"|Name spoken|Fail if only "button"|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Display|Hover and focus|Never displayed for VoiceOver users; only its text, if tied to the control|
|Description|Spoken after a pause|Spoken as a hint if hints are enabled|

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Control with tooltip|Control name|Control role|—|Visual order|Escape hides tooltip|Stays on control|Tooltip as description|
|Tooltip|—|Tooltip|—|Not a separate stop|None|Never focused|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Description|"Save, button" … "Saves a draft, not published"|
|iOS|Hint|"Save, button. Saves a draft, not published"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Dismissible, hoverable, persistent|WCAG 1.4.13 (AA); A11Y-56|Normative|001|
|Appears on keyboard focus|WCAG 2.1.1 (A)|Normative|001|
|Description associated|WCAG 1.3.1 (A)|Normative|002, 101|
|Name independent of tooltip|WCAG 4.1.2 (A)|Normative|003, 102|
|Tooltip pattern|[APG Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)|Best practice|002|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Hover only|Keyboard users miss it|`mouseenter` only|Show on focus too|
|Never spoken|Information lost|Not referenced|`aria-describedby` to the tooltip|
|Essential info only in tooltip|Lost on touch devices|Design choice|Show it as visible text|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Focus display, Escape, hoverable, persistent|001|Not tested|Not applicable||
|Spoken as description|002, 101|Not tested|Not tested||
|Name independent of tooltip|003, 102|Not tested|Not tested||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Icon Button](../actions/icon-button.md) · [Popover](popover.md) · [Keyboard Interactions §11.2](../../../04-interaction-quality/keyboard-interactions.md)
