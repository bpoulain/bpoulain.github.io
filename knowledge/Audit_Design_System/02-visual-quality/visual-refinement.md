# Visual Refinement

> **Purpose:** Define the visual quality standards that determine whether a component looks polished, intentional, balanced and production-ready.
> 
> **Scope:** Visual precision, optical alignment, proportions, surface details, borders, shadows, radii, icon integration, micro-details, visual consistency and perceived quality.
> 
> **Related principles:** Minimalism, Color Philosophy, Typography, Visual Hierarchy, Functional Density, Geometric Consistency, Interaction Feedback and Motion.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.
> 
> **Framework context:** Reef.js — state-based reactive framework.

---

# 1. Visual Refinement Philosophy

## 1.1. Definition

Visual refinement is the degree of precision and intentionality applied to the visual presentation of a component.

It is not about adding decoration.

It is about removing visual imperfections, correcting proportions and ensuring that every visual decision contributes to a coherent interface.

A refined component should feel:

- Precise.
- Balanced.
- Intentional.
- Restrained.
- Consistent.
- Legible.
- Professional.
- Visually stable.

## 1.2. Core principle

**Every visible detail must have a reason to exist, and every unnecessary detail must be removed.**

Visual refinement must prioritize:

1. Correct proportions.
2. Optical alignment.
3. Consistent geometry.
4. Controlled contrast.
5. Surface coherence.
6. Precise typography.
7. Consistent iconography.
8. Subtle interaction states.
9. High-quality micro-details.

## 1.3. Visual quality versus visual decoration

|Visual refinement|Visual decoration|
|---|---|
|Corrects proportions|Adds visual effects|
|Improves optical alignment|Adds ornamental elements|
|Balances contrast|Increases contrast indiscriminately|
|Removes visual noise|Adds more visual information|
|Improves surface consistency|Adds unnecessary shadows|
|Improves readability|Adds stylistic typography|
|Clarifies hierarchy|Adds arbitrary visual emphasis|

A refined interface is not visually sophisticated because it contains many effects.

It is sophisticated because its visual decisions are controlled.

## 1.4. Rules

- Never add decoration to compensate for poor hierarchy.
- Prefer precision over ornamentation.
- Prefer subtle differentiation over excessive contrast.
- Avoid visual inconsistencies between related components.
- Correct optical imperfections, not just mathematical measurements.
- Evaluate components in real interface contexts.
- Treat small visual details as part of the component's quality.

## 1.5. Audit checklist

- [ ] The component looks intentional.
- [ ] Proportions are balanced.
- [ ] Alignment is visually correct.
- [ ] Contrast is controlled.
- [ ] Surfaces are coherent.
- [ ] Typography is precise.
- [ ] Icons are consistently integrated.
- [ ] There are no unnecessary decorative elements.
- [ ] The component looks polished in isolation and in context.

---

# 2. Proportions and Visual Balance

## 2.1. Definition

A component must have balanced proportions between its dimensions, content, internal spacing and surrounding elements.

Correct dimensions do not automatically guarantee good proportions.

A mathematically centered element can appear visually off-center.

A component with correct padding can still look too large or too compressed.

## 2.2. Dimensions to evaluate

For every component, evaluate:

- Width.
- Height.
- Minimum height.
- Internal padding.
- Content dimensions.
- Icon dimensions.
- Text dimensions.
- Icon-to-text distance.
- Border thickness.
- Corner radius.
- Content-to-container ratio.

## 2.3. Example: Button proportions

A Button must maintain a balanced relationship between:

- Height.
- Horizontal padding.
- Text size.
- Icon size.
- Icon-to-label gap.
- Corner radius.

Example reference values:

|Size|Height|Horizontal padding|Text size|Icon|
|---|---|---|---|---|
|xs|24px|8px|11px|12px|
|sm|28px|10px|12px|14px|
|md|32px|12px|13px|14px|
|lg|36px|14px|14px|16px|
|xl|40px|16px|14px|16px|

These are starting reference values, not universal requirements. They must be validated against Reef.js typography, font metrics and density decisions.

## 2.4. Visual balance rules

- Text must not appear vertically compressed.
- Icons must not dominate their labels.
- Padding must be proportional to component size.
- Components must not feel unnecessarily bulky.
- Content must not appear cramped.
- Empty space must be intentional.
- Components of the same family must share coherent proportions.

## 2.5. Audit checklist

- [ ] Width and height are appropriate.
- [ ] Internal padding is balanced.
- [ ] Content-to-container proportions are coherent.
- [ ] Icon and text proportions are correct.
- [ ] Components do not look oversized.
- [ ] Components do not look compressed.
- [ ] Related sizes maintain a coherent visual progression.

---

# 3. Optical Alignment

## 3.1. Definition

Optical alignment refers to the visual positioning of elements as perceived by the human eye.

It is different from mathematical alignment.

For example, an icon can be perfectly centered according to its bounding box while appearing slightly too high or too low.

A text baseline can be mathematically aligned but still appear visually inconsistent with adjacent icons.

## 3.2. Areas to evaluate

- Icon and text alignment.
- Text baseline alignment.
- Vertical centering.
- Horizontal centering.
- Alignment inside buttons.
- Alignment inside inputs.
- Alignment inside menu items.
- Alignment between adjacent controls.
- Alignment of badges and labels.
- Alignment of empty states.

## 3.3. Example: Icon and text

```tsx
<Button>
  <Icon name="plus" />
  Create project
</Button>
```

The icon and label should:

- Share a visually coherent baseline.
- Have consistent spacing.
- Appear vertically centered.
- Have balanced visual weight.
- Maintain consistent alignment across sizes.

## 3.4. Optical correction

Potential corrections include:

- Small icon translation.
- Icon-specific optical sizing.
- Line-height adjustments.
- Baseline corrections.
- Asymmetric padding when visually justified.

However, optical corrections should remain controlled and documented.

Avoid accumulating arbitrary transforms on individual components.

## 3.5. Rules

- Evaluate alignment visually, not only through CSS measurements.
- Use consistent alignment rules across component families.
- Correct known icon optical imbalances.
- Avoid arbitrary per-instance offsets.
- Preserve predictable alignment across sizes.

## 3.6. Audit checklist

- [ ] Icons appear vertically centered.
- [ ] Text baselines are coherent.
- [ ] Labels align consistently.
- [ ] Buttons have balanced content alignment.
- [ ] Form controls have consistent alignment.
- [ ] Badges and indicators are optically positioned.
- [ ] No arbitrary positioning corrections are accumulating.

---

# 4. Border and Stroke Refinement

## 4.1. Definition

Borders define component boundaries and separate visual surfaces.

In refined interfaces, borders are usually subtle and purposeful.

They should provide enough definition without creating excessive visual noise.

## 4.2. Border characteristics

Evaluate:

- Border color.
- Border opacity.
- Border thickness.
- Border radius.
- Border consistency.
- Border contrast against the surface.
- Border visibility in different themes.

## 4.3. Recommended principles

- Prefer subtle borders for structural separation.
- Reserve stronger borders for interactive emphasis.
- Use consistent border colors across component families.
- Avoid stacking multiple unnecessary borders.
- Avoid borders that compete with content.
- Preserve visible boundaries in dark mode.

## 4.4. Semantic border roles

Example token architecture:

```css
:root {
  --border-subtle: ...;
  --border-default: ...;
  --border-strong: ...;
  --border-interactive: ...;
  --border-focus: ...;
  --border-disabled: ...;
}
```

The exact values must come from the semantic token system.

## 4.5. Audit checklist

- [ ] Border colors are semantically consistent.
- [ ] Border thickness is consistent.
- [ ] Borders do not create unnecessary visual noise.
- [ ] Interactive borders are distinguishable.
- [ ] Focus boundaries are visible.
- [ ] Dark theme borders remain perceptible.
- [ ] Nested borders do not produce excessive contrast.

---

# 5. Corner Radius Refinement

## 5.1. Definition

Corner radius influences the perceived character of an interface.

It contributes to visual identity and geometric consistency.

An interface can feel inconsistent even when every component uses individually reasonable radii.

## 5.2. Radius hierarchy

A coherent system should define a controlled radius scale.

Example:

|Token|Value|Typical usage|
|---|---|---|
|radius-xs|2px|Tiny indicators|
|radius-sm|4px|Compact controls|
|radius-md|6px|Buttons and inputs|
|radius-lg|8px|Cards and menus|
|radius-xl|12px|Dialogs and larger surfaces|
|radius-2xl|16px|Large containers|
|radius-full|9999px|Pills and circular controls|

These values are illustrative. The final scale should reflect the visual identity of Reef.js.

## 5.3. Rules

- Use a controlled radius scale.
- Avoid arbitrary values.
- Keep related components geometrically consistent.
- Avoid excessive rounding.
- Avoid mixing sharp and rounded styles without a clear reason.
- Use full rounding only when semantically appropriate.

## 5.4. Audit checklist

- [ ] Radius tokens are defined.
- [ ] Components use the appropriate radius roles.
- [ ] Related components share consistent geometry.
- [ ] Nested surfaces have coherent radius relationships.
- [ ] Radius does not vary arbitrarily.
- [ ] The overall interface has a recognizable geometric identity.

---

# 6. Shadow and Elevation Refinement

## 6.1. Definition

Shadows communicate spatial relationships between surfaces.

They should help distinguish floating elements from the underlying interface.

Shadows must not be used as generic decoration.

## 6.2. Elevation hierarchy

A useful elevation system distinguishes:

|Level|Usage|Visual treatment|
|---|---|---|
|0|Base interface|No shadow|
|1|Slightly elevated surfaces|Very subtle shadow|
|2|Menus and popovers|Controlled elevation|
|3|Dialogs|Stronger separation|
|4|High-priority overlays|Clearly elevated|

Elevation should reflect actual interface layering, not component importance alone.

## 6.3. Rules

- Avoid shadows on every card.
- Prefer borders for static surface differentiation.
- Use shadows when spatial separation is needed.
- Keep shadow softness consistent.
- Avoid excessive blur.
- Avoid shadows that appear dirty or muddy.
- Ensure shadows work in dark mode.
- Do not rely on shadows as the only visual boundary.

## 6.4. Audit checklist

- [ ] Elevation levels are defined.
- [ ] Shadows communicate meaningful depth.
- [ ] Static surfaces do not have unnecessary shadows.
- [ ] Floating surfaces are visually distinguishable.
- [ ] Shadow intensity is controlled.
- [ ] Dark mode elevation is coherent.

---

# 7. Iconography Refinement

## 7.1. Definition

Icons must share a coherent visual language.

Even when icons come from the same library, differences in stroke weight, dimensions and visual density can create inconsistency.

## 7.2. Characteristics to standardize

- Icon source.
- Stroke width.
- Optical size.
- Bounding box.
- Default dimensions.
- Alignment.
- Filled versus outlined style.
- Active-state treatment.
- Disabled-state treatment.

## 7.3. Icon size scale

Example:

|Size|Dimensions|Usage|
|---|---|---|
|xs|12px|Dense metadata|
|sm|14px|Compact controls|
|md|16px|Standard controls|
|lg|18px|Prominent actions|
|xl|20px|Larger visual elements|
|2xl|24px|Empty states and illustrations|

## 7.4. Rules

- Use a consistent icon family.
- Standardize stroke weights.
- Avoid mixing filled and outlined icons arbitrarily.
- Ensure icons are visually centered.
- Avoid inconsistent icon sizes.
- Use semantic icons consistently.
- Ensure icons do not replace necessary accessible labels.
- Use optical corrections only when justified.

## 7.5. Audit checklist

- [ ] Icon source is consistent.
- [ ] Stroke weight is coherent.
- [ ] Dimensions follow a scale.
- [ ] Optical alignment is correct.
- [ ] Icon styles are consistent.
- [ ] Semantic meanings are stable.
- [ ] Interactive icon states are distinguishable.

---

# 8. Micro-Details and Micro-Interactions

## 8.1. Definition

Micro-details are small visual decisions that collectively determine perceived quality.

They are often individually difficult to notice but become highly visible when inconsistent.

Examples:

- Hover background transitions.
- Focus ring positioning.
- Disabled opacity.
- Loading indicator alignment.
- Checkbox checkmark geometry.
- Switch thumb positioning.
- Dropdown offset.
- Tooltip spacing.
- Badge padding.
- Separator thickness.
- Caret alignment.
- Scrollbar appearance.

## 8.2. Refinement criteria

Every micro-detail must be:

- Consistent.
- Purposeful.
- Proportional.
- Predictable.
- Subtle.
- Aligned with the overall visual language.

## 8.3. Example: Input

An Input must be evaluated beyond its height and border.

Inspect:

- Text baseline.
- Placeholder contrast.
- Icon alignment.
- Internal padding.
- Focus border.
- Focus ring.
- Disabled appearance.
- Error appearance.
- Clear button position.
- Loading indicator position.

## 8.4. Rules

- Audit details at actual rendering size.
- Do not rely exclusively on component screenshots at high zoom.
- Avoid inconsistent state styling.
- Standardize repeated visual details.
- Treat loading and error states as first-class visual states.
- Avoid adding animation or decoration without functional purpose.

## 8.5. Audit checklist

- [ ] Hover transitions are coherent.
- [ ] Focus rings are correctly positioned.
- [ ] Disabled states are refined.
- [ ] Loading indicators are aligned.
- [ ] Small controls have consistent geometry.
- [ ] Tooltips and menus have correct offsets.
- [ ] Separators and scrollbars are visually coherent.
- [ ] No obvious micro-level inconsistencies remain.

---

# 9. Visual State Refinement

## 9.1. Definition

A component must maintain visual quality across every interaction state.

A polished default state is insufficient.

Each state must be designed and validated.

## 9.2. States to evaluate

|State|Visual requirement|
|---|---|
|Default|Balanced and neutral|
|Hover|Subtle visual response|
|Focus-visible|Clearly identifiable focus|
|Active|Immediate interaction feedback|
|Selected|Persistent selection indication|
|Disabled|Reduced emphasis without ambiguity|
|Loading|Clear activity indication|
|Error|Clear semantic feedback|
|Success|Clear confirmation|
|Expanded|Visible state change|
|Empty|Intentional and informative presentation|

## 9.3. Rules

- Maintain consistent visual treatment across states.
- Avoid excessive state contrast.
- Do not communicate state through color alone.
- Ensure disabled states remain understandable.
- Make selected states clearly identifiable.
- Distinguish hover from active.
- Ensure focus remains visible against every surface.
- Validate state transitions visually.

## 9.4. Audit checklist

- [ ] All relevant states are defined.
- [ ] Hover is distinguishable from default.
- [ ] Active is distinguishable from hover.
- [ ] Focus-visible is accessible.
- [ ] Selected state is persistent and clear.
- [ ] Disabled state remains legible.
- [ ] Loading state is visually coherent.
- [ ] Error and success states are recognizable.
- [ ] State styling is consistent across components.

---

# 10. Visual Consistency Across Component Families

## 10.1. Definition

A design system must look like one coherent product rather than a collection of independently designed components.

Components belonging to the same family must share visual characteristics.

## 10.2. Families to evaluate

### Action components

- Button.
- Icon Button.
- Toggle.
- Button Group.

### Form components

- Input.
- Textarea.
- Select.
- Checkbox.
- Radio.
- Switch.

### Surface components

- Card.
- Dialog.
- Popover.
- Dropdown.
- Tooltip.

### Navigation components

- Tabs.
- Breadcrumb.
- Pagination.
- Navigation Menu.

### Feedback components

- Alert.
- Badge.
- Toast.
- Progress.
- Skeleton.

## 10.3. Shared characteristics

Related components should maintain coherence in:

- Height.
- Padding.
- Typography.
- Border treatment.
- Radius.
- Icon sizing.
- Focus treatment.
- Disabled treatment.
- State transitions.

## 10.4. Rules

- Define family-level visual standards.
- Avoid independent styling decisions for similar components.
- Reuse shared semantic tokens.
- Keep size scales coherent.
- Keep interaction states consistent.
- Validate families side by side.

## 10.5. Audit checklist

- [ ] Related components share consistent dimensions.
- [ ] Typography is coherent.
- [ ] Border and radius treatment is consistent.
- [ ] Icon sizing follows common rules.
- [ ] Interaction states follow common patterns.
- [ ] Component families look visually related.
- [ ] No component appears to belong to a different design system.

---

# 11. Visual Refinement in Real Interface Contexts

## 11.1. Definition

A component cannot be fully evaluated in isolation.

Its visual quality depends on how it behaves alongside other components.

A Button may look excellent alone but feel oversized inside a dense toolbar.

A Card may look balanced alone but create excessive visual weight when repeated in a dashboard.

## 11.2. Required contexts

Every important component should be evaluated in:

- Isolation.
- Dense interfaces.
- Forms.
- Toolbars.
- Navigation structures.
- Cards and nested surfaces.
- Dialogs and overlays.
- Light theme.
- Dark theme.
- Responsive layouts.

## 11.3. Rules

- Validate components in realistic compositions.
- Test repeated instances.
- Evaluate visual rhythm across groups.
- Check consistency between adjacent controls.
- Avoid evaluating only idealized examples.
- Include dense developer-oriented interfaces in the audit.

## 11.4. Audit checklist

- [ ] Components look correct in isolation.
- [ ] Components work visually in dense layouts.
- [ ] Repeated components maintain visual rhythm.
- [ ] Nested surfaces remain coherent.
- [ ] Toolbars remain balanced.
- [ ] Forms remain visually consistent.
- [ ] Light and dark contexts are validated.
- [ ] Responsive behavior preserves proportions.

---

# 12. Visual Regression and Refinement Process

## 12.1. Definition

Visual refinement must be an iterative process rather than a subjective one-time review.

Every significant correction should be validated against a stable visual reference.

## 12.2. Recommended process

1. Render the component in a controlled environment.
2. Capture screenshots for every important state.
3. Compare against the intended visual reference.
4. Identify geometric and optical inconsistencies.
5. Identify token or semantic inconsistencies.
6. Correct the component.
7. Validate the correction across themes.
8. Validate the correction in composition.
9. Add visual regression coverage.
10. Document the final visual contract.

## 12.3. Screenshot coverage

For each important component, capture:

- Default.
- Hover.
- Focus-visible.
- Active.
- Disabled.
- Selected.
- Loading.
- Error.
- Light theme.
- Dark theme.

Not every state applies to every component.

## 12.4. Rules

- Use consistent screenshot dimensions.
- Use deterministic test data.
- Avoid unstable dynamic content.
- Keep reference environments consistent.
- Review visual diffs manually.
- Avoid accepting visual regressions automatically.
- Document intentional visual changes.

## 12.5. Audit checklist

- [ ] Components have visual references.
- [ ] Important states are covered.
- [ ] Light and dark themes are covered.
- [ ] Screenshot dimensions are consistent.
- [ ] Visual regressions are detected.
- [ ] Changes are reviewed.
- [ ] Intentional differences are documented.

---

# 13. Visual Refinement Anti-Patterns

|Anti-pattern|Problem|Expected correction|
|---|---|---|
|Excessive shadows|Creates visual noise|Reduce elevation|
|Arbitrary radii|Breaks geometric identity|Use radius tokens|
|Inconsistent icon sizing|Creates visual imbalance|Standardize icon scale|
|Mathematical-only alignment|Elements appear visually off-center|Apply optical correction|
|Excessive borders|Creates visual fragmentation|Reduce border contrast|
|Inconsistent padding|Breaks component rhythm|Standardize proportions|
|Overly large controls|Reduces functional density|Review size scale|
|Excessive rounding|Creates an inconsistent identity|Use controlled radius roles|
|Arbitrary hover effects|Breaks interaction consistency|Standardize state treatments|
|Weak focus styling|Reduces accessibility|Define focus tokens|
|Inconsistent disabled states|Creates unpredictable interfaces|Standardize disabled treatment|
|Decoration without purpose|Adds visual noise|Remove unnecessary effects|
|Isolated component validation|Hides contextual problems|Test realistic compositions|
|Inconsistent dark surfaces|Reduces surface differentiation|Refine semantic dark-theme tokens|
|Accumulated CSS overrides|Makes refinement fragile|Centralize visual rules|

---

# 14. Visual Refinement Audit Methodology

Every component must be evaluated across the following dimensions.

## 14.1. Proportions

- Are dimensions balanced?
- Is internal spacing appropriate?
- Are icons and text proportionate?
- Does the component feel too large or too compact?

## 14.2. Optical alignment

- Are icons visually centered?
- Are text baselines consistent?
- Is content optically balanced?
- Are there unnecessary positioning corrections?

## 14.3. Borders and geometry

- Are borders subtle and coherent?
- Are radii consistent?
- Are nested surfaces geometrically compatible?
- Is the component visually aligned with its family?

## 14.4. Elevation

- Is elevation meaningful?
- Are shadows necessary?
- Are floating elements distinguishable?
- Is dark-theme elevation correct?

## 14.5. Iconography

- Are icons consistent?
- Are stroke weights coherent?
- Are sizes appropriate?
- Are optical corrections necessary?

## 14.6. Micro-details

- Are hover and focus states refined?
- Are small indicators correctly positioned?
- Are loading and error states polished?
- Are transitions visually coherent?

## 14.7. Visual states

- Are all relevant states designed?
- Are states distinguishable?
- Is contrast controlled?
- Are states consistent across component families?

## 14.8. Contextual quality

- Does the component work in dense interfaces?
- Does it work when repeated?
- Does it integrate with other components?
- Does it maintain quality in both themes?

---

# 15. Visual Refinement Scoring

Each component must receive a score from 0 to 4 across eight dimensions.

|Dimension|Weight|
|---|---|
|Proportions and balance|15%|
|Optical alignment|15%|
|Border and geometry refinement|10%|
|Surface and elevation refinement|10%|
|Iconography|10%|
|Micro-details|15%|
|Visual state consistency|15%|
|Contextual visual quality|10%|

### Scoring scale

|Score|Classification|Description|
|---|---|---|
|0|Missing|No coherent visual standard|
|1|Poor|Noticeable visual imperfections|
|2|Partial|Generally functional but insufficiently refined|
|3|Good|Polished and visually consistent|
|4|Excellent|Highly refined, precise and production-ready|

Weighted score:

`(Proportions × 0.15) + (Alignment × 0.15) + (Geometry × 0.10) + (Elevation × 0.10) + (Iconography × 0.10) + (Micro-details × 0.15) + (States × 0.15) + (Context × 0.10)`

### Mandatory constraints

A component cannot be considered visually compliant if:

- Its focus state is not sufficiently visible.
- Its text or interactive elements have insufficient contrast.
- Its geometry conflicts with the design system.
- Its default and interactive states are visually inconsistent.
- It introduces arbitrary visual treatments without justification.
- Its dark-theme rendering is significantly degraded.

---

# 16. Remediation Guidelines

When a component fails the visual refinement audit, apply corrections in this order:

1. Correct incorrect dimensions and proportions.
2. Correct internal spacing.
3. Correct optical alignment.
4. Standardize border and radius treatments.
5. Refine surface differentiation.
6. Correct icon sizing and alignment.
7. Refine typography integration.
8. Standardize interaction states.
9. Correct micro-details.
10. Validate light and dark themes.
11. Validate in realistic interface compositions.
12. Add or update visual regression tests.

Always correct structural visual problems before decorative details.

---

# 17. Final Acceptance Criteria

Visual refinement is considered successfully implemented when:

- Components have balanced proportions.
- Internal spacing is visually coherent.
- Icons and text are optically aligned.
- Borders are subtle and consistent.
- Radius usage follows a controlled geometric system.
- Shadows communicate meaningful elevation.
- Iconography follows a consistent visual language.
- Micro-details are intentional and refined.
- All relevant interaction states are visually polished.
- Component families share a coherent visual identity.
- Components remain balanced in dense interfaces.
- Light and dark themes maintain comparable quality.
- Visual regressions are detected and reviewed.
- No unnecessary decorative treatment compromises the interface.

---

# 18. Final Principle

Visual refinement is the discipline of making every visual decision feel intentional.

It is not about making components more elaborate.

It is about making them more precise.

A refined component should not attract attention because of its decoration. It should feel natural, balanced and effortless to use.

**The objective is to achieve visual quality through precision, restraint and consistency — not through visual complexity.**