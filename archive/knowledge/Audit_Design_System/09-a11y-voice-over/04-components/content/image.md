---
id: CMP-CNT-004
title: Image
family: content
platforms: [macos, ios]
status: specification
---

# Image

Follows the structure of the reference specifications [Button](../actions/button.md) and [Dialog](../overlays/dialog.md). Every step separates the **tester action**, the **expected behavior** and the **validation criterion**. Spoken examples are illustrative: wording varies with OS version, language, verbosity and markup. Assert the information conveyed, never the exact string. An image is read, not operated, unless it is inside a link or a button.

## 1. Component overview

**Purpose:** show informative, decorative or functional pictures; avatars and figures with captions are included.

### Variants and states

|Variant or state|What to verify|Test IDs|
|---|---|---|
|Informative|Alternative conveys the information|001, 101|
|Decorative|Skipped|002, 101|
|Functional (inside a link or button)|Alternative describes the destination or action|003|
|Complex (chart, diagram)|Short alternative plus a long description|004|
|Figure with caption|Caption tied to the image|005|
|Avatar with fallback initials|Person named once|006|

### Main accessibility risks

- No `alt`: VoiceOver may read the file name.
- Decorative images announced.
- Functional image described visually ("arrow") instead of by purpose.
- Image of text.

### Test index

|Test ID|Platform|Scenario|Priority|Reference|
|---|---|---|---|---|
|TEST-IMG-001|macOS|Informative image|Critical|WCAG 1.1.1|
|TEST-IMG-002|macOS|Decorative image|High|WCAG 1.1.1|
|TEST-IMG-003|macOS|Functional image|Critical|WCAG 1.1.1, 2.4.4|
|TEST-IMG-004|macOS|Complex image|High|WCAG 1.1.1|
|TEST-IMG-005|macOS|Figure and caption|Medium|WCAG 1.3.1|
|TEST-IMG-006|macOS|Avatar|Medium|WCAG 1.1.1|
|TEST-IMG-101|iOS|Images by swiping and touch|Critical|WCAG 1.1.1|

## 2. Prerequisites

### Configuration

- macOS: follow [macOS setup](../../02-voiceover/macos/setup.md).
- iOS: follow [iOS setup](../../02-voiceover/ios/setup.md). Note whether VoiceOver image descriptions (automatic recognition) are on; they must not be mistaken for the page's alternative.
- Record OS build, Safari version, VoiceOver language and verbosity level.

### Test page

An informative photo; a decorative divider image; a logo link to the home page; a chart with a long description; a figure with a caption; an avatar with an image and one with initials.

### Initial state

Static.

## 3. VoiceOver tests on macOS

### TEST-IMG-001 — Informative image

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to the photo|Image role and an alternative conveying its information|Fail if file name, "image" only, or a useless text ("photo")|

### TEST-IMG-002 — Decorative image

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` past the divider|Not spoken|Fail if announced (file name or "image")|

### TEST-IMG-003 — Functional image

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to the logo link|Link named by destination, e.g. "Home" or "Company name, home"|Fail if "logo.svg", "link" only or "logo"|

### TEST-IMG-004 — Complex image

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to the chart|Short alternative naming the chart|Fail if missing|
|2|Find the long description|Adjacent text, a data table or a description reachable next|Fail if the data is only in the picture|

### TEST-IMG-005 — Figure and caption

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` through the figure|Image and caption, related|Minor if the caption is read separately without relation|

### TEST-IMG-006 — Avatar

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|`VO + Right Arrow` to each avatar next to a name|The person's name spoken once; the image hidden if the name is already visible|Minor if repeated; Fail if initials are read letter by letter with no name|

## 4. VoiceOver tests on iOS

### TEST-IMG-101 — Images by swiping and touch

|#|Tester action|Expected behavior|Validation criterion|
|---|---|---|---|
|1|Swipe through the page|Same results as 001–006|Same criteria|
|2|Touch the decorative image|Silent, or only an automatic description from iOS|Fail if the page exposes a name for it|

### Differences from macOS

|Point|macOS|iOS|
|---|---|---|
|Automatic image descriptions|Possible, depending on settings|Possible; record them separately from the page's alternative|

## 5. Expected results

|Scenario|Accessible name|Role|State|Order|Interactions|Focus|Announcement|
|---|---|---|---|---|---|---|---|
|Informative|Equivalent text|Image|—|Visual order|None|—|—|
|Decorative|None|Hidden|—|Skipped|None|—|—|
|Functional|Purpose|Link or button|—|Visual order|Return, double tap|—|—|

|Platform|Situation|Illustrative output|
|---|---|---|
|macOS|Informative|"Team at the 2026 summit, image"|
|iOS|Functional|"Home, link"|

## 6. Conformance criteria

|Requirement|Basis|Kind|Tests|
|---|---|---|---|
|Text alternatives|WCAG 1.1.1 (A)|Normative|001–004, 006, 101|
|Link purpose|WCAG 2.4.4 (A)|Normative|003|
|Caption relationship|WCAG 1.3.1 (A)|Normative|005|
|No images of text|WCAG 1.4.5 (AA)|Normative, checked visually|—|
|Automatic descriptions|VoiceOver behavior|AT behavior|101|

## 7. Common failures

|Symptom|User impact|Likely cause|Fix|
|---|---|---|---|
|File name spoken|Meaningless|Missing `alt`|Provide `alt`|
|Decorative image announced|Noise|`alt` with text|`alt=""`|
|"Logo, link"|Destination unknown|Image described, not purpose|Describe the destination|

## 8. Validation checklist

Status: Pass, Fail, Not applicable, Not tested, Blocked. Copy this table into a campaign report in [07-reports](../../07-reports/README.md).

|Check|Tests|macOS|iOS|Observations|
|---|---|---|---|---|
|Informative alternative|001, 101|Not tested|Not tested||
|Decorative hidden|002, 101|Not tested|Not tested||
|Functional purpose|003, 101|Not tested|Not tested||
|Complex image description|004|Not tested|Not applicable||
|Caption|005|Not tested|Not applicable||
|Avatar|006|Not tested|Not applicable||

**Defects found:** issue IDs from the [Issue Template](../../06-templates/issue-template.md). **Evidence:** speech recording or transcript, environment, date (TEST-32).

## Related guidance

[Icon](icon.md) · [Card](card.md) · [Link](../actions/link.md)
