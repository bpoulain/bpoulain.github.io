# Theme Invariants

> **Purpose:** Define what must remain true in every theme, so that customization cannot lower quality.
> 
> **Scope:** Customizable tokens, invariants, automated verification and its limits.
> 
> **Related principles:** DP-02 Neutral-First Color, DP-03 Subtle Contrast Hierarchy, DP-05 Geometric Consistency, DP-15 Semantic Consistency.
> 
> **Framework context:** Framework-agnostic.

---

# 1. Principle

Quality is a property of the system, not of one palette.

A criterion that names a color value can only judge one theme. A criterion that states a relationship can judge all of them.

This document therefore defines relationships. Every other document should do the same when it talks about a value that a theme can change.

---

# 2. What a Theme Can Change

|Layer|Examples|Rule|
|---|---|---|
|Free, within invariants|Primary color, background tint, neutral scale, semantic colors, radius, fonts, density|A theme can set these values|
|Derived|Text on primary, hover and active colors, borders, focus color|Calculated from the free values, or overridden and then checked|
|Fixed|Token roles, state model, keyboard behavior, accessibility contracts|A theme cannot change these|

A theme changes values. It does not change meaning.

---

# 3. Invariants

Each invariant is checked for each mode of a theme, usually light and dark.

Thresholds are defined in `contrast-balance.md`, sections 4.2 and 13.3. Values from section 13.3 remain hypotheses until the first audit.

Input states which data a check needs: Tokens means the token values alone, Render means a rendered component.

## 3.1. Color

|ID|Invariant|Input|Severity|
|---|---|---|---|
|THEME-01|Every allowed foreground and surface pair meets its APCA floor|Tokens|P0|
|THEME-02|Text on the primary color meets its floor in resting, hover, active and disabled states|Tokens|P0|
|THEME-03|Each neutral scale progresses in one direction in L*|Tokens|P1|
|THEME-04|Adjacent surfaces can be told apart|Tokens|P1|
|THEME-05|Hover, active and selected states differ from their resting state|Tokens|P1|
|THEME-06|The focus indicator meets its floor against every surface it can appear on|Tokens|P0|
|THEME-07|The primary color stays distinct from destructive, success and warning, so that a red primary cannot be mistaken for destructive. Info may share the primary color|Tokens|P1|
|THEME-08|Semantic colors of the same role differ from each other|Tokens|P1|
|THEME-09|Foreground and surface roles keep the same L* order in every mode|Tokens|P1|
|THEME-10|Surface chroma stays lower than primary chroma, so that the accent still stands out|Tokens|P2|
|THEME-11|Every pair reports its WCAG 2.2 ratio|Tokens|P2|

## 3.2. Structure

|ID|Invariant|Input|Severity|
|---|---|---|---|
|THEME-20|Every required token role has a resolved value|Tokens|P0|
|THEME-21|No token reference is circular or unresolved|Tokens|P0|
|THEME-22|Size, space, radius and type scales are ordered: each step is larger than the previous one|Tokens|P1|
|THEME-23|The radius of a nested element does not exceed the radius of its container|Tokens|P2|
|THEME-24|Control heights keep their relationship to font size and icon size|Tokens|P1|
|THEME-25|Durations stay within the range set by the library|Tokens|P2|
|THEME-26|Reduced-motion values remain defined|Tokens|P1|

## 3.3. Rendering

|ID|Invariant|Input|Severity|
|---|---|---|---|
|THEME-30|Text stays inside its container with the theme's fonts and density|Render|P1|
|THEME-31|Pointer targets stay within the limits in `accessibility.md` at every density|Render|P1|
|THEME-32|Every component state renders without an unresolved value|Render|P0|
|THEME-33|Forced colors mode remains usable|Render|P1|

---

# 4. Automated Audit

The future theme tool and the release audit must share one implementation of these rules.

- **Rule source:** one machine-readable list, with each control's ID, severity, input and threshold.
- **Token audit:** takes a theme's values and returns a report. It needs no DOM, so it can run live in a theme editor, at build time and in a test.
- **Rendered audit:** runs in a real browser on a sample of components and states.
- **Blocking:** a theme with an open P0 cannot be exported or released.
- **Report:** gives the failing pair, measured value, threshold and, when possible, the nearest passing value.

---

# 5. Limits

Passing these invariants proves that a theme is valid. It does not prove that the theme is beautiful or matches the quality bar.

Automation can verify floors, relationships and consistency. It cannot judge harmony, personality or the balance of a full screen.

A curated theme therefore also receives the human comparison described in `00-design-philosophy/design-direction.md`.
