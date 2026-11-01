# Design Direction

> **Purpose:** Define the visual, functional and experiential direction of the UI component library.
> 
> **Scope:** Global design identity, visual direction, interaction philosophy and product experience.
> 
> **Status:** Foundational design specification.

---

## 1. Design Vision

The library aims to provide a refined, consistent and highly composable UI system for building modern software applications.

Its design direction rests on the following qualities:

- Visual simplicity without sacrificing functionality.
- High information density without visual overload.
- Precise typography and geometric consistency.
- Restrained use of color, borders and shadows.
- Predictable and responsive interactions.
- Composable components with consistent visual behavior.
- Attention to details across every component and state.

The objective is not to reproduce the appearance of another design system.

The objective is to establish an independent visual identity based on the same level of design discipline, precision and consistency.

### Core design statement

**A precise, restrained and functional interface system where every visual element has a purpose, every interaction feels predictable, and every component contributes to a coherent product experience.**

### Quality bar

The library aims for the quality level of Linear on every plane, including visual quality.

This is the only place where a product is named. A product is an ambition, never a criterion: no component is evaluated on its resemblance to another product.

The ambition becomes verifiable in two ways:

- **Calibration:** measurable properties of the reference, such as spacing, type scale, timing or contrast, can be sampled to set this library's own thresholds. Each sample records its date and source.
- **Comparison:** at each milestone, a person compares key screens with the reference. The result is reported next to the audit score and is never part of it.

### Customization

The library must stay customizable: primary color, background tints and other tokens can change.

Quality must therefore hold for every valid theme, not for one palette. Criteria are written as invariants, defined in `02-visual-quality/theme-invariants.md`.

---

## 2. Design Personality

The library should express the following characteristics.

|Characteristic|Expected expression|
|---|---|
|Minimal|Avoid unnecessary visual elements|
|Precise|Consistent geometry, alignment and spacing|
|Functional|Prioritize usability over decoration|
|Restrained|Use color and contrast intentionally|
|Dense|Maximize useful information within available space|
|Consistent|Maintain a unified visual and interaction language|
|Composable|Support flexible component composition|
|Refined|Pay attention to subtle visual and interaction details|
|Predictable|Follow recognizable interaction conventions|
|Modern|Use contemporary interface patterns without unnecessary trends|

### Characteristics to avoid

The library should avoid:

- Excessive rounded corners.
- Excessive shadows and elevation.
- Decorative gradients without functional purpose.
- Excessive accent color usage.
- Oversized controls without a clear usability reason.
- Unnecessary borders around every element.
- Excessive spacing that reduces information density.
- Inconsistent icon sizes and alignments.
- Excessive animations.
- Arbitrary visual variations between similar components.
- Generic dashboard aesthetics based on cards, gradients and decorative containers.

---

## 3. Visual Direction

### 3.1. Neutral-first visual language

The visual foundation should be predominantly neutral.

Neutral means the low-chroma structural scale of the active theme. It may carry a tint.

Primary visual surfaces should rely on carefully balanced neutral colors rather than strong accent colors.

Expected characteristics:

- Neutral backgrounds.
- Subtle surface differentiation.
- Restrained borders.
- Controlled foreground contrast.
- Limited accent color usage.
- Semantic colors reserved for meaningful states.

Accent colors should communicate hierarchy, action or status rather than simply decorate the interface.

### 3.2. Restrained surface treatment

Surfaces should remain visually simple.

Preferred techniques:

- Background differentiation.
- Subtle borders.
- Limited elevation.
- Consistent surface hierarchy.
- Minimal use of shadows.

Avoid creating unnecessary containers around content.

A surface should exist because it provides structural, semantic or interactive value.

### 3.3. Precise geometry

All components should share a coherent geometric language.

This includes:

- Consistent border radii.
- Standardized control heights.
- Predictable padding.
- Consistent icon dimensions.
- Aligned text baselines.
- Consistent border thickness.
- Reusable sizing conventions.

Geometric consistency should be observable across the entire component library.

### 3.4. Typography-driven hierarchy

Typography should be one of the primary mechanisms used to organize information.

The visual hierarchy should rely on:

- Font size.
- Font weight.
- Line height.
- Foreground contrast.
- Text positioning.
- Spacing.

Avoid using excessive font sizes, weights or decorative typographic treatments to create hierarchy.

---

## 4. Layout Philosophy

### 4.1. Functional density

The library should support interfaces that display substantial amounts of information without appearing crowded.

Expected characteristics:

- Compact but readable controls.
- Efficient vertical spacing.
- Predictable component dimensions.
- Clear grouping of information.
- Well-structured lists and tables.
- Reduced decorative whitespace.

Whitespace should improve comprehension, not unnecessarily consume available space.

### 4.2. Clear hierarchy

Every interface should establish an understandable hierarchy between:

1. Primary content.
2. Secondary content.
3. Supporting information.
4. Primary actions.
5. Secondary actions.
6. Contextual actions.

The hierarchy should remain clear without requiring excessive color, borders or visual decoration.

### 4.3. Contextual complexity

Complexity should be revealed progressively.

Advanced actions and secondary information should appear when relevant through appropriate interaction patterns:

- Dropdown menus.
- Context menus.
- Popovers.
- Tooltips.
- Dialogs.
- Expandable sections.
- Command interfaces.

The default interface should expose what is necessary without overwhelming the user.

---

## 5. Interaction Philosophy

### 5.1. Immediate feedback

Every meaningful user action should produce an appropriate response.

Examples:

- Hover feedback.
- Active states.
- Focus indicators.
- Loading indicators.
- Success feedback.
- Error feedback.
- Selection states.

Feedback should be immediate, subtle and consistent.

### 5.2. Predictable behavior

Components should follow recognizable interaction conventions.

Similar components must behave similarly.

Examples:

- Escape closes dismissible overlays.
- Enter activates appropriate actions.
- Space activates buttons and toggles.
- Focus behavior remains consistent.
- Disabled controls do not trigger interactions.
- Loading states prevent inappropriate repeated actions.

### 5.3. Keyboard efficiency

The library should support efficient keyboard interaction.

Keyboard accessibility is a baseline requirement.

Keyboard efficiency is an additional design objective, particularly for professional productivity applications.

### 5.4. Purposeful motion

Animations should explain transitions and reinforce interaction feedback.

They should never become a source of distraction.

Motion must remain:

- Short.
- Consistent.
- Predictable.
- Functional.
- Respectful of reduced-motion preferences.

---

## 6. Component Philosophy

### 6.1. Composability

Components should be designed as reusable building blocks.

Prefer small, focused components that can be combined to create complex interfaces.

Avoid unnecessary monolithic components with excessive configuration options.

### 6.2. Consistency over uniqueness

A component should not introduce a new visual convention when an existing convention already solves the problem.

Consistency across the library is more important than giving every component an individual visual identity.

### 6.3. Controlled customization

Customization should be possible without breaking the design system.

Prefer:

- Semantic tokens.
- Explicit variants.
- Standardized sizes.
- Composable primitives.
- Well-defined component APIs.

Avoid uncontrolled one-off styling and arbitrary component-specific visual rules.

### 6.4. Reef.js compatibility

Components must respect Reef.js reactive state management and lifecycle behavior.

The design direction must not compromise:

- State correctness.
- Predictable rendering.
- Component isolation.
- Lifecycle cleanup.
- Interaction reliability.

Visual and functional consistency must survive reactive updates.

---

## 7. Design Quality Standards

The following qualities define the expected level of refinement.

|Dimension|Expected standard|
|---|---|
|Visual simplicity|No unnecessary decoration|
|Visual hierarchy|Immediately understandable|
|Color usage|Neutral-first and intentional|
|Typography|Precise and restrained|
|Geometry|Consistent across components|
|Density|Efficient without sacrificing readability|
|Alignment|Visually precise|
|Interaction|Predictable and responsive|
|Motion|Subtle and purposeful|
|Composition|Flexible and reusable|
|Accessibility|Accessible by default|
|Reactivity|Correct under Reef.js state updates|

---

## 8. Global Design Constraints

The following constraints apply throughout the library.

1. No arbitrary hardcoded visual values when an appropriate design token exists.
2. No component-specific design language without an explicit justification.
3. No unnecessary decorative elements.
4. No inconsistent control dimensions.
5. No arbitrary border-radius variations.
6. No excessive accent color usage.
7. No unnecessary shadows or elevation.
8. No inconsistent interaction states.
9. No animations without a functional purpose.
10. No visual customization that compromises accessibility.
11. No interaction pattern that violates established component conventions.
12. No implementation that compromises Reef.js reactivity.

---

## 9. Design Direction Audit

Use this checklist to evaluate whether the library follows the intended direction.

### Visual identity

- [ ] The overall visual language is recognizable and consistent.
- [ ] Neutral colors dominate the interface.
- [ ] Accent colors are used intentionally.
- [ ] Typography creates a clear hierarchy.
- [ ] Component geometry is consistent.
- [ ] Surface treatments remain restrained.
- [ ] Decorative elements are limited.

### Layout and density

- [ ] Interfaces use available space efficiently.
- [ ] Components have appropriate dimensions.
- [ ] Information hierarchy is immediately understandable.
- [ ] Secondary information remains visually subordinate.
- [ ] Complex interfaces avoid unnecessary visual noise.

### Interaction

- [ ] Interactions provide immediate feedback.
- [ ] Components behave predictably.
- [ ] Keyboard interaction is supported.
- [ ] Motion is subtle and purposeful.
- [ ] Component states are visually consistent.

### System consistency

- [ ] Components share the same visual language.
- [ ] Design tokens are used consistently.
- [ ] Components can be composed without visual conflicts.
- [ ] Customization preserves the system's identity.
- [ ] Reef.js reactivity does not introduce visual inconsistencies.

---

## 10. Acceptance Criteria

The design direction is considered successfully implemented when:

- The library expresses a coherent visual identity across all component categories.
- The same design principles are recognizable in simple and complex components.
- Components can be combined without creating visual inconsistencies.
- Light and dark themes preserve the same design philosophy.
- Interaction patterns feel consistent across the library.
- The overall aesthetic remains restrained, precise and functional.
- No major component category contradicts the established design direction.

**Final principle:**

The quality of the library must be evaluated as a complete visual and functional system, not as a collection of individually attractive components.