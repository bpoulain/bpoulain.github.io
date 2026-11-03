---
id: CMP-ACT-002
title: Link
family: actions
platforms: [macos, ios]
status: specification
---

# Link

Follows the structure of the reference specifications [Button](button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** navigate to another page, another place in the page, a file or an external site. An element that runs an action without navigating is a button, tested with [Button](button.md).

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Inline link in a paragraph|Name understandable, distinguishable from text|002, 004, 101|
|Standalone link|Name understandable out of context|002, 003, 101, 103|
|External link or link opening a new window|The change of context is announced|005, 104|
|Link to a file|Format and size announced|005|
|Current page link (`aria-current`)|Current state announced|006, 105|
|Link that looks disabled|Not presented as an active link|007|

### Main accessibility risks

- Ambiguous names: "Click here", "Read more", repeated with different destinations.
- A link built from a `span` or a button styled as a link: wrong role, wrong keyboard behavior.
- New window opened without warning.
- Link name made only of an icon or an image without alternative.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-LNK-001|macOS|Keyboard operation without VoiceOver|Critical|WCAG 2.1.1, 2.4.7|
|TEST-LNK-002|macOS|Name and role|Critical|WCAG 2.4.4, 4.1.2|
|TEST-LNK-003|macOS|Links list in the rotor|High|WCAG 2.4.4|
|TEST-LNK-004|macOS|Activation and destination|Critical|WCAG 2.1.1|
|TEST-LNK-005|macOS|New window, external site, file|High|WCAG 3.2.5 (AAA), best practice|
|TEST-LNK-006|macOS|Current page|Medium|WCAG 1.3.1|
|TEST-LNK-007|macOS|Disabled-looking link|Medium|WCAG 4.1.2|
|TEST-LNK-008|macOS|Visible text included in the name|High|WCAG 2.5.3|
|TEST-LNK-101|iOS|Discovery by swiping|Critical|WCAG 4.1.2|
|TEST-LNK-102|iOS|Activation by double tap|Critical|WCAG 2.1.1|
|TEST-LNK-103|iOS|Links in the rotor|Medium|AT behavior|
|TEST-LNK-104|iOS|New window or external site|High|Best practice|
|TEST-LNK-105|iOS|Current page|Medium|WCAG 1.3.1|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). Links are the first victims of the Safari default: enable **Settings › Advanced › Press Tab to highlight each item on a webpage** and **System Settings › Keyboard › Keyboard navigation**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md). Check that **Links** is available in the rotor.
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

1. A paragraph containing an inline link, e.g. "Read the [pricing details]".
2. Three standalone links with distinct destinations, and two "Read more" links if the design system offers that pattern, each with its context.
3. An external link opening in a new window, and a link to a PDF file.
4. A navigation list where one link has `aria-current="page"`.
5. A link styled as disabled, if supported.
6. A link with an icon only, if supported.

### Initial state

Page freshly loaded, scrolled to the top, no other window open.

## 3. VoiceOver tests on macOS

`VO` is Control-Option by default. See [macOS commands](../../02-voiceover/macos/voiceover-commands.md).

### TEST-LNK-001 — Keyboard operation without VoiceOver

VoiceOver is **off**. Contract: [Keyboard Interactions §13.1](../../../04-interaction-quality/keyboard-interactions.md).

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Press Tab through the page|Every link receives focus with a visible indicator, in visual order|Fail if a link is skipped (with the Safari option on) or focus is invisible|
|2|Press Return on a link|Navigation happens|Fail if nothing happens|
|3|Press Space on a link|The page scrolls; the link is not activated|Observation if Space activates: not a native link|
|4|Press Shift-Tab|Focus moves backward|Fail on any trap|

### TEST-LNK-002 — Name and role

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to each link|Role "link" and its name, e.g. "link, Pricing details" or "Pricing details, link"|Fail if the role is missing or another role is spoken|
|2|Listen to the "Read more" links|Each name, or its programmatic context, tells the destination apart|Fail if two links with different destinations are indistinguishable with their context (WCAG 2.4.4)|
|3|Reach the icon-only link|A name describing the destination|Fail if the URL, a file name or nothing is spoken|
|4|Check the inline link|One stop for the link, the text before and after read separately|Fail if the link's words are split or merged with the paragraph without role|

### TEST-LNK-003 — Links list in the rotor

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Press `VO + U` and move with Left or Right Arrow to the **Links** list|All links are listed with their names|Fail if a link is missing (wrong role)|
|2|Read the list without context|Each name is understandable alone, or duplicates lead to the same destination|Improvement if names need context; WCAG 2.4.9 (AAA) is not required|
|3|Select a link and press Return|The VoiceOver cursor moves to it|Observation|

### TEST-LNK-004 — Activation and destination

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Space` on a link to another page|The new page loads; VoiceOver starts reading it|Fail if nothing happens|
|2|`VO + Space` on a link to an anchor in the page|The page scrolls; the VoiceOver cursor and keyboard focus move to the target|Fail if VoiceOver stays on the link while the page scrolled|
|3|Press Command-[ to come back, if a page changed|The previous page is shown|Setup only|

### TEST-LNK-005 — New window, external site, file

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to the external link|The name or description warns about the new window or external site|Fail against the design system's own rule if it requires the warning; otherwise Improvement|
|2|`VO + Space`|A new window or tab opens|Observation: record what VoiceOver says|
|3|`VO + Right Arrow` to the file link|Format, and ideally size, are spoken, e.g. "Annual report, PDF, 2 MB"|Improvement if missing|

Warning about a new window is a best practice at levels A and AA; WCAG 3.2.5 (AAA) requires it.

### TEST-LNK-006 — Current page

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to the current page link|A current state is spoken, e.g. "current page"|Fail if the current page is shown visually but not exposed (WCAG 1.3.1)|

### TEST-LNK-007 — Disabled-looking link

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to it|Either not a link (plain text), or a link with a disabled state|Fail if it is spoken as an active link and does nothing|
|2|`VO + Space`|Nothing happens, consistently with what was spoken|Fail if it navigates although it looks disabled|

### TEST-LNK-008 — Visible text included in the name

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|For each link with visible text, compare the spoken name with the text|The name contains the visible words|Fail if the visible words are absent (WCAG 2.5.3)|

## 4. VoiceOver tests on iOS

See [iOS gestures](../../02-voiceover/ios/gestures.md).

### TEST-LNK-101 — Discovery by swiping

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe right through the paragraph|The text before, the link with its role, then the text after|Fail if the link has no role|
|2|Swipe to each standalone link|Name and role "link"|Fail if the name is missing or ambiguous with its context|

iOS sometimes reads a whole paragraph, link included, as one item. Record it; the link must still be reachable with the **Links** rotor (103).

### TEST-LNK-102 — Activation by double tap

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap a link to another page|The page loads; VoiceOver focus starts in the new page|Fail if nothing happens|
|2|Double tap an anchor link|The page scrolls to the target; the next swipe reads the target|Fail if VoiceOver focus stays on the link and the next swipe reads what follows the link|

### TEST-LNK-103 — Links in the rotor

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Rotate two fingers to **Links**, then swipe down repeatedly|VoiceOver moves from link to link, inline links included|Fail if a link cannot be reached|

### TEST-LNK-104 — New window or external site

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to the external link|The warning is spoken, as on macOS|Same rule as TEST-LNK-005|
|2|Double tap|A new tab opens|Observation: record whether VoiceOver says so|

### TEST-LNK-105 — Current page

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to the current page link|Current state spoken|Fail if not exposed|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Reaching links with the keyboard|Depends on a Safari setting|Not applicable|
|Inline links|Usually separate stops|Sometimes merged with the paragraph; use the rotor|
|Return to the previous page|Command-[|Safari's back button, or the two-finger scrub where it applies|

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus after action|Announcement|
|---|---|---|---|---|---|---|---|
|Standalone link|Destination|Link|Visited, if exposed|Visual order|Return, `VO + Space`, double tap|New page or anchor target|Page title or target|
|External link|Destination + warning|Link|—|Same|Same|New window|Warning before activation|
|Current page|Page name|Link|Current|Same|Same|—|"current page" or similar|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Standalone link|"link, Pricing details"|
|macOS|Current page|"current page, link, Home"|
|iOS|Standalone link|"Pricing details, link"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Name, role and state exposed|WCAG 4.1.2 (A); A11Y-30|Normative|002, 006, 007, 101, 105|
|Purpose understandable in context|WCAG 2.4.4 Link Purpose (In Context) (A)|Normative|002, 003|
|Keyboard operation, visible focus|WCAG 2.1.1 (A), 2.4.7 (AA)|Normative|001|
|Visible text in the name|WCAG 2.5.3 (A)|Normative|008|
|Current page exposed|WCAG 1.3.1 (A)|Normative|006, 105|
|New window warning|WCAG 3.2.5 (AAA)|Best practice at A/AA|005, 104|
|Native `a href`; Space not redefined|Keyboard Interactions §13.1|Best practice|001|
|Inline link merged in a paragraph on iOS|VoiceOver behavior|AT behavior|101|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|"Read more" repeated|Destinations indistinguishable|Generic text|Make the text specific, or add hidden context|
|Not reached by Tab, no link role|Unusable without a mouse|`span` or `div` with a click handler|Use `a href`|
|Link spoken as a button, or the reverse|Wrong expectation (Space, back button)|Wrong element|Link to navigate, button to act|
|New tab opens silently|The back button no longer works; disorientation|`target="_blank"` without warning|Add the warning to the name or description|
|Current page only in bold|The user does not know where they are|No `aria-current`|Add `aria-current="page"`|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard reach, Return activation, visible focus|001|Not tested|Not applicable||
|Name and role|002, 101|Not tested|Not tested||
|Purpose understandable with context|002, 003|Not tested|Not tested||
|Activation and destination focus|004, 102|Not tested|Not tested||
|All links reachable in the rotor|003, 103|Not tested|Not tested||
|New window, external site, file warned|005, 104|Not tested|Not tested||
|Current page exposed|006, 105|Not tested|Not tested||
|Disabled-looking link consistent|007|Not tested|Not applicable||
|Visible text in the name|008|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Keyboard Interactions §13](../../../04-interaction-quality/keyboard-interactions.md) · [Button](button.md) · [Breadcrumb](../navigation/breadcrumb.md) · [Navigation Menu](../navigation/menu.md)
