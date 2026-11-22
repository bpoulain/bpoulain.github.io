# Visual Language

> **Purpose:** Define the visual grammar of the UI library and establish consistent rules for how visual elements are represented, combined and rendered.
> 
> **Scope:** Surfaces, colors, borders, typography, geometry, spacing, icons, states, elevation, component treatments and visual relationships.
> 
> **Status:** Foundational visual specification.
> 
> **Design direction:** Minimal, neutral-first, precise, restrained, functional and information-dense.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.

---

# 1. Visual Language Overview

The visual language defines how the design philosophy manifests itself in actual interfaces.

It establishes a shared visual grammar that every component must follow.

The objective is to ensure that:

- Components look like members of the same system.
- Visual hierarchy is consistent.
- Surfaces have predictable relationships.
- Colors communicate semantic meaning.
- Typography creates recognizable information structures.
- Spacing and geometry follow common conventions.
- Interactive states are visually coherent.
- Complex interfaces remain visually restrained.

The visual language must be recognizable regardless of the component category or application context.

## 1.1. Visual identity attributes

The library must consistently express these attributes:

|Attribute|Visual manifestation|
|---|---|
|Minimal|Reduced decoration and unnecessary elements|
|Neutral|Predominantly neutral surfaces and colors|
|Precise|Consistent alignment and geometry|
|Subtle|Controlled contrast and restrained borders|
|Compact|Efficient component dimensions|
|Structured|Clear visual grouping|
|Refined|Carefully balanced details|
|Functional|Visual treatments communicate purpose|

## 1.2. Visual hierarchy model

The visual hierarchy must be constructed primarily through five mechanisms:

1. Typography.
2. Surface differentiation.
3. Color and contrast.
4. Spacing and positioning.
5. Borders and elevation.

These mechanisms should complement each other rather than compete.

Avoid using all five simultaneously to emphasize the same element.

---

# 2. Surface Language

## 2.1. Surface hierarchy

Surfaces establish the structural organization of the interface.

The library must define a limited and predictable surface hierarchy.

Recommended semantic surface roles:

|Surface role|Purpose|
|---|---|
|Base|Main application background|
|Primary|Default content surface|
|Secondary|Supporting content areas|
|Tertiary|Subtle grouping or recessed content|
|Elevated|Floating or layered elements|
|Overlay|Modal and overlay backgrounds|
|Interactive|Interactive surface states|

These are semantic roles, not mandatory separate color values.

Multiple roles may intentionally resolve to the same token when visual separation is unnecessary.

## 2.2. Surface rules

- Prefer subtle background differentiation.
- Avoid unnecessary nested surfaces.
- Do not wrap every content group in a card.
- Use elevation only when an element visually floats above another.
- Preserve consistent surface relationships across components.
- Ensure surface hierarchy remains understandable in both themes.

## 2.3. Surface audit

- [ ] Surface roles are clearly defined.
- [ ] Components use appropriate semantic surface tokens.
- [ ] Surface differences are intentional.
- [ ] Nested surfaces do not create unnecessary visual complexity.
- [ ] Elevated elements are distinguishable from their surroundings.
- [ ] Surface hierarchy is consistent across component categories.
- [ ] Light and dark themes preserve equivalent surface relationships.

## 2.4. Anti-patterns

- Every section rendered as an independent card.
- Excessive background variations.
- Multiple nested elevated surfaces.
- Arbitrary component-specific backgrounds.
- Surface differentiation that reduces readability.

---

# 3. Color Language

## 3.1. Neutral-first palette

Neutral means the low-chroma structural scale of the active theme. It may carry a tint.

Neutral colors must establish the dominant visual identity.

The palette should provide enough tonal variation to organize complex interfaces without requiring excessive accent colors.

The primary color roles are:

|Role|Function|
|---|---|
|Background|Main interface background|
|Foreground|Primary text and icons|
|Muted|Secondary text and subtle content|
|Surface|Default component backgrounds|
|Surface-secondary|Supporting surfaces|
|Border|Structural boundaries|
|Input|Input boundaries and surfaces|
|Primary|Primary actions|
|Secondary|Secondary actions|
|Accent|Contextual emphasis|
|Destructive|Dangerous or irreversible actions|
|Success|Successful states|
|Warning|Warning states|
|Information|Informational states|

Actual token names must follow the existing token architecture.

## 3.2. Color application rules

- Use semantic tokens instead of hardcoded colors.
- Use neutral colors for most structural elements.
- Reserve primary colors for important actions.
- Use destructive colors for destructive operations.
- Avoid semantic colors for purely decorative emphasis.
- Ensure disabled states remain distinguishable.
- Maintain readable foreground/background combinations.
- Preserve color meaning across light and dark themes.

## 3.3. Accent discipline

Accent color must create visual emphasis.

It must not become the default treatment for every interactive element.

Examples:

- Primary button: accent treatment.
- Secondary button: neutral treatment.
- Tertiary button: minimal or transparent treatment.
- Selected item: restrained accent indication.
- Focus ring: dedicated semantic focus treatment.
- Informational status: semantic information treatment.

## 3.4. Color audit

- [ ] Neutral colors dominate the interface.
- [ ] Accent usage is controlled.
- [ ] Semantic colors have consistent meanings.
- [ ] Primary actions are visually distinguishable.
- [ ] Secondary actions remain visually subordinate.
- [ ] Disabled colors are consistent.
- [ ] Focus colors are sufficiently visible.
- [ ] All color combinations meet relevant contrast requirements.
- [ ] Light and dark themes preserve semantic meaning.
- [ ] No arbitrary colors bypass the token system.

---

# 4. Border & Separator Language

## 4.1. Border philosophy

Borders should provide structural information, define interactive boundaries or separate content when necessary.

They should not become the dominant visual language of the interface.

Prefer subtle and controlled borders.

## 4.2. Border usage

Appropriate uses include:

- Input boundaries.
- Dialog boundaries.
- Popover boundaries.
- Table separators.
- Section separators.
- Card boundaries when necessary.
- Focus and selection indicators.

Avoid borders when spacing or surface differentiation already communicates the relationship.

## 4.3. Border rules

- Maintain consistent border thickness.
- Use semantic border tokens.
- Avoid excessive contrast.
- Avoid unnecessary double borders.
- Use consistent separator treatments.
- Ensure interactive boundaries remain identifiable.
- Use stronger borders only when a meaningful visual distinction is needed.

## 4.4. Border audit

- [ ] Borders have a clear purpose.
- [ ] Border thickness is consistent.
- [ ] Border colors use semantic tokens.
- [ ] Borders are not excessively contrasted.
- [ ] Equivalent components use equivalent border treatments.
- [ ] Separators are visually subordinate.
- [ ] Focus indicators are not confused with ordinary borders.

---

# 5. Elevation & Shadow Language

## 5.1. Elevation philosophy

Elevation should communicate spatial relationships.

It should not be used as a universal decoration.

The primary mechanism for visual hierarchy should remain typography, spacing and surface differentiation.

## 5.2. Elevation roles

|Role|Typical usage|
|---|---|
|None|Standard content|
|Subtle|Slightly differentiated surfaces|
|Floating|Dropdowns and popovers|
|Overlay|Dialogs and modal surfaces|

The exact elevation scale must be defined through existing design tokens or a dedicated elevation token system.

## 5.3. Shadow rules

- Prefer no shadow for standard content.
- Use restrained shadows for floating elements.
- Avoid excessive blur and opacity.
- Maintain consistency between floating components.
- Ensure shadows work in both themes.
- Avoid using shadow to compensate for insufficient contrast.

## 5.4. Elevation audit

- [ ] Standard content does not have unnecessary shadows.
- [ ] Floating elements have appropriate elevation.
- [ ] Equivalent overlays share similar treatments.
- [ ] Shadows do not dominate the interface.
- [ ] Elevation is consistent in light and dark themes.

---

# 6. Typography Language

## 6.1. Typographic hierarchy

Typography must communicate information importance through a limited and consistent set of styles.

Recommended semantic roles:

|Role|Purpose|
|---|---|
|Display|Large promotional or exceptional headings|
|Heading|Section and page titles|
|Body|Primary content|
|Label|Form controls and compact interface labels|
|Caption|Supporting information|
|Metadata|Secondary contextual information|
|Code|Technical and monospaced content|

Not every role needs to be exposed as a separate component or token.

## 6.2. Typography rules

- Use a controlled type scale.
- Prefer restrained font weights.
- Avoid excessive typographic variation.
- Maintain readable line heights.
- Use consistent text colors for equivalent roles.
- Keep metadata visually subordinate.
- Avoid oversized typography in functional interfaces.
- Preserve readability in compact layouts.

## 6.3. Text hierarchy

Primary text must be clearly distinguishable from secondary text.

Secondary text should be less prominent, but must remain readable.

Do not use reduced opacity indiscriminately to create hierarchy.

Prefer semantic foreground tokens with appropriate contrast.

## 6.4. Typography audit

- [ ] All text roles are documented.
- [ ] Components use appropriate typographic roles.
- [ ] Text sizes are consistent.
- [ ] Font weights are intentional.
- [ ] Line heights are appropriate.
- [ ] Metadata is visually subordinate.
- [ ] Long content is handled correctly.
- [ ] Truncation does not hide essential information.
- [ ] Text remains readable in both themes.

---

# 7. Geometry Language

## 7.1. Geometric philosophy

All components must share a consistent visual geometry.

The design system should favor controlled and recognizable proportions rather than arbitrary component-specific dimensions.

## 7.2. Border radius

Use a limited and intentional radius scale.

Typical semantic applications:

|Role|Typical usage|
|---|---|
|Small|Compact controls and small indicators|
|Medium|Inputs, buttons and standard components|
|Large|Cards and larger surfaces|
|Extra large|Dialogs and prominent containers|
|Full|Pills and circular elements|

The radius scale must be consistent with the established design tokens.

Do not use rounded corners indiscriminately.

The radius must reflect the component's shape and function.

## 7.3. Dimensions

Define standardized dimensions for frequently repeated component categories:

- Buttons.
- Inputs.
- Selects.
- Checkboxes.
- Switches.
- Badges.
- Icon buttons.
- Menu items.
- Tabs.

Equivalent controls must not introduce arbitrary height variations.

## 7.4. Geometry audit

- [ ] Radius values follow a controlled scale.
- [ ] Equivalent controls share dimensions.
- [ ] Component proportions are balanced.
- [ ] Icons are properly centered.
- [ ] Internal padding is consistent.
- [ ] Circular elements are geometrically correct.
- [ ] No arbitrary dimensions are introduced without justification.

---

# 8. Spacing & Alignment Language

## 8.1. Spacing philosophy

Spacing must create structure, grouping and readability.

It must not be treated as arbitrary empty space.

The library must use a consistent spacing scale based on its existing primitive tokens.

## 8.2. Spacing relationships

Use spacing to distinguish:

- Elements belonging to the same group.
- Separate content groups.
- Different interface sections.
- Independent components.
- Primary and secondary content.

Related elements should generally have smaller gaps than unrelated groups.

## 8.3. Alignment rules

- Maintain consistent horizontal alignment.
- Align labels and fields.
- Align icons optically.
- Maintain consistent content boundaries.
- Use predictable component padding.
- Avoid arbitrary offsets.
- Preserve alignment when optional elements are present or absent.

## 8.4. Spacing audit

- [ ] Components use spacing tokens.
- [ ] Internal padding is consistent.
- [ ] Related elements have appropriate spacing.
- [ ] Content groups are visually distinguishable.
- [ ] Layouts maintain alignment.
- [ ] Optional icons and labels do not disrupt geometry.
- [ ] Responsive layouts preserve spacing relationships.

---

# 9. Iconography Language

## 9.1. Icon philosophy

Icons should improve recognition, navigation or information comprehension.

They should not be used as unnecessary decoration.

The library must maintain a consistent icon language.

## 9.2. Icon rules

- Use a consistent icon family whenever possible.
- Maintain consistent stroke weight.
- Standardize common icon dimensions.
- Align icons optically with text.
- Avoid mixing filled and outlined styles without justification.
- Use accessible labels for functional icons.
- Hide decorative icons from assistive technologies.
- Use icons consistently for equivalent actions.
- Prefer recognizable metaphors.

## 9.3. Icon sizing

Define semantic sizes appropriate for:

- Inline icons.
- Standard controls.
- Compact controls.
- Navigation.
- Large visual indicators.

Icon size should be proportional to the surrounding text and control dimensions.

## 9.4. Icon audit

- [ ] Icons belong to a consistent visual family.
- [ ] Stroke weights are consistent.
- [ ] Icon sizes are standardized.
- [ ] Icons are optically aligned.
- [ ] Functional icons have accessible names.
- [ ] Decorative icons are appropriately hidden.
- [ ] Icon usage is semantically consistent.

---

# 10. Component Visual Treatments

Each component category must follow the same visual grammar.

## 10.1. Buttons

Expected visual characteristics:

- Clear primary and secondary hierarchy.
- Controlled background treatments.
- Consistent dimensions.
- Balanced icon and text alignment.
- Subtle hover feedback.
- Visible focus states.
- Clear disabled and loading treatments.

Avoid:

- Excessive gradients.
- Unnecessary shadows.
- Oversized padding.
- Inconsistent radius values.
- Excessive variant proliferation.

## 10.2. Form controls

Expected visual characteristics:

- Consistent heights.
- Restrained borders.
- Clear focus treatment.
- Readable placeholder text.
- Consistent labels and descriptions.
- Distinct validation states.
- Predictable disabled appearance.

Avoid:

- Excessively strong borders.
- Inconsistent heights.
- Unclear placeholder hierarchy.
- Different focus styles between controls.

## 10.3. Cards

Expected visual characteristics:

- Simple surfaces.
- Restrained borders.
- Limited elevation.
- Clear internal spacing.
- Structured content hierarchy.
- Optional rather than mandatory decoration.

Avoid:

- Wrapping every piece of content in a card.
- Excessive nested cards.
- Unnecessary shadows.
- Overly decorative headers.

## 10.4. Dialogs and overlays

Expected visual characteristics:

- Clear separation from the underlying interface.
- Appropriate elevation.
- Restrained surface treatment.
- Balanced internal spacing.
- Clear title and action hierarchy.
- Consistent close affordance.
- Predictable visual behavior.

Avoid:

- Excessive shadows.
- Unnecessary nested containers.
- Overly large dialogs for simple actions.
- Inconsistent overlay treatments.

## 10.5. Lists and tables

Expected visual characteristics:

- Efficient row heights.
- Consistent column alignment.
- Restrained separators.
- Clear selected states.
- Subdued metadata.
- Predictable hover feedback.
- Efficient information density.

Avoid:

- Excessive row padding.
- Strong separators everywhere.
- Unnecessary card wrappers.
- Inconsistent cell alignment.

---

# 11. Interaction State Language

Every interactive component must use a consistent visual language for its applicable states.

|State|Expected visual treatment|
|---|---|
|Default|Neutral baseline appearance|
|Hover|Subtle contextual feedback|
|Focus-visible|Clearly identifiable keyboard focus|
|Active|Immediate interaction feedback|
|Selected|Persistent selection indication|
|Disabled|Reduced emphasis and unavailable interaction|
|Loading|Visible progress indication|
|Error|Semantic error indication|
|Success|Semantic success indication|

## State rules

- Similar states must look similar across equivalent components.
- Focus must never rely exclusively on subtle background changes.
- Disabled controls must remain distinguishable.
- Selected states must be persistent and recognizable.
- Loading states must not create layout instability.
- Error and success treatments must communicate their meaning.
- State changes must preserve component geometry whenever possible.

## State audit

- [ ] All applicable states are implemented.
- [ ] States are visually consistent.
- [ ] Hover feedback is subtle.
- [ ] Focus-visible is clear.
- [ ] Selected states are distinguishable.
- [ ] Disabled states are coherent.
- [ ] Loading does not create layout shifts.
- [ ] Validation states are understandable.

---

# 12. Light & Dark Theme Language

## 12.1. Theme philosophy

Light and dark themes must represent the same design system.

They must not be treated as independent visual identities.

The same semantic roles, hierarchy and component treatments must remain recognizable.

## 12.2. Theme rules

- Use semantic tokens for all theme-dependent colors.
- Preserve surface hierarchy.
- Preserve text hierarchy.
- Maintain adequate contrast.
- Adapt shadows appropriately.
- Maintain consistent interactive states.
- Avoid hardcoded theme-specific component styles.
- Avoid simply inverting colors.

Dark surfaces should be differentiated through controlled tonal relationships.

Light surfaces should avoid excessive borders and unnecessary elevation.

## 12.3. Theme audit

- [ ] All semantic color roles have appropriate theme values.
- [ ] Surface hierarchy is preserved.
- [ ] Typography remains readable.
- [ ] Interactive states remain visible.
- [ ] Borders remain appropriately subtle.
- [ ] Shadows are adapted to the theme.
- [ ] No component breaks when switching themes.
- [ ] Screenshots of both themes preserve the same visual identity.

---

# 13. Responsive Visual Language

Responsive behavior must preserve the visual identity while adapting component dimensions and layouts.

## Rules

- Maintain visual hierarchy at every viewport size.
- Preserve consistent spacing relationships.
- Avoid arbitrary component scaling.
- Adapt dense layouts without losing essential information.
- Maintain appropriate touch targets.
- Prevent text and icon clipping.
- Ensure overlays remain usable on smaller screens.
- Avoid horizontal overflow unless explicitly intended.

## Audit

- [ ] Component proportions remain balanced.
- [ ] Content remains readable.
- [ ] Responsive spacing is coherent.
- [ ] Touch targets are adequate.
- [ ] Dialogs and menus adapt appropriately.
- [ ] No unintended overflow exists.
- [ ] Mobile layouts preserve the visual language.

---

# 14. Visual Anti-Pattern Catalog

The following patterns are considered design-system violations unless explicitly justified.

|Anti-pattern|Problem|Related principle|
|---|---|---|
|Excessive card wrapping|Unnecessary visual hierarchy|DP-01|
|Too many accent colors|Loss of color discipline|DP-02|
|Heavy borders everywhere|Excessive visual separation|DP-03|
|Too many font sizes|Typographic inconsistency|DP-04|
|Arbitrary radii|Geometric inconsistency|DP-05|
|Oversized controls|Reduced information density|DP-06|
|Competing visual emphasis|Unclear hierarchy|DP-07|
|Always-visible secondary actions|Interface overload|DP-08|
|Misaligned icons|Reduced visual precision|DP-09|
|Missing state feedback|Poor interaction communication|DP-10|
|Inconsistent control states|Unpredictable experience|DP-11|
|Decorative animation|Unnecessary motion|DP-12|
|Mouse-only controls|Incomplete interaction model|DP-13|
|Monolithic components|Reduced composability|DP-14|
|Component-specific styling conventions|Fragmented visual language|DP-15|

---

# 15. Global Visual Audit Checklist

## Surface and structure

- [ ] Surface hierarchy is consistent.
- [ ] Cards are used only when justified.
- [ ] Background differentiation is subtle.
- [ ] Borders are restrained.
- [ ] Shadows are purposeful.
- [ ] Overlays have consistent elevation.

## Color and contrast

- [ ] Neutral-first philosophy is respected.
- [ ] Accent color usage is controlled.
- [ ] Semantic colors are consistent.
- [ ] Text contrast is appropriate.
- [ ] Light and dark themes are coherent.

## Typography

- [ ] Typography follows a controlled scale.
- [ ] Labels and metadata are consistent.
- [ ] Text hierarchy is clear.
- [ ] Line heights are appropriate.
- [ ] Long content is handled correctly.

## Geometry and spacing

- [ ] Component dimensions are consistent.
- [ ] Radius values are standardized.
- [ ] Padding follows common conventions.
- [ ] Icons are optically aligned.
- [ ] Spacing creates clear visual groups.
- [ ] Layouts follow consistent alignment.

## Components and states

- [ ] Buttons share a common visual language.
- [ ] Form controls share a common visual language.
- [ ] Cards and containers are restrained.
- [ ] Dialogs and overlays are consistent.
- [ ] Lists and tables maintain functional density.
- [ ] Interactive states are coherent.

## Responsive and themes

- [ ] Light and dark themes preserve visual identity.
- [ ] Components remain balanced across viewports.
- [ ] Responsive layouts preserve hierarchy.
- [ ] No visual regressions occur during theme changes.

---

# 16. Visual Language Acceptance Criteria

The visual language is considered successfully implemented when:

1. Components share a recognizable and consistent visual identity.
2. Neutral colors establish the dominant interface language.
3. Typography provides a clear and controlled hierarchy.
4. Surfaces, borders and elevation are restrained.
5. Component dimensions and proportions are consistent.
6. Spacing and alignment follow predictable rules.
7. Icons share a consistent visual style.
8. Interactive states are visually coherent.
9. Light and dark themes express the same design identity.
10. Responsive layouts preserve the intended visual language.
11. Complex interfaces remain visually structured and information-dense.
12. No major component category introduces an unrelated visual convention.

---

# 17. Final Visual Language Principle

Visual quality is not the result of isolated aesthetic decisions.

It emerges from the consistency of relationships between:

- Colors.
- Surfaces.
- Typography.
- Geometry.
- Spacing.
- Icons.
- Component treatments.
- Interaction states.
- Layouts.

Every component must participate in the same visual grammar.

**The objective is not to make every component look impressive individually. It is to make every combination of components look like it naturally belongs to the same carefully designed system.**