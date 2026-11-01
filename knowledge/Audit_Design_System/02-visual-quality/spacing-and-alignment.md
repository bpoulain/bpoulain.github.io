# Spacing and Alignment

> **Purpose:** Define measurable spacing, alignment, sizing and layout standards to ensure geometric consistency, visual rhythm and optical precision throughout the design system.
> 
> **Scope:** Spacing scales, internal padding, external spacing, gaps, alignment, dimensions, sizing, baselines, optical corrections, layout constraints, responsive behavior and component geometry.
> 
> **Related principles:** Minimalism, Typography, Visual Hierarchy, Functional Density, Geometric Consistency, Composability and Visual Refinement.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.
> 
> **Framework context:** Reef.js — state-based reactive framework.

---

# 1. Spacing Philosophy

## 1.1. Definition

Spacing is the controlled use of empty space to establish relationships between interface elements.

It determines:

- How elements relate to each other.
- How content is organized.
- How visual hierarchy is perceived.
- How dense an interface feels.
- How easily information can be scanned.
- How components integrate into larger layouts.

Spacing is not merely a visual property.

It is a structural design decision.

## 1.2. Core principle

**Every spacing value must express a meaningful relationship between elements.**

Spacing should not be arbitrary.

It must communicate:

- Proximity.
- Grouping.
- Separation.
- Hierarchy.
- Structure.
- Density.
- Visual rhythm.

## 1.3. Spacing versus decoration

Good spacing:

- Clarifies component structure.
- Groups related information.
- Separates unrelated information.
- Improves readability.
- Creates visual rhythm.
- Supports functional density.

Bad spacing:

- Adds empty space without purpose.
- Makes interfaces unnecessarily large.
- Creates inconsistent visual gaps.
- Hides structural relationships.
- Produces irregular layouts.

## 1.4. Rules

- Use a controlled spacing scale.
- Prefer consistent spacing relationships.
- Use spacing to communicate hierarchy.
- Distinguish internal spacing from external spacing.
- Avoid arbitrary one-off values.
- Do not add spacing simply to make an interface feel more spacious.
- Evaluate spacing in realistic contexts.
- Preserve functional density.

## 1.5. Audit checklist

- [ ] A documented spacing philosophy exists.
- [ ] Spacing values follow a controlled scale.
- [ ] Spacing communicates meaningful relationships.
- [ ] Internal and external spacing are distinguished.
- [ ] Related components use consistent spacing.
- [ ] Unnecessary empty space is avoided.
- [ ] Visual rhythm is consistent across the interface.

---

# 2. Spacing Scale

## 2.1. Definition

A spacing scale is a controlled set of values used throughout the design system.

It provides a shared geometric vocabulary.

Without a spacing scale, individual components tend to introduce arbitrary values, resulting in visual inconsistency.

## 2.2. Recommended base scale

A 4px-based spacing scale is a useful starting point for a compact, developer-oriented interface.

|Token|Value|Typical usage|
|---|---|---|
|space-0|0px|No spacing|
|space-0.5|2px|Optical micro-adjustments|
|space-1|4px|Tight internal spacing|
|space-1.5|6px|Compact control spacing|
|space-2|8px|Standard icon and text gap|
|space-3|12px|Compact component padding|
|space-4|16px|Standard component spacing|
|space-5|20px|Intermediate separation|
|space-6|24px|Section spacing|
|space-8|32px|Large grouping|
|space-10|40px|Section separation|
|space-12|48px|Major layout spacing|
|space-16|64px|Large structural separation|

These values are reference recommendations, not mandatory values for every component.

A design system may use additional intermediate values when justified by optical or structural requirements.

## 2.3. Scale requirements

The spacing scale must be:

- Limited.
- Predictable.
- Easy to remember.
- Consistent across components.
- Compatible with responsive layouts.
- Flexible enough for real interface requirements.

## 2.4. Spacing token architecture

Separate raw spacing values from semantic spacing roles.

Example:

```css
:root {
  /* Primitive spacing */
  --space-0: 0px;
  --space-0-5: 2px;
  --space-1: 4px;
  --space-1-5: 6px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Semantic spacing */
  --spacing-control-gap: var(--space-2);
  --spacing-control-padding-x: var(--space-3);
  --spacing-control-padding-y: var(--space-2);
  --spacing-form-field-gap: var(--space-2);
  --spacing-form-section-gap: var(--space-6);
  --spacing-card-padding: var(--space-4);
  --spacing-dialog-padding: var(--space-6);
}
```

Semantic tokens should describe the purpose of spacing rather than merely repeat primitive values.

## 2.5. Rules

- Primitive spacing values must be centralized.
- Semantic spacing values must have meaningful names.
- Components should prefer semantic spacing tokens where appropriate.
- Avoid arbitrary pixel values in component implementations.
- Allow justified optical exceptions.
- Avoid creating tokens for every individual usage.
- Remove unused spacing tokens.

## 2.6. Audit checklist

- [ ] A spacing scale exists.
- [ ] The scale is documented.
- [ ] Primitive and semantic spacing are separated.
- [ ] Component styles use centralized values.
- [ ] Arbitrary spacing values are limited.
- [ ] Exceptions are justified.
- [ ] Duplicate spacing tokens are identified.

---

# 3. Internal Spacing

## 3.1. Definition

Internal spacing determines the distance between a component's boundaries and its content.

It includes:

- Padding.
- Content gaps.
- Icon-to-text spacing.
- Label-to-control spacing.
- Header-to-content spacing.
- Content-to-footer spacing.

Internal spacing is part of the component's visual contract.

## 3.2. Component-specific internal spacing

Different component families require different internal spacing rules.

|Component|Internal spacing requirements|
|---|---|
|Button|Horizontal padding, icon gap, vertical balance|
|Input|Horizontal padding, icon gap, text positioning|
|Select|Trigger padding, indicator gap|
|Card|Content padding, section separation|
|Dialog|Container padding, header/content/footer spacing|
|Dropdown|Item padding, group spacing|
|Menu Item|Horizontal padding, icon and shortcut gaps|
|Alert|Icon-to-content gap, internal padding|
|Badge|Compact horizontal and vertical padding|
|Tooltip|Text padding and icon spacing|

## 3.3. Internal spacing hierarchy

Use a clear distinction between:

- Micro spacing: icon-to-label, indicator-to-text.
- Compact spacing: elements within the same control.
- Standard spacing: related content within a component.
- Section spacing: separation between component sections.

Example:

```text
Button
  |
  +-- Horizontal padding: 12px
  |
  +-- Icon
  |
  +-- Gap: 8px
  |
  +-- Label
  |
  +-- Horizontal padding: 12px
```

## 3.4. Rules

- Internal padding must be proportional to component dimensions.
- Related components must use coherent padding values.
- Icon-to-label spacing must be consistent.
- Component sections must have intentional separation.
- Content must not touch component boundaries unnecessarily.
- Internal spacing must not be confused with external margins.

## 3.5. Audit checklist

- [ ] Internal padding is defined for each component.
- [ ] Icon-to-label gaps are consistent.
- [ ] Content is not cramped.
- [ ] Content is not unnecessarily distant.
- [ ] Component sections have coherent spacing.
- [ ] Related components share consistent internal spacing.

---

# 4. External Spacing and Layout Ownership

## 4.1. Definition

External spacing determines the distance between a component and its surrounding elements.

Unlike internal spacing, external spacing should generally be controlled by the parent layout.

This is a critical composability requirement.

## 4.2. Ownership principle

**Components own their internal layout. Parents own the spacing between components.**

For example:

```tsx
<div class="flex gap-2">
  <Button>Cancel</Button>
  <Button>Save</Button>
</div>
```

The Button controls its internal padding.

The parent controls the distance between the two Buttons.

Avoid:

```css
.button {
  margin-right: 8px;
}
```

This creates unexpected behavior when components are composed in different layouts.

## 4.3. External spacing responsibilities

|Responsibility|Owner|
|---|---|
|Button internal padding|Button|
|Icon-to-label gap|Button|
|Input internal padding|Input|
|Gap between form fields|Form layout|
|Card internal padding|Card|
|Gap between cards|Parent layout|
|Dialog internal spacing|Dialog|
|Dialog position on screen|Overlay/layout system|

## 4.4. Rules

- Avoid implicit external margins.
- Use parent-controlled gaps.
- Support flex and grid layouts.
- Avoid assumptions about sibling components.
- Make component sizing predictable.
- Document any intentional external layout behavior.

## 4.5. Audit checklist

- [ ] Components avoid unexpected external margins.
- [ ] Parent layouts control inter-component spacing.
- [ ] Components work correctly in flex layouts.
- [ ] Components work correctly in grid layouts.
- [ ] Composition does not create doubled spacing.
- [ ] Layout ownership is documented.

---

# 5. Spacing and Visual Grouping

## 5.1. Definition

Spacing communicates the relationship between elements.

Elements that belong together should generally be closer than elements that belong to different groups.

This is the proximity principle.

## 5.2. Proximity hierarchy

Example:

```text
Form
|
+-- Field group
|   |
|   +-- Label
|   |
|   +-- Input
|   |
|   +-- Description
|
+-- Field group
|   |
|   +-- Label
|   |
|   +-- Input
|   |
|   +-- Error message
|
+-- Actions
```

A coherent spacing hierarchy might use:

|Relationship|Example spacing|
|---|---|
|Icon to label|6–8px|
|Label to input|6px|
|Input to helper text|4px|
|Between related fields|12–16px|
|Between form sections|24px|
|Between form and actions|24px|

## 5.3. Rules

- Related elements should be visually grouped.
- Unrelated groups should have greater separation.
- Group boundaries must be recognizable.
- Avoid uniform spacing everywhere.
- Use spacing to reinforce information hierarchy.
- Do not use decorative containers when spacing already communicates the relationship.

## 5.4. Audit checklist

- [ ] Related elements are visually close.
- [ ] Unrelated groups are sufficiently separated.
- [ ] Grouping is recognizable without unnecessary borders.
- [ ] Spacing reinforces information hierarchy.
- [ ] Section boundaries are consistent.
- [ ] Visual grouping remains clear in dense layouts.

---

# 6. Component Sizing and Height Consistency

## 6.1. Definition

Component dimensions must follow a coherent sizing system.

Inconsistent control heights are particularly noticeable in developer-oriented interfaces.

Buttons, inputs, selects and other controls that appear in the same interaction context should share compatible dimensions.

## 6.2. Recommended control height scale

|Size|Height|Typical usage|
|---|---|---|
|xs|24px|Dense toolbars and compact controls|
|sm|28px|Secondary controls|
|md|32px|Default developer-oriented controls|
|lg|36px|Prominent controls|
|xl|40px|Larger touch-oriented controls|

This is a compact reference scale inspired by dense productivity interfaces.

It is not a requirement that every component implement every size.

For accessibility, a compact visual control may still need a larger interactive hit area, depending on context and platform requirements.

## 6.3. Related component alignment

Components that appear together should have compatible heights.

Example:

```tsx
<div class="flex items-center gap-2">
  <Input size="md" />
  <Select size="md" />
  <Button size="md">Search</Button>
</div>
```

All three controls should share:

- The same nominal height.
- Compatible border radii.
- Similar typography.
- Consistent vertical alignment.
- Compatible focus treatment.

## 6.4. Rules

- Define a shared control height scale.
- Use consistent sizes across related components.
- Avoid arbitrary component-specific heights.
- Distinguish visual height from interactive hit area.
- Ensure text and icons fit correctly.
- Validate sizing across font variations.

## 6.5. Audit checklist

- [ ] A shared control size scale exists.
- [ ] Related controls have compatible heights.
- [ ] Component dimensions are documented.
- [ ] Icons fit the control height.
- [ ] Text does not appear vertically compressed.
- [ ] Interactive hit areas meet accessibility requirements.
- [ ] Sizes remain coherent across themes.

---

# 7. Horizontal and Vertical Alignment

## 7.1. Definition

Alignment establishes common visual axes between interface elements.

Consistent alignment makes interfaces easier to scan and creates a sense of precision.

## 7.2. Horizontal alignment

Evaluate:

- Left edges of labels.
- Left edges of inputs.
- Card content boundaries.
- Dialog content boundaries.
- Navigation item alignment.
- Table column alignment.
- Icon alignment.
- Action group alignment.

## 7.3. Vertical alignment

Evaluate:

- Text baselines.
- Icon centers.
- Control centers.
- Button groups.
- Input and select alignment.
- Badge alignment.
- Table row content.
- Menu item content.

## 7.4. Alignment rules

- Prefer shared alignment axes.
- Avoid arbitrary horizontal offsets.
- Use consistent content boundaries.
- Align related controls vertically.
- Use appropriate flex and grid alignment.
- Distinguish center alignment from baseline alignment.
- Apply optical corrections where necessary.

## 7.5. Audit checklist

- [ ] Related elements share alignment axes.
- [ ] Horizontal boundaries are coherent.
- [ ] Vertical alignment is consistent.
- [ ] Baseline alignment is used appropriately.
- [ ] Flex and grid layouts produce predictable results.
- [ ] Optical alignment has been reviewed.

---

# 8. Optical Alignment

## 8.1. Definition

Mathematical alignment is not always perceived as visual alignment.

Optical alignment accounts for differences in visual weight, glyph shapes and icon geometry.

For example:

- A triangular icon may need a small optical offset.
- A circular icon may appear smaller than a square icon at identical dimensions.
- Uppercase labels may appear vertically different from lowercase labels.
- Different fonts may have different baseline metrics.

## 8.2. Common optical corrections

|Element|Potential issue|Correction|
|---|---|---|
|Triangle icon|Appears off-center|Optical translation|
|Circle icon|Appears too small|Optical sizing|
|Icon and text|Inconsistent visual baseline|Alignment adjustment|
|Uppercase text|Appears vertically misaligned|Typography adjustment|
|Checkbox checkmark|Appears asymmetrical|Internal geometry correction|
|Switch thumb|Appears visually unbalanced|Position adjustment|

## 8.3. Rules

- Evaluate visual perception, not only bounding boxes.
- Keep corrections minimal.
- Centralize repeated optical corrections.
- Avoid component-specific arbitrary transforms.
- Validate corrections at actual rendering sizes.

## 8.4. Audit checklist

- [ ] Icons are optically centered.
- [ ] Text baselines appear consistent.
- [ ] Geometric shapes have balanced visual weight.
- [ ] Small indicators are correctly positioned.
- [ ] Optical corrections are documented.
- [ ] No unnecessary transforms exist.

---

# 9. Typography and Spacing Relationship

## 9.1. Definition

Spacing cannot be designed independently of typography.

Font size, line height, font metrics and text length all influence the perceived geometry of a component.

A control with correct padding may still appear poorly balanced because its line height is incorrect.

## 9.2. Typography dimensions

Evaluate:

- Font size.
- Line height.
- Font weight.
- Letter spacing.
- Baseline.
- Cap height.
- Text wrapping.
- Multiline content.
- Vertical alignment.

## 9.3. Rules

- Align spacing with typography metrics.
- Avoid fixed heights that clip text.
- Ensure multiline content has adequate line spacing.
- Keep text vertically balanced in controls.
- Account for font fallback.
- Validate with the actual production font.
- Avoid using arbitrary padding to compensate for incorrect line height.

## 9.4. Audit checklist

- [ ] Typography and spacing are designed together.
- [ ] Line heights are appropriate.
- [ ] Text is vertically balanced.
- [ ] Multiline content is not clipped.
- [ ] Font fallback does not break component geometry.
- [ ] Text wrapping remains predictable.

---

# 10. Dense Interface Spacing

## 10.1. Definition

Developer-oriented interfaces often display large amounts of information within limited space.

The spacing system must support functional density without sacrificing readability.

This is particularly important for:

- Data tables.
- Toolbars.
- Sidebars.
- Navigation menus.
- Command palettes.
- Lists.
- Settings panels.
- Project management interfaces.

## 10.2. Density levels

Define explicit density modes rather than allowing every component to invent its own compactness.

|Density|Characteristics|Usage|
|---|---|---|
|Compact|Reduced height and padding|Dense tables, toolbars|
|Default|Balanced dimensions|Standard application UI|
|Comfortable|Increased spacing|Forms and touch-oriented interfaces|

Example API:

```tsx
<DataTable density="compact" />

<NavigationMenu density="default" />

<SettingsPanel density="comfortable" />
```

## 10.3. Density requirements

Compact interfaces must preserve:

- Text readability.
- Interactive hit areas.
- Clear grouping.
- Visual distinction between states.
- Keyboard accessibility.
- Sufficient focus visibility.

Reducing padding must not make controls difficult to use.

## 10.4. Rules

- Define a small number of density modes.
- Apply density consistently across component families.
- Do not create arbitrary compact variants.
- Preserve readable typography.
- Preserve accessibility.
- Validate density at realistic content volumes.

## 10.5. Audit checklist

- [ ] Density modes are defined.
- [ ] Compact mode is genuinely more efficient.
- [ ] Typography remains readable.
- [ ] Interactive areas remain accessible.
- [ ] Related components respond consistently to density.
- [ ] Dense layouts remain scannable.

---

# 11. Responsive Spacing

## 11.1. Definition

Spacing must adapt to the available layout space.

Responsive behavior should preserve hierarchy and readability rather than simply scaling every spacing value proportionally.

## 11.2. Responsive considerations

Evaluate:

- Container padding.
- Page margins.
- Section spacing.
- Card padding.
- Dialog dimensions.
- Grid gaps.
- Toolbar spacing.
- Navigation spacing.
- Control dimensions.

## 11.3. Example

```css
.panel {
  padding: var(--spacing-panel);
}

@media (max-width: 640px) {
  .panel {
    padding: var(--spacing-panel-compact);
  }
}
```

## 11.4. Rules

- Define responsive spacing behavior intentionally.
- Avoid arbitrary breakpoint-specific overrides.
- Preserve content hierarchy.
- Prevent controls from becoming cramped.
- Avoid excessive empty space on narrow screens.
- Validate layouts at intermediate widths, not only device presets.

## 11.5. Audit checklist

- [ ] Responsive spacing rules are documented.
- [ ] Container padding adapts appropriately.
- [ ] Grid gaps remain coherent.
- [ ] Components do not overflow.
- [ ] Content remains readable.
- [ ] Intermediate viewport sizes are tested.

---

# 12. Layout Constraints and Intrinsic Sizing

## 12.1. Definition

Components must have predictable sizing behavior when placed inside different layout contexts.

A component should not unexpectedly expand, shrink or overflow.

## 12.2. Properties to evaluate

- Width.
- Height.
- Min-width.
- Max-width.
- Min-height.
- Max-height.
- Flex grow.
- Flex shrink.
- Grid sizing.
- Intrinsic sizing.
- Overflow.
- Text wrapping.

## 12.3. Examples

A Button should generally size itself according to its content unless a full-width behavior is explicitly requested.

An Input should be able to expand within its parent.

A Dialog should respect viewport constraints.

A Badge should not unexpectedly stretch to fill its container.

## 12.4. Rules

- Define intrinsic sizing behavior.
- Avoid unnecessary fixed widths.
- Avoid unexpected flex shrinking.
- Support parent-controlled sizing.
- Prevent content overflow.
- Define full-width behavior explicitly.
- Preserve predictable behavior in nested flex and grid layouts.

## 12.5. Audit checklist

- [ ] Intrinsic sizing is predictable.
- [ ] Width behavior is documented.
- [ ] Height behavior is documented.
- [ ] Components work in flex layouts.
- [ ] Components work in grid layouts.
- [ ] Text overflow is handled.
- [ ] Full-width behavior is explicit.
- [ ] Dialogs and overlays respect viewport constraints.

---

# 13. Spacing Consistency Across Component Families

## 13.1. Definition

Components belonging to the same family must share consistent spacing conventions.

This avoids the impression that every component was designed independently.

## 13.2. Family-level standards

|Family|Shared spacing characteristics|
|---|---|
|Buttons|Internal padding, icon gap, content centering|
|Form controls|Height, horizontal padding, label gap|
|Menus|Item padding, item gap, group separation|
|Cards|Container padding, section spacing|
|Dialogs|Header, content and footer spacing|
|Navigation|Item gaps, indicator alignment|
|Feedback|Icon-to-content gap, container padding|

## 13.3. Rules

- Define family-level spacing standards.
- Reuse semantic spacing tokens.
- Avoid unrelated values between equivalent components.
- Keep variants geometrically compatible.
- Review component families side by side.

## 13.4. Audit checklist

- [ ] Related components use compatible spacing.
- [ ] Family-level standards are documented.
- [ ] Variants preserve spacing consistency.
- [ ] Shared tokens are used appropriately.
- [ ] No unexplained spacing differences exist.

---

# 14. Spacing Anti-Patterns

|Anti-pattern|Problem|Expected correction|
|---|---|---|
|Arbitrary pixel values|Inconsistent geometry|Use spacing tokens|
|Excessive spacing values|Hard to maintain|Simplify the scale|
|Implicit external margins|Composition problems|Parent-controlled gaps|
|Uniform spacing everywhere|Weak hierarchy|Use proximity relationships|
|Inconsistent control heights|Visual fragmentation|Shared sizing scale|
|Excessive padding|Reduced functional density|Rebalance dimensions|
|Insufficient padding|Cramped content|Increase internal spacing|
|Unnecessary optical offsets|Fragile CSS|Centralize corrections|
|Fixed widths everywhere|Reduced layout flexibility|Prefer intrinsic sizing|
|Inconsistent responsive gaps|Unstable layouts|Define responsive rules|
|Typography-independent spacing|Poor vertical balance|Align with font metrics|
|Inconsistent family spacing|Fragmented visual identity|Define family-level standards|

---

# 15. Spacing and Alignment Audit Methodology

Every component must be evaluated across the following dimensions.

## 15.1. Spacing scale

- Does the component use approved spacing values?
- Are semantic tokens used appropriately?
- Are exceptions justified?

## 15.2. Internal spacing

- Is padding balanced?
- Are internal gaps consistent?
- Is content correctly grouped?

## 15.3. External spacing

- Does the component avoid unexpected margins?
- Is spacing controlled by its parent?
- Does composition produce predictable gaps?

## 15.4. Dimensions

- Are width and height appropriate?
- Does the component follow the size scale?
- Are related controls compatible?

## 15.5. Alignment

- Are content elements aligned?
- Are baselines consistent?
- Are optical corrections necessary?

## 15.6. Typography integration

- Does line height work with component dimensions?
- Is text vertically balanced?
- Does multiline content behave correctly?

## 15.7. Density

- Does compact mode preserve usability?
- Are density levels consistent?
- Is information easy to scan?

## 15.8. Responsive behavior

- Does spacing adapt appropriately?
- Do components preserve their proportions?
- Are intermediate widths validated?

## 15.9. Layout compatibility

- Does the component work in flex?
- Does it work in grid?
- Is intrinsic sizing predictable?
- Is overflow controlled?

---

# 16. Spacing and Alignment Scoring

Each component must receive a score from 0 to 4 across eight dimensions.

|Dimension|Weight|
|---|---|
|Spacing scale compliance|15%|
|Internal spacing|15%|
|External spacing ownership|10%|
|Dimensions and proportions|15%|
|Horizontal and vertical alignment|15%|
|Typography integration|10%|
|Density consistency|10%|
|Responsive and intrinsic sizing|10%|

### Scoring scale

|Score|Classification|Description|
|---|---|---|
|0|Missing|No coherent spacing or sizing rules|
|1|Poor|Arbitrary values and inconsistent geometry|
|2|Partial|Basic consistency with noticeable exceptions|
|3|Good|Predictable and visually coherent|
|4|Excellent|Highly precise, consistent and adaptable|

Weighted score:

`(Scale × 0.15) + (Internal × 0.15) + (External × 0.10) + (Dimensions × 0.15) + (Alignment × 0.15) + (Typography × 0.10) + (Density × 0.10) + (Responsive × 0.10)`

### Mandatory constraints

A component cannot be considered compliant if:

- It introduces unexplained arbitrary spacing values.
- Its layout breaks in standard flex or grid contexts.
- Its content is clipped at supported sizes.
- Its controls have inconsistent dimensions within the same family without justification.
- Its internal and external spacing responsibilities are confused.
- Its compact mode compromises accessibility.

---

# 17. Remediation Guidelines

When a component fails the spacing and alignment audit, apply corrections in this order:

1. Identify spacing values that do not belong to the approved scale.
2. Replace arbitrary values with primitive or semantic tokens.
3. Separate internal padding from external spacing.
4. Correct component dimensions.
5. Standardize related control heights.
6. Correct horizontal and vertical alignment.
7. Review optical alignment.
8. Correct typography and line-height relationships.
9. Review density behavior.
10. Correct intrinsic sizing and overflow.
11. Validate responsive behavior.
12. Validate the component in realistic compositions.

Correct structural spacing problems before introducing individual optical adjustments.

---

# 18. Final Acceptance Criteria

The spacing and alignment system is considered successfully implemented when:

- A documented spacing scale exists.
- Primitive and semantic spacing tokens are clearly separated.
- Internal spacing is controlled by components.
- External spacing is controlled by parent layouts.
- Related components share coherent dimensions.
- Control heights follow a consistent scale.
- Horizontal and vertical alignment are predictable.
- Optical corrections are intentional and limited.
- Typography and spacing work together.
- Density modes are consistent.
- Responsive spacing preserves hierarchy.
- Components behave predictably in flex and grid layouts.
- Overflow and intrinsic sizing are controlled.
- Component families maintain consistent spacing.
- No unexplained geometric inconsistencies remain.

---

# 19. Final Principle

Spacing is not empty space.

It is a visual language that communicates relationships, hierarchy and structure.

A good spacing system does not simply make interfaces look clean.

It makes them feel organized, precise and effortless to navigate.

**The objective is to achieve geometric consistency through controlled spacing, predictable dimensions and intentional alignment — without sacrificing functional density or compositional flexibility.**