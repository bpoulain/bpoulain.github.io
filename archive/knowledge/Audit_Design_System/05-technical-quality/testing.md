# Testing

> **Purpose:** Define what a component library must test, at which level, and what counts as proof of quality.
> 
> **Scope:** Unit, interaction, visual, accessibility, cross-browser, performance and regression tests, along with test quality.
> 
> **Related principles:** DP-11 Predictable Behavior, DP-15 Semantic Consistency.
> 
> **Framework context:** Framework-agnostic. Adapters belong in a separate document.

---

# 1. Principles

- A test must be able to fail. A test that cannot detect a known defect proves nothing.
- Test what users and consumers observe, not private implementation details.
- A simulated DOM cannot prove layout, focus rings, contrast or real keyboard behavior. Those need a real browser.
- Coverage percentages show what ran, not what was verified.
- Every defect fixed adds a test that fails without the fix.

---

# 2. Test Levels

|Level|Proves|Environment|Required for|
|---|---|---|---|
|Static|Types, lint and token references are valid|Build|All|
|Unit|Output for given inputs|Simulated DOM|All|
|Interaction|Behavior through real events|Real browser|Components with behavior|
|Accessibility|Scan and accessibility tree|Real browser|All|
|Visual regression|Rendered pixels by theme and state|Real browser|All|
|Cross-browser|Same behavior across engines|Chromium, Firefox, WebKit|Components with behavior|
|Performance|Budgets from `performance.md`|Real browser|Complex components|
|Consumer|The published package works from a clean install|Sample application|Each release|

---

# 3. Requirements

Methods: Script, DOM and Manual have the same meaning as in `accessibility.md`.

## 3.1. Coverage by Behavior

|ID|Requirement|Method|Severity|
|---|---|---|---|
|TEST-01|Every public prop or attribute has at least one test that observes its effect|Script|P2|
|TEST-02|Every variant and size renders in a test|Script|P2|
|TEST-03|Every state in the visual state matrix has a test|Script|P1|
|TEST-04|Every documented event has a test of its timing and payload|Script|P1|
|TEST-05|Controlled and uncontrolled modes are both tested|Script|P1|
|TEST-06|External state updates are tested during user interaction|Script|P1|
|TEST-07|Empty, long, wrapped and right-to-left content are tested|Script|P2|
|TEST-08|Invalid input produces a defined result|Script|P2|
|TEST-09|Output that includes consumer content is tested with HTML-sensitive characters|Script|P0|

## 3.2. Interaction and Keyboard

|ID|Requirement|Method|Severity|
|---|---|---|---|
|TEST-10|Each binding in `keyboard-interactions.md` has a test in a real browser|Script|P1|
|TEST-11|Focus movement and restoration are asserted|Script|P1|
|TEST-12|Pointer, touch and keyboard paths are each tested when they differ|Script|P2|
|TEST-13|Rapid and repeated actions are tested|Script|P2|
|TEST-14|Stress scenarios from `lifecycle.md` run in the test suite|Script|P1|

## 3.3. Visual

|ID|Requirement|Method|Severity|
|---|---|---|---|
|TEST-20|Snapshots cover each state in light and dark themes|Script|P1|
|TEST-21|Snapshots cover forced colors and 200% zoom for key components|Script|P2|
|TEST-22|Snapshots are generated in a stable environment, with fonts loaded and animation disabled|Script|P2|
|TEST-23|Each accepted visual change is reviewed by a person|Manual|P2|

## 3.4. Accessibility

|ID|Requirement|Method|Severity|
|---|---|---|---|
|TEST-30|An automated accessibility scan runs on each state|Script|P1|
|TEST-31|The contrast report runs on every token change and fails below the APCA floors|Script|P1|
|TEST-32|Manual screen reader checks are recorded with date and versions|Manual|P1|

---

# 4. Test Quality

|ID|Requirement|Method|Severity|
|---|---|---|---|
|TEST-40|The suite is deterministic: 20 consecutive runs produce the same result|Script|P1|
|TEST-41|Tests do not depend on execution order|Script|P2|
|TEST-42|Mutating key behavior makes a test fail|Script|P2|
|TEST-43|Skipped tests have a tracked reason|Script|P2|
|TEST-44|Every test runs on each change before merging|Script|P1|
|TEST-45|Generic contract tests apply to every component, so that new components inherit them|Script|P2|

To verify TEST-42, deliberately break a sample of behaviors and record whether the suite detects each one. Report the detection rate.

---

# 5. Evidence

|Result|Accepted evidence|
|---|---|
|Coverage by behavior|Mapping from each prop, state and event to its test|
|Test quality|Report of repeated runs and deliberate breaks|
|Visual|Stored snapshots and their review history|
|Manual|Dated record with tools and versions|

---

# 6. Scoring

|Score|Meaning|
|---|---|
|0|No tests|
|1|Render tests only, no behavior asserted|
|2|Behavior tested in a simulated DOM only|
|3|Behavior, keyboard and visual states tested in a real browser|
|4|Score 3, plus repeated runs and deliberate breaks show the suite detects defects|

A component with behavior that has never run in a real browser cannot score above 2.
