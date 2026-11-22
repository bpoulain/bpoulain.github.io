# Contrast Balance

> **Purpose:** Define how luminance, color contrast, visual intensity and foreground/background relationships are controlled to establish readable, accessible and visually balanced interfaces.
> 
> **Scope:** Text contrast, surface contrast, semantic contrast, visual hierarchy, interactive contrast, border visibility, icon contrast, state differentiation, contrast accessibility, dark/light consistency and perceptual balance.
> 
> **Related principles:** Minimalism, Color Philosophy, Typography, Visual Hierarchy, Functional Density, Surface Treatment, Visual Refinement and Accessibility.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.
> 
> **Framework context:** Reef.js — state-based reactive framework.

---

# 1. Contrast Philosophy

## 1.1. Definition

Contrast is the perceptual difference between two visual elements.

It can be created through differences in:

- Luminance.
- Hue.
- Saturation.
- Opacity.
- Brightness.
- Visual weight.
- Shape.
- Size.

In interface design, contrast establishes visual differentiation and helps users identify important information.

## 1.2. Core principle

**Contrast must communicate hierarchy, not create visual noise.**

Every contrast decision should have a purpose.

It should help users distinguish:

- Primary from secondary information.
- Foreground from background.
- Interactive from non-interactive elements.
- Selected from unselected states.
- Important from supplementary content.
- Enabled from disabled controls.

## 1.3. Contrast versus decoration

|Functional contrast|Decorative contrast|
|---|---|
|Establishes information hierarchy|Adds unnecessary color variations|
|Improves readability|Creates visual noise|
|Distinguishes interaction states|Makes every element stand out|
|Separates surfaces|Introduces arbitrary brightness differences|
|Supports accessibility|Relies on aesthetic appearance alone|

## 1.4. Contrast philosophy for restrained interfaces

A restrained interface should generally follow these principles:

1. High contrast for essential information.
2. Controlled contrast for secondary information.
3. Subtle contrast for structural boundaries.
4. Strong contrast for important interaction states.
5. Limited use of saturated colors.
6. Consistent contrast relationships across components.

A subtle interface is not an interface with uniformly low contrast.

It is an interface where contrast is allocated intentionally.

## 1.5. Rules

- Prioritize readability over aesthetic subtlety.
- Use contrast to reinforce hierarchy.
- Avoid making every element equally prominent.
- Avoid excessive contrast between adjacent surfaces.
- Distinguish functional contrast from decorative contrast.
- Validate actual foreground/background combinations.
- Preserve accessibility in every theme.
- Do not rely exclusively on color to communicate meaning.

## 1.6. Audit checklist

- [ ] Contrast has a documented design philosophy.
- [ ] Primary and secondary content have distinct contrast levels.
- [ ] Structural contrast remains subtle but visible.
- [ ] Interactive states are distinguishable.
- [ ] Important information has sufficient contrast.
- [ ] Decorative contrast is limited.
- [ ] Light and dark themes preserve readability.

---

# 2. Contrast Hierarchy

## 2.1. Definition

Contrast hierarchy defines how much visual prominence different elements receive.

Not all content deserves the same contrast.

A title, description, metadata label and disabled action should not have identical visual intensity.

## 2.2. Recommended hierarchy

|Level|Semantic role|Typical usage|
|---|---|---|
|1|Primary|Main text, important actions|
|2|Secondary|Descriptions, supporting content|
|3|Tertiary|Metadata, timestamps, supplementary labels|
|4|Subtle|Decorative separators and low-priority information|
|5|Disabled|Unavailable or inactive content|

These levels represent semantic roles, not fixed opacity values.

For example, disabled text may need more contrast than tertiary text to remain readable, depending on the context.

## 2.3. Example

```text
Project Settings

Configure your workspace and preferences.

General
Manage your workspace information.

Last updated 2 hours ago

[Save changes]
```

The visual hierarchy should be:

- `Project Settings`: primary.
- `Configure your workspace`: secondary.
- `General`: primary or section-level emphasis.
- `Manage your workspace information`: secondary.
- `Last updated`: tertiary.
- `Save changes`: primary interactive emphasis.

## 2.4. Rules

- Define semantic contrast roles.
- Keep primary content immediately readable.
- Reduce emphasis progressively for supplementary information.
- Avoid excessive contrast between adjacent hierarchy levels.
- Ensure tertiary content remains readable.
- Do not equate disabled styling with low-priority styling.

## 2.5. Audit checklist

- [ ] Contrast hierarchy is documented.
- [ ] Primary information is immediately recognizable.
- [ ] Secondary information is visually subordinate.
- [ ] Tertiary information remains readable.
- [ ] Decorative information does not compete with content.
- [ ] Disabled elements are distinguishable from secondary content.

---

# 3. Foreground and Background Contrast

## 3.1. Definition

Foreground/background contrast determines the readability of content placed on a surface.

It applies to:

- Text.
- Icons.
- Controls.
- Badges.
- Buttons.
- Input values.
- Navigation items.
- Selected states.

## 3.2. Semantic foreground tokens

Foreground tokens should be independent of the surfaces on which they appear.

Recommended architecture:

```css
:root {
  /* Foreground hierarchy */
  --foreground-primary: #18181b;
  --foreground-secondary: #52525b;
  --foreground-tertiary: #71717a;
  --foreground-disabled: #a1a1aa;
  --foreground-inverse: #ffffff;

  /* Surface hierarchy */
  --surface-base: #ffffff;
  --surface-subtle: #fafafa;
  --surface-default: #ffffff;
  --surface-raised: #ffffff;
  --surface-overlay: #ffffff;
}
```

These values are illustrative.

The final values must be validated against the actual Reef color palette and its semantic surface mappings.

## 3.3. Foreground/background pairing

Do not assume that a foreground token works on every surface.

Create explicit contrast pairings.

|Foreground|Intended background|
|---|---|
|Primary|Base, default, raised|
|Secondary|Base, default, subtle|
|Tertiary|Base or default, when validated|
|Inverse|Inverse or strongly contrasting surface|
|Disabled|Component-specific disabled surface|

For semantic colors, define appropriate foreground/background combinations.

For example:

```css
--color-success-foreground: ...;
--color-success-background: ...;

--color-danger-foreground: ...;
--color-danger-background: ...;
```

## 3.4. Rules

- Define semantic foreground tokens.
- Validate foreground/background combinations.
- Avoid arbitrary opacity-based text colors.
- Ensure secondary text remains readable.
- Avoid using tertiary text for essential information.
- Provide inverse foreground roles where necessary.
- Validate all component surfaces.

## 3.5. Audit checklist

- [ ] Foreground roles are documented.
- [ ] Foreground and surface pairings are validated.
- [ ] Secondary text remains readable.
- [ ] Tertiary text is reserved for supplementary content.
- [ ] Inverse text is correctly configured.
- [ ] Disabled text is distinguishable.
- [ ] Semantic colors have compatible foregrounds.

---

# 4. Text Contrast

## 4.1. Definition

Text contrast is the difference between text luminance and its background luminance.

It directly affects readability.

A visually subtle interface must never compromise essential text readability to achieve a minimalist appearance.

## 4.2. Contrast standard

This section is the single reference for contrast thresholds. Other documents point here and do not restate them.

### Precedence

|Rank|Method|Role|
|---|---|---|
|1|APCA (Lc)|Decides the verdict for text, icons, boundaries and focus indicators|
|2|WCAG 2.2 ratio|Always calculated and reported. Does not decide the quality verdict|
|3|L* and ΔE2000|Measure what APCA does not address: tonal scales and small differences between surfaces or states (section 13.3)|

### Status of the standards

APCA is the method chosen by this library. It is not a WCAG 3 requirement.

The WCAG 3 Working Draft of 10 September 2026 states that its contrast algorithm is yet to be determined, and its text contrast requirement is still marked Developing. Never describe a result as WCAG 3 compliant.

WCAG 2.x remains the version that regulations reference. When a product carries a legal accessibility obligation, the WCAG 2.2 AA thresholds apply to it in addition to the floors below.

### Floors

Values are absolute Lc values. APCA reports negative values for light text on a dark background, so compare the magnitude.

|Use|Floor|Preferred|Source|
|---|---|---|---|
|Body text and text columns|Lc 75|Lc 90|APCA|
|Other content text: labels, control text, table cells, secondary text|Lc 60|Lc 75|APCA|
|Large text above 36px|Lc 45|Maximum Lc 90|APCA|
|Headlines and large, heavy text|Lc 45|Lc 60|APCA|
|Fine-detail pictograms and outline icons|Lc 45|Lc 60|APCA|
|Large solid icons|Lc 30|Lc 45|APCA|
|Placeholder and disabled text|Lc 30|Lc 45|APCA|
|Essential component boundaries|Lc 30|Lc 45|Library calibration|
|Focus indicators|Lc 45|Lc 60|Library calibration|
|Dividers and other discernible non-text elements|Lc 15|Lc 30|APCA|
|Purely decorative elements|None|None|APCA|

These are floors, not targets. Small or light text needs more contrast: for text under 16px or below weight 400, check the official APCA font table for the exact size and weight. The table is not copied here so that it cannot drift from its source.

Lines marked Library calibration come from this document, not from APCA guidance. Confirm them during the first audit.

### WCAG 2.2 values to report

|Element|WCAG 2.2 AA ratio|
|---|---|
|Normal text|4.5:1|
|Large text: 24px, or 18.66px bold|3:1|
|Essential non-text elements|3:1|

## 4.3. Important distinction

A text color that looks sufficiently contrasted on a white background may fail on a subtle gray surface.

For example:

```text
Primary text + white background
Secondary text + white background
Tertiary text + white background
```

Each combination must be measured independently.

Never validate a foreground token against only one background.

## 4.4. Rules

- Text must meet its APCA floor from section 4.2.
- Report the WCAG 2.2 ratio next to every Lc value.
- Important information must not rely on insufficiently contrasted tertiary text.
- Validate text on every supported surface.
- Test actual rendered colors.
- Avoid opacity-based text treatments that unintentionally reduce contrast.

## 4.5. Audit checklist

- [ ] Primary text meets its APCA floor.
- [ ] Secondary text meets its APCA floor.
- [ ] Tertiary text is used appropriately.
- [ ] Large text meets its APCA floor.
- [ ] Text inside controls meets its APCA floor.
- [ ] The WCAG 2.2 ratio is reported for each pair.
- [ ] Text contrast is validated in light mode.
- [ ] Text contrast is validated in dark mode.

---

# 5. Surface Contrast

## 5.1. Definition

Surface contrast determines how clearly adjacent interface regions are differentiated.

Unlike text contrast, surface contrast is primarily concerned with the perception of boundaries and spatial relationships.

Examples:

- Card against page background.
- Sidebar against main content.
- Input against surrounding panel.
- Dropdown against application.
- Selected row against table.
- Dialog against backdrop.

## 5.2. Surface contrast principles

### Principle A — Use the minimum necessary differentiation

Surfaces should be distinguishable without creating unnecessary visual fragmentation.

### Principle B — Prefer consistent relationships

If cards use a subtle background difference in one part of the interface, equivalent cards should follow the same convention.

### Principle C — Use borders when background differences are insufficient

A subtle border can provide a more precise boundary than introducing another background color.

### Principle D — Avoid contrast competition

Several adjacent surfaces should not all demand attention.

## 5.3. Rules

- Define surface contrast relationships.
- Keep static surface differences restrained.
- Use borders to clarify ambiguous boundaries.
- Avoid arbitrary brightness differences.
- Preserve visual separation in dark mode.
- Validate nested surfaces.
- Do not assume that different colors automatically produce sufficient perceptual contrast.

## 5.4. Audit checklist

- [ ] Adjacent surfaces are distinguishable.
- [ ] Surface contrast is consistent.
- [ ] Nested surfaces remain understandable.
- [ ] Borders provide sufficient separation.
- [ ] Surface differences do not compete with content.
- [ ] Dark surfaces remain visually distinguishable.

---

# 6. Border and Separator Contrast

## 6.1. Definition

Borders and separators provide structural information.

Their contrast should be sufficient to communicate boundaries without making the interface feel excessively outlined.

## 6.2. Recommended hierarchy

|Role|Typical usage|
|---|---|
|Subtle border|Card boundaries and internal separators|
|Default border|Input and control boundaries|
|Strong border|Important structural boundaries|
|Interactive border|Hover and active states|
|Focus border|Keyboard focus|
|Disabled border|Disabled controls|

## 6.3. Accessibility considerations

Essential component boundaries and state indicators must meet their floor from section 4.2.

Decorative borders have no floor.

WCAG 2.2 Success Criterion 1.4.11 requires 3:1 for the same elements. Report that value as well.

## 6.4. Rules

- Define semantic border contrast roles.
- Preserve sufficient component boundary visibility.
- Avoid excessive border contrast.
- Ensure focus indicators are distinguishable.
- Validate borders against adjacent surfaces.
- Do not use one subtle border token for every situation.

## 6.5. Audit checklist

- [ ] Border hierarchy is documented.
- [ ] Essential component boundaries are identifiable.
- [ ] Required non-text contrast meets its floor from section 4.2.
- [ ] Decorative separators remain subtle.
- [ ] Focus indicators are visible.
- [ ] Dark theme borders are sufficiently differentiated.

---

# 7. Icon Contrast

## 7.1. Definition

Icons communicate actions, states, navigation and information.

Their contrast must reflect their functional importance.

## 7.2. Icon hierarchy

|Icon role|Contrast|
|---|---|
|Primary action|High|
|Secondary action|Moderate|
|Decorative|Low|
|Disabled action|Context-dependent|
|Status indicator|Semantic|
|Selected navigation|Clearly emphasized|

## 7.3. Accessibility requirements

Meaningful graphical objects required to identify a component or state must meet their floor from section 4.2.

Decorative icons that provide no information and are not necessary to identify a control may be exempt.

A disabled control may also fall under specific WCAG exceptions, but this should not be used as a reason to make the interface unnecessarily difficult to understand.

## 7.4. Rules

- Use semantic icon foreground tokens.
- Match icon contrast to functional importance.
- Avoid making every icon equally prominent.
- Ensure action icons remain recognizable.
- Validate icons against their actual surfaces.
- Do not rely exclusively on color for status.

## 7.5. Audit checklist

- [ ] Icon contrast roles are documented.
- [ ] Important action icons remain recognizable.
- [ ] Decorative icons are visually subordinate.
- [ ] Required graphical elements meet non-text contrast requirements.
- [ ] Disabled icons remain understandable.
- [ ] Selected icons are distinguishable.

---

# 8. Interactive Contrast

## 8.1. Definition

Interactive contrast describes the visual differentiation between the various states of an interactive element.

An interface must communicate interaction changes without requiring excessive visual effects.

## 8.2. State contrast matrix

|State|Expected contrast behavior|
|---|---|
|Default|Neutral baseline|
|Hover|Noticeable but subtle change|
|Active|Clear immediate feedback|
|Focus-visible|Strong, identifiable focus indicator|
|Selected|Persistent differentiation|
|Disabled|Reduced prominence while retaining clarity|
|Invalid|Clear error indication|
|Loading|Visible activity feedback|

## 8.3. State differentiation

Hover and selected states must not be visually interchangeable.

Example:

```text
Menu Item — Default
Neutral background

Menu Item — Hover
Subtle background change

Menu Item — Selected
Persistent background + optional indicator

Menu Item — Focus
Visible focus ring
```

A selected state should remain recognizable after the pointer leaves.

A focus state must remain recognizable during keyboard navigation.

## 8.4. Rules

- Define state-specific contrast treatments.
- Distinguish hover from selected.
- Make focus highly recognizable.
- Preserve semantic error and success information.
- Do not rely only on color.
- Avoid excessive contrast changes during hover.
- Keep state behavior consistent across component families.

## 8.5. Audit checklist

- [ ] Interactive states are documented.
- [ ] Hover is distinguishable from default.
- [ ] Selected is distinguishable from hover.
- [ ] Focus is clearly identifiable.
- [ ] Invalid states are recognizable.
- [ ] Loading states are visible.
- [ ] State contrast is consistent across themes.

---

# 9. Semantic Color Contrast

## 9.1. Definition

Semantic colors communicate meaning rather than visual decoration.

Common semantic categories include:

- Success.
- Warning.
- Danger.
- Information.
- Neutral.

Each semantic color must have appropriate contrast relationships.

## 9.2. Semantic color architecture

```css
:root {
  /* Success */
  --success-foreground: ...;
  --success-background: ...;
  --success-border: ...;

  /* Warning */
  --warning-foreground: ...;
  --warning-background: ...;
  --warning-border: ...;

  /* Danger */
  --danger-foreground: ...;
  --danger-background: ...;
  --danger-border: ...;

  /* Information */
  --info-foreground: ...;
  --info-background: ...;
  --info-border: ...;
}
```

## 9.3. Semantic contrast requirements

A semantic background must not automatically determine its foreground color.

For example, a green background does not guarantee that white text will be readable.

Each combination must be independently validated.

Furthermore, semantic meaning should not rely exclusively on color.

Use appropriate labels, icons or other visual indicators.

## 9.4. Rules

- Define foreground/background pairs.
- Validate each semantic color combination.
- Avoid arbitrary opacity changes.
- Preserve meaning in light and dark themes.
- Do not communicate errors exclusively through red.
- Do not communicate success exclusively through green.

## 9.5. Audit checklist

- [ ] Semantic color pairings are documented.
- [ ] Foreground/background combinations are validated.
- [ ] Semantic colors meet text contrast requirements.
- [ ] Semantic borders are sufficiently visible when necessary.
- [ ] Meaning is not communicated by color alone.
- [ ] Both themes are validated.

---

# 10. Dark Mode Contrast Balance

## 10.1. Definition

Dark mode requires a dedicated contrast strategy.

Simply inverting a light theme often produces:

- Excessively bright text.
- Harsh borders.
- Overly bright surfaces.
- Poor visual hierarchy.
- Excessive contrast between adjacent layers.

Dark interfaces should maintain readability without creating visual fatigue.

## 10.2. Dark mode principles

### Principle A — Avoid excessive pure white

Use carefully selected foreground colors rather than pure white for every text element.

### Principle B — Preserve surface differentiation

Dark surfaces need sufficient luminance differences or boundaries to remain distinguishable.

### Principle C — Avoid invisible borders

Borders that work on white backgrounds may disappear on dark backgrounds.

### Principle D — Recalibrate semantic colors

Bright reds, greens and blues may appear excessively intense against dark surfaces.

### Principle E — Preserve text readability

Never reduce contrast below accessibility requirements simply to obtain a softer appearance.

## 10.3. Audit checklist

- [ ] Primary text is comfortable and readable.
- [ ] Secondary text remains distinguishable.
- [ ] Surface hierarchy is preserved.
- [ ] Borders remain visible.
- [ ] Semantic colors are recalibrated.
- [ ] Interactive states remain recognizable.
- [ ] No excessive visual glare exists.
- [ ] Contrast floors remain satisfied.

---

# 11. Light Mode Contrast Balance

## 11.1. Definition

Light mode generally relies on subtle gray differences, controlled borders and dark foreground colors.

Its main challenge is maintaining visual hierarchy without excessive outlines or backgrounds.

## 11.2. Light mode principles

- Avoid using pure black for all foreground content.
- Use restrained gray backgrounds.
- Preserve sufficient contrast for secondary text.
- Prevent subtle borders from disappearing.
- Avoid excessive use of saturated semantic colors.
- Maintain recognizable interaction states.

## 11.3. Audit checklist

- [ ] Primary text has sufficient contrast.
- [ ] Secondary information remains readable.
- [ ] Subtle surfaces remain distinguishable.
- [ ] Borders are visible when necessary.
- [ ] Selected states are recognizable.
- [ ] Semantic colors remain balanced.

---

# 12. Contrast and Functional Density

## 12.1. Definition

Dense interfaces contain many visual elements within limited space.

Contrast must help users scan and distinguish information without introducing excessive visual emphasis.

This is especially important for:

- Data tables.
- Navigation sidebars.
- Command palettes.
- Toolbars.
- Settings interfaces.
- Project management views.
- Lists and menus.

## 12.2. Density principles

In dense interfaces:

- Primary information must remain immediately readable.
- Secondary information should remain accessible.
- Decorative elements should recede.
- Selected rows must be recognizable.
- Column separators should not dominate.
- Interactive controls must remain identifiable.

## 12.3. Example: Data table

```text
NAME             STATUS       UPDATED

Project Alpha    Active       2 min ago
Project Beta     Archived     Yesterday
Project Gamma    Active       3 hours ago
```

The contrast hierarchy should prioritize:

1. Row content.
2. Column headers.
3. Important status indicators.
4. Supplementary timestamps.
5. Decorative separators.

## 12.4. Rules

- Prioritize content over decoration.
- Use contrast to improve scanning.
- Keep separators subtle.
- Make selected rows recognizable.
- Avoid excessive semantic colors.
- Preserve readability at compact density levels.

## 12.5. Audit checklist

- [ ] Dense content remains readable.
- [ ] Important information is easy to scan.
- [ ] Secondary information does not dominate.
- [ ] Selected rows are distinguishable.
- [ ] Separators remain discreet.
- [ ] Interactive elements remain recognizable.

---

# 13. Contrast Testing and Validation

## 13.1. Definition

Contrast must be validated mathematically and visually.

Human visual inspection alone is insufficient.

A color combination that appears readable on one monitor may fail objective accessibility requirements.

## 13.2. Calculation methods

### APCA

Calculate Lc with the `apca-w3` reference implementation, using the version recorded in the audit report.

- Pass text and background in that order. APCA is not symmetric, so swapping them changes the result.
- Composite any alpha over its real background first.
- Convert any wide-gamut color to sRGB first, and record that conversion.

### WCAG 2.2 ratio

`CR = (L1 + 0.05) / (L2 + 0.05)`, where `L1` is the lighter relative luminance and `L2` the darker one.

Relative luminance is `L = 0.2126 R + 0.7152 G + 0.0722 B`, calculated on linearized sRGB channels.

### L* and ΔE2000

Use CIELAB L* to describe lightness and CIEDE2000 (ΔE2000) to describe the difference between two colors.

Neither one measures legibility. A pair can have a high ΔE2000 and unreadable text, for example two hues of similar lightness.

## 13.3. Perceptual checks

No standard defines these thresholds. They are starting hypotheses, to be confirmed or replaced during the first audit.

|Check|Metric|Starting hypothesis|
|---|---|---|
|Neutral scale progresses in one direction|L* per step|Always increases or always decreases|
|Adjacent surfaces can be told apart|ΔE2000|At least 2|
|Hover, active or selected differs from its resting state|ΔE2000|At least 3|
|Semantic colors of the same role differ from each other|ΔE2000|At least 10|
|A role keeps its place in the hierarchy across themes|L* rank|Same order in light and dark|

Color vision deficiencies are not covered by these metrics. Every meaningful state must therefore keep a signal that does not depend on hue.

## 13.4. Required validation matrix

Every semantic foreground token should be checked against every surface on which it is permitted.

|Foreground|Base|Subtle|Default|Raised|Overlay|
|---|---|---|---|---|---|
|Primary|✓|✓|✓|✓|✓|
|Secondary|✓|✓|✓|✓|✓|
|Tertiary|✓|✓|✓|✓|✓|
|Disabled|Contextual|Contextual|Contextual|Contextual|Contextual|
|Inverse|Contextual|Contextual|Contextual|Contextual|Contextual|

Repeat the validation independently for:

- Light theme.
- Dark theme.
- Semantic backgrounds.
- Interactive states.
- Component-specific surfaces.

## 13.5. References

- [APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html) — Lc levels by use.
- [APCA Contrast Calculator](https://apcacontrast.com/) — calculator and font table.
- [ARC Bronze Simple Mode](https://readtech.org/ARC/tests/bronze-simple-mode/) — entry-level APCA conformance mode.
- [WCAG 3.0 Working Draft](https://www.w3.org/TR/wcag-3.0/) — current status of the future standard.
- [WCAG 2.2 Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) — ratio for text.
- [WCAG 2.2 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) — ratio for components and states.
    

## 13.6. Automated validation

The audit must be able to generate a contrast report.

Example:

```ts
interface ContrastResult {
  foregroundToken: string;
  backgroundToken: string;
  theme: "light" | "dark";
  state: string;
  usage: string;
  fontSizePx: number | null;
  fontWeight: number | null;
  lc: number;
  lcFloor: number;
  wcag2Ratio: number;
  wcag2Pass: boolean;
  deltaE2000: number;
  verdict: "pass" | "fail";
}
```

The verdict depends on `lc` and `lcFloor` only.

Record each pair where the two methods disagree:

|APCA|WCAG 2.2|Meaning|Action|
|---|---|---|---|
|Pass|Pass|No issue|None|
|Fail|Pass|Readability defect that WCAG 2 misses|Fix|
|Pass|Fail|Compliance risk only|Report it. Fix it if the product has a legal obligation|
|Fail|Fail|Defect|Fix|

## 13.7. Audit checklist

- [ ] Lc values and WCAG 2.2 ratios are calculated automatically.
- [ ] All semantic foreground/background pairings are tested.
- [ ] Both themes are tested independently.
- [ ] Text and non-text requirements are distinguished.
- [ ] Failed combinations are reported.
- [ ] Contextual exceptions are documented.
- [ ] Contrast reports can be regenerated after token changes.

---

# 14. Contrast Balance Anti-Patterns

|Anti-pattern|Problem|Expected correction|
|---|---|---|
|Excessive contrast everywhere|Visual fatigue|Establish contrast hierarchy|
|Insufficient secondary text contrast|Poor readability|Adjust foreground tokens|
|Very subtle essential borders|Unrecognizable controls|Improve non-text contrast|
|Pure white text everywhere in dark mode|Excessive glare|Recalibrate foreground hierarchy|
|Arbitrary opacity-based text|Unpredictable contrast|Use semantic tokens|
|Hover and selected look identical|Ambiguous state|Separate state treatments|
|Semantic colors without validation|Inaccessible combinations|Validate foreground/background pairs|
|Tertiary text used for important content|Information becomes difficult to read|Promote its semantic role|
|Excessive colored icons|Visual noise|Restrict semantic color usage|
|Contrast checked only on base surface|Hidden failures|Test all permitted pairings|
|Color-only state communication|Accessibility problem|Add shape, icon or text indicators|
|Dark borders copied from light theme|Poor surface separation|Recalibrate dark theme borders|

---

# 15. Contrast Balance Audit Methodology

Every component must be evaluated across the following dimensions.

## 15.1. Text contrast

- Is primary text readable?
- Is secondary text sufficiently contrasted?
- Is tertiary text used appropriately?
- Are the APCA floors met?

## 15.2. Surface contrast

- Are adjacent surfaces distinguishable?
- Are nested surfaces recognizable?
- Are surface boundaries sufficiently visible?

## 15.3. Border contrast

- Are essential boundaries visible?
- Are decorative separators sufficiently subtle?
- Are focus indicators identifiable?

## 15.4. Icon contrast

- Are functional icons recognizable?
- Are decorative icons appropriately subordinate?
- Are semantic icons distinguishable?

## 15.5. Interactive contrast

- Are hover and active states distinguishable?
- Is selection persistent?
- Is focus clearly visible?
- Are disabled states understandable?

## 15.6. Semantic contrast

- Are success, warning, danger and information combinations validated?
- Are colors consistent across themes?
- Is meaning communicated through more than color?

## 15.7. Theme consistency

- Are all APCA floors met in light mode?
- Are they satisfied in dark mode?
- Are borders and surfaces recalibrated?

## 15.8. Functional density

- Can users scan dense content?
- Are important elements visually prioritized?
- Do decorative elements remain subordinate?

---

# 16. Contrast Balance Scoring

Each component must receive a score from 0 to 4 across eight dimensions.

|Dimension|Weight|
|---|---|
|Text contrast|20%|
|Surface contrast|15%|
|Border contrast|10%|
|Icon contrast|10%|
|Interactive state contrast|15%|
|Semantic color contrast|10%|
|Light/dark consistency|10%|
|Functional density and readability|10%|

### Scoring scale

|Score|Classification|Description|
|---|---|---|
|0|Missing|No coherent contrast strategy|
|1|Poor|Arbitrary contrast and significant readability problems|
|2|Partial|Basic hierarchy with notable inconsistencies|
|3|Good|Consistent, readable and controlled|
|4|Excellent|Precise, accessible and visually balanced|

Weighted score:

`(Text × 0.20) + (Surface × 0.15) + (Borders × 0.10) + (Icons × 0.10) + (States × 0.15) + (Semantic × 0.10) + (Themes × 0.10) + (Density × 0.10)`

### Mandatory constraints

A component cannot be considered compliant if:

- Essential text fails its APCA floor.
- Essential graphical component boundaries fail applicable non-text contrast requirements.
- Keyboard focus is not sufficiently visible.
- Important information is communicated exclusively through color.
- A theme introduces significant accessibility regressions.
- Contrast failures are hidden by an overall average score.

Accessibility failures must be tracked independently of the weighted score.

---

# 17. Remediation Guidelines

When a component fails the contrast audit, apply corrections in this order:

1. Identify the affected foreground/background pairing.
2. Determine whether the problem is text, surface, border, icon or state contrast.
3. Check whether the semantic token has the correct role.
4. Correct the foreground or background token.
5. Recalculate Lc and the WCAG 2.2 ratio.
6. Validate all other surfaces using the same token.
7. Review the visual hierarchy.
8. Check semantic colors and interaction states.
9. Validate light and dark themes.
10. Test in realistic component compositions.
11. Regenerate the contrast report.

Avoid fixing a contrast problem by introducing isolated component-specific colors when the underlying issue belongs to the semantic token system.

---

# 18. Final Acceptance Criteria

The contrast balance system is considered successfully implemented when:

- A documented contrast philosophy exists.
- A semantic contrast hierarchy is defined.
- Foreground and background roles are centralized.
- Text contrast meets its APCA floors, and WCAG 2.2 ratios are reported.
- Essential graphical elements meet applicable non-text contrast requirements.
- Surface contrast remains coherent.
- Border contrast is appropriate.
- Icon contrast reflects functional importance.
- Interactive states are distinguishable.
- Semantic colors have validated foreground/background combinations.
- Light and dark themes satisfy accessibility requirements.
- Dense interfaces remain readable.
- Contrast validation can be automated.
- Accessibility failures cannot be hidden by average scores.

---

# 19. Final Principle

Contrast is not about making everything visible.

It is about making the right things visible at the right level of importance.

A sophisticated interface does not use maximum contrast everywhere.

It distributes visual emphasis intentionally.

**The objective is to achieve maximum clarity with minimum visual noise, preserving accessibility while maintaining a restrained and coherent visual identity.**