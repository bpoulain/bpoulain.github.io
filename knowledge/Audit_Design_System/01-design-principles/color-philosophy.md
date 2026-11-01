# Color Philosophy

> **Purpose:** Define the philosophy, architecture, usage rules and evaluation criteria governing color throughout the UI library.
> 
> **Scope:** Primitive color tokens, semantic tokens, component tokens, surface hierarchy, foreground hierarchy, accent colors, semantic colors, interactive states, contrast and theme consistency.
> 
> **Related principles:** DP-01 Functional Minimalism, DP-02 Neutral-First Color, DP-03 Subtle Contrast Hierarchy, DP-07 Clear Information Hierarchy, DP-10 Immediate Feedback, DP-15 Semantic Consistency.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.

---

# 1. Color Philosophy

## 1.1. Definition

Color is a functional communication mechanism.

Its primary purpose is to establish hierarchy, communicate meaning, distinguish states and support interaction.

The visual identity of the library must be predominantly neutral, with accent and semantic colors introduced only when they provide meaningful value.

Color must never become a substitute for proper layout, typography or information architecture.

### Core principle

**Use color to communicate, not to decorate.**

A color decision must have a clear purpose:

- Establish visual hierarchy.
- Distinguish surfaces.
- Identify an action.
- Communicate a status.
- Indicate interaction state.
- Improve readability.
- Support navigation or recognition.

If a color does not serve one of these purposes, its use must be questioned.

---

# 2. Neutral-First Philosophy

Neutral means the low-chroma structural scale of the active theme. It may carry a tint.

## 2.1. Definition

Neutral colors must establish the dominant visual language of the library.

The majority of the interface should be constructed using neutral backgrounds, foregrounds, borders and subtle surface variations.

Accent colors must remain selective.

## 2.2. Expected visual characteristics

- Neutral application backgrounds.
- Restrained surface differentiation.
- Subtle borders.
- Clear foreground hierarchy.
- Muted secondary information.
- Limited accent color usage.
- Semantic colors reserved for meaningful states.

## 2.3. Neutral hierarchy

The neutral palette must provide enough variation to support complex interfaces without introducing unnecessary colors.

Recommended semantic roles:

|Role|Purpose|
|---|---|
|Background|Main application background|
|Foreground|Primary content|
|Surface|Default component surface|
|Surface-secondary|Secondary content surface|
|Surface-tertiary|Subtle grouped surface|
|Surface-hover|Hovered surface|
|Surface-active|Active surface|
|Surface-selected|Selected surface|
|Muted|Secondary foreground|
|Subtle|Low-emphasis foreground|
|Border|Standard structural boundary|
|Border-strong|Emphasized boundary|
|Border-subtle|Subtle separator|

These are semantic roles, not mandatory unique color values.

Several roles may resolve to the same primitive when the visual distinction is unnecessary.

## 2.4. Rules

- Neutral colors must dominate standard interface composition.
- Neutral variations must be perceptually distinguishable where necessary.
- Avoid excessive contrast between adjacent neutral surfaces.
- Do not introduce new neutral colors for individual components without justification.
- Use foreground hierarchy rather than arbitrary opacity reductions.
- Preserve readability in compact interfaces.
- Avoid relying on color alone to communicate structure.

## 2.5. Audit checklist

- [ ] Neutral colors dominate the interface.
- [ ] Neutral surfaces have a coherent tonal hierarchy.
- [ ] Secondary information is visually subordinate.
- [ ] Borders are appropriately subtle.
- [ ] Surface differences are intentional.
- [ ] No component introduces arbitrary neutral colors.
- [ ] Neutral hierarchy is consistent across component categories.

---

# 3. Color Architecture

Color architecture must preserve a clear separation between raw color values and their semantic usage.

The library must use the existing token architecture consistently.

## 3.1. Primitive color tokens

Primitive tokens represent raw color values.

Examples:

```css
--color-neutral-0: #ffffff;
--color-neutral-50: #fafafa;
--color-neutral-100: #f4f4f5;
--color-neutral-200: #e4e4e7;
--color-neutral-300: #d4d4d8;
--color-neutral-400: #a1a1aa;
--color-neutral-500: #71717a;
--color-neutral-600: #52525b;
--color-neutral-700: #3f3f46;
--color-neutral-800: #27272a;
--color-neutral-900: #18181b;
--color-neutral-950: #09090b;
```

These values are illustrative references, not mandatory palette values.

Rules:

- Primitive tokens must not encode component-specific meaning.
- Primitive tokens should be organized into coherent color scales.
- Primitive tokens should not be consumed directly by components when semantic tokens are available.
- Raw values should remain centralized.
- Primitive scales should provide sufficient tonal flexibility.

## 3.2. Semantic color tokens

Semantic tokens express the intended function of a color.

Examples:

```css
--color-background: var(--color-neutral-0);
--color-foreground: var(--color-neutral-900);

--color-surface: var(--color-neutral-0);
--color-surface-secondary: var(--color-neutral-50);

--color-muted: var(--color-neutral-500);
--color-border: var(--color-neutral-200);

--color-primary: var(--color-neutral-900);
--color-primary-foreground: var(--color-neutral-0);

--color-accent: var(--color-neutral-100);
--color-accent-foreground: var(--color-neutral-900);
```

Rules:

- Components should consume semantic tokens.
- Semantic tokens must express purpose rather than specific color values.
- Semantic roles must remain stable across themes.
- Theme changes must remap semantic roles without changing component implementations.
- Avoid redundant semantic tokens with indistinguishable purposes.

## 3.3. Component-level tokens

Component tokens express visual decisions specific to a component when necessary.

Examples:

```css
--button-primary-background: var(--color-primary);
--button-primary-foreground: var(--color-primary-foreground);

--input-background: var(--color-surface);
--input-border: var(--color-border);

--dialog-background: var(--color-surface);
--dialog-border: var(--color-border);
```

Rules:

- Introduce component tokens only when a genuine component-specific requirement exists.
- Prefer semantic tokens when the component follows a shared convention.
- Avoid duplicating semantic tokens without functional justification.
- Ensure component tokens remain theme-aware.
- Keep component-specific tokens centralized.

## 3.4. Token dependency hierarchy

The expected dependency direction is:

```text
Primitive Color Tokens
        |
        v
Semantic Color Tokens
        |
        v
Component Color Tokens
        |
        v
Rendered UI Components
```

Theme-specific primitive mappings may differ, but semantic meanings must remain stable.

Components should not bypass this hierarchy through arbitrary hardcoded colors.

## 3.5. Architecture audit

- [ ] Primitive tokens are centralized.
- [ ] Primitive tokens are independent of component meaning.
- [ ] Semantic tokens describe functional roles.
- [ ] Components use semantic tokens by default.
- [ ] Component tokens exist only when justified.
- [ ] Theme changes do not require component-specific color overrides.
- [ ] No unnecessary token duplication exists.
- [ ] No hardcoded colors bypass the architecture.

---

# 4. Accent Color Philosophy

## 4.1. Definition

Accent color provides controlled emphasis.

It identifies important actions, selected elements and meaningful interface highlights.

It must not be applied indiscriminately to every interactive element.

## 4.2. Accent usage hierarchy

Recommended applications:

|Element|Expected treatment|
|---|---|
|Primary action|Strong accent emphasis|
|Secondary action|Neutral treatment|
|Tertiary action|Minimal or transparent treatment|
|Selected navigation|Restrained accent indication|
|Selected control|Appropriate selection treatment|
|Focus indicator|Dedicated focus treatment|
|Informational highlight|Contextual accent usage|

## 4.3. Rules

- Maintain one primary accent identity unless a clear product requirement demands otherwise.
- Avoid multiple competing accent colors.
- Use accent color consistently for equivalent actions.
- Do not use accent color for every hover state.
- Avoid accent-colored borders without a meaningful interaction or semantic purpose.
- Do not introduce accent colors to compensate for weak hierarchy.
- Ensure accent colors remain legible against their foregrounds.

## 4.4. Accent restraint

Accent color should remain visually meaningful because it is not everywhere.

If every component is emphasized, nothing is emphasized.

## 4.5. Audit checklist

- [ ] Primary accent usage is consistent.
- [ ] Primary actions are recognizable.
- [ ] Secondary actions remain visually subordinate.
- [ ] Selected states use consistent treatments.
- [ ] Accent colors are not overused.
- [ ] Accent colors do not replace structural hierarchy.
- [ ] Accent contrast is sufficient.

---

# 5. Foreground Color Hierarchy

## 5.1. Definition

Foreground colors establish the importance and readability of textual and graphical content.

The library must provide a consistent hierarchy between primary content, secondary content and low-emphasis information.

## 5.2. Recommended roles

|Role|Purpose|
|---|---|
|Foreground|Primary content|
|Foreground-secondary|Supporting content|
|Foreground-muted|Secondary labels and metadata|
|Foreground-subtle|Low-emphasis information|
|Foreground-disabled|Unavailable content|
|Foreground-inverted|Content on inverted surfaces|

These roles must be semantically defined and validated for contrast.

## 5.3. Rules

- Primary content must have sufficient contrast.
- Secondary content must remain readable.
- Metadata should be visually subordinate.
- Disabled content must remain distinguishable.
- Avoid arbitrary opacity values.
- Do not use the same foreground treatment for every text role.
- Avoid excessively muted text for essential information.

## 5.4. Audit checklist

- [ ] Foreground roles are clearly defined.
- [ ] Primary text has sufficient contrast.
- [ ] Secondary text remains readable.
- [ ] Metadata is visually subordinate.
- [ ] Disabled text is distinguishable.
- [ ] Inverted foregrounds are correct.
- [ ] Text hierarchy remains coherent across themes.

---

# 6. Surface Color Philosophy

## 6.1. Definition

Surface colors organize the interface into meaningful visual regions.

Surface differentiation should remain subtle and intentional.

## 6.2. Rules

- Use the base background for standard content.
- Introduce secondary surfaces only when grouping requires them.
- Avoid unnecessary nested surface variations.
- Prefer subtle tonal differences.
- Keep floating elements visually distinguishable.
- Maintain consistent surface roles across components.
- Avoid component-specific background colors without justification.

## 6.3. Surface relationships

The library should define how the following roles interact:

- Application background.
- Standard content surface.
- Secondary content surface.
- Recessed surface.
- Interactive surface.
- Floating surface.
- Overlay surface.

The goal is not to force a different color for every role.

The goal is to provide a predictable vocabulary for surface relationships.

## 6.4. Audit checklist

- [ ] Surface roles have clear meanings.
- [ ] Surface differences are intentional.
- [ ] Nested surfaces remain restrained.
- [ ] Floating elements are distinguishable.
- [ ] Surface tokens are shared across components.
- [ ] Light and dark themes preserve equivalent hierarchy.

---

# 7. Semantic Color Philosophy

## 7.1. Definition

Semantic colors communicate meaningful application states.

Their meaning must remain consistent throughout the entire library.

## 7.2. Semantic categories

|Semantic role|Meaning|
|---|---|
|Success|Successful operation or positive status|
|Warning|Potential problem requiring attention|
|Destructive|Dangerous action or critical failure|
|Information|Informational state|
|Neutral|Standard or non-critical status|

## 7.3. Semantic token structure

Each semantic category may require multiple roles:

- Foreground.
- Background.
- Border.
- Subtle background.
- Strong emphasis.

Example:

```css
--color-success: ...;
--color-success-foreground: ...;
--color-success-background: ...;
--color-success-border: ...;

--color-warning: ...;
--color-warning-foreground: ...;
--color-warning-background: ...;
--color-warning-border: ...;

--color-destructive: ...;
--color-destructive-foreground: ...;
--color-destructive-background: ...;
--color-destructive-border: ...;
```

Exact token names should remain consistent with the existing architecture.

## 7.4. Rules

- Semantic colors must preserve their meaning across components.
- Success must not be used as generic decoration.
- Warning must communicate a relevant caution.
- Destructive must indicate dangerous or destructive operations.
- Information must remain distinct from warning and success.
- Semantic backgrounds should remain appropriately restrained.
- Semantic colors must not be the only way to communicate a status.
- Icons, labels or other contextual information should reinforce important statuses.

## 7.5. Audit checklist

- [ ] All semantic roles are defined.
- [ ] Semantic meanings are documented.
- [ ] Equivalent states use equivalent colors.
- [ ] Semantic foregrounds remain readable.
- [ ] Semantic backgrounds are restrained.
- [ ] Semantic colors are not used decoratively.
- [ ] Important states are not communicated through color alone.

---

# 8. Interactive Color States

## 8.1. Definition

Interactive states must provide consistent visual feedback through controlled color changes.

Color should reinforce interaction, not create unnecessary visual noise.

## 8.2. State definitions

|State|Color behavior|
|---|---|
|Default|Standard semantic treatment|
|Hover|Subtle contextual change|
|Active|Immediate interaction feedback|
|Focus-visible|Dedicated accessible focus indication|
|Selected|Persistent selection treatment|
|Disabled|Reduced emphasis without losing clarity|
|Loading|Consistent loading treatment|
|Invalid|Semantic error treatment|

Not every component needs every state.

States must be implemented according to the component's interaction model.

## 8.3. Rules

- Use consistent state colors across equivalent controls.
- Hover changes should remain subtle.
- Active states should be perceptible.
- Focus must be visually distinct from hover.
- Selected states must remain visible after pointer movement.
- Disabled colors must not compromise readability unnecessarily.
- Invalid states must communicate errors clearly.
- State transitions must not introduce excessive color changes.

## 8.4. Focus philosophy

Focus is a functional accessibility state, not a decorative accent.

The focus indicator must:

- Be clearly visible.
- Be distinguishable from hover.
- Work across different surfaces.
- Meet applicable contrast requirements.
- Remain consistent across component categories.

## 8.5. Audit checklist

- [ ] Hover states are subtle and consistent.
- [ ] Active states are recognizable.
- [ ] Focus-visible is clearly identifiable.
- [ ] Selected states are persistent.
- [ ] Disabled states are coherent.
- [ ] Invalid states are semantically correct.
- [ ] State transitions preserve readability.
- [ ] No arbitrary state colors are introduced.

---

# 9. Contrast Philosophy

## 9.1. Definition

Contrast establishes readability and visual hierarchy.

The library must balance subtle visual treatments with accessibility requirements.

A restrained aesthetic must never justify insufficient contrast.

## 9.2. Contrast requirements

APCA is the primary contrast method. WCAG 2.2 ratios are calculated and reported alongside it.

Thresholds, precedence and calculation rules are defined in `02-visual-quality/contrast-balance.md`, sections 4.2 and 13. They are not restated here.

## 9.3. Rules

- Never reduce contrast solely for aesthetic reasons.
- Validate foreground/background combinations.
- Test interactive boundaries.
- Test semantic colors.
- Test disabled and placeholder text according to their applicable requirements.
- Test all themes.
- Test text over translucent surfaces.
- Avoid relying on opacity without checking the final rendered contrast.

## 9.4. Contrast audit

- [ ] Text meets its APCA floor.
- [ ] The WCAG 2.2 ratio is reported for each pair.
- [ ] Essential graphical elements meet applicable non-text contrast requirements.
- [ ] Focus indicators remain sufficiently visible.
- [ ] Semantic color combinations are validated.
- [ ] Both themes are tested.
- [ ] Hover, selected and invalid states are tested.
- [ ] Contrast is measured using actual rendered colors.

---

# 10. Light & Dark Theme Color Philosophy

## 10.1. Definition

Light and dark themes must express the same semantic color system.

They are different tonal implementations of the same visual language.

A dark theme must not simply invert the light theme.

## 10.2. Light theme characteristics

- Bright neutral backgrounds.
- Restrained surface differentiation.
- Subtle borders.
- Clear dark foregrounds.
- Controlled accent saturation.
- Limited shadow usage.

## 10.3. Dark theme characteristics

- Deep neutral backgrounds.
- Carefully differentiated dark surfaces.
- Readable foreground hierarchy.
- Controlled contrast between adjacent surfaces.
- Appropriate accent saturation.
- Restrained borders.
- Carefully adapted elevation.

## 10.4. Theme consistency rules

- Semantic token names must remain identical.
- Semantic meanings must remain identical.
- Component implementations must not require theme-specific color logic.
- Equivalent states must remain recognizable.
- Contrast must be validated independently.
- Accent colors may require different tonal values.
- Shadows may require theme-specific adaptation.
- Selected states must remain visible.

## 10.5. Audit checklist

- [ ] All semantic tokens have light theme values.
- [ ] All semantic tokens have dark theme values.
- [ ] Surface hierarchy is equivalent.
- [ ] Foreground hierarchy is equivalent.
- [ ] Accent colors remain meaningful.
- [ ] Semantic states preserve their meanings.
- [ ] Interactive states remain visible.
- [ ] Contrast requirements are met independently.
- [ ] No component requires arbitrary theme-specific overrides.

---

# 11. Color and Information Hierarchy

## 11.1. Definition

Color must reinforce the information hierarchy established by layout and typography.

It must not create an independent and contradictory hierarchy.

## 11.2. Rules

- Primary content should not be visually overwhelmed by decorative colors.
- Secondary information should use appropriate muted treatments.
- Primary actions should have clear emphasis.
- Status colors should remain contextual.
- Selected content should be distinguishable without excessive saturation.
- Avoid assigning equal color prominence to unrelated elements.

## 11.3. Audit checklist

- [ ] Color reinforces typography.
- [ ] Color reinforces layout hierarchy.
- [ ] Primary actions remain identifiable.
- [ ] Status colors remain contextual.
- [ ] Secondary information is appropriately subdued.
- [ ] No competing color hierarchy exists.

---

# 12. Color Anti-Patterns

|Anti-pattern|Problem|Expected correction|
|---|---|---|
|Accent everywhere|Loss of emphasis|Restrict accent usage|
|Too many neutral shades|Unnecessary complexity|Consolidate semantic roles|
|Hardcoded colors|Token inconsistency|Use semantic tokens|
|Same color for every text role|Weak hierarchy|Establish foreground roles|
|Excessive muted text|Poor readability|Validate contrast|
|Decorative semantic colors|Meaning becomes ambiguous|Reserve colors for actual states|
|Strong borders everywhere|Excessive visual noise|Use subtle border roles|
|Inconsistent hover colors|Fragmented behavior|Standardize state treatments|
|Dark theme color inversion|Poor tonal balance|Design theme mappings independently|
|Opacity-based hierarchy|Unpredictable contrast|Use semantic foreground tokens|
|Color-only status communication|Accessibility issue|Add labels or other indicators|
|Component-specific accent colors|Fragmented identity|Centralize accent semantics|

---

# 13. Color Audit Methodology

Every component must be audited through the following dimensions.

## 13.1. Token compliance

- Are all colors sourced from the token system?
- Are primitive and semantic roles correctly separated?
- Are component-specific tokens justified?
- Are there duplicated or unused tokens?

## 13.2. Semantic correctness

- Does each color communicate the intended meaning?
- Are equivalent states visually equivalent?
- Are semantic colors used consistently?
- Is color being used decoratively?

## 13.3. Visual balance

- Is the component neutral-first?
- Is accent usage controlled?
- Is contrast hierarchy appropriate?
- Are surface treatments restrained?

## 13.4. Accessibility

- Is text contrast sufficient?
- Are graphical boundaries distinguishable?
- Are focus indicators visible?
- Are statuses communicated through more than color when necessary?

## 13.5. Theme consistency

- Does the component work in light mode?
- Does it work in dark mode?
- Are all states preserved?
- Are semantic relationships equivalent?

---

# 14. Color Scoring

Each component must receive a score from 0 to 4 across five dimensions.

|Dimension|Weight|
|---|---|
|Token architecture compliance|20%|
|Semantic correctness|25%|
|Visual restraint|20%|
|Contrast and accessibility|20%|
|Light/dark consistency|15%|

### Scoring scale

|Score|Classification|Description|
|---|---|---|
|0|Missing|No coherent color system|
|1|Poor|Hardcoded, inconsistent or incorrect usage|
|2|Partial|Mostly coherent but contains significant deviations|
|3|Good|Consistent and semantically correct|
|4|Excellent|Fully integrated, restrained and refined|

Weighted score:

`(Token × 0.20) + (Semantic × 0.25) + (Restraint × 0.20) + (Accessibility × 0.20) + (Theme × 0.15)`

### Mandatory constraints

A component cannot be considered compliant if:

- Essential text fails applicable contrast requirements.
- Focus indicators are not sufficiently visible.
- Semantic colors communicate incorrect meanings.
- Hardcoded colors bypass mandatory token conventions.
- A theme introduces a significant readability regression.

Accessibility failures must be tracked independently of the average score and must not be hidden by high scores in other dimensions.

---

# 15. Remediation Guidelines

When a component fails the color audit, apply corrections in the following order:

1. Identify hardcoded or incorrect color references.
2. Map raw values to existing primitive tokens.
3. Map component usage to semantic tokens.
4. Remove unnecessary component-specific color variations.
5. Consolidate redundant semantic roles.
6. Correct foreground hierarchy.
7. Reduce unnecessary accent usage.
8. Correct surface and border treatments.
9. Validate semantic states.
10. Measure contrast.
11. Validate light and dark themes.
12. Reinspect the complete rendered component.

Do not introduce new tokens automatically to solve every visual inconsistency.

First determine whether the existing token system already provides the necessary semantic role.

---

# 16. Final Acceptance Criteria

The color philosophy is considered successfully implemented when:

- Neutral colors establish the dominant visual identity.
- Accent colors are used selectively.
- Semantic colors have consistent meanings.
- Primitive, semantic and component tokens are correctly separated.
- Components do not introduce arbitrary hardcoded colors.
- Foreground hierarchy is consistent.
- Surface colors are restrained.
- Interactive states use coherent color treatments.
- All applicable contrast requirements are satisfied.
- Light and dark themes preserve equivalent semantic relationships.
- Color reinforces rather than replaces information hierarchy.
- The complete library expresses one coherent color language.

---

# 17. Final Principle

Color is one of the strongest tools for creating visual hierarchy, but also one of the easiest ways to introduce visual noise.

A refined interface does not need many colors.

It needs the right colors, applied consistently, at the right moments.

**The objective is not to maximize color variation. It is to maximize the semantic and visual value of every color used.**