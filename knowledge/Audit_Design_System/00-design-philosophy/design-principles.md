# Design Principles

> **Purpose:** Establish the mandatory design principles governing the visual language, component architecture, interaction patterns and user experience of the UI library.
> 
> **Scope:** All design foundations, components, patterns, layouts and interactive behaviors.
> 
> **Status:** Foundational design specification.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.

---

# 1. Core Principles

The library must follow 15 fundamental design principles.

These principles define what good design means within the system.

They are not merely aesthetic preferences. They are design constraints that must influence implementation decisions and be verifiable during audits.

|ID|Principle|Primary objective|
|---|---|---|
|DP-01|Functional Minimalism|Eliminate unnecessary visual complexity|
|DP-02|Neutral-First Color|Use color intentionally|
|DP-03|Subtle Contrast Hierarchy|Establish hierarchy through restrained contrast|
|DP-04|Typographic Precision|Use typography to organize information|
|DP-05|Geometric Consistency|Maintain consistent component proportions|
|DP-06|Functional Density|Maximize useful information density|
|DP-07|Clear Information Hierarchy|Make content immediately understandable|
|DP-08|Progressive Disclosure|Reveal complexity contextually|
|DP-09|Alignment Discipline|Maintain precise visual alignment|
|DP-10|Immediate Feedback|Make interactions perceptible|
|DP-11|Predictable Behavior|Maintain consistent interaction conventions|
|DP-12|Purposeful Motion|Use animation to communicate state changes|
|DP-13|Keyboard-First Interaction|Support efficient keyboard operation|
|DP-14|Composability Over Complexity|Favor reusable and composable components|
|DP-15|Semantic Consistency|Maintain a unified design language|

---

# 2. Visual Identity Principles

## DP-01 — Functional Minimalism

### Definition

Every visual element must serve a functional, structural, semantic or navigational purpose.

The interface should communicate as much as possible using as few visual elements as reasonably necessary.

Minimalism must never come at the expense of usability, accessibility or information clarity.

### Design rules

- Prefer simple surfaces over decorative containers.
- Avoid unnecessary borders and separators.
- Avoid shadows without a clear elevation purpose.
- Avoid decorative gradients and effects.
- Eliminate redundant labels and visual indicators.
- Avoid unnecessary nested cards.
- Prefer visual hierarchy over decorative emphasis.
- Keep component structures visually lightweight.

### Expected manifestations

- Simple button treatments.
- Restrained card designs.
- Minimal dialog decoration.
- Unobtrusive separators.
- Limited use of visual effects.
- Clear and concise component structures.

### Anti-patterns

- Multiple nested containers with identical visual treatment.
- Decorative icons without semantic purpose.
- Shadows applied to every component.
- Excessive use of badges.
- Multiple competing accent colors.
- Repeated labels that communicate information already visible elsewhere.

### Audit checklist

- [ ] Every visual element has an identifiable purpose.
- [ ] No unnecessary decorative container exists.
- [ ] Borders and shadows are used selectively.
- [ ] Components avoid redundant visual indicators.
- [ ] The interface remains understandable without decorative effects.
- [ ] Removing unnecessary decoration improves or preserves clarity.

### Acceptance criteria

A component passes when its visual complexity is justified by its functionality and no unnecessary decoration competes with its content or actions.

---

## DP-02 — Neutral-First Color

### Definition

Neutral colors must establish the primary visual language of the library.

Neutral means the low-chroma structural scale of the active theme. It may carry a tint.

Accent and semantic colors must communicate meaningful information rather than serve as general decoration.

### Design rules

- Use semantic color tokens rather than arbitrary color values.
- Reserve primary accent colors for important actions and emphasis.
- Use neutral surfaces for most interface structures.
- Distinguish surface levels through controlled color differences.
- Use semantic colors consistently across components.
- Ensure light and dark themes preserve equivalent hierarchy.
- Avoid excessive saturation.

### Expected manifestations

- Neutral page backgrounds.
- Subtle secondary surfaces.
- Restrained primary buttons.
- Muted secondary controls.
- Semantic status indicators.
- Consistent error, warning, success and information treatments.

### Anti-patterns

- Using the accent color for every interactive component.
- Coloring entire cards without semantic justification.
- Using semantic colors as decorative backgrounds.
- Introducing component-specific colors outside the semantic system.
- Inconsistent colors for identical statuses.

### Audit checklist

- [ ] Neutral colors dominate the visual composition.
- [ ] Accent colors are used selectively.
- [ ] Semantic colors have consistent meanings.
- [ ] Interactive states use appropriate tokens.
- [ ] Light and dark themes maintain equivalent semantic meaning.
- [ ] No arbitrary color values bypass the token system.

### Acceptance criteria

The interface must remain visually coherent and recognizable when accent colors are temporarily removed or reduced.

---

## DP-03 — Subtle Contrast Hierarchy

### Definition

Visual hierarchy should be established through controlled differences in contrast, surface tone and typography rather than excessive borders, shadows or strong visual separation.

### Design rules

- Use subtle surface differentiation.
- Prefer tonal separation over unnecessary outlines.
- Reserve strong contrast for important content and actions.
- Use borders primarily for structural or interactive boundaries.
- Avoid excessive elevation.
- Maintain sufficient accessibility contrast.
- Ensure secondary information remains readable.

### Expected manifestations

- Subtle input borders.
- Muted separators.
- Differentiated background surfaces.
- Clear primary and secondary text.
- Limited shadow usage.
- Minimal visual separation between related content.

### Anti-patterns

- Strong borders around every element.
- Excessive use of shadows.
- Overly contrasting secondary surfaces.
- Insufficient contrast for important content.
- Multiple nested surface treatments.

### Audit checklist

- [ ] Surface differences are subtle but understandable.
- [ ] Borders do not dominate the interface.
- [ ] Shadows are used only when justified.
- [ ] Primary content has sufficient contrast.
- [ ] Secondary content remains readable.
- [ ] Visual hierarchy does not depend exclusively on borders.

### Acceptance criteria

The interface must communicate structural relationships clearly without relying on excessive visual separation.

---

## DP-04 — Typographic Precision

### Definition

Typography is a primary structural element of the interface.

It must communicate hierarchy, importance, grouping and readability with a limited and consistent set of typographic styles.

### Design rules

- Establish a controlled type scale.
- Use font weight intentionally.
- Avoid unnecessary font size variations.
- Maintain consistent line heights.
- Distinguish labels, descriptions and metadata.
- Prefer typographic hierarchy over decorative styling.
- Ensure readable text in compact components.
- Use consistent conventions for uppercase text and letter spacing.

### Expected manifestations

- Compact but readable labels.
- Clear heading hierarchy.
- Subdued metadata.
- Consistent button typography.
- Appropriate input typography.
- Balanced text density.

### Anti-patterns

- Excessive font size variations.
- Arbitrary font weights.
- Oversized labels.
- Inconsistent line heights.
- Decorative uppercase text used everywhere.
- Different typography for equivalent component roles.

### Audit checklist

- [ ] All text styles belong to a coherent type scale.
- [ ] Typography reflects information importance.
- [ ] Labels and descriptions are visually distinguishable.
- [ ] Text remains readable in compact layouts.
- [ ] Equivalent components share typographic conventions.
- [ ] Long text and truncation are handled correctly.

### Acceptance criteria

The visual hierarchy must remain understandable through typography alone, without requiring excessive color or decoration.

---

## DP-05 — Geometric Consistency

### Definition

All components must share a consistent geometric language.

Component dimensions, proportions, radii, padding and alignment must follow standardized rules.

### Design rules

- Use standardized control heights.
- Use a controlled radius scale.
- Maintain consistent internal padding.
- Standardize icon dimensions.
- Maintain predictable border thickness.
- Align labels and controls.
- Use consistent spacing between icons and text.
- Avoid arbitrary dimensions.

### Expected manifestations

- Uniform input and select heights.
- Consistent button proportions.
- Shared border radius conventions.
- Aligned icons.
- Consistent badge sizing.
- Predictable dialog and popover geometry.

### Anti-patterns

- Different heights for equivalent controls.
- Arbitrary border radii.
- Inconsistent icon sizing.
- Irregular padding.
- Visually unbalanced button proportions.
- Component-specific dimensions without justification.

### Audit checklist

- [ ] Equivalent controls share standardized dimensions.
- [ ] Radius values follow a coherent scale.
- [ ] Padding is consistent.
- [ ] Icons are optically aligned.
- [ ] Borders follow standardized thickness.
- [ ] Components maintain coherent proportions.

### Acceptance criteria

Components from different categories must look like members of the same design system when displayed together.

---

# 3. Layout & Information Principles

## DP-06 — Functional Density

### Definition

The library must maximize the amount of useful information displayed within the available interface space while preserving readability and accessibility.

Density should be intentional, not simply achieved by reducing all spacing.

### Design rules

- Avoid unnecessary vertical whitespace.
- Provide appropriate compact and comfortable sizes.
- Keep repeated information visually concise.
- Optimize table and list layouts.
- Use consistent row heights.
- Avoid oversized controls without usability justification.
- Prioritize information over decoration.
- Maintain adequate interaction target sizes.

### Expected manifestations

- Compact data tables.
- Efficient lists.
- Concise metadata.
- Controlled component spacing.
- Balanced form layouts.
- Information-rich dashboards.

### Anti-patterns

- Excessive vertical spacing.
- Oversized buttons and inputs.
- Large empty cards.
- Repeated decorative headings.
- Unnecessarily tall list items.
- Dense layouts that sacrifice readability.

### Audit checklist

- [ ] Components use space efficiently.
- [ ] Lists and tables maintain useful information density.
- [ ] Compact variants remain readable.
- [ ] Spacing is proportional to content importance.
- [ ] Dense layouts remain accessible.
- [ ] Whitespace contributes to grouping and comprehension.

### Acceptance criteria

The library must support information-dense professional interfaces without appearing cluttered or compromising usability.

---

## DP-07 — Clear Information Hierarchy

### Definition

Every interface must communicate the relative importance of its information and actions immediately.

Users should understand what matters, what is secondary and what can be done next.

### Design rules

- Establish a clear primary content area.
- Distinguish primary and secondary actions.
- Keep metadata visually subordinate.
- Group related information.
- Use consistent heading levels.
- Avoid competing visual emphasis.
- Maintain predictable content ordering.

### Expected manifestations

- Clearly differentiated primary buttons.
- Subdued secondary actions.
- Structured content groups.
- Consistent section headings.
- Readable metadata.
- Predictable list and table hierarchy.

### Anti-patterns

- Multiple equally emphasized primary actions.
- Excessive heading levels.
- Metadata competing with primary content.
- Inconsistent action hierarchy.
- Unstructured groups of controls.

### Audit checklist

- [ ] Primary content is immediately identifiable.
- [ ] Primary actions are visually distinguishable.
- [ ] Secondary information is subordinate.
- [ ] Related content is grouped consistently.
- [ ] Hierarchy remains clear without decorative effects.

### Acceptance criteria

Users must be able to identify the primary content and next meaningful action without having to inspect every element.

---

## DP-08 — Progressive Disclosure

### Definition

The interface should reveal information and functionality progressively according to context and user intent.

Complexity should be available without being continuously visible.

### Design rules

- Keep secondary actions contextual.
- Reveal advanced settings when needed.
- Use menus for grouped secondary actions.
- Use tooltips for supplementary explanations.
- Use expandable regions for optional content.
- Preserve access to important functionality.
- Avoid hiding essential information behind unnecessary interactions.

### Expected manifestations

- Dropdown menus.
- Contextual actions.
- Command palettes.
- Expandable sections.
- Popovers.
- Context menus.
- Advanced configuration panels.

### Anti-patterns

- Displaying every possible action simultaneously.
- Hiding essential actions in obscure menus.
- Excessive nested dropdowns.
- Tooltips containing essential instructions.
- Interactions that require too many steps.

### Audit checklist

- [ ] Secondary actions are revealed contextually.
- [ ] Essential functionality remains discoverable.
- [ ] Menus are logically grouped.
- [ ] Advanced options do not overload default views.
- [ ] Disclosure interactions are predictable.

### Acceptance criteria

The default interface should remain focused while preserving efficient access to advanced functionality.

---

## DP-09 — Alignment Discipline

### Definition

Every component and layout must respect a consistent visual alignment system.

Alignment precision is essential to the perceived quality of the library.

### Design rules

- Use consistent layout grids.
- Align text baselines where appropriate.
- Standardize internal component padding.
- Maintain consistent spacing between related elements.
- Align icons optically with text.
- Use predictable content boundaries.
- Avoid arbitrary positioning adjustments.

### Expected manifestations

- Consistent form alignment.
- Aligned table columns.
- Uniform button content positioning.
- Consistent sidebar spacing.
- Balanced icon and label placement.

### Anti-patterns

- Inconsistent left margins.
- Misaligned icons.
- Uneven gaps.
- Arbitrary per-component offsets.
- Inconsistent form field alignment.

### Audit checklist

- [ ] Related elements share alignment boundaries.
- [ ] Icons are optically aligned.
- [ ] Text baselines are consistent.
- [ ] Component padding follows shared conventions.
- [ ] Layout spacing follows a predictable rhythm.

### Acceptance criteria

No systematic alignment inconsistency should be visible when comparing components or composed interfaces.

---

# 4. Interaction Principles

## DP-10 — Immediate Feedback

### Definition

Every meaningful interaction must produce an appropriate and timely response.

Feedback should communicate that an action has been received, is being processed or has completed.

### Design rules

- Define visual feedback for interactive states.
- Use loading indicators for asynchronous actions.
- Provide clear validation feedback.
- Make selection states identifiable.
- Provide appropriate success and error messages.
- Avoid ambiguous interaction results.
- Keep feedback proportional to the action.

### Expected manifestations

- Hover states.
- Focus indicators.
- Active states.
- Loading states.
- Selected states.
- Validation messages.
- Toast notifications.

### Anti-patterns

- Buttons without interaction feedback.
- Silent failures.
- Indefinite loading states.
- Excessive confirmation notifications.
- Feedback that disappears before it can be understood.

### Audit checklist

- [ ] Interactive states are visually identifiable.
- [ ] Asynchronous actions provide feedback.
- [ ] Errors are communicated clearly.
- [ ] Success states are appropriate.
- [ ] Feedback is consistent across components.

### Acceptance criteria

Users must never be left uncertain about the result or status of a meaningful interaction.

---

## DP-11 — Predictable Behavior

### Definition

Components with similar purposes must follow consistent interaction conventions.

The same action should produce the same expected behavior throughout the library.

### Design rules

- Standardize keyboard conventions.
- Standardize overlay dismissal behavior.
- Maintain consistent focus handling.
- Keep disabled behavior consistent.
- Define clear selection semantics.
- Prevent accidental repeated actions.
- Document component-specific exceptions.

### Expected manifestations

- Escape dismisses appropriate overlays.
- Enter activates appropriate actions.
- Space activates buttons and toggles.
- Consistent dropdown navigation.
- Consistent dialog behavior.
- Consistent disabled interactions.

### Anti-patterns

- Different keyboard conventions for similar components.
- Unexpected dismissal behavior.
- Inconsistent focus restoration.
- Disabled controls that remain interactive.
- Ambiguous selection behavior.

### Audit checklist

- [ ] Similar components behave similarly.
- [ ] Keyboard behavior follows established conventions.
- [ ] Overlay behavior is standardized.
- [ ] Focus behavior is predictable.
- [ ] Disabled components cannot trigger inappropriate actions.
- [ ] Exceptions are explicitly documented.

### Acceptance criteria

Users should be able to transfer interaction knowledge from one component to another without relearning basic behavior.

---

## DP-12 — Purposeful Motion

### Definition

Motion should communicate state transitions, spatial relationships and interaction feedback.

Animation must improve comprehension rather than simply add visual activity.

### Design rules

- Use consistent duration tokens.
- Use standardized easing curves.
- Prefer short transitions.
- Avoid unnecessary movement.
- Animate meaningful state changes.
- Respect reduced-motion preferences.
- Avoid animation that blocks interaction.

### Expected manifestations

- Smooth dropdown appearance.
- Subtle dialog transitions.
- Clear accordion expansion.
- Controlled hover transitions.
- Responsive loading indicators.
- Consistent state transitions.

### Anti-patterns

- Excessive bounce effects.
- Long decorative animations.
- Unnecessary parallax.
- Different transition speeds for equivalent components.
- Animations that interfere with keyboard interaction.

### Audit checklist

- [ ] Each animation has a functional purpose.
- [ ] Durations are consistent.
- [ ] Easing is standardized.
- [ ] Reduced-motion is respected.
- [ ] Animations do not delay essential interactions.

### Acceptance criteria

Motion must make the interface easier to understand and must never become a source of friction.

---

## DP-13 — Keyboard-First Interaction

### Definition

The library should support efficient keyboard operation as a first-class interaction model.

Keyboard accessibility is mandatory; keyboard efficiency is an additional product quality objective.

### Design rules

- Ensure all interactive elements are keyboard accessible.
- Use visible focus indicators.
- Preserve logical tab order.
- Support standard keyboard interactions.
- Implement appropriate arrow-key navigation for composite widgets.
- Support Escape where dismissal is expected.
- Manage focus in dialogs and overlays.
- Provide shortcuts only when their behavior is clear.

### Expected manifestations

- Keyboard-operable menus.
- Efficient tab navigation.
- Accessible dialogs.
- Command interfaces.
- Focus restoration.
- Keyboard-operable selection controls.

### Anti-patterns

- Mouse-only interactions.
- Invisible focus states.
- Unpredictable tab order.
- Broken focus trapping in modal dialogs.
- Conflicting keyboard shortcuts.

### Audit checklist

- [ ] All interactive components are keyboard accessible.
- [ ] Focus is always visible.
- [ ] Tab order is logical.
- [ ] Composite widgets implement appropriate keyboard behavior.
- [ ] Dialogs manage focus correctly.
- [ ] Keyboard shortcuts are documented.

### Acceptance criteria

All essential interactions must be possible without a mouse, and complex components must follow their appropriate accessibility interaction patterns.

---

# 5. System Design Principles

## DP-14 — Composability Over Complexity

### Definition

The library should favor small, focused and composable components over monolithic components with excessive configuration.

Composition should be the preferred mechanism for building complex interfaces.

### Design rules

- Separate primitives from complex components.
- Keep component responsibilities focused.
- Use slots and composition where appropriate.
- Avoid excessive configuration props.
- Support custom content.
- Minimize dependencies between components.
- Preserve consistent styling during composition.
- Ensure compatibility with Reef.js state management.

### Expected manifestations

- Primitive buttons and inputs.
- Composable dialog structures.
- Flexible form components.
- Reusable menu primitives.
- Independent layout components.
- Explicit component APIs.

### Anti-patterns

- Components with dozens of unrelated props.
- Components that impose rigid DOM structures.
- Excessive component-specific configuration.
- Unnecessary dependencies between primitives.
- Components that cannot be customized without modifying internal code.

### Audit checklist

- [ ] Component responsibilities are clearly defined.
- [ ] Complex components are built from reusable primitives where appropriate.
- [ ] APIs remain focused.
- [ ] Composition does not require styling hacks.
- [ ] Components remain independently usable.
- [ ] Composition works correctly with Reef.js reactive state.

### Acceptance criteria

Developers must be able to build new interface patterns from existing components without duplicating implementation or introducing inconsistent styling.

---

## DP-15 — Semantic Consistency

### Definition

The entire library must share a unified semantic, visual and interaction language.

A design decision made in one component category should remain compatible with equivalent decisions elsewhere.

### Design rules

- Use shared semantic design tokens.
- Standardize component states.
- Standardize variant meanings.
- Maintain consistent naming conventions.
- Share interaction patterns.
- Avoid isolated component-specific conventions.
- Keep light and dark theme semantics aligned.
- Ensure all components respect the global design direction.

### Expected manifestations

- Shared primary, secondary and destructive variants.
- Consistent disabled states.
- Shared focus treatment.
- Consistent surface semantics.
- Standardized sizing conventions.
- Predictable component APIs.

### Anti-patterns

- Different meanings for equivalent variants.
- Inconsistent semantic colors.
- Component-specific focus systems.
- Different disabled treatments.
- Unnecessary duplication of design tokens.

### Audit checklist

- [ ] Equivalent variants have equivalent meanings.
- [ ] Shared states are visually consistent.
- [ ] Components use semantic tokens.
- [ ] Naming conventions are consistent.
- [ ] Interaction patterns are shared.
- [ ] No component introduces an unjustified design convention.

### Acceptance criteria

The library must behave and look like one coherent system, regardless of which components are combined.

---

# 6. Principle Compliance Framework

Every principle must be evaluated at three levels.

|Level|Evaluation objective|
|---|---|
|Foundation|Are the necessary tokens and conventions available?|
|Implementation|Does the component correctly apply the principle?|
|Experience|Does the final interface express the intended quality?|

A principle cannot be considered fully implemented merely because its tokens exist.

For example, having a neutral color palette does not guarantee a neutral-first visual experience if components use accent colors excessively.

---

# 7. Audit Scoring

Each principle must be evaluated using the following scale.

|Score|Classification|Meaning|
|---|---|---|
|0|Missing|Principle is not implemented|
|1|Poor|Implementation contradicts the principle|
|2|Partial|Principle is inconsistently implemented|
|3|Good|Principle is consistently respected|
|4|Excellent|Principle is refined and fully integrated|

Use N/A when a principle is genuinely not applicable to a specific component.

### Compliance interpretation

- **0–1:** Requires correction.
- **2:** Requires improvement.
- **3:** Acceptable.
- **4:** Reference-quality implementation.

Scores must be supported by observable evidence, not subjective impressions alone.

---

# 8. Audit Rules

The following rules govern all future design audits.

1. Evaluate components against principles, not personal aesthetic preferences.
2. Do not introduce arbitrary design rules without documenting their purpose.
3. Evaluate the complete component, including its states and interactions.
4. Compare equivalent components to detect inconsistencies.
5. Inspect the final rendered interface, not only source code.
6. Validate behavior under reactive state updates.
7. Verify both light and dark themes.
8. Distinguish intentional design decisions from implementation defects.
9. Document every identified deviation.
10. Recommend corrections that preserve the overall design direction.

---

# 9. Principle Traceability

Every identified issue must reference the principle it violates.

Example:

|Issue|Component|Violated principle|
|---|---|---|
|Excessive border contrast|Input|DP-03|
|Inconsistent control height|Select|DP-05|
|Excessive vertical spacing|Data Table|DP-06|
|Secondary actions always visible|Toolbar|DP-08|
|Missing hover feedback|Button|DP-10|
|Inconsistent dialog dismissal|Dialog|DP-11|
|Excessive transition duration|Popover|DP-12|
|Monolithic component API|Date Picker|DP-14|
|Inconsistent destructive variant|Button|DP-15|

---

# 10. Final Design Principle

The library must not be treated as a collection of independent visual components.

Every component is an expression of the same underlying design philosophy.

A component that is individually attractive but visually inconsistent with the rest of the library is not considered a successful implementation.

A component that is technically correct but violates the established visual or interaction principles is not considered complete.

**The ultimate objective is systemic design quality: every component must reinforce the same visual identity, interaction language and product experience.**
