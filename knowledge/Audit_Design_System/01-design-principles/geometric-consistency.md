# Geometric Consistency

> **Purpose:** Define the geometric rules, dimensional relationships, proportions and evaluation criteria governing the entire UI library.
> 
> **Scope:** Component dimensions, spacing, alignment, border radius, borders, icon geometry, control proportions, grids, optical alignment, surface geometry, nested components and responsive dimensions.
> 
> **Related principles:** DP-01 Functional Minimalism, DP-04 Typographic Precision, DP-05 Geometric Consistency, DP-06 Functional Density, DP-07 Clear Information Hierarchy, DP-08 Progressive Disclosure.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.

---

# 1. Geometric Consistency Philosophy

## 1.1. Definition

Geometric consistency describes the degree to which dimensions, proportions, shapes and spatial relationships follow a coherent visual system.

It ensures that components feel like parts of the same design language rather than independent visual constructions.

Geometric consistency applies to:

- Width and height.
- Internal and external spacing.
- Border radius.
- Border thickness.
- Icon dimensions.
- Component proportions.
- Alignment.
- Grid relationships.
- Surface boundaries.
- Nested component geometry.
- Optical corrections.

### Core principle

**Every geometric decision must belong to a coherent system of dimensions, proportions and spatial relationships.**

## 1.2. Expected visual characteristics

The library must favor:

- Predictable dimensions.
- Consistent component proportions.
- Controlled geometric variation.
- Precise alignment.
- Harmonious border radii.
- Consistent border thickness.
- Proportional icon sizing.
- Reusable spacing relationships.
- Balanced internal padding.
- Consistent nested geometry.

Avoid:

- Arbitrary dimensions.
- Inconsistent corner radii.
- Random icon sizes.
- Misaligned component boundaries.
- Inconsistent control heights.
- Excessive geometric variation.
- Unnecessary nested borders.
- Uncontrolled padding.
- Inconsistent visual proportions.

## 1.3. Geometry versus visual uniformity

Geometric consistency does not mean every component must have identical dimensions.

A button, dialog, badge and tooltip have different functional requirements.

The objective is not uniformity.

It is coherence.

For example:

- A Dialog can have a larger radius than an Input.
- A Badge can be smaller than a Button.
- An IconButton can have equal width and height.
- A Table can use different row heights depending on its density.

These differences are acceptable when they follow explicit and predictable rules.

## 1.4. Rules

- Use centralized geometric tokens.
- Define relationships between component dimensions.
- Avoid arbitrary one-off values.
- Preserve consistency between equivalent components.
- Allow functional exceptions when justified.
- Validate geometry at both component and composition levels.
- Distinguish mathematical alignment from optical alignment.

## 1.5. Audit checklist

- [ ] Geometric decisions follow a common system.
- [ ] Component dimensions are predictable.
- [ ] Equivalent components have consistent proportions.
- [ ] Exceptions are justified.
- [ ] Alignment is consistent.
- [ ] Nested components preserve geometric coherence.
- [ ] No arbitrary geometric values exist without justification.

---

# 2. Geometric Token Architecture

## 2.1. Definition

Geometric consistency requires a centralized token architecture that defines the physical characteristics of components and surfaces.

The library must distinguish primitive geometric values from semantic geometric roles.

## 2.2. Primitive geometric tokens

Primitive tokens define available physical values.

Example:

```css
/* Spacing */
--space-0: 0;
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.25rem;
--space-6: 1.5rem;
--space-8: 2rem;

/* Border radius */
--radius-none: 0;
--radius-xs: 0.125rem;
--radius-sm: 0.25rem;
--radius-md: 0.375rem;
--radius-lg: 0.5rem;
--radius-xl: 0.75rem;
--radius-2xl: 1rem;
--radius-full: 9999px;

/* Border width */
--border-width-none: 0;
--border-width-thin: 1px;
--border-width-medium: 1.5px;
--border-width-thick: 2px;

/* Icon dimensions */
--icon-size-xs: 0.75rem;
--icon-size-sm: 0.875rem;
--icon-size-md: 1rem;
--icon-size-lg: 1.25rem;
--icon-size-xl: 1.5rem;
```

Values are illustrative and must be calibrated against the actual Reef.js visual language.

## 2.3. Semantic geometric tokens

Semantic tokens define the intended usage of primitive values.

Example:

```css
/* Component geometry */
--geometry-button-height-sm: ...;
--geometry-button-height-md: ...;
--geometry-input-height-md: ...;
--geometry-menu-item-height: ...;

/* Component radii */
--geometry-button-radius: ...;
--geometry-input-radius: ...;
--geometry-card-radius: ...;
--geometry-dialog-radius: ...;
--geometry-popover-radius: ...;

/* Component borders */
--geometry-control-border-width: ...;
--geometry-surface-border-width: ...;

/* Icon relationships */
--geometry-control-icon-size: ...;
--geometry-inline-icon-size: ...;
```

## 2.4. Rules

- Primitive values must be centralized.
- Semantic tokens must express functional roles.
- Components should consume semantic tokens.
- Avoid arbitrary CSS dimensions.
- Avoid duplicating equivalent values under different names.
- Document exceptional geometric values.
- Avoid creating tokens for meaningless differences.
- Keep geometric tokens independent of color themes wherever possible.

## 2.5. Audit checklist

- [ ] Primitive geometry is centralized.
- [ ] Semantic geometry is documented.
- [ ] Components consume semantic tokens.
- [ ] Equivalent dimensions are reused.
- [ ] Arbitrary values are identified.
- [ ] Exceptions are documented.
- [ ] Geometry is independent of theme-specific color decisions.

---

# 3. Dimensional Consistency

## 3.1. Definition

Dimensional consistency ensures that components with equivalent functional roles share predictable dimensions.

It is especially important for controls that frequently appear together.

## 3.2. Standard control heights

The library should establish a controlled dimension scale.

Illustrative example:

|Size|Height|Intended usage|
|---|---|---|
|XS|24px|Compact secondary controls|
|SM|28px|Dense interfaces|
|MD|32px|Standard compact controls|
|LG|36px|Standard controls|
|XL|40px|Comfortable controls|

These values are starting points, not mandatory universal dimensions.

The actual scale must be aligned with the product's density philosophy.

## 3.3. Equivalent component relationships

|Component|Geometric expectation|
|---|---|
|Button|Standard control height|
|Input|Compatible with Button|
|Select|Compatible with Input|
|Search|Compatible with Input|
|IconButton|Square dimensions|
|Checkbox|Consistent indicator dimensions|
|Radio|Consistent indicator dimensions|
|MenuItem|Predictable row height|
|Tabs|Consistent trigger dimensions|

## 3.4. Rules

- Inputs and buttons of equivalent size must align.
- Select and Input must share compatible dimensions.
- IconButtons must preserve square proportions.
- Repeated menu items must share row geometry.
- Component sizes must be defined centrally.
- Avoid unnecessary height variations.
- Width should remain flexible unless the component requires a constraint.
- Text must remain vertically balanced.

## 3.5. Audit checklist

- [ ] Equivalent controls share compatible heights.
- [ ] Control dimensions follow a defined scale.
- [ ] IconButtons preserve square geometry.
- [ ] Menu items have consistent row dimensions.
- [ ] Text is vertically centered.
- [ ] Component dimensions are not arbitrarily defined.

---

# 4. Border Radius System

## 4.1. Definition

Border radius defines the curvature of component boundaries.

It contributes significantly to the perceived personality of a design system.

A coherent radius system creates a recognizable visual language.

The library generally favors restrained, functional corner treatments rather than excessive roundness.

## 4.2. Radius hierarchy

The library should define a limited number of semantic radius roles.

|Token|Typical usage|
|---|---|
|radius-none|Tables, structural separators|
|radius-xs|Small indicators|
|radius-sm|Compact controls|
|radius-md|Standard controls|
|radius-lg|Cards and popovers|
|radius-xl|Dialogs and larger surfaces|
|radius-full|Pills and circular controls|

## 4.3. Geometric relationships

The radius should be proportional to the component's dimensions and visual role.

Examples:

- Small controls should generally use restrained radii.
- Larger surfaces may use larger radii.
- Circular controls should use fully rounded geometry.
- Pills should preserve their capsule shape.
- Nested surfaces should avoid visually awkward corner combinations.

## 4.4. Nested radius consistency

When a rounded element is placed inside another rounded element, the resulting corners must remain visually coherent.

Example:

```text
+--------------------------------+
| Outer surface                  |
|                                |
|   +------------------------+   |
|   | Inner surface          |   |
|   |                        |   |
|   +------------------------+   |
|                                |
+--------------------------------+
```

The inner surface must not visually collide with the outer surface boundary.

When nested elements share a background, avoid introducing unnecessary additional radii.

## 4.5. Rules

- Use a limited radius scale.
- Define semantic radius roles.
- Keep equivalent controls consistent.
- Avoid excessive rounding.
- Avoid arbitrary component-specific radii.
- Ensure nested surfaces are coherent.
- Preserve circular proportions where required.
- Do not use radius differences as meaningless decoration.

## 4.6. Audit checklist

- [ ] Radius tokens are centralized.
- [ ] Radius hierarchy is documented.
- [ ] Equivalent controls share radii.
- [ ] Large surfaces use coherent corner treatments.
- [ ] Nested radii are visually balanced.
- [ ] Excessive rounding is avoided.
- [ ] No arbitrary radius values exist.

---

# 5. Spacing and Proportional Relationships

## 5.1. Definition

Spacing establishes geometric relationships between components.

It determines how elements align, group and occupy available space.

The library must use a predictable spacing scale rather than independent margin and padding decisions.

## 5.2. Spacing scale

Example:

|Token|Value|Typical usage|
|---|---|---|
|space-1|4px|Tight icon gaps|
|space-2|8px|Inline relationships|
|space-3|12px|Control internal spacing|
|space-4|16px|Standard grouping|
|space-5|20px|Content grouping|
|space-6|24px|Section grouping|
|space-8|32px|Major separation|
|space-12|48px|Large layout separation|

## 5.3. Proportional rules

- Related elements should have consistent gaps.
- Internal padding should be proportional to component size.
- Horizontal and vertical padding should be intentionally balanced.
- Repeated groups should use consistent spacing.
- Larger structural separations should be visibly greater than inline gaps.
- Avoid arbitrary fractional differences unless visually justified.

## 5.4. Component padding

The library should define padding conventions by component category.

|Component|Padding strategy|
|---|---|
|Button|Controlled horizontal and vertical padding|
|Input|Consistent internal padding|
|Badge|Small content-driven padding|
|Card|Generous but restrained internal padding|
|Dialog|Consistent content inset|
|MenuItem|Compact horizontal and vertical padding|
|TableCell|Controlled cell padding|

## 5.5. Audit checklist

- [ ] Spacing uses a controlled scale.
- [ ] Internal padding is consistent.
- [ ] Horizontal and vertical relationships are balanced.
- [ ] Related elements use predictable gaps.
- [ ] Structural spacing is distinct from inline spacing.
- [ ] Arbitrary margin values are avoided.

---

# 6. Alignment System

## 6.1. Definition

Alignment determines how visual elements relate along horizontal and vertical axes.

Poor alignment creates a perception of imprecision even when individual component dimensions are correct.

## 6.2. Alignment principles

- Related content should share alignment axes.
- Repeated components should preserve consistent alignment.
- Icons and labels should be vertically balanced.
- Text baselines should align where appropriate.
- Controls in the same group should align consistently.
- Content boundaries should follow predictable layout edges.

## 6.3. Alignment types

|Alignment|Intended usage|
|---|---|
|Left|Standard text and content alignment|
|Center|Icons, indicators and centered controls|
|Right|Numerical values and trailing actions|
|Top|Multiline content and complex layouts|
|Baseline|Text relationships|
|Stretch|Repeated controls and columns|

## 6.4. Rules

- Prefer shared layout alignment over individual offsets.
- Avoid arbitrary `margin-top` corrections.
- Use flex and grid relationships intentionally.
- Maintain alignment across repeated rows.
- Align controls within the same visual group.
- Preserve consistent content insets.
- Apply optical corrections only when mathematically correct alignment appears visually wrong.

## 6.5. Audit checklist

- [ ] Shared alignment axes are respected.
- [ ] Repeated components align consistently.
- [ ] Icons and labels are balanced.
- [ ] Text baselines are coherent.
- [ ] Controls align within groups.
- [ ] Arbitrary offsets are minimized.
- [ ] Optical corrections are justified.

---

# 7. Icon Geometry

## 7.1. Definition

Icons must follow a consistent geometric language.

Even when icons originate from different sources, they must appear visually coherent when used together.

## 7.2. Icon characteristics

Evaluate:

- ViewBox dimensions.
- Stroke width.
- Stroke caps.
- Stroke joins.
- Internal padding.
- Optical size.
- Visual weight.
- Proportions.
- Alignment.
- Filled versus outlined appearance.

## 7.3. Standard icon dimensions

Illustrative scale:

|Size|Dimension|Typical usage|
|---|---|---|
|XS|12px|Compact indicators|
|SM|14px|Dense controls|
|MD|16px|Standard controls|
|LG|20px|Prominent controls|
|XL|24px|Larger interface elements|

## 7.4. Icon-to-control relationships

|Control size|Icon size|
|---|---|
|XS|12px|
|SM|14px|
|MD|16px|
|LG|16–20px|
|XL|20–24px|

The relationship should be calibrated according to icon style and available internal space.

## 7.5. Rules

- Use a consistent icon family whenever possible.
- Standardize icon sizing.
- Maintain consistent stroke characteristics.
- Avoid mixing visually incompatible icon families.
- Preserve optical alignment.
- Avoid oversized icons in compact interfaces.
- Maintain consistent icon-to-label spacing.
- Do not distort icons to force alignment.

## 7.6. Audit checklist

- [ ] Icon sources are consistent.
- [ ] Icon sizes follow a standard scale.
- [ ] Stroke widths are coherent.
- [ ] ViewBox proportions are respected.
- [ ] Icons align optically with text.
- [ ] Icon-to-label spacing is consistent.
- [ ] No icons are distorted.

---

# 8. Border Geometry

## 8.1. Definition

Borders establish boundaries between components and surfaces.

Their geometry must remain predictable and restrained.

## 8.2. Rules

- Use consistent border thickness.
- Align borders with component boundaries.
- Avoid double borders between adjacent components.
- Avoid excessive nested borders.
- Use separators when they improve structural comprehension.
- Keep border geometry independent from semantic color meaning.
- Avoid arbitrary border widths.
- Ensure focus indicators are not confused with ordinary borders.

## 8.3. Border thickness scale

|Token|Value|Usage|
|---|---|---|
|None|0px|Borderless components|
|Thin|1px|Standard boundaries|
|Medium|1.5px|Emphasized boundaries|
|Thick|2px|Strong indicators and selected treatments|

The standard interface border should generally remain restrained.

## 8.4. Audit checklist

- [ ] Border widths are standardized.
- [ ] Borders align with component geometry.
- [ ] Adjacent borders do not create unnecessary thickness.
- [ ] Nested borders are justified.
- [ ] Separators have a clear structural purpose.
- [ ] Focus indicators remain distinguishable.

---

# 9. Surface Geometry

## 9.1. Definition

Surface geometry determines how containers, cards, dialogs, popovers and other visual regions relate to each other.

The library must avoid creating unnecessary geometric layers.

## 9.2. Surface hierarchy

|Surface|Geometric characteristics|
|---|---|
|Page|Primary layout boundary|
|Panel|Structural content grouping|
|Card|Independent content grouping|
|Popover|Floating contextual surface|
|Dialog|Prominent modal surface|
|Tooltip|Compact contextual surface|

## 9.3. Rules

- Use surfaces when they communicate meaningful grouping.
- Avoid unnecessary nested cards.
- Keep surface radii consistent by category.
- Maintain predictable content insets.
- Avoid excessive surface depth.
- Ensure floating surfaces have coherent dimensions.
- Use spacing instead of containers when possible.

## 9.4. Audit checklist

- [ ] Surface categories are defined.
- [ ] Radius usage is consistent.
- [ ] Content insets are predictable.
- [ ] Nested containers are justified.
- [ ] Floating surfaces have coherent geometry.
- [ ] Excessive visual nesting is avoided.

---

# 10. Geometric Consistency in Dense Interfaces

## 10.1. Definition

Dense interfaces require particularly strong geometric consistency because small dimensional differences become highly visible when repeated.

## 10.2. Rules

- Repeated rows must share identical geometry.
- Column boundaries must align.
- Controls in toolbars must use compatible dimensions.
- Navigation items must follow a consistent height scale.
- Metadata must align predictably.
- Icons must use consistent optical dimensions.
- Repeated separators must share thickness and position.

## 10.3. Examples

### List rows

```text
+--------------------------------------------------+
| [Icon]  Item title                   [Status] [...]|
+--------------------------------------------------+
| [Icon]  Item title                   [Status] [...]|
+--------------------------------------------------+
| [Icon]  Item title                   [Status] [...]|
+--------------------------------------------------+
```

### Toolbar

```text
+--------------------------------------------------+
| [Icon] [Icon] | [Select] | [Search] | [Action]   |
+--------------------------------------------------+
```

Every control should respect common alignment and dimension rules.

## 10.4. Audit checklist

- [ ] Repeated rows have consistent dimensions.
- [ ] Column boundaries align.
- [ ] Toolbar controls share compatible geometry.
- [ ] Navigation items follow consistent dimensions.
- [ ] Repeated icons have consistent optical size.
- [ ] Separators are aligned.

---

# 11. Optical Alignment

## 11.1. Definition

Mathematical alignment and perceived visual alignment are not always identical.

Optical alignment accounts for differences in visual mass, shape and internal whitespace.

For example, a circular icon and a square icon may have identical bounding boxes but appear to have different visual sizes.

## 11.2. Rules

- Use mathematical alignment as the default.
- Apply optical corrections only when a visible imbalance exists.
- Keep optical adjustments small.
- Document repeated optical corrections.
- Avoid component-specific hacks when the correction belongs to the icon system.
- Validate corrections at actual rendering sizes.

## 11.3. Common examples

- Circular icons may require slight optical adjustment.
- Chevron icons may require different horizontal centering.
- Text and icons may require baseline compensation.
- Filled icons may appear heavier than outlined icons.
- Different glyphs may require different perceived vertical positioning.

## 11.4. Audit checklist

- [ ] Mathematical alignment is the default.
- [ ] Optical corrections are intentional.
- [ ] Repeated corrections are centralized.
- [ ] Icons appear balanced at actual sizes.
- [ ] Optical adjustments do not create inconsistencies.

---

# 12. Geometric Consistency Across States

## 12.1. Definition

Component geometry must remain stable across interaction states.

State changes should not introduce unexpected dimensional or positional changes.

## 12.2. Rules

- Hover must not change component dimensions.
- Focus must not unexpectedly shift layout.
- Selected states must preserve geometry.
- Loading states must reserve appropriate space.
- Validation messages must not overlap controls.
- Borders must not cause unwanted size changes.
- Transitions must preserve dimensional stability.

## 12.3. Audit checklist

- [ ] Component dimensions remain stable across states.
- [ ] Focus indicators do not cause layout shifts.
- [ ] Selected states preserve alignment.
- [ ] Loading content does not cause unexpected movement.
- [ ] Validation states remain geometrically coherent.
- [ ] Borders use predictable box-sizing behavior.

---

# 13. Geometric Consistency Across Themes and Density Modes

## 13.1. Definition

Geometry should remain structurally consistent across light and dark themes and across density modes.

Themes should primarily modify visual appearance.

Density modes may modify dimensions, but must preserve proportional relationships.

## 13.2. Rules

- Light and dark themes must share geometric values unless explicitly justified.
- Radius roles must remain consistent.
- Border thickness must remain predictable.
- Icon dimensions must not change arbitrarily.
- Density changes must preserve component proportions.
- Compact controls must remain visually balanced.
- Comfortable controls must not become excessively rounded.

## 13.3. Audit checklist

- [ ] Geometry is equivalent across themes.
- [ ] Radius roles remain consistent.
- [ ] Border widths remain predictable.
- [ ] Density modes preserve proportions.
- [ ] Icons remain correctly scaled.
- [ ] No theme-specific geometric hacks exist.

---

# 14. Geometric Consistency Across Component Composition

## 14.1. Definition

Components must preserve geometric relationships when composed with other components.

The library must provide predictable results when controls, containers and surfaces are nested.

## 14.2. Rules

- Components must not introduce arbitrary external margins.
- Parent layouts should control inter-component spacing.
- Child dimensions must respect parent constraints.
- Nested surfaces must preserve radius relationships.
- Shared boundaries should avoid double borders.
- Controls must align within composite components.
- Component geometry must remain predictable regardless of nesting depth.

## 14.3. Example: Form composition

```text
+------------------------------------------+
| Account settings                         |
|                                          |
| Full name                                |
| +--------------------------------------+ |
| | Jane Doe                             | |
| +--------------------------------------+ |
|                                          |
| Email address                            |
| +--------------------------------------+ |
| | jane@example.com                     | |
| +--------------------------------------+ |
|                                          |
|                         [Cancel] [Save]  |
+------------------------------------------+
```

The composition should maintain:

- Consistent content insets.
- Aligned input boundaries.
- Consistent control heights.
- Predictable vertical gaps.
- Aligned action dimensions.

## 14.4. Audit checklist

- [ ] Parent layouts control spacing.
- [ ] Child components respect parent constraints.
- [ ] Nested radii are coherent.
- [ ] Shared borders are handled correctly.
- [ ] Controls align within compositions.
- [ ] Geometry remains predictable at different nesting levels.

---

# 15. Geometric Consistency Anti-Patterns

|Anti-pattern|Problem|Expected correction|
|---|---|---|
|Arbitrary border radii|Fragmented visual language|Centralize radius roles|
|Inconsistent control heights|Misaligned interfaces|Standardize dimensions|
|Random spacing values|Unpredictable relationships|Use spacing tokens|
|Mixed icon families|Inconsistent optical weight|Standardize icon sources|
|Inconsistent stroke widths|Visual imbalance|Normalize icon geometry|
|Excessive nested borders|Geometric noise|Simplify boundaries|
|Double borders|Unnecessary visual thickness|Coordinate shared edges|
|Arbitrary margin corrections|Fragile layouts|Correct parent alignment|
|Oversized icons|Unbalanced controls|Standardize icon scale|
|Unjustified fixed widths|Poor adaptability|Prefer flexible sizing|
|Inconsistent row heights|Unstable dense interfaces|Standardize repeated geometry|
|Radius overuse|Excessively soft appearance|Use restrained curvature|
|Unstable state dimensions|Layout shifts|Reserve component geometry|
|Optical hacks everywhere|Difficult maintenance|Centralize optical corrections|

---

# 16. Geometric Consistency Audit Methodology

Every component must be audited through the following dimensions.

## 16.1. Dimensional consistency

- Are dimensions based on a shared scale?
- Are equivalent controls compatible?
- Are fixed dimensions justified?
- Are proportions coherent?

## 16.2. Spacing

- Are internal and external gaps consistent?
- Is padding proportional to component size?
- Are spacing tokens used correctly?
- Are parent layouts responsible for spacing?

## 16.3. Border radius

- Are radius roles consistent?
- Are nested radii coherent?
- Is curvature appropriate to the component?
- Are arbitrary values avoided?

## 16.4. Alignment

- Are shared alignment axes respected?
- Are controls aligned?
- Are icons optically balanced?
- Are repeated structures consistent?

## 16.5. Icon geometry

- Are icon dimensions consistent?
- Are stroke characteristics coherent?
- Are ViewBoxes respected?
- Are icons visually balanced?

## 16.6. Border geometry

- Are border widths standardized?
- Are boundaries correctly aligned?
- Are double borders avoided?
- Are focus indicators distinguishable?

## 16.7. Composition

- Does the component preserve parent alignment?
- Are nested surfaces coherent?
- Are external margins avoided?
- Does geometry remain stable when composed?

## 16.8. Cross-system consistency

- Does geometry remain consistent across themes?
- Does density preserve proportions?
- Do interaction states preserve dimensions?
- Does responsive behavior maintain coherent relationships?

---

# 17. Geometric Consistency Scoring

Each component must receive a score from 0 to 4 across eight dimensions.

|Dimension|Weight|
|---|---|
|Dimensional consistency|20%|
|Spacing consistency|15%|
|Border radius consistency|10%|
|Alignment precision|15%|
|Icon geometry|10%|
|Border geometry|10%|
|Composition consistency|10%|
|Cross-system consistency|10%|

### Scoring scale

|Score|Classification|Description|
|---|---|---|
|0|Missing|No coherent geometric system|
|1|Poor|Arbitrary dimensions and frequent inconsistencies|
|2|Partial|Basic geometric conventions with exceptions|
|3|Good|Consistent and predictable geometry|
|4|Excellent|Highly refined, coherent and optically balanced geometry|

Weighted score:

`(Dimensions × 0.20) + (Spacing × 0.15) + (Radius × 0.10) + (Alignment × 0.15) + (Icons × 0.10) + (Borders × 0.10) + (Composition × 0.10) + (Cross-system × 0.10)`

### Mandatory constraints

A component cannot be considered compliant if:

- Equivalent controls have incompatible dimensions without justification.
- Its alignment is visibly inconsistent.
- Its geometry breaks when nested.
- Interaction states cause unexpected layout shifts.
- Arbitrary values replace existing semantic tokens without justification.

---

# 18. Remediation Guidelines

When a component fails the geometric consistency audit, apply corrections in the following order:

1. Identify dimensions that do not follow the system.
2. Identify duplicated or arbitrary values.
3. Review semantic geometry token usage.
4. Correct component heights and proportions.
5. Correct internal and external spacing.
6. Normalize border radius.
7. Correct alignment and optical balance.
8. Normalize icon dimensions and stroke characteristics.
9. Correct border geometry.
10. Review nested surface relationships.
11. Validate geometry across density modes.
12. Validate geometry across themes.
13. Validate state transitions for dimensional stability.
14. Test the component inside realistic compositions.

Do not begin by applying a universal radius or dimension to every component.

First identify the geometric relationship that is incorrect.

Then correct the smallest possible part of the system.

---

# 19. Final Acceptance Criteria

The geometric consistency system is considered successfully implemented when:

- Primitive and semantic geometric tokens are centralized.
- Equivalent components share compatible dimensions.
- Spacing follows a predictable scale.
- Border radii form a coherent hierarchy.
- Internal and external padding is intentional.
- Icons follow consistent geometric conventions.
- Borders have predictable thickness and placement.
- Alignment is mathematically and optically balanced.
- Nested components preserve geometric coherence.
- Interaction states do not cause unexpected dimensional changes.
- Themes preserve the same geometric language.
- Density modes preserve proportional relationships.
- No arbitrary geometric values exist without documented justification.

---

# 20. Final Principle

Geometric consistency is not about making every component identical.

It is about ensuring that every dimension, radius, alignment and proportion feels like part of the same visual language.

The user should not need to notice the geometry.

They should simply perceive an interface that feels balanced, precise and intentional.

**The objective is geometric coherence through controlled relationships, not visual uniformity through identical values.**