---
id: CMP-CPX-003
title: Carousel
family: complex
platforms: [macos, ios]
status: specification
---

# Carousel

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string.

## 1. Component overview

**Purpose:** show a set of slides one (or a few) at a time, with previous/next controls, optional slide pickers and optional automatic rotation.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Manual|Controls named; current slide position|002, 003, 101|
|Automatic rotation|Pause control; stops on focus|004, 102|
|Slide picker (dots or tabs)|Names and selected state|005|
|First / last slide|Edge behavior|003|

### Main accessibility risks

- Rotation that cannot be paused, or moves the reading point.
- Previous/next as unnamed arrows.
- Hidden slides read or focusable.
- Slide changes silent.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-CAR-001|macOS|Keyboard operation without VoiceOver|Critical|WCAG 2.1.1, 2.2.2|
|TEST-CAR-002|macOS|Structure and position|High|WCAG 1.3.1|
|TEST-CAR-003|macOS|Previous and next|Critical|WCAG 4.1.2|
|TEST-CAR-004|macOS|Automatic rotation|Critical|WCAG 2.2.2|
|TEST-CAR-005|macOS|Slide picker|Medium|WCAG 4.1.2|
|TEST-CAR-101|iOS|Reaching slides and controls|Critical|WCAG 1.3.2|
|TEST-CAR-102|iOS|Rotation while reading|Critical|WCAG 2.2.2|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md). For TEST-CAR-001, enable **System Settings › Keyboard › Keyboard navigation** and Safari **Settings › Advanced › Press Tab to highlight each item on a webpage**, or use Option-Tab and record it.
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level, and whether Reduce Motion is on.

### Test page

A carousel "Featured products" with 5 slides (image, title, link), previous/next buttons, a picker, and automatic rotation every 5 seconds, if supported.

### Initial state

Slide 1; rotation running, if supported.

## 3. VoiceOver tests on macOS

### TEST-CAR-001 — Keyboard operation without VoiceOver

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver off. Tab into the carousel|Rotation stops while focus is inside; a pause control is reachable first|Fail if rotation continues with focus inside and no pause control exists|
|2|Tab through|Only the visible slide's link is focusable|Fail if hidden slides take focus|
|3|Press Return on "Next"|Next slide shown; focus stays on "Next"|Fail if focus lost|

### TEST-CAR-002 — Structure and position

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|VoiceOver on. `VO + Right Arrow` into it|Name, e.g. "Featured products, carousel"; slide position, e.g. "1 of 5"|Minor if position is missing|

### TEST-CAR-003 — Previous and next

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Reach the controls|Named "Previous slide", "Next slide"|Fail if unnamed or arrows only|
|2|`VO + Space` on "Next"|New slide perceivable (announced or read next)|Fail if the change is silent and the cursor reads the old slide|
|3|On slide 5, "Next"|Wraps or is disabled, as documented, and says so|Fail if active but does nothing|

### TEST-CAR-004 — Automatic rotation

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Reach the pause control|Named, with state, e.g. "Pause rotation, button"|Fail if absent while rotation lasts more than 5 seconds (WCAG 2.2.2)|
|2|Read a slide with `VO + Right Arrow` while rotation runs|The slide does not change under the cursor; rotation is not announced|Fail if slides change and are announced while reading|

### TEST-CAR-005 — Slide picker

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Reach the dots|Each named, e.g. "Slide 3", current one with selected state|Fail if unnamed|

## 4. VoiceOver tests on iOS

### TEST-CAR-101 — Reaching slides and controls

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe through the carousel|Controls named; only the visible slide read|Fail if hidden slides read|
|2|Double tap "Next"|Slide change perceivable|Fail if silent|
|3|Three-finger swipe left on the slides, if the carousel supports it|Slide changes|Observation|

### TEST-CAR-102 — Rotation while reading

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Place VoiceOver focus on a slide and wait 10 seconds|The slide does not change under VoiceOver focus, or rotation is paused|Fail if focus is moved or the content changes under it|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Stopping rotation|Focus inside, or pause button|VoiceOver focus may not trigger focus events; the pause button is the reliable path|

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Carousel|"Featured products"|Region (carousel)|Rotating / paused|Pause, controls, slide|—|—|—|
|Slide|"n of 5"|Group (slide)|Visible|Current only|Inner link|—|On manual change|
|Control|Action|Button|Disabled at ends if no wrap|—|Return, double tap|Stays|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Slide|"2 of 5, slide"|
|iOS|Pause|"Pause rotation, button"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Pause, stop, hide|WCAG 2.2.2 (A)|Normative|001, 004, 102|
|Keyboard operation|WCAG 2.1.1 (A)|Normative|001|
|Names and states of controls|WCAG 4.1.2 (A)|Normative|003–005|
|Structure and order|WCAG 1.3.1 (A), 1.3.2 (A)|Normative|002, 101|
|Hidden slides hidden|A11Y-33|Best practice|001, 101|
|Carousel pattern|[APG Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)|Best practice|002, 004|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|No pause|Reading interrupted|Autoplay without control|Pause button first in the carousel; stop on focus|
|Hidden slides focusable|Lost focus|Off-screen slides not hidden|`inert` or `hidden` on hidden slides|
|Arrows unnamed|Unknown controls|Icon only|Accessible names|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Keyboard; rotation stops; hidden slides not focusable|001|Not tested|Not applicable||
|Name and position|002|Not tested|Not applicable||
|Controls named, change perceivable|003, 101|Not tested|Not tested||
|Pause control; no change under the reader|004, 102|Not tested|Not tested||
|Picker|005|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Button](../actions/button.md) · [Tabs](../navigation/tabs.md)
