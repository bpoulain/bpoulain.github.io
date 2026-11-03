---
id: CMP-NAV-004
title: Pagination
family: navigation
platforms: [macos, ios]
status: specification
---

# Pagination

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** move between pages of a list of results.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|First, middle, last page|Current page; previous/next availability|002, 003, 101|
|Links (new URL) or buttons (same page update)|Role and focus after change|004, 102|
|Truncated with ellipsis|Ellipsis not announced as a control|002|
|Compact "Page 3 of 10"|Position spoken|002|

### Main accessibility risks

- Page numbers spoken as "3, link" without saying it is a page.
- Current page not exposed.
- Disabled previous/next still spoken as active.
- Content updated in place with focus left on the pagination and no announcement.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-PAG-001|macOS|Keyboard operation without VoiceOver|High|WCAG 2.1.1|
|TEST-PAG-002|macOS|Landmark, names, current page|Critical|WCAG 2.4.4, 1.3.1|
|TEST-PAG-003|macOS|Previous/next at the edges|High|WCAG 4.1.2|
|TEST-PAG-004|macOS|Changing page: focus and feedback|Critical|WCAG 2.4.3, 4.1.3|
|TEST-PAG-101|iOS|Discovery|Critical|WCAG 2.4.4|
|TEST-PAG-102|iOS|Changing page|Critical|WCAG 2.4.3|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-PAG-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

A list of results with 10 pages, a pagination in a `nav` labelled "Pagination", with previous, next, numbers and an ellipsis; start on page 1.

### Initial state

Page 1.

## 3. VoiceOver tests on macOS

### TEST-PAG-001 — Keyboard operation without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab through the pagination|Each control receives visible focus; the ellipsis does not|Fail if the ellipsis is focusable or a control is skipped|
|2|Press Return on "Next"|Page 2 loads|Fail if nothing happens|

### TEST-PAG-002 — Landmark, names, current page

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` into the pagination|"Pagination, navigation" or similar|Observation if no landmark|
|2|Continue|Numbers spoken as pages, e.g. "Page 2, link"; current page with a current state|Fail if the current page is not exposed (WCAG 1.3.1)|
|3|Reach "Previous" and "Next"|Named|Fail if arrows only, e.g. "‹, link" (WCAG 2.4.4)|

### TEST-PAG-003 — Previous/next at the edges

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|On page 1, reach "Previous"|Absent, or spoken as disabled|Fail if spoken as active and does nothing|
|2|On page 10, reach "Next"|Same|Same|

### TEST-PAG-004 — Changing page: focus and feedback

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Space` on "Page 3"|New URL: page loads and is read from the top or a skip target. Same page: focus moves to the results heading, or the change is announced|Fail if content changes silently and focus stays on the pagination with no indication|
|2|Re-read the pagination|"Page 3" now current|Fail if stale|

## 4. VoiceOver tests on iOS

### TEST-PAG-101 — Discovery

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe through the pagination|Pages named, current page exposed, edges disabled or absent|Fail on any of the macOS failures|

### TEST-PAG-102 — Changing page

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Double tap "Next"|New content perceivable; VoiceOver focus on the results or the change announced|Fail if silent|

### Differences from macOS

No specific difference beyond activation and navigation gestures.

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Container|"Pagination"|Navigation|—|After results|—|—|—|
|Number|"Page n"|Link or button|Current, if applicable|Numeric order|Return, `VO + Space`, double tap|Results or new page|Change|
|Previous / next|"Previous page", "Next page"|Link or button|Disabled at edges|Ends|Same|Same|Same|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Current|"current page, link, Page 1"|
|iOS|Next|"Next page, link"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Link purpose|WCAG 2.4.4 (A)|Normative|002, 101|
|Current page exposed|WCAG 1.3.1 (A)|Normative|002, 004|
|Disabled state|WCAG 4.1.2 (A)|Normative|003|
|Focus after change|WCAG 2.4.3 (A)|Normative|004, 102|
|Change announced when focus stays|WCAG 4.1.3 (AA)|Normative|004, 102|
|Keyboard operation|WCAG 2.1.1 (A)|Normative|001|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|"3, link"|Purpose unclear out of context|Number only|Hidden text "Page"|
|Current page silent|Position unknown|Styling only|`aria-current="page"`|
|Silent in-place update|User thinks nothing happened|Focus left on pagination|Move focus to the results heading|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard reach; ellipsis not focusable|001|Not tested|Not applicable||
|Names and current page|002, 101|Not tested|Not tested||
|Edges disabled or absent|003, 101|Not tested|Not tested||
|Focus and feedback after change|004, 102|Not tested|Not tested||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Link](../actions/link.md) · [Navigation Menu](menu.md) · [Data Table](../content/table.md)
