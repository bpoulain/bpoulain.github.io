# Surface Treatment

> **Purpose:** Define how surfaces, backgrounds, borders, overlays, elevation and visual layers are designed and combined to create a coherent spatial visual language.
> 
> **Scope:** Surface hierarchy, background roles, semantic surface tokens, borders, elevation, shadows, overlays, nested surfaces, interactive surfaces, transparency, layering, material consistency and theme adaptation.
> 
> **Related principles:** Minimalism, Color Philosophy, Visual Hierarchy, Functional Density, Geometric Consistency, Progressive Disclosure, Visual Refinement and Spacing and Alignment.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.
> 
> **Framework context:** Reef.js — state-based reactive framework.

---

# 1. Surface Philosophy

## 1.1. Definition

A surface is a visual layer that organizes, contains, separates or emphasizes interface content.

Surfaces can be:

- Page backgrounds.
- Application panels.
- Cards.
- Input fields.
- Navigation containers.
- Menus.
- Popovers.
- Dialogs.
- Tooltips.
- Selected items.
- Interactive regions.

Surface treatment determines how these layers relate to each other.

It establishes the spatial perception of an interface.

## 1.2. Core principle

**Surfaces should communicate structure and hierarchy without introducing unnecessary visual noise.**

A surface should have a reason to exist.

It should communicate at least one of the following:

- Containment.
- Grouping.
- Separation.
- Interaction.
- Selection.
- Emphasis.
- Elevation.
- Temporary visibility.

If a surface does not communicate a meaningful relationship, its visual treatment should be reconsidered.

## 1.3. Surface treatment versus decoration

|Surface treatment|Decoration|
|---|---|
|Establishes visual hierarchy|Adds arbitrary visual effects|
|Separates meaningful content|Adds unnecessary containers|
|Communicates elevation|Adds shadows everywhere|
|Defines interactive regions|Adds borders without purpose|
|Creates visual grouping|Creates excessive nested cards|
|Supports information architecture|Introduces competing backgrounds|

## 1.4. Expected characteristics

A coherent surface system must be:

- Restrained.
- Hierarchical.
- Predictable.
- Consistent.
- Theme-aware.
- Composable.
- Accessible.
- Semantically meaningful.

## 1.5. Rules

- Every surface must have a defined visual role.
- Avoid unnecessary nested containers.
- Prefer subtle differentiation.
- Use borders and shadows with intention.
- Avoid excessive background variations.
- Preserve a clear surface hierarchy.
- Maintain consistency across component families.
- Never rely exclusively on color to communicate interaction or selection.

## 1.6. Audit checklist

- [ ] Surface roles are documented.
- [ ] Every surface has a clear purpose.
- [ ] Background differentiation is intentional.
- [ ] Nested surfaces do not create excessive visual noise.
- [ ] Borders are meaningful.
- [ ] Elevation is used consistently.
- [ ] Light and dark themes preserve the same spatial logic.

---

# 2. Surface Hierarchy

## 2.1. Definition

A surface hierarchy defines the relationship between different visual layers.

Not every surface should have the same visual weight.

A page background, a card, an input and a dialog represent different structural roles.

The system must make these distinctions recognizable without making every surface visually prominent.

## 2.2. Recommended surface hierarchy

A useful starting model contains five levels.

|Level|Semantic role|Typical usage|
|---|---|---|
|0|Base|Application background|
|1|Subtle|Secondary regions and grouped content|
|2|Default|Cards, panels and containers|
|3|Raised|Inputs, floating controls and popovers|
|4|Overlay|Dialogs and temporary foreground layers|

These levels describe semantic roles, not a mandatory brightness progression.

For example, an input does not necessarily need to be brighter than a card.

The actual visual relationship depends on the design direction and theme.

## 2.3. Example: Application structure

```text
Application
|
+-- Base Surface
|   |
|   +-- Sidebar
|   |   |
|   |   +-- Navigation Items
|   |
|   +-- Main Content
|       |
|       +-- Panel
|       |   |
|       |   +-- Card
|       |       |
|       |       +-- Interactive Control
|
+-- Floating Layer
    |
    +-- Popover
    |
    +-- Dialog
```

Each layer should have an intentional visual relationship with its parent and neighboring surfaces.

## 2.4. Surface hierarchy principles

### Principle A — Hierarchy through subtle differentiation

Prefer small, controlled differences in:

- Background color.
- Border contrast.
- Elevation.
- Surface brightness.
- Transparency.

Avoid using a completely different color for every container.

### Principle B — Not every container needs a visible boundary

Some groupings can be communicated through spacing and alignment alone.

Do not automatically add a border or background to every logical group.

### Principle C — Interactive surfaces require clear affordances

An interactive surface should provide sufficient indication that it can be interacted with.

The treatment may use:

- Hover background.
- Border change.
- Focus ring.
- Selected background.
- Cursor behavior.

### Principle D — Floating surfaces need clear separation

Menus, dialogs and popovers must remain visually distinguishable from the content behind them.

This does not necessarily require a strong shadow.

## 2.5. Rules

- Establish a documented surface hierarchy.
- Use the minimum differentiation needed.
- Do not confuse semantic hierarchy with brightness.
- Keep interactive surfaces distinguishable.
- Give floating layers enough separation.
- Avoid unnecessary nested surface levels.

## 2.6. Audit checklist

- [ ] Surface levels are defined.
- [ ] Their semantic roles are documented.
- [ ] Hierarchy remains understandable.
- [ ] Adjacent surfaces are sufficiently distinguishable.
- [ ] Containers do not compete visually.
- [ ] Floating layers are recognizable.
- [ ] Surface hierarchy remains coherent across themes.

---

# 3. Semantic Surface Tokens

## 3.1. Definition

Surface tokens describe the semantic purpose of a surface rather than its raw color value.

They create a shared visual vocabulary across the component library.

A component should not independently decide that its background is `#18181B`.

It should use an appropriate semantic token.

## 3.2. Recommended token architecture

Separate primitive colors from semantic surface roles.

Example:

```css
:root {
  /* Primitive colors */
  --neutral-0: #ffffff;
  --neutral-50: #fafafa;
  --neutral-100: #f4f4f5;
  --neutral-200: #e4e4e7;
  --neutral-800: #27272a;
  --neutral-900: #18181b;
  --neutral-950: #09090b;

  /* Semantic surfaces */
  --surface-base: var(--neutral-0);
  --surface-subtle: var(--neutral-50);
  --surface-default: var(--neutral-0);
  --surface-raised: var(--neutral-0);
  --surface-overlay: var(--neutral-0);

  /* Semantic interactive surfaces */
  --surface-hover: var(--neutral-100);
  --surface-active: var(--neutral-200);
  --surface-selected: var(--neutral-100);
  --surface-disabled: var(--neutral-50);
}
```

The example values are illustrative.

In a production design system, semantic tokens should map to the appropriate primitive palette for each theme.

## 3.3. Recommended semantic roles

|Token|Responsibility|
|---|---|
|`surface-base`|Primary application background|
|`surface-subtle`|Low-emphasis background|
|`surface-default`|Standard content surface|
|`surface-raised`|Elevated or distinct surface|
|`surface-overlay`|Temporary foreground surface|
|`surface-sunken`|Recessed region|
|`surface-hover`|Hover interaction|
|`surface-active`|Active interaction|
|`surface-selected`|Persistent selection|
|`surface-disabled`|Disabled region|
|`surface-inverse`|Inverse visual context|

Not every token needs to be exposed publicly.

Avoid creating semantic tokens that represent the same role under different names.

## 3.4. Token ownership

Surface tokens should be managed centrally.

Component-specific tokens should reference semantic surface roles rather than duplicate primitive values.

Example:

```css
.button {
  background: var(--surface-interactive);
}

.card {
  background: var(--surface-default);
}

.popover {
  background: var(--surface-overlay);
}
```

If a component requires a genuinely unique surface treatment, document the reason.

## 3.5. Rules

- Use semantic surface tokens.
- Separate primitive and semantic layers.
- Avoid raw color values in component styles.
- Avoid duplicated semantic roles.
- Keep token names independent of a specific theme.
- Document token ownership.
- Validate token mappings in light and dark themes.

## 3.6. Audit checklist

- [ ] Surface tokens are centralized.
- [ ] Primitive and semantic tokens are separated.
- [ ] Components use semantic roles.
- [ ] Duplicate tokens are identified.
- [ ] Raw color values are controlled.
- [ ] Theme mappings are documented.
- [ ] Token names describe purpose rather than appearance.

---

# 4. Background Differentiation

## 4.1. Definition

Background differentiation is the use of subtle color variations to separate interface regions.

It is one of the most important tools for building understated interfaces.

## 4.2. Common patterns

### Pattern A — Single background with borders

```text
Application Background
|
+-- Card
    |
    +-- Border
```

Useful for minimal interfaces where surface separation should remain discreet.

### Pattern B — Contrasting container backgrounds

```text
Application Background
|
+-- Subtle Panel
    |
    +-- Default Surface
```

Useful for sidebars, settings panels and structured content.

### Pattern C — Sunken content regions

```text
Default Surface
|
+-- Sunken Region
    |
    +-- Content
```

Useful for code blocks, recessed inputs and secondary content areas.

## 4.3. Background differentiation rules

- Use small color differences where possible.
- Avoid unnecessary alternating backgrounds.
- Prefer one dominant application background.
- Use subtle backgrounds for secondary regions.
- Avoid backgrounds that compete with content.
- Maintain consistent surface relationships across the interface.

## 4.4. Audit checklist

- [ ] Background roles are intentional.
- [ ] Secondary regions are distinguishable.
- [ ] Surface differences are not excessive.
- [ ] Content remains visually dominant.
- [ ] Repeated backgrounds are consistent.
- [ ] Nested backgrounds do not create excessive fragmentation.

---

# 5. Border Treatment

## 5.1. Definition

Borders establish boundaries between surfaces and help communicate component structure.

In restrained design systems, borders often carry more structural responsibility than shadows.

They must be subtle without becoming invisible.

## 5.2. Border hierarchy

|Role|Usage|
|---|---|
|Subtle|Delicate internal separators|
|Default|Standard component boundaries|
|Strong|Important structural boundaries|
|Interactive|Hover or active boundaries|
|Focus|Keyboard focus indication|
|Disabled|Disabled component boundaries|

## 5.3. Border characteristics

Evaluate:

- Color.
- Opacity.
- Thickness.
- Style.
- Radius compatibility.
- Visibility.
- Relationship with adjacent surfaces.

## 5.4. Border stacking

A frequent problem is the accumulation of borders.

Example:

```text
Card border
  |
  +-- Panel border
        |
        +-- Input border
              |
              +-- Nested container border
```

When every layer has a visible border, the interface becomes fragmented.

Prefer a clear boundary hierarchy.

Some nested containers should rely on spacing or background differentiation instead.

## 5.5. Rules

- Use borders to clarify structure.
- Prefer subtle borders for standard containers.
- Reserve strong borders for meaningful emphasis.
- Avoid unnecessary nested borders.
- Keep border thickness consistent.
- Ensure focus indicators are distinguishable from ordinary borders.
- Preserve sufficient visibility in dark mode.

## 5.6. Audit checklist

- [ ] Border roles are defined.
- [ ] Border colors are semantic.
- [ ] Border thickness is consistent.
- [ ] Nested borders are controlled.
- [ ] Structural boundaries are recognizable.
- [ ] Focus borders are distinguishable.
- [ ] Dark theme borders remain visible.

---

# 6. Elevation and Shadow System

## 6.1. Definition

Elevation communicates the spatial relationship between a surface and the interface behind it.

Shadows can reinforce this relationship.

However, elevation and shadow are not interchangeable concepts.

A surface may be logically elevated without requiring a prominent shadow.

## 6.2. Elevation model

|Level|Semantic role|Typical usage|
|---|---|---|
|0|Base|Main application surface|
|1|Local elevation|Small floating controls|
|2|Floating|Dropdowns and popovers|
|3|Modal|Dialogs and modal sheets|
|4|Critical overlay|Exceptional foreground layers|

The number of elevation levels should remain limited.

## 6.3. Shadow tokens

Example:

```css
:root {
  --shadow-none: none;

  --shadow-sm:
    0 1px 2px rgb(0 0 0 / 0.04);

  --shadow-md:
    0 4px 12px rgb(0 0 0 / 0.08);

  --shadow-lg:
    0 12px 32px rgb(0 0 0 / 0.12);
}
```

These are starting values, not a complete production shadow system.

Real shadow treatments may require multiple layers and theme-specific adjustments.

## 6.4. Elevation rules

- Use elevation only when it communicates spatial separation.
- Prefer borders for static surface boundaries.
- Keep shadows restrained.
- Avoid applying shadows to every card.
- Ensure elevation levels remain visually distinguishable.
- Do not use shadow as a substitute for hierarchy.
- Avoid excessive blur and dark halos.
- Test shadows against actual theme backgrounds.

## 6.5. Audit checklist

- [ ] Elevation levels are documented.
- [ ] Shadow tokens are centralized.
- [ ] Floating surfaces have sufficient separation.
- [ ] Static surfaces avoid unnecessary shadows.
- [ ] Shadows are consistent across components.
- [ ] Dark theme shadows remain effective.
- [ ] Elevation communicates real spatial relationships.

---

# 7. Interactive Surface States

## 7.1. Definition

Interactive surfaces must communicate their state through controlled visual changes.

A surface can be:

- Default.
- Hovered.
- Active.
- Focused.
- Selected.
- Disabled.
- Loading.
- Expanded.
- Dragged.

These states should remain consistent across the entire design system.

## 7.2. State treatment matrix

|State|Typical treatment|
|---|---|
|Default|Neutral surface|
|Hover|Subtle background change|
|Active|Slightly stronger response|
|Focus-visible|Visible focus ring|
|Selected|Persistent background or indicator|
|Disabled|Reduced emphasis|
|Loading|Activity indication|
|Expanded|Consistent expanded-state styling|
|Dragged|Clear interaction feedback|

## 7.3. Example

```css
.menu-item {
  background: transparent;
}

.menu-item:hover {
  background: var(--surface-hover);
}

.menu-item[data-active="true"] {
  background: var(--surface-selected);
}

.menu-item:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: -2px;
}
```

The example illustrates the principle, not a universal implementation.

## 7.4. Rules

- Standardize interactive surface states.
- Keep hover treatments subtle.
- Make selected states persistent and recognizable.
- Distinguish hover from selection.
- Never rely exclusively on background color for focus.
- Avoid inconsistent state treatments across component families.
- Preserve sufficient contrast.

## 7.5. Audit checklist

- [ ] Default surfaces are defined.
- [ ] Hover treatments are consistent.
- [ ] Active states are recognizable.
- [ ] Focus states are accessible.
- [ ] Selected states are persistent.
- [ ] Disabled states are distinguishable.
- [ ] Expanded states are consistent.
- [ ] Surface states work in both themes.

---

# 8. Nested Surfaces

## 8.1. Definition

Nested surfaces are surfaces contained within other surfaces.

They are common in:

- Cards.
- Settings panels.
- Dialogs.
- Dropdown menus.
- Navigation containers.
- Dashboard layouts.
- Data-heavy applications.

Their visual relationships must be carefully controlled.

## 8.2. Nested surface principles

### Principle A — Avoid excessive nesting

Not every content group requires its own Card.

### Principle B — Establish a clear parent-child relationship

A nested surface must be visually related to its parent.

### Principle C — Avoid identical treatment at every level

If every nested surface has the same background, border and radius, the hierarchy becomes difficult to understand.

### Principle D — Use spacing before adding containers

Sometimes a simple gap is enough to communicate separation.

## 8.3. Example

Prefer:

```text
Settings Card
|
+-- Account Section
|   |
|   +-- Input
|   +-- Input
|
+-- Security Section
    |
    +-- Switch
    +-- Description
```

Over:

```text
Settings Card
|
+-- Account Card
|   |
|   +-- Input Card
|
+-- Security Card
    |
    +-- Switch Card
```

The second structure introduces unnecessary visual fragmentation.

## 8.4. Rules

- Limit unnecessary nesting.
- Establish parent-child visual relationships.
- Avoid repeated borders.
- Use spacing to separate related groups.
- Vary surface treatments only when hierarchy requires it.
- Preserve consistent radius relationships.

## 8.5. Audit checklist

- [ ] Nested containers are justified.
- [ ] Parent-child relationships are recognizable.
- [ ] Repeated borders are avoided.
- [ ] Nested surfaces do not compete visually.
- [ ] Spacing is used appropriately.
- [ ] Radius relationships are coherent.

---

# 9. Floating Surfaces and Overlays

## 9.1. Definition

Floating surfaces temporarily appear above the normal interface flow.

Examples:

- Dropdown menus.
- Popovers.
- Tooltips.
- Context menus.
- Command palettes.
- Dialogs.
- Modal sheets.

They require a consistent visual and spatial treatment.

## 9.2. Floating surface characteristics

Evaluate:

- Background.
- Border.
- Shadow.
- Radius.
- Internal padding.
- Positioning.
- Layering.
- Separation from underlying content.
- Dismissal behavior.
- Animation.

## 9.3. Overlay hierarchy

```text
Application
|
+-- Page Content
|
+-- Floating Layer
|   |
|   +-- Tooltip
|   +-- Dropdown
|   +-- Popover
|
+-- Modal Layer
    |
    +-- Backdrop
    |
    +-- Dialog
```

This is a conceptual hierarchy. Actual stacking must be explicitly defined by the overlay architecture.

## 9.4. Backdrop treatment

A modal backdrop should:

- Clearly separate modal content from the application.
- Reduce background prominence.
- Preserve sufficient context where appropriate.
- Avoid excessive opacity.
- Remain consistent across dialogs and modal sheets.

Example:

```css
.dialog-backdrop {
  background: rgb(0 0 0 / 0.48);
}
```

The appropriate opacity depends on the theme and underlying surface.

## 9.5. Rules

- Define a shared floating surface treatment.
- Standardize overlay backgrounds.
- Use consistent border and radius treatments.
- Establish explicit stacking rules.
- Avoid arbitrary z-index values.
- Ensure overlays remain distinguishable.
- Preserve sufficient contrast.
- Prevent floating surfaces from appearing visually disconnected.

## 9.6. Audit checklist

- [ ] Floating surface styles are centralized.
- [ ] Overlay hierarchy is documented.
- [ ] Z-index levels are controlled.
- [ ] Backdrop treatment is consistent.
- [ ] Dialogs and menus have appropriate elevation.
- [ ] Floating surfaces have consistent radii.
- [ ] Content remains readable.
- [ ] Nested overlays behave predictably.

---

# 10. Transparency and Translucency

## 10.1. Definition

Transparency and translucency allow underlying content to influence the appearance of a surface.

They can create sophisticated effects but should be used selectively.

Examples:

- Modal backdrops.
- Translucent navigation bars.
- Glass-like overlays.
- Floating toolbars.
- Layered panels.

## 10.2. Usage principles

Transparency may be appropriate when:

- The underlying context is useful.
- The visual effect supports the spatial hierarchy.
- Text contrast remains sufficient.
- The rendering remains stable across themes.

Avoid transparency when:

- It reduces readability.
- It introduces visual noise.
- It creates inconsistent colors depending on background content.
- It is used merely as decoration.

## 10.3. Rules

- Use transparency intentionally.
- Do not apply blur indiscriminately.
- Ensure text contrast against changing backgrounds.
- Provide opaque fallbacks where needed.
- Test across different underlying content.
- Account for browser rendering and performance.

## 10.4. Audit checklist

- [ ] Transparent surfaces have a clear purpose.
- [ ] Text remains readable.
- [ ] Transparency is consistent.
- [ ] Blur is used selectively.
- [ ] Opaque fallbacks exist where necessary.
- [ ] Theme behavior is validated.

---

# 11. Light and Dark Surface Architecture

## 11.1. Definition

Light and dark themes must preserve the same semantic surface relationships.

A dark theme should not simply be an inversion of light theme colors.

It requires its own carefully controlled surface hierarchy.

## 11.2. Light theme characteristics

Light interfaces typically rely on:

- A dominant light background.
- Subtle gray secondary surfaces.
- Carefully controlled borders.
- Minimal shadows.
- Clear content separation.

## 11.3. Dark theme characteristics

Dark interfaces typically rely on:

- A dark neutral foundation.
- Subtle surface brightness differences.
- Controlled border contrast.
- Carefully balanced text contrast.
- Shadows that may require different treatment.
- Avoidance of excessive pure-black regions.

## 11.4. Semantic mapping example

```css
:root {
  color-scheme: light;

  --surface-base: #ffffff;
  --surface-subtle: #fafafa;
  --surface-default: #ffffff;
  --surface-raised: #ffffff;
  --surface-overlay: #ffffff;

  --border-subtle: #f0f0f0;
  --border-default: #e5e5e5;
}

.dark {
  color-scheme: dark;

  --surface-base: #09090b;
  --surface-subtle: #111113;
  --surface-default: #18181b;
  --surface-raised: #202023;
  --surface-overlay: #202023;

  --border-subtle: #242427;
  --border-default: #303034;
}
```

Values are illustrative and should be calibrated against the actual Reef palette.

## 11.5. Rules

- Preserve semantic roles across themes.
- Do not mechanically invert colors.
- Recalibrate borders independently.
- Recalibrate elevation and shadows.
- Validate nested surfaces.
- Preserve selected and interactive states.
- Avoid excessive brightness differences.
- Ensure all surface combinations remain distinguishable.

## 11.6. Audit checklist

- [ ] Semantic surface roles exist in both themes.
- [ ] Surface hierarchy remains recognizable.
- [ ] Borders are recalibrated.
- [ ] Shadows are theme-aware.
- [ ] Nested surfaces remain coherent.
- [ ] Interactive states remain visible.
- [ ] No surface becomes unexpectedly invisible.

---

# 12. Surface Consistency Across Component Families

## 12.1. Definition

Components belonging to the same family must use compatible surface treatments.

This is essential to preserve a recognizable visual identity.

## 12.2. Family standards

|Family|Surface requirements|
|---|---|
|Cards|Background, border, radius|
|Form controls|Background, border, focus surface|
|Menus|Overlay surface, hover and selected surfaces|
|Dialogs|Overlay surface, backdrop, elevation|
|Navigation|Base surface, active surface, hover|
|Feedback|Semantic background and border|
|Tooltips|Floating surface and text contrast|
|Data tables|Row backgrounds, selected rows, separators|

## 12.3. Rules

- Define surface standards by component family.
- Reuse semantic tokens.
- Avoid independently invented backgrounds.
- Standardize border treatments.
- Standardize floating surface treatments.
- Validate related components side by side.

## 12.4. Audit checklist

- [ ] Component families share surface conventions.
- [ ] Similar components use compatible backgrounds.
- [ ] Floating components share a visual language.
- [ ] Borders and shadows are coherent.
- [ ] State treatments are consistent.
- [ ] No component appears visually disconnected.

---

# 13. Surface Treatment Anti-Patterns

|Anti-pattern|Problem|Expected correction|
|---|---|---|
|Too many background colors|Visual fragmentation|Reduce semantic surface roles|
|Every component has a border|Excessive visual noise|Use spacing and hierarchy|
|Every card has a shadow|Artificial elevation|Reserve shadows for floating layers|
|Excessive nested cards|Weak information hierarchy|Use grouping and spacing|
|Arbitrary surface colors|Inconsistent themes|Use semantic tokens|
|Identical treatment at every level|Flat hierarchy|Define surface roles|
|Excessive dark mode contrast|Harsh appearance|Recalibrate surface relationships|
|Invisible dark borders|Poor separation|Adjust semantic border tokens|
|Arbitrary z-index values|Unpredictable layering|Centralize layer tokens|
|Blur everywhere|Decorative complexity|Use translucency selectively|
|Hover indistinguishable from selected|Ambiguous interaction|Define distinct states|
|Focus represented only by background|Accessibility issue|Add visible focus indicator|
|Shadow used as a border substitute|Inconsistent boundaries|Separate elevation and boundary roles|

---

# 14. Surface Treatment Audit Methodology

Every component must be evaluated across the following dimensions.

## 14.1. Surface hierarchy

- Does the component use the correct semantic surface role?
- Is it visually distinguishable from its parent?
- Does it create unnecessary visual layers?

## 14.2. Backgrounds

- Are background colors semantic?
- Are color differences controlled?
- Is content visually dominant?

## 14.3. Borders

- Are boundaries meaningful?
- Is border contrast appropriate?
- Are nested borders controlled?

## 14.4. Elevation

- Does elevation communicate spatial relationships?
- Are shadows necessary?
- Is the floating layer sufficiently separated?

## 14.5. Interactive states

- Are hover and active surfaces coherent?
- Is selection persistent and clear?
- Is focus accessible?

## 14.6. Nested surfaces

- Is nesting justified?
- Are parent-child relationships recognizable?
- Is there unnecessary visual fragmentation?

## 14.7. Floating surfaces

- Are overlays consistent?
- Is layering predictable?
- Are backdrops and shadows coherent?

## 14.8. Theme consistency

- Are semantic relationships preserved?
- Are dark-theme surfaces properly differentiated?
- Are borders and shadows recalibrated?

---

# 15. Surface Treatment Scoring

Each component must receive a score from 0 to 4 across eight dimensions.

|Dimension|Weight|
|---|---|
|Surface hierarchy|15%|
|Background differentiation|15%|
|Border treatment|15%|
|Elevation and shadows|10%|
|Interactive surface states|15%|
|Nested surface consistency|10%|
|Floating surface treatment|10%|
|Light/dark consistency|10%|

### Scoring scale

|Score|Classification|Description|
|---|---|---|
|0|Missing|No coherent surface architecture|
|1|Poor|Arbitrary backgrounds, borders and shadows|
|2|Partial|Basic hierarchy with significant inconsistencies|
|3|Good|Consistent and visually controlled|
|4|Excellent|Precise, restrained and coherent surface system|

Weighted score:

`(Hierarchy × 0.15) + (Background × 0.15) + (Borders × 0.15) + (Elevation × 0.10) + (States × 0.15) + (Nested × 0.10) + (Floating × 0.10) + (Themes × 0.10)`

### Mandatory constraints

A component cannot be considered compliant if:

- It uses arbitrary colors instead of semantic surface tokens without justification.
- Its interactive states are visually ambiguous.
- Its focus state is not sufficiently visible.
- Its surface treatment breaks the established hierarchy.
- Its floating layers cannot be distinguished from the underlying interface.
- Its dark-theme rendering significantly degrades readability.

---

# 16. Remediation Guidelines

When a component fails the surface treatment audit, apply corrections in this order:

1. Identify the semantic role of every surface.
2. Remove unnecessary containers and nested surfaces.
3. Replace arbitrary backgrounds with semantic tokens.
4. Correct background differentiation.
5. Standardize border roles and contrast.
6. Correct elevation and shadow usage.
7. Standardize interactive surface states.
8. Review overlay and stacking behavior.
9. Correct transparency and blur usage.
10. Validate light and dark theme mappings.
11. Validate component family consistency.
12. Test in realistic application compositions.

Always correct the surface hierarchy before adjusting decorative details.

---

# 17. Final Acceptance Criteria

The surface treatment system is considered successfully implemented when:

- A documented surface hierarchy exists.
- Semantic surface tokens are centralized.
- Background differentiation is controlled.
- Borders communicate meaningful boundaries.
- Elevation and shadows have clear responsibilities.
- Interactive surface states are consistent.
- Nested surfaces do not create unnecessary visual fragmentation.
- Floating surfaces have predictable visual treatment.
- Transparency is used intentionally.
- Light and dark themes preserve the same semantic relationships.
- Component families share coherent surface treatments.
- No arbitrary surface styling compromises the visual identity.

---

# 18. Final Principle

Surface treatment is the discipline of organizing an interface into meaningful visual layers.

A good surface system does not make every component stand out.

It makes the right elements stand out at the right time.

It creates hierarchy without noise, depth without excessive shadows and separation without unnecessary borders.

**The objective is to create a coherent spatial language through restraint, semantic differentiation and precise control of visual layers.**