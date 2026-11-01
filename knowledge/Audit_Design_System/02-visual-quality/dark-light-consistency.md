# Dark / Light Consistency

> **Purpose:** Define how the design system preserves visual identity, semantic hierarchy, readability, component behavior and interaction consistency across light and dark themes.
> 
> **Scope:** Theme architecture, semantic token mapping, luminance hierarchy, foreground/background relationships, surface differentiation, border visibility, elevation, semantic colors, interactive states, component adaptation, theme transitions and accessibility.
> 
> **Related principles:** Color Philosophy, Visual Hierarchy, Surface Treatment, Contrast Balance, Typography, Interaction Feedback, Visual Refinement and Accessibility.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.
> 
> **Framework context:** Reef.js — state-based reactive framework.

---

# 1. Theme Philosophy

## 1.1. Definition

A theme is a complete visual configuration that determines how semantic design tokens are rendered.

It defines:

- Background colors.
- Foreground colors.
- Surface hierarchy.
- Borders.
- Shadows.
- Semantic colors.
- Interactive states.
- Focus indicators.
- Selection treatments.
- Overlay appearances.

A theme is not simply a collection of colors.

It is a visual interpretation of the design system.

## 1.2. Core principle

**A theme may change the visual expression of the interface, but it must not change its underlying visual logic.**

The same component should preserve its:

- Semantic role.
- Visual hierarchy.
- Interaction affordances.
- Information priority.
- Spatial organization.
- Accessibility requirements.

## 1.3. Theme equivalence versus color equivalence

Light and dark themes do not need identical color values.

They need equivalent semantic relationships.

|Design intention|Light theme|Dark theme|
|---|---|---|
|Primary surface|Light neutral|Dark neutral|
|Secondary surface|Slightly darker or differentiated|Slightly lighter or differentiated|
|Primary text|Dark neutral|Light neutral|
|Secondary text|Medium neutral|Softer light neutral|
|Structural border|Subtle gray|Visible dark gray|
|Selected surface|Subtle tinted background|Subtle tinted background|
|Floating surface|Light elevated surface|Differentiated dark surface|

The goal is perceptual and semantic consistency, not numerical symmetry.

## 1.4. Expected characteristics

A coherent multi-theme system must be:

- Semantically consistent.
- Visually balanced.
- Accessible.
- Predictable.
- Theme-independent at the component API level.
- Centrally configurable.
- Extensible.
- Resistant to visual regressions.

## 1.5. Rules

- Never implement Dark Mode as a mechanical color inversion.
- Preserve semantic token roles across themes.
- Keep component APIs theme-independent.
- Recalibrate contrast independently for each theme.
- Preserve interaction state differentiation.
- Validate all component families in both themes.
- Avoid component-specific theme exceptions unless justified.
- Never sacrifice accessibility for aesthetic subtlety.

## 1.6. Audit checklist

- [ ] Light and dark themes share the same semantic architecture.
- [ ] Theme changes do not alter component behavior.
- [ ] Visual hierarchy is preserved.
- [ ] Interactive states remain recognizable.
- [ ] Accessibility requirements are satisfied independently.
- [ ] Components do not contain arbitrary theme-specific colors.
- [ ] Theme behavior is centrally managed.

---

# 2. Theme Architecture

## 2.1. Definition

Theme architecture defines how primitive colors, semantic tokens and component styles relate to the active theme.

A robust architecture separates color values from their semantic meaning.

## 2.2. Recommended architecture

```text
Design System
|
+-- Primitive Tokens
|   |
|   +-- Neutral Palette
|   +-- Blue Palette
|   +-- Green Palette
|   +-- Red Palette
|   +-- Yellow Palette
|
+-- Semantic Tokens
|   |
|   +-- Background
|   +-- Foreground
|   +-- Surface
|   +-- Border
|   +-- Interactive
|   +-- Semantic Colors
|
+-- Theme Mapping
|   |
|   +-- Light Theme
|   |
|   +-- Dark Theme
|
+-- Component Tokens
    |
    +-- Button
    +-- Input
    +-- Card
    +-- Dialog
    +-- Menu
```

The component layer should consume semantic tokens rather than directly accessing primitive palettes.

## 2.3. Three-level token model

### Level 1 — Primitive tokens

Primitive tokens define raw values.

```css
:root {
  --neutral-0: #ffffff;
  --neutral-50: #fafafa;
  --neutral-100: #f4f4f5;
  --neutral-200: #e4e4e7;
  --neutral-300: #d4d4d8;
  --neutral-500: #71717a;
  --neutral-700: #3f3f46;
  --neutral-800: #27272a;
  --neutral-900: #18181b;
  --neutral-950: #09090b;
}
```

These values should remain independent of component usage.

### Level 2 — Semantic tokens

Semantic tokens define visual responsibilities.

```css
:root {
  --background: ...;
  --foreground: ...;

  --surface-base: ...;
  --surface-subtle: ...;
  --surface-default: ...;
  --surface-raised: ...;
  --surface-overlay: ...;

  --foreground-primary: ...;
  --foreground-secondary: ...;
  --foreground-tertiary: ...;

  --border-subtle: ...;
  --border-default: ...;
  --border-strong: ...;
}
```

### Level 3 — Component tokens

Component tokens define component-specific visual decisions.

```css
:root {
  --button-primary-background: var(--accent);
  --button-primary-foreground: var(--accent-foreground);

  --input-background: var(--surface-base);
  --input-border: var(--border-default);

  --card-background: var(--surface-default);
  --card-border: var(--border-subtle);
}
```

Component tokens should only exist when they represent a genuine component-specific requirement.

Avoid creating aliases for every individual CSS property without a clear semantic benefit.

## 2.4. Rules

- Separate primitive, semantic and component tokens.
- Keep semantic roles stable across themes.
- Centralize theme mappings.
- Avoid direct primitive references in component styles.
- Avoid duplicating semantic tokens.
- Document token ownership.
- Ensure every required semantic token has a valid mapping in every supported theme.

## 2.5. Audit checklist

- [ ] Three-level token architecture is documented.
- [ ] Primitive palettes are centralized.
- [ ] Semantic tokens are theme-independent.
- [ ] Theme mappings are explicit.
- [ ] Components consume semantic tokens.
- [ ] Component tokens are justified.
- [ ] No unresolved theme token exists.

---

# 3. Semantic Theme Mapping

## 3.1. Definition

Semantic theme mapping determines which primitive values implement each semantic role in each theme.

This is the foundation of theme consistency.

A token such as `--foreground-secondary` must represent the same functional role in Light Mode and Dark Mode.

Its actual color changes, but its purpose does not.

## 3.2. Recommended semantic token contract

|Semantic role|Responsibility|
|---|---|
|`background`|Main application background|
|`foreground`|Default application text|
|`surface-base`|Base surface|
|`surface-subtle`|Low-emphasis surface|
|`surface-default`|Standard content surface|
|`surface-raised`|Elevated surface|
|`surface-overlay`|Floating surface|
|`foreground-primary`|Main content|
|`foreground-secondary`|Supporting content|
|`foreground-tertiary`|Supplementary content|
|`foreground-disabled`|Disabled content|
|`foreground-inverse`|Inverse content|
|`border-subtle`|Subtle structural boundary|
|`border-default`|Standard boundary|
|`border-strong`|Strong boundary|
|`border-focus`|Focus indicator|

Additional roles should be defined for:

- Primary actions.
- Secondary actions.
- Destructive actions.
- Selection.
- Success.
- Warning.
- Information.
- Disabled controls.

## 3.3. Example mapping

```css
:root,
[data-theme="light"] {
  color-scheme: light;

  --background: #ffffff;
  --foreground: #18181b;

  --surface-base: #ffffff;
  --surface-subtle: #fafafa;
  --surface-default: #ffffff;
  --surface-raised: #ffffff;
  --surface-overlay: #ffffff;

  --foreground-primary: #18181b;
  --foreground-secondary: #52525b;
  --foreground-tertiary: #71717a;

  --border-subtle: #f0f0f0;
  --border-default: #e4e4e7;
  --border-strong: #a1a1aa;
  --border-focus: #2563eb;
}

[data-theme="dark"] {
  color-scheme: dark;

  --background: #09090b;
  --foreground: #fafafa;

  --surface-base: #09090b;
  --surface-subtle: #111113;
  --surface-default: #18181b;
  --surface-raised: #202023;
  --surface-overlay: #202023;

  --foreground-primary: #fafafa;
  --foreground-secondary: #a1a1aa;
  --foreground-tertiary: #71717a;

  --border-subtle: #242427;
  --border-default: #303034;
  --border-strong: #52525b;
  --border-focus: #60a5fa;
}
```

These values are starting points, not validated Reef production values.

The actual mappings must be tested for contrast, hierarchy and visual balance.

## 3.4. Rules

- Every semantic token must have a mapping in every theme.
- Token names must not encode a specific color.
- Keep semantic meaning consistent.
- Validate foreground/background combinations.
- Avoid using one generic border token everywhere.
- Avoid relying on browser defaults for theme behavior.

## 3.5. Audit checklist

- [ ] Semantic tokens are complete.
- [ ] Every theme provides all required mappings.
- [ ] Token roles remain consistent.
- [ ] Foreground and background pairings are validated.
- [ ] Focus colors are theme-aware.
- [ ] Semantic states are theme-aware.
- [ ] No component references a missing token.

---

# 4. Perceptual Hierarchy Preservation

## 4.1. Definition

Perceptual hierarchy preservation ensures that the visual importance of interface elements remains consistent across themes.

An element should not become visually dominant simply because the theme changed.

For example:

- A secondary button should not become more prominent than the primary button.
- A subtle card boundary should not become a strong outline.
- Secondary text should not compete with primary text.
- A selected navigation item should remain identifiable.

## 4.2. Hierarchy invariants

Define relationships that must remain true.

|Relationship|Required invariant|
|---|---|
|Primary text vs secondary text|Primary remains more prominent|
|Primary action vs secondary action|Primary remains dominant|
|Selected vs unselected|Selected remains identifiable|
|Surface vs background|Structural hierarchy remains clear|
|Focus vs default|Focus remains distinguishable|
|Error vs neutral|Error remains recognizable|

These are semantic invariants, not necessarily fixed luminance ratios.

## 4.3. Example

Light Mode:

```text
Primary text       #18181b
Secondary text     #52525b
Tertiary text      #71717a
Background         #ffffff
```

Dark Mode:

```text
Primary text       #fafafa
Secondary text     #a1a1aa
Tertiary text      #71717a
Background         #09090b
```

The absolute colors differ, but the intended hierarchy remains.

## 4.4. Rules

- Define visual hierarchy invariants.
- Validate relative prominence.
- Avoid unexpected hierarchy reversals.
- Preserve action priority.
- Preserve selected-state visibility.
- Review the complete interface, not only individual colors.

## 4.5. Audit checklist

- [ ] Primary and secondary text retain their hierarchy.
- [ ] Primary actions remain dominant.
- [ ] Selected states remain recognizable.
- [ ] Surface hierarchy remains coherent.
- [ ] Borders do not become disproportionately prominent.
- [ ] Semantic indicators preserve their importance.

---

# 5. Surface Consistency Across Themes

## 5.1. Definition

Surface consistency ensures that spatial relationships remain understandable across Light and Dark Modes.

A card may be almost indistinguishable from the page background in Light Mode, but require a different treatment in Dark Mode.

This is acceptable if its semantic role remains clear.

## 5.2. Surface mapping

|Surface role|Light Mode|Dark Mode|
|---|---|---|
|Base|White|Near-black|
|Subtle|Very light gray|Slightly elevated dark neutral|
|Default|White or neutral|Dark neutral|
|Raised|White|Lighter dark neutral|
|Overlay|White|Elevated dark neutral|
|Sunken|Light gray|Darker recessed neutral|

## 5.3. Important principle

Do not assume that surface hierarchy must always follow the same brightness progression.

Some interfaces use borders rather than background changes to distinguish surfaces.

Others use subtle luminance variations.

The correct treatment depends on the visual language.

What must remain consistent is the structural relationship between the surfaces.

## 5.4. Rules

- Preserve semantic surface roles.
- Recalibrate surface differentiation independently.
- Avoid excessive dark-mode surface brightness.
- Keep nested surfaces distinguishable.
- Revalidate overlay treatments.
- Use borders when luminance differentiation is insufficient.
- Avoid excessive black-on-black layering.

## 5.5. Audit checklist

- [ ] Surface roles are consistent.
- [ ] Adjacent surfaces remain distinguishable.
- [ ] Nested surfaces preserve hierarchy.
- [ ] Floating surfaces remain identifiable.
- [ ] Dialogs remain visually separated.
- [ ] Recessed regions remain recognizable.
- [ ] Surface combinations work in both themes.

---

# 6. Typography Consistency Across Themes

## 6.1. Definition

Typography consistency ensures that text retains the same hierarchy, legibility and perceived weight in both themes.

Typography itself should generally not need different font sizes or font families when switching themes.

However, its rendering and perceived prominence may change because of background luminance and contrast.

## 6.2. Typography invariants

Preserve:

- Font family.
- Font size.
- Font weight.
- Line height.
- Letter spacing.
- Text hierarchy.
- Truncation behavior.
- Text wrapping.

Recalibrate where necessary:

- Foreground colors.
- Contrast.
- Muted text.
- Inverse text.
- Text on semantic surfaces.

## 6.3. Rules

- Keep typography tokens theme-independent.
- Use semantic foreground tokens.
- Validate small text independently.
- Avoid excessive brightness for large areas of text.
- Ensure placeholders remain readable.
- Preserve readability in dense layouts.

## 6.4. Audit checklist

- [ ] Typography scale is identical across themes.
- [ ] Font weights remain consistent.
- [ ] Text hierarchy is preserved.
- [ ] Small text meets contrast requirements.
- [ ] Placeholders remain readable.
- [ ] Disabled text remains understandable.
- [ ] Text on colored surfaces is validated.

---

# 7. Border and Separator Consistency

## 7.1. Definition

Borders often require significant recalibration between themes.

A subtle light-gray border on white may disappear when mechanically converted into a dark-gray border on black.

The objective is to preserve the boundary's function rather than its numerical color relationship.

## 7.2. Border mapping

|Role|Light Mode|Dark Mode|
|---|---|---|
|Subtle|Very light neutral|Dark neutral|
|Default|Light neutral|Medium-dark neutral|
|Strong|Medium neutral|Lighter neutral|
|Focus|Accessible accent|Accessible accent variant|
|Disabled|Contextual neutral|Contextual neutral|

## 7.3. Rules

- Recalibrate borders independently.
- Validate against adjacent surfaces.
- Preserve component boundary visibility.
- Keep decorative separators discreet.
- Preserve visible focus indicators.
- Avoid excessive outlines in dark mode.

## 7.4. Audit checklist

- [ ] Border hierarchy is preserved.
- [ ] Required boundaries remain visible.
- [ ] Separators do not dominate.
- [ ] Focus indicators remain recognizable.
- [ ] Disabled borders are distinguishable.
- [ ] Both themes are validated.

---

# 8. Shadow and Elevation Consistency

## 8.1. Definition

Shadows communicate depth and separation.

Their effectiveness changes significantly between light and dark backgrounds.

A shadow that works on white may become almost invisible on a dark surface.

Conversely, applying a strong black shadow to a dark interface may produce no useful visual differentiation.

## 8.2. Theme-specific elevation

Light Mode often relies on:

- Soft dark shadows.
- Subtle border separation.
- Limited blur.
- Controlled elevation.

Dark Mode may rely more on:

- Surface luminance differences.
- Border differentiation.
- Carefully controlled shadows.
- Layered surface treatments.

## 8.3. Rules

- Keep elevation semantics consistent.
- Allow theme-specific shadow definitions.
- Do not blindly reuse shadow colors.
- Avoid excessive shadow intensity.
- Use borders and surfaces when shadows are ineffective.
- Validate floating layers against actual backgrounds.

## 8.4. Audit checklist

- [ ] Elevation roles are preserved.
- [ ] Shadow tokens are theme-aware.
- [ ] Floating surfaces remain distinguishable.
- [ ] Shadows do not introduce visual noise.
- [ ] Dark-mode elevation does not rely exclusively on black shadows.

---

# 9. Semantic Color Consistency

## 9.1. Definition

Semantic colors must preserve their meaning and recognizability across themes.

Examples:

- Success.
- Warning.
- Danger.
- Information.
- Neutral.

However, their brightness and saturation may require adjustments.

## 9.2. Semantic color mapping

|Semantic role|Light Mode|Dark Mode|
|---|---|---|
|Success|Darker green foreground, pale green background|Lighter green foreground, dark green background|
|Warning|Dark amber foreground, pale amber background|Lighter amber foreground, dark amber background|
|Danger|Dark red foreground, pale red background|Lighter red foreground, dark red background|
|Information|Dark blue foreground, pale blue background|Lighter blue foreground, dark blue background|

## 9.3. Important principle

Semantic color consistency is not achieved by preserving the exact same hex value.

It is achieved by preserving:

- Meaning.
- Recognizability.
- Contrast.
- Functional priority.
- State differentiation.

## 9.4. Rules

- Preserve semantic meaning.
- Recalibrate foreground/background pairs.
- Validate saturation and brightness.
- Ensure text contrast.
- Ensure graphical indicator contrast where required.
- Never rely exclusively on color.

## 9.5. Audit checklist

- [ ] Semantic colors are mapped independently.
- [ ] Success remains recognizable.
- [ ] Warning remains recognizable.
- [ ] Danger remains recognizable.
- [ ] Information remains recognizable.
- [ ] Foreground/background pairs are validated.
- [ ] Semantic states remain understandable without color alone.

---

# 10. Interactive State Consistency

## 10.1. Definition

Interactive states must remain recognizable and behaviorally consistent across themes.

The same interaction should communicate the same meaning in both modes.

## 10.2. State mapping

|State|Light Mode|Dark Mode|
|---|---|---|
|Default|Neutral|Neutral|
|Hover|Subtle background|Subtle brighter surface|
|Active|Slightly stronger background|Controlled surface change|
|Selected|Tinted surface or indicator|Tinted surface or indicator|
|Focus|Visible focus ring|Visible focus ring|
|Disabled|Reduced prominence|Reduced prominence|
|Invalid|Semantic error treatment|Semantic error treatment|
|Loading|Activity indicator|Activity indicator|

## 10.3. Rules

- Preserve state semantics.
- Recalibrate colors independently.
- Keep hover subtle.
- Make selection persistent.
- Ensure focus remains highly visible.
- Distinguish disabled from inactive-looking content.
- Preserve error and success recognition.

## 10.4. Audit checklist

- [ ] Default states are coherent.
- [ ] Hover is distinguishable.
- [ ] Active is distinguishable.
- [ ] Selected is persistent.
- [ ] Focus is accessible.
- [ ] Disabled states remain understandable.
- [ ] Invalid states remain recognizable.
- [ ] Loading indicators are visible.

---

# 11. Component-Level Theme Consistency

## 11.1. Definition

Every component family must preserve its visual identity across themes.

A component must not become an entirely different visual object simply because its theme changed.

## 11.2. Component validation matrix

|Component|Light Mode|Dark Mode|
|---|---|---|
|Button|Surface, text, borders, states|Same roles, recalibrated values|
|Input|Background, placeholder, focus|Same roles, recalibrated values|
|Card|Surface, border, hierarchy|Same roles, recalibrated values|
|Dialog|Overlay, backdrop, elevation|Same roles, recalibrated values|
|Dropdown|Floating surface, selection|Same roles, recalibrated values|
|Checkbox|Checked, unchecked, disabled|Same roles, recalibrated values|
|Switch|Track and thumb states|Same roles, recalibrated values|
|Tooltip|Background and text|Same roles, recalibrated values|
|Table|Rows, separators, selection|Same roles, recalibrated values|
|Navigation|Active and inactive items|Same roles, recalibrated values|

## 11.3. Rules

- Test every component in both themes.
- Preserve component geometry.
- Preserve typography.
- Preserve interaction semantics.
- Recalibrate colors and shadows.
- Avoid hardcoded theme-specific styles.
- Document legitimate component exceptions.

## 11.4. Audit checklist

- [ ] Every component supports both themes.
- [ ] Component appearance is consistent.
- [ ] No component contains arbitrary theme-specific colors.
- [ ] Interaction states are coherent.
- [ ] Component variants remain recognizable.
- [ ] Nested compositions remain consistent.

---

# 12. Theme Transition and Runtime Behavior

## 12.1. Definition

Theme transitions describe how the interface changes when the active theme changes.

Theme switching must not create visual instability, inconsistent component states or unnecessary rendering overhead.

## 12.2. Theme modes

A design system should generally support:

- Light.
- Dark.
- System.

The System mode follows the operating system preference.

The selected preference should be distinguishable from the resolved theme.

For example:

```text
Preference: system
Resolved theme: dark
```

These are two different pieces of information.

## 12.3. Theme transition principles

- Avoid flashing the wrong theme during initial loading.
- Avoid unnecessary transitions on initial rendering.
- Prevent partial theme updates.
- Preserve component state.
- Avoid unnecessary component remounting.
- Respect reduced-motion preferences.
- Keep the active theme available to the entire application.

## 12.4. CSS implementation

```css
:root {
  color-scheme: light;
}

[data-theme="dark"] {
  color-scheme: dark;
}
```

For transitions:

```css
.theme-transition,
.theme-transition * {
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    color 150ms ease;
}

@media (prefers-reduced-motion: reduce) {
  .theme-transition,
  .theme-transition * {
    transition: none;
  }
}
```

This is an illustrative implementation.

Avoid applying global transitions indiscriminately, particularly to components with complex animations or frequent state changes.

## 12.5. Reef.js-specific requirements

Because Reef.js is state-based and reactive, theme switching should be treated as a state transition rather than a component reconstruction.

Recommended behavior:

```text
Theme Preference
       |
       v
Theme Resolution
       |
       v
Active Theme State
       |
       v
Semantic Token Mapping
       |
       v
Reactive Visual Update
```

The active theme should ideally be managed centrally.

Components should react to token changes through CSS rather than independently subscribing to theme state.

This minimizes unnecessary component updates.

## 12.6. Rules

- Centralize theme state.
- Separate user preference from resolved theme.
- Apply theme changes consistently.
- Avoid component remounting.
- Avoid unnecessary reactive subscriptions.
- Prevent initial theme flashes.
- Respect reduced motion.
- Test runtime switching.

## 12.7. Audit checklist

- [ ] Light, dark and system modes are supported.
- [ ] Preference and resolved theme are separated.
- [ ] Theme state is centralized.
- [ ] Components do not require remounting.
- [ ] Theme changes preserve component state.
- [ ] Initial rendering uses the correct theme.
- [ ] Transitions do not cause visual artifacts.
- [ ] Reduced-motion preferences are respected.

---

# 13. Theme Extensibility

## 13.1. Definition

A theme architecture should allow additional themes without requiring changes to component implementations.

Examples:

- Light.
- Dark.
- Dim.
- High Contrast.
- Brand-specific themes.
- Custom application themes.

The component library should depend on semantic contracts rather than theme identities.

## 13.2. Extensibility principles

A new theme should only need to provide the required semantic token mappings.

It should not need to redefine:

- Component structures.
- Component APIs.
- Interaction behavior.
- Typography scales.
- Spacing scales.
- Component geometry.

## 13.3. Example

```css
[data-theme="dim"] {
  --background: #151519;
  --foreground: #e4e4e7;

  --surface-base: #151519;
  --surface-subtle: #1b1b20;
  --surface-default: #202026;
  --surface-raised: #27272e;
  --surface-overlay: #292930;

  /* Remaining semantic tokens */
}
```

A Dim theme should be treated as a separate visual configuration, not as a collection of exceptions inside Dark Mode.

## 13.4. Rules

- Components must not depend on specific theme names.
- Require complete semantic mappings.
- Validate custom themes.
- Keep component behavior theme-independent.
- Support theme extension without component modification.
- Document the required token contract.

## 13.5. Audit checklist

- [ ] Additional themes can be introduced without modifying components.
- [ ] All themes implement the semantic contract.
- [ ] No component depends directly on `dark` or `light`.
- [ ] Custom themes can be validated.
- [ ] Missing tokens are detected.

---

# 14. Theme Consistency Anti-Patterns

|Anti-pattern|Problem|Expected correction|
|---|---|---|
|Mechanical color inversion|Incorrect visual relationships|Rebuild semantic mappings|
|Different component APIs per theme|Fragmented architecture|Keep APIs theme-independent|
|Hardcoded colors|Theme regressions|Use semantic tokens|
|Same shadows in both themes|Poor elevation|Recalibrate shadows|
|Invisible dark borders|Weak structural hierarchy|Adjust border mappings|
|Excessive white in dark mode|Visual fatigue|Recalibrate foreground hierarchy|
|Different typography per theme without reason|Inconsistent identity|Preserve typography tokens|
|Hover equals selected|Ambiguous states|Define distinct state mappings|
|Missing semantic tokens|Incomplete themes|Validate token contracts|
|Component-specific theme hacks|Maintenance complexity|Correct the semantic layer|
|Theme switch causes remounting|State loss and unnecessary work|Update theme centrally|
|Initial theme flash|Poor perceived quality|Resolve theme before first paint|
|Inaccessible custom themes|Quality regressions|Automate contrast validation|

---

# 15. Dark/Light Consistency Audit Methodology

Every component must be evaluated across the following dimensions.

## 15.1. Token architecture

- Are primitive and semantic tokens separated?
- Are semantic tokens theme-independent?
- Are component tokens justified?
- Are all required tokens implemented?

## 15.2. Visual hierarchy

- Is primary content still dominant?
- Is secondary information still subordinate?
- Are selected states recognizable?
- Are actions correctly prioritized?

## 15.3. Surface consistency

- Are surfaces differentiated correctly?
- Are nested surfaces coherent?
- Are floating surfaces recognizable?
- Are borders recalibrated?

## 15.4. Typography

- Is the typography scale preserved?
- Are foreground colors readable?
- Are small labels sufficiently contrasted?
- Are placeholders and disabled text understandable?

## 15.5. Semantic colors

- Are semantic meanings preserved?
- Are foreground/background pairs valid?
- Are error and success states recognizable?

## 15.6. Interactive states

- Are hover and active states distinguishable?
- Is selection persistent?
- Is focus visible?
- Are disabled states understandable?

## 15.7. Runtime behavior

- Does switching themes preserve component state?
- Is theme state centralized?
- Is initial theme rendering correct?
- Are transitions controlled?

## 15.8. Extensibility

- Can a new theme be added without component changes?
- Is the semantic contract complete?
- Are missing token mappings detectable?

---

# 16. Theme Consistency Scoring

Each component must receive a score from 0 to 4 across eight dimensions.

|Dimension|Weight|
|---|---|
|Semantic token mapping|15%|
|Visual hierarchy preservation|15%|
|Surface consistency|15%|
|Typography consistency|10%|
|Border and elevation consistency|10%|
|Semantic color consistency|10%|
|Interactive state consistency|15%|
|Runtime and theme extensibility|10%|

### Scoring scale

|Score|Classification|Description|
|---|---|---|
|0|Missing|No coherent multi-theme architecture|
|1|Poor|Mechanical inversion and numerous inconsistencies|
|2|Partial|Basic support with visible theme regressions|
|3|Good|Consistent semantic relationships|
|4|Excellent|Fully coherent, extensible and validated theme system|

Weighted score:

`(Tokens × 0.15) + (Hierarchy × 0.15) + (Surfaces × 0.15) + (Typography × 0.10) + (Borders × 0.10) + (Semantic × 0.10) + (States × 0.15) + (Runtime × 0.10)`

### Mandatory constraints

A component cannot be considered compliant if:

- Required semantic tokens are missing in a supported theme.
- Essential text fails applicable contrast requirements.
- Interactive states become ambiguous.
- Focus indicators become inaccessible.
- Semantic meanings change between themes.
- Theme switching causes component state loss.
- A supported theme introduces major visual regressions.

Accessibility failures must be tracked independently of the weighted score.

---

# 17. Remediation Guidelines

When a component fails the theme consistency audit, apply corrections in this order:

1. Identify the affected semantic role.
2. Determine whether the problem belongs to primitive, semantic or component tokens.
3. Correct the theme mapping.
4. Revalidate foreground/background contrast.
5. Review visual hierarchy.
6. Correct surface differentiation.
7. Recalibrate borders and elevation.
8. Correct semantic colors.
9. Validate interactive states.
10. Test runtime theme switching.
11. Validate the component inside realistic compositions.
12. Regenerate the theme consistency report.

Prefer correcting a semantic theme mapping over introducing a component-specific exception.

---

# 18. Final Acceptance Criteria

The theme consistency system is considered successfully implemented when:

- A documented theme philosophy exists.
- Primitive, semantic and component tokens are separated.
- All themes implement the same semantic contract.
- Visual hierarchy is preserved.
- Surface relationships remain coherent.
- Typography remains consistent.
- Borders and elevation are correctly recalibrated.
- Semantic colors preserve their meaning.
- Interactive states remain recognizable.
- APCA floors are independently satisfied, and WCAG 2.2 ratios are reported.
- Theme switching preserves application and component state.
- Initial theme rendering is correct.
- Additional themes can be introduced without component modifications.
- Theme regressions can be detected automatically.

---

# 19. Final Principle

A design system does not have two visual identities.

It has one visual identity expressed through different environmental conditions.

Light Mode and Dark Mode should feel like two interpretations of the same design language.

The user should never feel that they are using two different products.

**The objective is to preserve the same visual hierarchy, interaction clarity and design philosophy while allowing every theme to use its own carefully calibrated visual expression.**