---
id: CMP-CNT-003
title: Card
family: content
platforms: [macos, ios]
status: specification
---

# Card

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** group content about one item (title, image, text, actions).

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Static card|Heading; reading order|002, 101|
|Whole card clickable|One link named by the title; no duplicates|003, 102|
|Card with several controls|Each control reachable and named with context|004|
|Card in a list or grid|List semantics; count|005|

### Main accessibility risks

- Whole card wrapped in a link: everything read as one long link name.
- Same link repeated (image, title, "Read more").
- Nested interactive elements inside a clickable card.
- Visual order (image first) different from logical order.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-CRD-001|macOS|Keyboard operation without VoiceOver|High|WCAG 2.1.1, 2.4.3|
|TEST-CRD-002|macOS|Heading and reading order|High|WCAG 1.3.1, 1.3.2|
|TEST-CRD-003|macOS|Clickable card|High|WCAG 2.4.4, 4.1.2|
|TEST-CRD-004|macOS|Card with several controls|High|WCAG 2.4.6|
|TEST-CRD-005|macOS|Cards in a list|Medium|WCAG 1.3.1|
|TEST-CRD-101|iOS|Reading order|High|WCAG 1.3.2|
|TEST-CRD-102|iOS|Clickable card|High|WCAG 2.4.4|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-CRD-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

A grid of 3 article cards (image, title, date, summary), whole card clickable; a product card with "Add to cart" and "Favorite" buttons.

### Initial state

Static.

## 3. VoiceOver tests on macOS

### TEST-CRD-001 — Keyboard operation without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab through the article cards|One Tab stop per card, visible focus around the card or the title|Fail if several stops lead to the same destination without reason|
|2|Tab through the product card|Each button reachable|Fail if a button is skipped|

### TEST-CRD-002 — Heading and reading order

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Command + H`|Each card title is a heading|Observation if not; Fail if the design presents them as headings|
|2|`VO + Right Arrow` through a card|Logical order: title, then metadata and summary; a decorative image skipped|Fail if order is confusing (WCAG 1.3.2)|

### TEST-CRD-003 — Clickable card

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + U`, **Links**|One link per card, named by its title|Fail if the link name is the whole card text or if duplicates appear|
|2|`VO + Space` on the link|Navigates|Fail if not|

### TEST-CRD-004 — Card with several controls

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to the buttons|Names include or follow the product name clearly, e.g. "Add Chair to cart"|Minor if generic but in a clear context; Fail if indistinguishable in the controls list|
|2|"Favorite" toggle|State spoken|Fail if no state|

### TEST-CRD-005 — Cards in a list

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Enter the grid|List semantics with a count|Observation if missing|

## 4. VoiceOver tests on iOS

### TEST-CRD-101 — Reading order

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe through a card|Same logical order as macOS|Fail if confusing|

### TEST-CRD-102 — Clickable card

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to the card link; double tap|Short name; navigates|Fail if the name is the whole card text|

### Differences from macOS

iOS may group a whole clickable card into one item. Record it; the name must stay short and meaningful.

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Article card|Title|Link + heading|—|Title first|Return, double tap|New page|—|
|Product card|—|Group with buttons|Favorite state|Title, info, actions|Buttons|Stays|New state|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Card link|"link, How we test, heading level 3"|
|iOS|Favorite|"Favorite Chair, toggle button, not selected"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Headings and structure|WCAG 1.3.1 (A)|Normative|002, 005|
|Meaningful sequence|WCAG 1.3.2 (A)|Normative|002, 101|
|Link purpose|WCAG 2.4.4 (A)|Normative|003, 102|
|Focus order|WCAG 2.4.3 (A)|Normative|001|
|Descriptive labels|WCAG 2.4.6 (AA)|Normative|004|
|Name, role, state|WCAG 4.1.2 (A)|Normative|003, 004|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Very long link name|Tedious, unclear|Link wraps the whole card|Link on the title; extend the clickable area with CSS|
|Three links to the same page|Noise|Image, title and "Read more" all linked|One link; hide duplicates from AT and focus|
|Buttons inside a card link|Unpredictable activation|Nested interactive content|Separate the controls from the link|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Tab stops and focus|001|Not tested|Not applicable||
|Heading and order|002, 101|Not tested|Not tested||
|One short link per card|003, 102|Not tested|Not tested||
|Controls named in context|004|Not tested|Not applicable||
|List semantics|005|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Link](../actions/link.md) · [List](list.md) · [Image](image.md)
