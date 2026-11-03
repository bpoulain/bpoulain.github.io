---
id: CMP-CPX-004
title: Tree View
family: complex
platforms: [macos, ios]
status: specification
---

# Tree View

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** a hierarchical list (folders, nested navigation) with expandable nodes. A simple nested navigation of links may be better served by a disclosure [Navigation Menu](../navigation/menu.md); this specification applies to `role="tree"`.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Collapsed / expanded node|State; children visible|003, 101|
|Levels and positions|Level, position in set|002|
|Selected node|Selected state, distinct from focus|004|
|Multi-select or checkable|Checked state|005|

### Main accessibility risks

- No tree roles: hierarchy lost.
- Every node a Tab stop.
- Level and position not exposed.
- Hidden children still reachable.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-TRV-001|macOS|Keyboard contract without VoiceOver|Critical|WCAG 2.1.1|
|TEST-TRV-002|macOS|Role, level, position|Critical|WCAG 1.3.1, 4.1.2|
|TEST-TRV-003|macOS|Expanding and collapsing|Critical|WCAG 4.1.2|
|TEST-TRV-004|macOS|Selection|High|WCAG 4.1.2|
|TEST-TRV-005|macOS|Checkable nodes|Medium|WCAG 4.1.2|
|TEST-TRV-101|iOS|Swiping and expanding|Critical|WCAG 1.3.1, 4.1.2|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-TRV-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

A tree "Files" with 3 levels: "Documents" (with "Reports" containing 2 files), "Images", "Music"; one node selected.

### Initial state

All collapsed except "Documents".

## 3. VoiceOver tests on macOS

Contract: [Keyboard Interactions §14](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-TRV-001 — Keyboard contract without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab into the tree|One Tab stop: the selected or first node|Fail if every node is a Tab stop|
|2|Down/Up Arrow|Next/previous visible node|Fail if hidden nodes are reached|
|3|Right Arrow on a collapsed node; again|Expands; then moves to the first child|Fail if not|
|4|Left Arrow on a child; on an expanded parent|Moves to the parent; collapses|Fail if not|
|5|Home/End, typeahead|First/last visible node; first node starting with the typed letter|Observation if typeahead missing|

### TEST-TRV-002 — Role, level, position

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. Reach the tree|Tree role; VoiceOver may call it an outline|Fail if spoken as a plain list without hierarchy|
|2|Move to "Reports"|Name, level, position and state, e.g. "Reports, level 2, 1 of 1, collapsed"|Fail if level is not exposed|

### TEST-TRV-003 — Expanding and collapsing

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Right Arrow on "Reports"|"expanded" spoken|Fail if silent|
|2|Collapse it; Down Arrow|Children not reached|Fail if hidden children are reached|

### TEST-TRV-004 — Selection

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Move focus away from the selected node|The focused node is not spoken as selected|Fail if focus and selection are confused|
|2|Press Return or Space on a node|Selection changes as documented; spoken|Fail if the selected state is visual only|

### TEST-TRV-005 — Checkable nodes

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Toggle a checkable node|Checked, unchecked or mixed state spoken|Fail if no state|

## 4. VoiceOver tests on iOS

### TEST-TRV-101 — Swiping and expanding

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe through visible nodes|Names with level and state|Fail if hierarchy is lost|
|2|Double tap a collapsed node|Expanded; children follow on the next swipe|Fail if children cannot be reached or state is silent|

Arrow-key behavior has no equivalent on iOS; expanding by double tap must work.

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Moving and expanding|Arrows|Swipe and double tap|

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Tree|"Files"|Tree (outline)|—|—|One Tab stop|—|—|
|Node|Label|Tree item|Level, position, expanded, selected|Visible nodes in order|Arrows, Home/End, typeahead, Return/Space|Roving|New state|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Node|"Reports, level 2, collapsed"|
|iOS|Node|"Reports, collapsed, level 2"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Hierarchy exposed|WCAG 1.3.1 (A)|Normative|002, 101|
|Name, role, states|WCAG 4.1.2 (A)|Normative|002–005, 101|
|Keyboard operation|WCAG 2.1.1 (A)|Normative|001|
|Tree keys, focus separate from selection|Keyboard Interactions §14; [APG Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)|Best practice|001, 004|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|No level spoken|Hierarchy lost|No `aria-level` or nesting|Nested `group`s or `aria-level`|
|Hidden children reached|Confusion|Collapsed items not hidden|Hide collapsed groups|
|Every node a Tab stop|Slow|No roving tabindex|One Tab stop|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard contract|001|Not tested|Not applicable||
|Role, level, position|002, 101|Not tested|Not tested||
|Expand and collapse|003, 101|Not tested|Not tested||
|Focus vs selection|004|Not tested|Not applicable||
|Checkable nodes|005|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Keyboard Interactions §14](../../../04-interaction-quality/keyboard-interactions.md) · [Navigation Menu](../navigation/menu.md) · [Accordion](../navigation/accordion.md)
