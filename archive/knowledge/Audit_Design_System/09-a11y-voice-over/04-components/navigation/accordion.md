---
id: CMP-NAV-005
title: Accordion
family: navigation
platforms: [macos, ios]
status: specification
---

# Accordion

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string. This specification also covers a single collapsible section.

## 1. Component overview

**Purpose:** show and hide sections of content under headed buttons.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Collapsed / expanded section|Expanded state; content follows the header|002, 003, 101, 102|
|Single-open accordion (opening one closes the others)|Closed sections announced correctly|004|
|Nested accordion|Levels understandable|005|
|Optional arrow-key navigation|Works as documented|001|
|Disabled section|State spoken|006|

### Main accessibility risks

- Header is a `div` with a click handler, not a button.
- No expanded state.
- Header button not inside a heading: the structure disappears from the headings rotor.
- Collapsed content still read.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-ACC-001|macOS|Keyboard operation without VoiceOver|Critical|WCAG 2.1.1|
|TEST-ACC-002|macOS|Header: heading, button, state|Critical|WCAG 4.1.2, 1.3.1|
|TEST-ACC-003|macOS|Expanding and collapsing|Critical|WCAG 4.1.2|
|TEST-ACC-004|macOS|Single-open behavior|Medium|WCAG 4.1.2|
|TEST-ACC-005|macOS|Nested sections|Low|WCAG 1.3.1|
|TEST-ACC-006|macOS|Disabled section|Low|WCAG 4.1.2|
|TEST-ACC-101|iOS|Discovery through headings|High|WCAG 1.3.1|
|TEST-ACC-102|iOS|Expanding and collapsing|Critical|WCAG 4.1.2|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-ACC-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

An accordion "FAQ" with 3 sections ("Shipping", "Returns", "Payment"), each with a paragraph and a link; a single-open variant if supported; a nested accordion if supported; a disabled section if supported.

### Initial state

All sections collapsed.

## 3. VoiceOver tests on macOS

Contract: [Keyboard Interactions §12](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-ACC-001 — Keyboard operation without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab to "Shipping"|Visible focus|Fail if skipped or invisible|
|2|Press Return, then Space|Each toggles the section|Fail if a key does nothing|
|3|Expanded: press Tab|Focus enters the section's link|Fail if skipped|
|4|Collapsed: press Tab|The link inside is skipped|Fail if hidden content takes focus|
|5|If arrow navigation is documented: Down/Up, Home/End between headers|Works as documented|Fail if documented but broken|

### TEST-ACC-002 — Header: heading, button, state

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` to "Shipping"|Heading level, button role and collapsed state, e.g. "heading level 3, Shipping, collapsed, button"|Fail if no button role or no state|
|2|`VO + Command + H` from the top of the page|Each header is reached as a heading|Observation if headers are not headings; Fail if the visual design makes them headings (WCAG 1.3.1)|

### TEST-ACC-003 — Expanding and collapsing

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Space` on "Shipping"|Expanded spoken|Fail if not spoken|
|2|`VO + Right Arrow`|The section content follows immediately|Fail if content is elsewhere|
|3|Collapse; `VO + Right Arrow`|The next header, not the hidden content|Fail if hidden content is read (A11Y-33)|
|4|Check focus after toggling|Stays on the header|Fail if it moves|

### TEST-ACC-004 — Single-open behavior

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Expand "Shipping", then "Returns"|"Shipping" collapses; re-reading it says collapsed|Fail if the state is stale|

### TEST-ACC-005 — Nested sections

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Expand a parent then a child|Heading levels or structure distinguish the levels|Minor if levels are indistinguishable|

### TEST-ACC-006 — Disabled section

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to it, `VO + Space`|Disabled spoken; no change|Fail if it toggles|

## 4. VoiceOver tests on iOS

### TEST-ACC-101 — Discovery through headings

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Rotor **Headings**, swipe down|Each header is reached|Observation, as in 002|
|2|Swipe right on a header|Button role and state|Fail if missing|

### TEST-ACC-102 — Expanding and collapsing

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap "Shipping"|Expanded spoken|Fail if not spoken|
|2|Swipe right|Section content|Fail if elsewhere|
|3|Collapse; swipe right|Next header|Fail if hidden content is read|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Jump between headers|`VO + Command + H`, or optional arrows|Rotor **Headings**|

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Header|Section title|Button inside a heading|Expanded / collapsed|Header then content|Return, Space, `VO + Space`, double tap|Stays on the header|New state|
|Content|—|Region (optional)|—|Right after its header|—|—|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Collapsed|"heading level 3, Shipping, collapsed, button"|
|iOS|Expanded|"Shipping, button, expanded, heading level 3"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Name, role, expanded state|WCAG 4.1.2 (A); A11Y-30|Normative|002, 003, 004, 006, 101, 102|
|Heading structure, content order|WCAG 1.3.1 (A), 1.3.2 (A)|Normative|002, 003, 005|
|Keyboard operation|WCAG 2.1.1 (A)|Normative|001|
|Hidden content not focusable or read|A11Y-33; Keyboard Interactions §12.3|Best practice|001, 003|
|Button inside heading; optional arrows|[APG Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)|Best practice|001, 002|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|No state|User cannot tell if content is shown|No `aria-expanded`|Add it to the button|
|Header not a button|Not operable|`div` click handler|`button` inside a heading|
|Hidden content read|Confusion|Hidden by height or opacity|`hidden`, or `display: none`|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard operation; hidden content skipped|001|Not tested|Not applicable||
|Heading, button, state|002, 101|Not tested|Not tested||
|Toggle updates state; content order|003, 102|Not tested|Not tested||
|Single-open state accurate|004|Not tested|Not applicable||
|Nested levels|005|Not tested|Not applicable||
|Disabled section|006|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Keyboard Interactions §12](../../../04-interaction-quality/keyboard-interactions.md) · [Tabs](tabs.md) · [Navigation Menu](menu.md)
