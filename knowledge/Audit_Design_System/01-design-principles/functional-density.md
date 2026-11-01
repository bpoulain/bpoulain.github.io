# Functional Density

> **Purpose:** Define the principles, rules, token architecture and evaluation criteria governing functional density throughout the UI library.
> 
> **Scope:** Information density, component sizing, spacing, typography, control dimensions, content grouping, layout efficiency, action visibility, density modes, responsive behavior and cognitive load.
> 
> **Related principles:** DP-01 Functional Minimalism, DP-04 Typographic Precision, DP-06 Functional Density, DP-07 Clear Information Hierarchy, DP-08 Progressive Disclosure, DP-15 Semantic Consistency.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.

---

# 1. Functional Density Philosophy

## 1.1. Definition

Functional density describes the amount of useful information and functionality presented within a given interface area.

It measures how efficiently the available space is used without compromising readability, comprehension, interaction or accessibility.

A dense interface is not necessarily a crowded interface.

A compact interface is not necessarily an efficient interface.

The objective is to maximize useful information while minimizing unnecessary visual and cognitive overhead.

### Core principle

**Maximize useful information per unit of space without increasing cognitive load.**

## 1.2. Expected visual characteristics

The library must favor:

- Compact but readable components.
- Efficient use of available space.
- Consistent control dimensions.
- Restrained internal padding.
- Clear information hierarchy.
- Predictable alignment.
- Compact typography.
- Minimal decorative elements.
- Efficient action placement.
- Contextual visibility of secondary functionality.

Avoid:

- Excessive whitespace.
- Oversized controls without justification.
- Excessive internal padding.
- Unnecessarily large typography.
- Redundant descriptions.
- Excessive visual separation.
- Crowded information groups.
- Excessive action visibility.
- Arbitrary component dimensions.

## 1.3. Density versus compactness

These concepts must remain distinct.

|Concept|Definition|
|---|---|
|Compactness|Reduction of dimensions and spacing|
|Information density|Quantity of information displayed|
|Functional density|Amount of useful information and functionality available in a given space|
|Cognitive load|Mental effort required to understand and use the interface|

Reducing component dimensions increases compactness, but does not automatically improve functional density.

For example, reducing a table row from 48px to 28px may increase the number of visible rows while making the content difficult to scan.

The result is higher physical density but potentially lower functional efficiency.

## 1.4. Rules

- Never reduce dimensions without evaluating readability.
- Never increase spacing without a functional justification.
- Prioritize useful information over decorative space.
- Preserve clear grouping between related elements.
- Maintain sufficient interaction areas.
- Avoid unnecessary duplication of information.
- Use progressive disclosure for secondary functionality.
- Evaluate density in complete compositions, not isolated components.

## 1.5. Audit checklist

- [ ] Available space is used efficiently.
- [ ] Information remains readable.
- [ ] Components are compact without feeling crowded.
- [ ] Decorative elements do not consume unnecessary space.
- [ ] Primary functionality remains visible.
- [ ] Secondary functionality remains accessible.
- [ ] Density does not increase cognitive load.

---

# 2. Density Modes

## 2.1. Definition

The library must provide a consistent mechanism for adapting component dimensions and spacing to different information-density requirements.

Density must be treated as a system-level design decision rather than an independent size setting on every component.

## 2.2. Recommended density modes

|Mode|Purpose|Characteristics|
|---|---|---|
|Compact|Information-heavy interfaces|Reduced spacing, smaller controls, tighter typography|
|Default|General-purpose interfaces|Balanced spacing and readability|
|Comfortable|Reading-oriented interfaces|Increased spacing and more generous dimensions|

These modes must preserve the same visual language and component semantics.

## 2.3. Compact mode

Intended for:

- Data tables.
- Dense navigation.
- Command menus.
- Issue lists.
- Activity feeds.
- Toolbars.
- Administrative interfaces.

Expected characteristics:

- Reduced vertical padding.
- Compact control heights.
- Tighter group spacing.
- Smaller secondary typography.
- Efficient row dimensions.
- Minimal decorative separation.

Compact mode must not remove essential visual distinctions.

## 2.4. Default mode

Intended for standard application interfaces.

Expected characteristics:

- Balanced control dimensions.
- Comfortable text readability.
- Consistent spacing.
- Clear grouping.
- Predictable interaction areas.

This should be the default mode for components unless a specific context requires otherwise.

## 2.5. Comfortable mode

Intended for:

- Reading-oriented content.
- Long forms.
- Content management.
- Detailed configuration.
- Interfaces with lower information density.

Expected characteristics:

- More generous vertical spacing.
- Larger interaction surfaces where appropriate.
- Comfortable multiline typography.
- Increased separation between groups.

## 2.6. Rules

- Density modes must have documented behavior.
- All applicable components must support the same density vocabulary.
- Components must not implement incompatible interpretations of compact, default and comfortable.
- Density modes must preserve accessibility.
- Density modes must not change component functionality.
- Components may opt out of density adaptation when dimensions are constrained by their functional requirements.
- Density changes must not create unexpected layout instability.

## 2.7. Audit checklist

- [ ] Density modes are centrally defined.
- [ ] Compact mode is consistently implemented.
- [ ] Default mode is coherent.
- [ ] Comfortable mode provides meaningful adaptation.
- [ ] All applicable component categories support the same modes.
- [ ] Components preserve their semantics across modes.
- [ ] No unnecessary component-specific density systems exist.

---

# 3. Density Token Architecture

## 3.1. Definition

Functional density requires a coordinated token architecture covering spacing, dimensions, typography and control geometry.

A density mode must not be implemented through unrelated arbitrary overrides.

## 3.2. Primitive density tokens

Primitive tokens define the available physical values.

Examples:

```css
/* Control dimensions */
--control-height-xs: 1.5rem;
--control-height-sm: 1.875rem;
--control-height-md: 2.25rem;
--control-height-lg: 2.5rem;

/* Vertical padding */
--control-padding-y-compact: 0.25rem;
--control-padding-y-default: 0.375rem;
--control-padding-y-comfortable: 0.5rem;

/* Horizontal padding */
--control-padding-x-compact: 0.5rem;
--control-padding-x-default: 0.75rem;
--control-padding-x-comfortable: 1rem;

/* Content spacing */
--content-gap-compact: 0.5rem;
--content-gap-default: 0.75rem;
--content-gap-comfortable: 1rem;
```

These values are illustrative and must be calibrated against the actual component system.

## 3.3. Semantic density tokens

Semantic tokens describe how dimensions are used.

Examples:

```css
--density-control-height: ...;
--density-control-padding-x: ...;
--density-control-padding-y: ...;

--density-list-row-height: ...;
--density-table-row-height: ...;

--density-inline-gap: ...;
--density-group-gap: ...;
--density-section-gap: ...;

--density-label-size: ...;
--density-metadata-size: ...;
```

## 3.4. Density mappings

The same semantic token must resolve to different primitive values depending on the selected density mode.

Conceptually:

```text
Density Mode
     |
     +-- Compact
     |     |
     |     +-- Compact control dimensions
     |     +-- Compact spacing
     |     +-- Compact typography
     |
     +-- Default
     |     |
     |     +-- Standard dimensions
     |     +-- Standard spacing
     |     +-- Standard typography
     |
     +-- Comfortable
           |
           +-- Comfortable dimensions
           +-- Comfortable spacing
           +-- Comfortable typography
```

## 3.5. Rules

- Primitive values must remain centralized.
- Semantic density tokens must express functional roles.
- Density mappings must be consistent across components.
- Avoid direct primitive token consumption when a semantic token exists.
- Avoid creating density tokens for every individual component.
- Component-specific exceptions must be documented.
- Theme and density must remain independent dimensions.

## 3.6. Architecture audit

- [ ] Density primitives are centralized.
- [ ] Semantic density roles are documented.
- [ ] Density mappings are explicit.
- [ ] Components use semantic density tokens.
- [ ] Component-specific exceptions are justified.
- [ ] Density and theme can be combined independently.
- [ ] No arbitrary dimensional overrides exist.

---

# 4. Component Dimensions and Control Sizing

## 4.1. Definition

Component dimensions determine how much space controls occupy and how efficiently they fit into functional interfaces.

The library must provide consistent sizing conventions across component categories.

## 4.2. Standard size vocabulary

|Size|Intended usage|
|---|---|
|XS|Compact secondary controls|
|SM|Dense functional controls|
|MD|Standard controls|
|LG|Prominent or comfortable controls|
|XL|Exceptional large controls|

Not every component needs to support every size.

## 4.3. Dimension consistency

Equivalent controls should have predictable dimensions.

For example:

|Component|Expected relationship|
|---|---|
|Input|Aligned with standard button height|
|Select|Consistent with input height|
|Button|Consistent sizing across variants|
|Search input|Compatible with standard input dimensions|
|Menu item|Predictable row height|
|Toolbar control|Compact and aligned|
|Badge|Content-driven with controlled padding|

## 4.4. Rules

- Standard controls should share compatible heights.
- Equivalent size variants should use consistent naming.
- Component dimensions must preserve text alignment.
- Icons must remain proportionate to control dimensions.
- Width should generally adapt to content or layout constraints.
- Avoid arbitrary fixed widths.
- Use minimum dimensions where flexibility is necessary.
- Avoid creating size variants that differ only imperceptibly.

## 4.5. Audit checklist

- [ ] Component sizing conventions are documented.
- [ ] Equivalent controls share compatible dimensions.
- [ ] Size variants have meaningful differences.
- [ ] Icons remain proportionate.
- [ ] Text is vertically centered.
- [ ] Fixed dimensions are justified.
- [ ] Responsive behavior is preserved.

---

# 5. Spacing Efficiency

## 5.1. Definition

Spacing determines how efficiently information is organized within available space.

The objective is not to minimize all spacing.

It is to allocate space according to the relationships between elements.

## 5.2. Spacing hierarchy

The library should establish distinct spacing roles:

|Role|Purpose|
|---|---|
|Inline gap|Separation between inline elements|
|Control gap|Separation between controls|
|Content gap|Separation within content groups|
|Group gap|Separation between related groups|
|Section gap|Separation between major sections|
|Layout gap|Separation between major layout regions|

## 5.3. Rules

- Related elements should have smaller gaps.
- Unrelated groups should have larger gaps.
- Labels should remain close to their associated controls.
- Icons and labels should maintain balanced spacing.
- Repeated rows should use consistent spacing.
- Avoid arbitrary margins on individual components.
- Prefer layout-level spacing over compensating component margins.
- Do not use whitespace as a substitute for missing structure.

## 5.4. Spacing efficiency audit

- [ ] Spacing follows a controlled scale.
- [ ] Related content is visually grouped.
- [ ] Unrelated content is sufficiently separated.
- [ ] Repeated elements have consistent gaps.
- [ ] Internal padding is justified.
- [ ] Excessive whitespace is identified.
- [ ] Crowded groups are identified.

---

# 6. Typography and Density

## 6.1. Definition

Typography must adapt to density requirements while preserving semantic hierarchy.

The library must avoid shrinking every text element indiscriminately.

## 6.2. Rules

- Compact mode may reduce secondary typography sizes.
- Primary content must retain sufficient readability.
- Metadata may use smaller typographic roles when appropriate.
- Font weights must remain consistent.
- Line heights must adapt to text roles.
- Long content must retain appropriate wrapping.
- Numerical information should use tabular numerals where beneficial.
- Typography must not become the sole mechanism for increasing density.

## 6.3. Typography density mapping

|Text role|Compact|Default|Comfortable|
|---|---|---|---|
|Primary content|Compact readable|Standard|Standard or larger|
|Labels|Compact|Standard|Standard|
|Metadata|Compact|Standard|Standard|
|Descriptions|Compact readable|Standard|Relaxed|
|Large headings|Context-dependent|Standard|More spacious|

## 6.4. Audit checklist

- [ ] Typography adapts to density modes.
- [ ] Primary text remains readable.
- [ ] Metadata is appropriately sized.
- [ ] Line heights remain coherent.
- [ ] Typography hierarchy is preserved.
- [ ] Compact mode does not rely exclusively on tiny text.

---

# 7. Information Density and Layout

## 7.1. Definition

Layout determines how information is distributed within the available interface area.

Functional density depends on how effectively layout organizes information into recognizable groups.

## 7.2. Rules

- Prefer structured layouts over arbitrary positioning.
- Align related information.
- Use consistent column widths where appropriate.
- Avoid unnecessary nested containers.
- Prefer shared layout patterns for repeated content.
- Keep primary information within predictable visual regions.
- Avoid layouts that require excessive horizontal or vertical scanning.
- Adapt content organization to available space.

## 7.3. Layout efficiency

Evaluate:

- Number of visible information groups.
- Number of unnecessary layout containers.
- Amount of unused space.
- Alignment consistency.
- Horizontal and vertical scanning effort.
- Visibility of important content.
- Need for scrolling.
- Responsiveness to viewport changes.

## 7.4. Audit checklist

- [ ] Layout uses available space efficiently.
- [ ] Related information is aligned.
- [ ] Nested containers are justified.
- [ ] Repeated structures use consistent layouts.
- [ ] Primary content is visible.
- [ ] Scanning effort is reasonable.
- [ ] Layout adapts to viewport constraints.

---

# 8. Lists and Repeated Content

## 8.1. Definition

Lists are among the most important components for functional density.

They must support rapid scanning, comparison and interaction.

## 8.2. Rules

- Use consistent row dimensions.
- Keep repeated content aligned.
- Avoid excessive vertical padding.
- Use typography to distinguish primary and secondary row information.
- Keep metadata compact.
- Avoid unnecessary row backgrounds.
- Use subtle separators only when they improve scanning.
- Preserve sufficient space for interaction.
- Keep contextual actions discoverable.

## 8.3. List row hierarchy

A typical list row may contain:

```text
[Icon]  Primary title              [Status] [Actions]
        Secondary description
        Metadata
```

The title should dominate.

The description and metadata should remain subordinate.

Actions should not compete with the content.

## 8.4. Audit checklist

- [ ] Rows have consistent dimensions.
- [ ] Primary information is immediately visible.
- [ ] Metadata remains subordinate.
- [ ] Repeated alignment is consistent.
- [ ] Separators are restrained.
- [ ] Actions do not clutter the list.
- [ ] Compact mode remains usable.

---

# 9. Tables and Data Density

## 9.1. Definition

Tables must maximize the amount of comparable information displayed while preserving scanning and comprehension.

## 9.2. Rules

- Use consistent row heights.
- Keep column headers visually distinct.
- Align numerical data appropriately.
- Use tabular numerals when beneficial.
- Avoid unnecessary cell padding.
- Keep secondary metadata compact.
- Use subtle row separators.
- Avoid excessive background variation.
- Support horizontal overflow when necessary.
- Preserve readable minimum column widths.
- Avoid reducing text size excessively to fit content.

## 9.3. Table density dimensions

|Dimension|Audit target|
|---|---|
|Row height|Compact but readable|
|Cell padding|Consistent and justified|
|Column width|Appropriate to content|
|Typography|Readable and hierarchical|
|Alignment|Predictable|
|Separators|Subtle|
|Selection|Clearly identifiable|
|Actions|Contextually accessible|

## 9.4. Audit checklist

- [ ] Tables support efficient scanning.
- [ ] Row heights are consistent.
- [ ] Column alignment is coherent.
- [ ] Numerical values are easy to compare.
- [ ] Headers are distinguishable.
- [ ] Cell padding is optimized.
- [ ] Selection states are clear.
- [ ] Tables remain usable at smaller widths.

---

# 10. Navigation Density

## 10.1. Definition

Navigation must provide efficient access to functionality without permanently consuming unnecessary interface space.

## 10.2. Rules

- Keep navigation labels concise.
- Maintain consistent item heights.
- Use icons only when they improve recognition.
- Keep active states recognizable.
- Group related destinations.
- Avoid excessive nested navigation.
- Use collapsible groups when justified.
- Preserve discoverability of secondary destinations.
- Keep shortcuts and metadata visually subordinate.

## 10.3. Audit checklist

- [ ] Navigation items have consistent dimensions.
- [ ] Active destinations are identifiable.
- [ ] Groups are logically organized.
- [ ] Labels remain readable.
- [ ] Icons provide meaningful value.
- [ ] Secondary navigation does not clutter the interface.
- [ ] Collapsed navigation remains understandable.

---

# 11. Forms and Input Density

## 11.1. Definition

Forms must balance the efficient presentation of controls with clear field identification and validation.

Reducing the size of form controls must never compromise input usability.

## 11.2. Rules

- Keep labels visually connected to inputs.
- Use consistent input heights.
- Group related fields.
- Avoid unnecessary vertical gaps.
- Keep helper text compact but readable.
- Place validation messages near their associated fields.
- Use columns when they improve information organization.
- Avoid excessive horizontal layouts for long labels.
- Preserve sufficient space for error messages.

## 11.3. Audit checklist

- [ ] Form fields use consistent dimensions.
- [ ] Labels are clearly associated.
- [ ] Related fields are grouped.
- [ ] Helper text is subordinate.
- [ ] Validation messages remain visible.
- [ ] Spacing is efficient.
- [ ] Compact mode preserves usability.

---

# 12. Action Density

## 12.1. Definition

An interface must provide access to relevant actions without displaying every possible control permanently.

The number of visible actions should be proportional to their frequency and importance.

## 12.2. Rules

- Keep primary actions visible.
- Keep frequent secondary actions discoverable.
- Move infrequent actions into contextual menus when appropriate.
- Avoid displaying multiple competing action buttons.
- Use icon-only controls selectively.
- Preserve accessible names for icon-only actions.
- Group related actions.
- Avoid hiding essential functionality behind excessive interaction layers.

## 12.3. Action visibility model

|Action frequency|Recommended visibility|
|---|---|
|Critical|Always visible when relevant|
|Frequent|Directly accessible|
|Occasional|Contextual or secondary|
|Rare|Overflow menu or advanced interface|

Frequency alone must not determine visibility. Importance and task context must also be considered.

## 12.4. Audit checklist

- [ ] Primary actions are visible.
- [ ] Frequent actions are accessible.
- [ ] Rare actions do not clutter the interface.
- [ ] Action groups are consistent.
- [ ] Icon-only actions have accessible names.
- [ ] Contextual actions are discoverable.

---

# 13. Progressive Disclosure and Density

## 13.1. Definition

Progressive disclosure is a key mechanism for controlling functional density.

It allows the library to expose essential information immediately while keeping secondary functionality accessible when needed.

## 13.2. Appropriate applications

- Overflow menus.
- Expandable list rows.
- Collapsible sections.
- Advanced form fields.
- Contextual toolbars.
- Secondary navigation.
- Detail panels.
- Additional metadata.

## 13.3. Rules

- Show essential information by default.
- Reveal secondary functionality in predictable ways.
- Avoid hiding frequently used actions.
- Keep disclosure interactions consistent.
- Ensure hidden content remains keyboard accessible.
- Preserve clear indications of expandable content.
- Avoid unnecessary interaction layers.

## 13.4. Audit checklist

- [ ] Primary information is immediately available.
- [ ] Secondary functionality is accessible.
- [ ] Disclosure patterns are predictable.
- [ ] Important actions are not hidden.
- [ ] Expandable content has clear indicators.
- [ ] Keyboard access is preserved.

---

# 14. Interaction Areas and Accessibility

## 14.1. Definition

Functional density must not be achieved by reducing interaction areas below usable dimensions.

Visual compactness and interaction accessibility must be treated as separate concerns.

A control can have a small visual representation while maintaining a larger effective interaction area.

## 14.2. Rules

- Preserve usable pointer targets.
- Preserve keyboard accessibility.
- Ensure adjacent controls remain distinguishable.
- Avoid overlapping interaction areas.
- Keep focus indicators visible.
- Maintain sufficient spacing between independent actions.
- Do not sacrifice touch usability to achieve desktop compactness.
- Evaluate target dimensions against the applicable accessibility standard.

## 14.3. WCAG considerations

For WCAG 2.2 AA, Target Size (Minimum), criterion 2.5.8, generally requires targets to be at least 24 × 24 CSS pixels, subject to its exceptions and spacing provisions.

For touch-oriented interfaces, larger targets are often preferable.

The system should distinguish:

- Visual icon size.
- Visible control size.
- Effective interaction area.
- Minimum target size.

These values do not necessarily need to be identical.

## 14.4. Audit checklist

- [ ] Interaction targets meet applicable requirements.
- [ ] Small icons have usable hit areas.
- [ ] Adjacent actions do not overlap.
- [ ] Keyboard navigation remains usable.
- [ ] Focus indicators remain visible.
- [ ] Touch interactions are considered.
- [ ] Compact mode does not compromise accessibility.

---

# 15. Density and Responsive Behavior

## 15.1. Definition

Functional density must adapt to available space and interaction context.

A dense desktop layout should not simply be compressed into a mobile viewport.

## 15.2. Rules

- Reorganize content when space becomes insufficient.
- Preserve primary information.
- Hide or relocate secondary details when appropriate.
- Avoid excessive horizontal scrolling.
- Maintain usable control dimensions.
- Preserve clear grouping.
- Adapt action visibility to available space.
- Keep typography readable.
- Avoid arbitrary breakpoint-specific overrides.

## 15.3. Responsive density strategies

|Context|Recommended strategy|
|---|---|
|Large desktop|Higher information density|
|Standard desktop|Balanced density|
|Tablet|Reorganized layouts|
|Mobile|Prioritized information and contextual actions|

Responsive density is not simply a smaller version of desktop density.

It is a different allocation of information and interaction space.

## 15.4. Audit checklist

- [ ] Density adapts to viewport dimensions.
- [ ] Primary information remains visible.
- [ ] Secondary content is reorganized appropriately.
- [ ] Actions remain accessible.
- [ ] Controls preserve usable dimensions.
- [ ] Horizontal scrolling is justified.
- [ ] Mobile layouts preserve functional hierarchy.

---

# 16. Density and Visual Calm

## 16.1. Definition

A dense interface must remain visually calm.

Visual calm is achieved by reducing unnecessary variation and maintaining predictable patterns.

It does not require large amounts of whitespace.

## 16.2. Rules

- Use consistent row dimensions.
- Maintain predictable alignment.
- Avoid excessive borders.
- Limit background variations.
- Use restrained color.
- Keep typography consistent.
- Reduce decorative icons.
- Avoid unnecessary component nesting.
- Prefer repetition and consistency over visual variation.

## 16.3. Audit checklist

- [ ] Dense content remains visually calm.
- [ ] Repeated structures are predictable.
- [ ] Decorative elements are restrained.
- [ ] Borders and backgrounds are minimal.
- [ ] Alignment is consistent.
- [ ] Information hierarchy remains clear.

---

# 17. Functional Density Anti-Patterns

|Anti-pattern|Problem|Expected correction|
|---|---|---|
|Oversized controls everywhere|Wasted space|Introduce consistent sizing|
|Excessive padding|Reduced information capacity|Rebalance spacing|
|Tiny typography|Poor readability|Restore readable text roles|
|Excessive row height|Low information density|Optimize row dimensions|
|Extremely compact rows|Poor scanning and interaction|Restore minimum usable dimensions|
|Too many visible actions|Visual clutter|Use contextual actions|
|Excessive card nesting|Fragmented layout|Simplify composition|
|Redundant metadata|Unnecessary cognitive load|Remove or disclose secondary details|
|Inconsistent dimensions|Visual instability|Standardize sizing|
|Excessive whitespace|Inefficient space usage|Improve grouping|
|No whitespace|Cognitive overload|Restore spatial hierarchy|
|Desktop compression on mobile|Poor usability|Reorganize responsive layouts|
|Small interaction targets|Accessibility problems|Increase effective hit areas|
|Independent density settings|Fragmented system|Centralize density modes|

---

# 18. Functional Density Audit Methodology

Every component must be audited through the following dimensions.

## 18.1. Space efficiency

- Is available space used effectively?
- Is internal padding justified?
- Are component dimensions appropriate?
- Is unnecessary whitespace present?

## 18.2. Information efficiency

- How much useful information is visible?
- Is redundant information present?
- Can content be scanned efficiently?
- Are primary details immediately accessible?

## 18.3. Typography

- Is text readable at the selected density?
- Are primary and secondary roles distinguishable?
- Are line heights appropriate?
- Is metadata appropriately compact?

## 18.4. Component dimensions

- Are control heights consistent?
- Are row dimensions appropriate?
- Are icon proportions coherent?
- Are size variants meaningful?

## 18.5. Interaction efficiency

- Are primary actions visible?
- Are secondary actions accessible?
- Are hit areas usable?
- Is contextual disclosure appropriate?

## 18.6. Composition efficiency

- Are related elements grouped?
- Are nested containers justified?
- Are repeated structures consistent?
- Does the composition remain visually calm?

## 18.7. Responsive behavior

- Does density adapt to available space?
- Is important information preserved?
- Are actions reorganized appropriately?
- Does mobile retain usability?

## 18.8. Accessibility

- Are interaction targets sufficiently large?
- Is text readable?
- Is keyboard access preserved?
- Are focus indicators visible?
- Does compact mode preserve accessibility?

---

# 19. Functional Density Scoring

Each component must receive a score from 0 to 4 across eight dimensions.

|Dimension|Weight|
|---|---|
|Space efficiency|15%|
|Information efficiency|20%|
|Typography and readability|15%|
|Component dimensions|10%|
|Interaction efficiency|15%|
|Composition consistency|10%|
|Responsive behavior|10%|
|Accessibility|5%|

### Scoring scale

|Score|Classification|Description|
|---|---|---|
|0|Missing|No coherent density strategy|
|1|Poor|Significant space waste or usability problems|
|2|Partial|Basic density management with inconsistencies|
|3|Good|Efficient, readable and consistent|
|4|Excellent|Highly optimized without compromising usability|

Weighted score:

`(Space × 0.15) + (Information × 0.20) + (Typography × 0.15) + (Dimensions × 0.10) + (Interaction × 0.15) + (Composition × 0.10) + (Responsive × 0.10) + (Accessibility × 0.05)`

### Mandatory constraints

A component cannot be considered compliant if:

- Essential information becomes unreadable.
- Primary functionality becomes inaccessible.
- Interaction targets fail applicable accessibility requirements.
- Compact mode creates significant usability regressions.
- Responsive layouts hide essential functionality without an appropriate alternative.

Accessibility failures must be tracked independently of the average score.

---

# 20. Remediation Guidelines

When a component fails the functional density audit, apply corrections in the following order:

1. Identify unnecessary visual and functional elements.
2. Identify redundant information.
3. Determine the intended density mode.
4. Review component dimensions.
5. Review internal and external spacing.
6. Correct typographic density.
7. Improve information grouping.
8. Optimize repeated content and alignment.
9. Review action visibility.
10. Introduce progressive disclosure where appropriate.
11. Validate effective interaction areas.
12. Test responsive behavior.
13. Compare the component in all density modes.
14. Reinspect the complete composition.

Do not simply reduce padding or font size to improve a density score.

A density improvement is only valid when information efficiency increases without reducing usability.

---

# 21. Final Acceptance Criteria

The functional density system is considered successfully implemented when:

- Density modes are centrally defined.
- Component dimensions follow consistent conventions.
- Spacing is allocated according to information relationships.
- Typography adapts without compromising readability.
- Lists and tables support efficient scanning.
- Navigation remains compact and understandable.
- Forms remain usable at different density levels.
- Actions are visible according to their importance.
- Progressive disclosure reduces unnecessary visual complexity.
- Interaction targets preserve accessibility.
- Responsive layouts reorganize information appropriately.
- Dense interfaces remain visually calm.
- Density does not compromise the established visual hierarchy.

---

# 22. Final Principle

Functional density is not about fitting as much content as possible into the smallest available space.

It is about making the greatest amount of useful information accessible with the least possible friction.

A refined interface can be information-rich without feeling crowded, and compact without feeling constrained.

**The objective is maximum functional efficiency, not minimum component dimensions.**