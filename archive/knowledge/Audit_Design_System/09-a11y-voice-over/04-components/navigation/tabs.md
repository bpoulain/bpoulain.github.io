---
id: CMP-NAV-001
title: Tabs
family: navigation
platforms: [macos, ios]
status: specification
---

# Tabs

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** switch between panels of related content in the same place. Links that load other pages, even styled as tabs, are a navigation and are tested with [Navigation Menu](menu.md).

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Horizontal, automatic activation|Arrows select and show the panel|001, 003, 004|
|Horizontal, manual activation|Arrows move focus; Return or Space selects|001, 004|
|Vertical|Up/Down arrows|001|
|Disabled tab|Skipped or spoken as disabled|006|
|Panel with or without focusable content|Tab reaches the panel|005|

### Main accessibility risks

- Tabs built as buttons or links with no tab role or selected state.
- Every tab is a Tab stop; arrows do nothing.
- Panel not tied to its tab; the user does not know the panel changed.
- Focused and selected tabs confused in manual mode.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-TAB-001|macOS|Keyboard contract without VoiceOver|Critical|WCAG 2.1.1|
|TEST-TAB-002|macOS|Tab list, name, role, selected state, position|Critical|WCAG 4.1.2, 1.3.1|
|TEST-TAB-003|macOS|Selecting a tab|Critical|WCAG 4.1.2|
|TEST-TAB-004|macOS|Activation mode|High|Keyboard Interactions §6.3|
|TEST-TAB-005|macOS|Reaching and reading the panel|Critical|WCAG 1.3.1, 2.4.3|
|TEST-TAB-006|macOS|Disabled tab|Medium|WCAG 4.1.2|
|TEST-TAB-101|iOS|Discovery|Critical|WCAG 4.1.2|
|TEST-TAB-102|iOS|Selecting by double tap|Critical|WCAG 4.1.2|
|TEST-TAB-103|iOS|Reaching the panel|Critical|WCAG 1.3.2|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-TAB-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level, and the activation mode.

### Test page

1. A tab list labelled "Account settings" with "Profile", "Security", "Billing" (disabled, if supported), "Notifications".
2. "Profile" panel: text with a link. "Security" panel: text only.
3. A focusable element after the tabs.

### Initial state

"Profile" selected.

## 3. VoiceOver tests on macOS

Contract: [Keyboard Interactions §6](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-TAB-001 — Keyboard contract without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab to the tab list|Focus on the selected tab, visible|Fail if focus lands on another tab or is invisible|
|2|Press Right Arrow, then Left Arrow (Down/Up if vertical)|Focus moves to the next/previous tab, wrapping at the ends unless documented otherwise|Fail if arrows do nothing|
|3|Press Home, then End|First and last tab|Fail if unsupported without documentation|
|4|Press Tab|Focus moves into the panel (its first focusable element, or the panel itself)|Fail if Tab goes through every tab|

### TEST-TAB-002 — Tab list, name, role, selected state, position

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` to the tab list|The list name may be spoken, e.g. "Account settings, tab group"|Observation if no name|
|2|`VO + Right Arrow` to "Profile"|Name, role, selected state and position, e.g. "Profile, selected, tab, 1 of 4"|Fail if role or selected state is missing|
|3|`VO + Right Arrow` to "Security"|Not selected|Fail if spoken as selected|

### TEST-TAB-003 — Selecting a tab

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Space` on "Security"|"Security" selected; its panel shown; state spoken|Fail if the panel changes but the selected state does not, or the reverse|
|2|Re-read "Profile"|Not selected|Fail if stale|

### TEST-TAB-004 — Activation mode

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|With keyboard focus on a tab, press Right Arrow|Automatic mode: the panel changes. Manual mode: only focus moves, the selected state stays on the previous tab|Fail if the behavior differs from the documented mode|
|2|Manual mode: press Return or Space|The focused tab becomes selected|Fail if nothing happens|
|3|Manual mode: listen while moving|Focused tab spoken as not selected until activated|Fail if spoken as selected before activation|

### TEST-TAB-005 — Reaching and reading the panel

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|From the selected tab, `VO + Right Arrow` past the last tab|The selected panel's content follows; hidden panels are not read|Fail if a hidden panel is read (A11Y-33)|
|2|From the selected tab, press Tab|Focus goes into the panel|Fail if it skips the panel|
|3|Check the panel name|The panel may be spoken with the tab's name|Observation|

### TEST-TAB-006 — Disabled tab

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Arrow to "Billing"|Skipped, or focused and spoken as disabled, as documented|Fail if spoken as available|
|2|Try to activate it|Nothing changes|Fail if its panel opens|

## 4. VoiceOver tests on iOS

### TEST-TAB-101 — Discovery

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe right through the tabs|Each tab: name, role, selected state, position|Fail if role or selected state is missing|

### TEST-TAB-102 — Selecting by double tap

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap "Security"|Selected state spoken; panel shown|Fail if not spoken|
|2|Swipe left to "Profile"|Not selected|Fail if stale|

### TEST-TAB-103 — Reaching the panel

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|From the last tab, swipe right|The selected panel's content|Fail if a hidden panel's content or unrelated content is read|
|2|Touch the panel area|The visible panel content is read|Fail if hidden content is read|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Moving between tabs|Arrows (keyboard focus)|Swipes; no activation mode difference|
|Reaching the panel|Tab key or `VO + Right Arrow`|Swipe after the last tab|

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Tab list|List label|Tab list|—|Before the panel|—|—|—|
|Tab|Visible label|Tab|Selected / not selected; position|List order|Arrows, Home, End, Return/Space (manual)|One Tab stop|New selected state|
|Panel|Tab label|Tab panel|—|After the tab list|Tab enters|Panel content|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Selected tab|"Profile, selected, tab, 1 of 4"|
|iOS|Tab|"Security, tab, 2 of 4"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Name, role, selected state|WCAG 4.1.2 (A); A11Y-30|Normative|002, 003, 006, 101, 102|
|Tab–panel relationship|WCAG 1.3.1 (A)|Normative|005, 103|
|Keyboard operation|WCAG 2.1.1 (A)|Normative|001, 004|
|Focus order into the panel|WCAG 2.4.3 (A)|Normative|001, 005|
|Hidden panels hidden from AT|A11Y-33|Best practice|005, 103|
|Arrows, Home/End, documented activation mode|Keyboard Interactions §6; [APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)|Best practice|001, 004|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|No selected state|The user does not know which panel is shown|Selection only styled|`aria-selected` on the tab|
|Every tab is a Tab stop|Slow, unexpected|No roving tabindex|`tabindex="-1"` on unselected tabs, arrows|
|Hidden panel read|Confusion|Panels hidden visually only|`hidden` on inactive panels|
|Panel not reached with Tab|Content skipped|Panel not focusable and empty of focusable elements|`tabindex="0"` on the panel when it has no focusable content|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard contract: one Tab stop, arrows, Home/End, Tab to panel|001|Not tested|Not applicable||
|Role, name, selected state, position|002, 101|Not tested|Not tested||
|Selecting updates state and panel|003, 102|Not tested|Not tested||
|Activation mode matches documentation|004|Not tested|Not applicable||
|Panel reachable; hidden panels not read|005, 103|Not tested|Not tested||
|Disabled tab|006|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Keyboard Interactions §6](../../../04-interaction-quality/keyboard-interactions.md) · [Accordion](accordion.md) · [Navigation Menu](menu.md)
