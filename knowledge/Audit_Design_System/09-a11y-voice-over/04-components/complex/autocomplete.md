---
id: CMP-CPX-001
title: Autocomplete
family: complex
platforms: [macos, ios]
status: specification
---

# Autocomplete

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** a free-text field that offers suggestions while the user types; the user may ignore them. When the value must be one of the options, use [Combobox](combobox.md), which holds the full keyboard contract; this specification focuses on what differs.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Suggestions appear|Availability announced; field stays editable|002, 101|
|Suggestion highlighted|Spoken; query kept|003|
|Suggestion chosen|Value spoken; popup closed|003, 102|
|Free text kept|No forced replacement|004|
|No suggestion|Nothing announced, or "no suggestions"|005|
|Inline completion (text completed in the field)|Completion spoken and selectable|006|

### Main accessibility risks

- Suggestions appear silently.
- The typed text is replaced by the first suggestion on blur.
- Suggestions unreachable on iOS.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-AUT-001|macOS|Keyboard contract without VoiceOver|Critical|WCAG 2.1.1|
|TEST-AUT-002|macOS|Suggestions announced|Critical|WCAG 4.1.3, 4.1.2|
|TEST-AUT-003|macOS|Highlight and choose|Critical|WCAG 4.1.2|
|TEST-AUT-004|macOS|Free text kept|High|WCAG 3.2.2|
|TEST-AUT-005|macOS|No suggestion|Low|WCAG 4.1.3|
|TEST-AUT-006|macOS|Inline completion|Medium|WCAG 4.1.2|
|TEST-AUT-101|iOS|Suggestions reachable|Critical|WCAG 4.1.3|
|TEST-AUT-102|iOS|Choosing a suggestion|Critical|WCAG 4.1.2|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-AUT-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

"City": free text with suggestions from a list of 100 cities; inline completion variant if supported; a submit button.

### Initial state

Empty.

## 3. VoiceOver tests on macOS

Contract: [Keyboard Interactions §9](../../../04-interaction-quality/keyboard-interactions.md).

### TEST-AUT-001 — Keyboard contract without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Type "par"|Suggestions appear; typing continues normally|Fail if typing is blocked or slowed|
|2|Down Arrow, Return|The suggestion is chosen; form not submitted|Fail if submitted|
|3|Type "Parisville", press Tab|The free text stays|Fail if replaced by a suggestion|
|4|Press Escape with suggestions open|Suggestions close; text kept|Fail if text lost|

### TEST-AUT-002 — Suggestions announced

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` to "City"|Name and a hint that suggestions exist (e.g. autocomplete role or description)|Observation if missing|
|2|Type "par" and pause|Availability announced, e.g. "4 suggestions"|Fail if suggestions appear silently and cannot be discovered from the field|

### TEST-AUT-003 — Highlight and choose

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Press Down Arrow|The highlighted suggestion is spoken|Fail if silent|
|2|Press Return|Chosen value spoken; popup closed; focus in the field|Fail if value not spoken on re-reading|

### TEST-AUT-004 — Free text kept

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Type a city not in the list, leave the field|The text is kept, no unexpected change|Fail if replaced (WCAG 3.2.2)|

### TEST-AUT-005 — No suggestion

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Type "zzz"|No suggestion popup, or "no suggestions" spoken|Fail if an empty popup stays open and is spoken as expanded|

### TEST-AUT-006 — Inline completion

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Type "Pa" in the inline variant|The completed text is spoken, selected after the cursor|Fail if the completion is silent|
|2|Keep typing|The completion is replaced by typed text|Fail if typing is blocked|

## 4. VoiceOver tests on iOS

### TEST-AUT-101 — Suggestions reachable

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap, type "par"|Suggestions announced or perceivable|Fail if silent|
|2|Swipe right from the field|Suggestions reached|Fail if unreachable|

### TEST-AUT-102 — Choosing a suggestion

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap a suggestion|Value set and spoken; VoiceOver focus back in the field or nearby|Fail if focus lost|

### Differences from macOS

Same as [Combobox](combobox.md): on iOS, suggestions are reached by swiping, not by arrows.

## 5. Expected results

|Scenario|Accessible name|Role|State or value|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Field|Label|Combobox or text field with autocomplete|Value; expanded when suggestions shown|Visual order|Typing, arrows, Return, Escape|Field|Suggestions count|
|Suggestion|Text|Option|Highlighted|After field|Return, double tap|Field|Highlight|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Suggestions|"4 suggestions available"|
|iOS|Suggestion|"Paris"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Suggestion availability as status|WCAG 4.1.3 (AA); A11Y-31|Normative|002, 005, 101|
|Name, role, expanded, highlight|WCAG 4.1.2 (A)|Normative|002, 003, 006, 102|
|Keyboard operation|WCAG 2.1.1 (A)|Normative|001|
|No change of context on input|WCAG 3.2.2 (A)|Normative|004|
|Combobox pattern with `aria-autocomplete`|[APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)|Best practice|002|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Suggestions silent|Feature unknown|No status|Polite count announcement|
|Text replaced on blur|Wrong data|Auto-commit|Commit only on explicit choice|
|Suggestions unreachable on iOS|Feature unusable|Popup outside reading order|Place it after the field|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard contract; free text kept|001, 004|Not tested|Not applicable||
|Suggestions announced and reachable|002, 101|Not tested|Not tested||
|Highlight and choice spoken|003, 102|Not tested|Not tested||
|Empty state|005|Not tested|Not applicable||
|Inline completion|006|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Combobox](combobox.md) · [Search Field](../forms/search.md) · [Keyboard Interactions §9](../../../04-interaction-quality/keyboard-interactions.md)
