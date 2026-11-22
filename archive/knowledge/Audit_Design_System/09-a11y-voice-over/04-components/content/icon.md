---
id: CMP-CNT-005
title: Icon
family: content
platforms: [macos, ios]
status: specification
---

# Icon

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string. An icon is read, not operated; an icon used as a control is tested with [Icon Button](../actions/icon-button.md).

## 1. Component overview

**Purpose:** a small symbol, decorative next to text, or meaningful on its own (status, warning).

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Decorative next to text|Hidden|001, 101|
|Meaningful alone (status)|Named|002, 101|
|Icon font or emoji|No stray characters read|003|

### Main accessibility risks

- Decorative icons announced ("image", glyph name, private-use characters).
- Status icon without text: meaning lost.
- Emoji read with their long names.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-ICN-001|macOS|Decorative icon hidden|High|A11Y-34|
|TEST-ICN-002|macOS|Meaningful icon named|Critical|WCAG 1.1.1|
|TEST-ICN-003|macOS|Icon fonts and emoji|Medium|WCAG 1.1.1|
|TEST-ICN-101|iOS|Same checks by swiping|High|WCAG 1.1.1|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md).
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md).
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

A "Download" text with a decorative icon; a status column with a meaningful "Error" icon without text; an icon from an icon font, if supported; an emoji used decoratively.

### Initial state

Static.

## 3. VoiceOver tests on macOS

### TEST-ICN-001 — Decorative icon hidden

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` across "Download"|Only "Download" is spoken|Minor if "image" or a glyph is spoken in addition|

### TEST-ICN-002 — Meaningful icon named

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to the status icon|Its meaning, e.g. "Error"|Fail if silent or "image" only|

### TEST-ICN-003 — Icon fonts and emoji

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Reach the icon-font icon|Hidden, or named|Fail if a strange character or nothing meaningful is read where meaning is needed|
|2|Reach the decorative emoji|Hidden|Minor if read|

## 4. VoiceOver tests on iOS

### TEST-ICN-101 — Same checks by swiping

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe across each case|Same results as macOS|Same criteria|

### Differences from macOS

No specific difference.

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Decorative|None|Hidden|—|Skipped|None|—|—|
|Meaningful|Meaning|Image|—|Visual order|None|—|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Meaningful|"Error, image"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Text alternative for meaningful icons|WCAG 1.1.1 (A)|Normative|002, 003, 101|
|Not by color or shape alone|WCAG 1.4.1 (A)|Normative|002|
|Decorative hidden|A11Y-34|Best practice|001, 003|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|"image" next to every label|Noise|SVG not hidden|`aria-hidden="true"`|
|Status silent|Meaning lost|Icon without name|`role="img"` with `aria-label`, or visible text|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Decorative hidden|001, 101|Not tested|Not tested||
|Meaningful named|002, 101|Not tested|Not tested||
|Icon fonts and emoji|003|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Icon Button](../actions/icon-button.md) · [Image](image.md)
