---
id: CMP-CNT-002
title: List
family: content
platforms: [macos, ios]
status: specification
---

# List

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string. A list is read, not operated: no activation test applies to the list itself.

## 1. Component overview

**Purpose:** group related items (ordered, unordered, nested, list of items with actions).

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Unordered|List role and count|001, 101|
|Ordered|Order conveyed|002|
|Nested|Levels|003|
|Items with actions (rows with buttons)|Each action named with its item|004|
|Styled without bullets|Semantics kept|001|

### Main accessibility risks

- Visual lists built with `div`s: no count, no structure.
- CSS `list-style: none` removing list semantics in Safari.
- Item actions with identical names.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-LST-001|macOS|List role and count|High|WCAG 1.3.1|
|TEST-LST-002|macOS|Ordered list|Medium|WCAG 1.3.1|
|TEST-LST-003|macOS|Nested list|Medium|WCAG 1.3.1|
|TEST-LST-004|macOS|Items with actions|High|WCAG 2.4.6, 4.1.2|
|TEST-LST-101|iOS|List boundaries|High|WCAG 1.3.1|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md).
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

An unordered list of 4 items styled without bullets; an ordered list of 3 steps; a nested list; a list of 3 files each with a "Delete" button.

### Initial state

Static.

## 3. VoiceOver tests on macOS

### TEST-LST-001 — List role and count

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` into the unordered list|List role and item count, e.g. "list, 4 items"|Fail if no list semantics when the content is visually a list|
|2|`VO + Command + X`|Moves to the next list|Observation|

Safari may drop list semantics when bullets are removed with CSS. If so, record it: the design system must restore them (for example `role="list"`).

### TEST-LST-002 — Ordered list

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` through the steps|Numbers or positions spoken|Fail if the order matters and is not conveyed|

### TEST-LST-003 — Nested list

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Enter the sub-list|A new list with its count is spoken|Fail if levels are flattened with no cue|

### TEST-LST-004 — Items with actions

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` through the file list|Each "Delete" button is understandable with its item|Fail if the target cannot be determined (see [Icon Button](../actions/icon-button.md) TEST-ICB-006)|

## 4. VoiceOver tests on iOS

### TEST-LST-101 — List boundaries

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe into and out of each list|Start and end of the list are perceivable, with a count|Fail if no list semantics|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Jump between lists|`VO + Command + X`|Rotor, if a list category is available|

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|List|—|List|Item count|DOM order|None|—|Count on entry|
|Item|Content|List item|Position|List order|Inner controls|—|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Entering|"list, 4 items"|
|iOS|Entering|"list start"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|List structure and order|WCAG 1.3.1 (A)|Normative|001–003, 101|
|Action labels distinguishable|WCAG 2.4.6 (AA), 4.1.2 (A)|Normative|004|
|Semantics kept when styled|Best practice|Best practice|001|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|No list spoken|Size and grouping unknown|`div` items, or CSS reset in Safari|`ul`/`ol`, or `role="list"`|
|"Delete" ×3|Wrong item affected|Same name|Name includes the item|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|List role and count|001, 101|Not tested|Not tested||
|Order conveyed|002|Not tested|Not applicable||
|Nesting conveyed|003|Not tested|Not applicable||
|Item actions distinguishable|004|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Card](card.md) · [Icon Button](../actions/icon-button.md)
