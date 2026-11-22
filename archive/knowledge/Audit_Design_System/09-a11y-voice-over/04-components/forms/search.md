---
id: CMP-FRM-006
title: Search Field
family: forms
platforms: [macos, ios]
status: specification
---

# Search Field

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** enter a query and get results, on submission or as the user types. Suggestions shown while typing are tested with [Autocomplete](../complex/autocomplete.md); this specification tests the field, its clear and submit controls, and the results feedback.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Empty|Name, role, search landmark|002, 101|
|Filled, with a clear button|Clear button named; focus after clearing|003, 102|
|Results on submission|Results announced; focus|004, 103|
|Live results while typing|Count announced without interruption|005|
|No results|Empty state perceivable|006, 103|

### Main accessibility risks

- Field named only by a magnifier icon or a placeholder.
- Clear and submit buttons without names.
- Results updated silently.
- Focus lost after clearing.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-SRC-001|macOS|Keyboard operation without VoiceOver|Critical|WCAG 2.1.1|
|TEST-SRC-002|macOS|Name, role, landmark|Critical|WCAG 4.1.2, 1.3.1|
|TEST-SRC-003|macOS|Clear button|High|WCAG 4.1.2, 2.4.3|
|TEST-SRC-004|macOS|Results on submission|Critical|WCAG 4.1.3|
|TEST-SRC-005|macOS|Live results|High|WCAG 4.1.3|
|TEST-SRC-006|macOS|No results|High|WCAG 4.1.3|
|TEST-SRC-101|iOS|Discovery|Critical|WCAG 4.1.2|
|TEST-SRC-102|iOS|Typing and clearing|High|WCAG 4.1.2|
|TEST-SRC-103|iOS|Results and no results|Critical|WCAG 4.1.3|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-SRC-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

A search form in a `search` landmark: field "Search products", clear button, submit button, a results region below. A query known to give results ("chair") and one giving none ("zzz").

### Initial state

Empty field, no results.

## 3. VoiceOver tests on macOS

### TEST-SRC-001 — Keyboard operation without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab to the field, type "chair", press Return|Results appear|Fail if Return does nothing and no other keyboard way exists|
|2|Tab to the clear button, press Return or Space|The field is emptied; focus returns to the field|Fail if focus is lost|
|3|Press Escape in a filled field, if documented|Clears the field|Observation|

### TEST-SRC-002 — Name, role, landmark

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` to the field|Name and role, e.g. "Search products, search text field"|Fail if the name is missing or only a placeholder|
|2|`VO + U`, **Landmarks**|A search landmark is listed|Observation if missing; best practice|

### TEST-SRC-003 — Clear button

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Type "chair"; `VO + Right Arrow` to the clear button|Named, e.g. "Clear search, button"|Fail if only "button"|
|2|`VO + Space`|Field emptied; focus and VoiceOver cursor on the field|Fail if focus is lost|

### TEST-SRC-004 — Results on submission

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Type "chair", press Return|The number of results is announced, or focus moves to the results heading|Fail if results appear silently and focus stays without indication|
|2|`VO + Right Arrow` from the field|The results heading or region is reachable soon after|Minor if far in the reading order|

### TEST-SRC-005 — Live results

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Type "chair" letter by letter|The count is announced after a pause, not for every keystroke|Minor if every keystroke announces; Fail if never announced and not findable|
|2|Check typing|Not interrupted; focus stays in the field|Fail if focus moves while typing|

### TEST-SRC-006 — No results

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Search "zzz"|"No results" announced or focused|Fail if only visual|

## 4. VoiceOver tests on iOS

### TEST-SRC-101 — Discovery

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe to the field|Name and search field role|Fail if no name|

### TEST-SRC-102 — Typing and clearing

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap, type "chair", activate the keyboard's search key|The query is submitted|Fail if not|
|2|Swipe to the clear button, double tap|Named; field emptied; VoiceOver focus nearby|Fail if unnamed or focus lost|

### TEST-SRC-103 — Results and no results

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|After submission, listen and swipe|Result count announced, or results reached in a few swipes|Fail if silent and unfindable|
|2|Search "zzz"|Empty state perceivable|Fail if only visual|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Submit|Return|Keyboard search key; on-page submit button|
|Clear|Escape (if documented), clear button|Clear button only|

## 5. Expected results

|Scenario|Accessible name|Role|State or value|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Field|"Search products"|Search field|Query|In a search landmark|Typing, Return|Field|—|
|Clear button|"Clear search"|Button|—|After the field|Return, Space|Back to field|—|
|Results|Results heading|Region, list|Count|After the form|—|Unchanged or on heading|Count|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Field|"Search products, search text field"|
|macOS|Results|"12 results"|
|iOS|Field|"Search products, search field"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Name and role|WCAG 4.1.2 (A); A11Y-30|Normative|002, 003, 101, 102|
|Visible label or instructions|WCAG 3.3.2 (A)|Normative|002|
|Results status|WCAG 4.1.3 (AA); A11Y-31|Normative|004–006, 103|
|Keyboard operation|WCAG 2.1.1 (A)|Normative|001|
|Focus after clearing|WCAG 2.4.3 (A)|Normative|003|
|Search landmark|WAI-ARIA `search` role|Best practice|002|
|No announcement per keystroke|A11Y-32|Best practice|005|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|Field without name|Purpose unknown|Icon or placeholder only|Visible or hidden `label`|
|Clear button "button"|Unknown action|Icon without name|`aria-label`|
|Results silent|The user waits or searches again|No status region|Polite live region with the count|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard submit and clear|001|Not tested|Not applicable||
|Name, role, landmark|002, 101|Not tested|Not tested||
|Clear button named, focus kept|003, 102|Not tested|Not tested||
|Results announced|004, 005, 103|Not tested|Not tested||
|No results perceivable|006, 103|Not tested|Not tested||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Text Input](text-input.md) · [Autocomplete](../complex/autocomplete.md) · [Loading State](../feedback/loading.md)
