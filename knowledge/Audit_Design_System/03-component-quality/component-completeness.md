# Component Completeness

> **Purpose:** Define the completeness criteria for every component in the Reef.js UI library.
> 
> **Scope:** Functional capabilities, visual states, interaction states, component anatomy, composition, accessibility, responsive behavior, customization, state management, edge cases and production readiness.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.
> 
> **Framework context:** Reef.js — state-based reactive framework.

---

# 1. Component Completeness Philosophy

## 1.1. Definition

Component completeness measures whether a component provides all essential capabilities required by its intended use cases.

A complete component must provide:

- A clearly defined purpose.
- A coherent visual representation.
- All necessary interaction states.
- Predictable behavior.
- An appropriate public API.
- Accessibility support.
- Composition capabilities where necessary.
- Correct reactive state management.
- Robust behavior in edge cases.
- Production-ready implementation.

Completeness does not mean feature abundance.

A component with 30 unnecessary props is not more complete than a component with 8 well-designed props.

## 1.2. Core principle

**Every component must be complete within its intended responsibility, not overloaded with unrelated capabilities.**

## 1.3. Completeness versus complexity

|Complete component|Overengineered component|
|---|---|
|Covers essential use cases|Exposes every imaginable option|
|Has meaningful states|Has redundant states|
|Provides predictable behavior|Has excessive configuration|
|Supports relevant composition|Introduces unnecessary abstractions|
|Has accessible interactions|Exposes accessibility implementation details unnecessarily|
|Provides sensible defaults|Requires excessive configuration|

## 1.4. Audit checklist

- [ ] Component responsibility is clearly defined.
- [ ] Primary use cases are documented.
- [ ] Required capabilities are implemented.
- [ ] Important states are covered.
- [ ] Interaction behavior is complete.
- [ ] Accessibility requirements are satisfied.
- [ ] Composition requirements are satisfied.
- [ ] Edge cases are handled.
- [ ] No unnecessary complexity has been introduced.

---

# 2. Component Responsibility and Scope

## 2.1. Definition

Before evaluating completeness, establish exactly what the component is responsible for.

A component should solve a well-defined UI problem.

Its scope determines which features are mandatory, optional or out of scope.

## 2.2. Component specification

Every component should have a short specification containing:

|Property|Description|
|---|---|
|Purpose|What problem does it solve?|
|Category|Primitive, form, navigation, overlay, feedback, layout, etc.|
|Responsibilities|What must it handle?|
|Non-responsibilities|What should it delegate?|
|Primary use cases|How is it expected to be used?|
|Composition|Which other components does it coordinate with?|
|Interaction model|How does the user interact with it?|
|State model|Which states does it own or expose?|

## 2.3. Example: Dialog

Responsibilities:

- Display modal content.
- Manage open and closed states.
- Handle Escape.
- Manage focus.
- Provide accessible naming and description.
- Support close interactions.
- Handle outside interaction according to its dismissal policy.
- Restore focus appropriately.

Non-responsibilities:

- Implement form validation.
- Manage application routing.
- Manage business-specific data.
- Define the visual design of every dialog content element.

## 2.4. Rules

- Define component responsibilities before implementing features.
- Avoid overlapping responsibilities.
- Delegate specialized functionality to appropriate components.
- Avoid unnecessary dependencies between unrelated components.
- Keep the component's scope understandable.

## 2.5. Audit checklist

- [ ] Component purpose is explicit.
- [ ] Responsibilities are documented.
- [ ] Non-responsibilities are documented.
- [ ] Scope is appropriately limited.
- [ ] Dependencies are justified.
- [ ] Feature boundaries are clear.

---

# 3. Component Anatomy Completeness

## 3.1. Definition

Component anatomy describes the structural parts that make up a component.

A component must expose the necessary structural elements for its intended usage and customization.

## 3.2. Anatomy examples

### Button

```text
Button
├── Leading Icon (optional)
├── Label
└── Trailing Icon (optional)
```

### Input

```text
Field
├── Label
├── Description (optional)
├── Control
│   ├── Leading Content (optional)
│   ├── Input
│   └── Trailing Content (optional)
└── Error Message (optional)
```

### Dialog

```text
Dialog
├── Trigger
└── Portal
    ├── Overlay
    └── Content
        ├── Header
        │   ├── Title
        │   └── Description
        ├── Body
        └── Footer
```

### Select

```text
Select
├── Trigger
│   ├── Value
│   └── Indicator
└── Content
    ├── Group
    │   ├── Label
    │   └── Items
    └── Empty State
```

## 3.3. Anatomy evaluation

For each structural element, determine:

- Is it necessary?
- Is it optional?
- Can it be customized?
- Should it be a separate component?
- Does it need its own state?
- Does it need accessibility semantics?
- Can it be omitted without breaking the component?

## 3.4. Rules

- Define the canonical anatomy.
- Expose structural elements only when useful.
- Keep component relationships understandable.
- Avoid unnecessary nesting.
- Preserve semantic HTML.
- Ensure compound elements work together.

## 3.5. Audit checklist

- [ ] Component anatomy is documented.
- [ ] All essential structural elements exist.
- [ ] Optional elements can be omitted.
- [ ] Compound elements coordinate correctly.
- [ ] Semantic structure is correct.
- [ ] No unnecessary structural abstraction exists.

---

# 4. Functional Completeness

## 4.1. Definition

Functional completeness measures whether the component supports the essential operations associated with its purpose.

A component should not require consumers to implement missing fundamental functionality themselves.

## 4.2. Functional capability matrix

|Capability|Evaluation|
|---|---|
|Primary operation|Does the main use case work?|
|Secondary operations|Are expected secondary actions supported?|
|Configuration|Can behavior be configured appropriately?|
|State management|Can state be controlled where required?|
|Validation|Are relevant constraints handled?|
|Reset|Can state be reset when relevant?|
|Cancellation|Can operations be cancelled when relevant?|
|Error handling|Are failures handled appropriately?|
|Empty states|Are empty conditions handled?|
|Boundary conditions|Are limits handled correctly?|

Not every capability applies to every component.

## 4.3. Component-specific examples

### Input

Expected capabilities:

- Text entry.
- Controlled value.
- Uncontrolled initial value.
- Placeholder.
- Disabled state.
- Read-only state.
- Required state.
- Invalid state.
- Input type.
- Clear action where appropriate.
- Label and description integration.

### Checkbox

Expected capabilities:

- Checked state.
- Unchecked state.
- Indeterminate state where appropriate.
- Controlled state.
- Uncontrolled state.
- Disabled state.
- Keyboard interaction.
- Accessible state communication.

### Tooltip

Expected capabilities:

- Trigger interaction.
- Delayed opening.
- Closing behavior.
- Escape handling.
- Positioning.
- Collision handling.
- Accessible relationship.
- Touch and pointer considerations.

### Data Table

Expected capabilities depend on scope but may include:

- Column definitions.
- Custom cell rendering.
- Empty state.
- Loading state.
- Sorting.
- Selection.
- Pagination.
- Responsive overflow.
- Row interactions.

## 4.4. Rules

- Evaluate capabilities against the component's specification.
- Do not confuse optional enhancements with essential functionality.
- Avoid missing fundamental operations.
- Avoid implementing unrelated functionality.
- Document unsupported scenarios.

## 4.5. Audit checklist

- [ ] Primary functionality is complete.
- [ ] Secondary functionality is covered where necessary.
- [ ] Configuration capabilities are sufficient.
- [ ] State management is complete.
- [ ] Empty conditions are handled.
- [ ] Boundary conditions are handled.
- [ ] Error scenarios are handled.
- [ ] No unnecessary features exist.

---

# 5. Visual State Completeness

## 5.1. Definition

Visual state completeness measures whether every meaningful component state has an intentional visual representation.

A component must not look unfinished or ambiguous when its state changes.

## 5.2. Universal visual states

Evaluate applicability of:

|State|Expected behavior|
|---|---|
|Default|Normal appearance|
|Hover|Pointer feedback|
|Focus|Keyboard and programmatic focus feedback|
|Focus-visible|Visible keyboard focus indication|
|Active|Pressed or activated appearance|
|Disabled|Clearly unavailable appearance|
|Loading|Operation in progress|
|Invalid|Validation error appearance|
|Read-only|Non-editable but available appearance|
|Selected|Selection feedback|
|Expanded|Expanded state representation|
|Empty|No content representation|
|Error|Failure representation|

Not every state applies to every component.

For example, Loading is generally relevant to a Button but not necessarily to a static Card.

## 5.3. Visual consistency

Every state must respect the design system's visual language:

- Color tokens.
- Typography tokens.
- Spacing tokens.
- Border tokens.
- Radius tokens.
- Focus ring conventions.
- Opacity conventions.
- Motion conventions.

## 5.4. State combinations

Components must also be evaluated when multiple states coexist.

Examples:

- Disabled + Invalid.
- Focused + Invalid.
- Loading + Disabled.
- Selected + Disabled.
- Hovered + Selected.
- Expanded + Focused.

The design must define which state takes visual precedence.

## 5.5. Rules

- Define applicable visual states.
- Ensure each state has an intentional appearance.
- Use semantic design tokens.
- Preserve contrast in all states.
- Define state precedence.
- Avoid conflicting state styles.

## 5.6. Audit checklist

- [ ] Default state is complete.
- [ ] Hover state is defined where relevant.
- [ ] Focus state is defined.
- [ ] Active state is defined where relevant.
- [ ] Disabled state is defined.
- [ ] Loading state is defined where relevant.
- [ ] Validation states are defined where relevant.
- [ ] Selected and expanded states are defined where relevant.
- [ ] Combined states are tested.
- [ ] All states respect the visual language.

---

# 6. Interaction State Completeness

## 6.1. Definition

Interaction completeness measures whether the component correctly handles every meaningful interaction path.

Visual states alone are insufficient.

For example, a Button may have a beautiful focus state but still fail to activate using the keyboard.

## 6.2. Interaction dimensions

Evaluate:

- Pointer interaction.
- Mouse interaction.
- Touch interaction.
- Keyboard interaction.
- Focus navigation.
- Focus restoration.
- Outside interaction.
- Escape behavior.
- Repeated activation.
- Interrupted interaction.
- Interaction cancellation.

## 6.3. Interaction matrix

|Interaction|Evaluation|
|---|---|
|Click|Primary action works|
|Enter|Keyboard activation where appropriate|
|Space|Keyboard activation where appropriate|
|Tab|Focus navigation works|
|Shift + Tab|Reverse navigation works|
|Escape|Dismissal where appropriate|
|Arrow keys|Navigation where appropriate|
|Touch|Touch interaction works|
|Outside click|Dismissal where appropriate|
|Double activation|No unintended duplicate action|

Keyboard requirements must follow the component's semantic role and relevant interaction pattern, not an arbitrary universal key list.

## 6.4. Rules

- Follow native HTML behavior whenever possible.
- Follow established ARIA interaction patterns for custom widgets.
- Avoid unnecessary keyboard handlers.
- Define focus behavior.
- Prevent duplicate or conflicting interactions.
- Handle interrupted interactions.

## 6.5. Audit checklist

- [ ] Primary pointer interactions work.
- [ ] Keyboard interactions work.
- [ ] Focus behavior is correct.
- [ ] Touch behavior is considered.
- [ ] Dismissal behavior is correct.
- [ ] Repeated interactions are safe.
- [ ] Interrupted interactions are handled.
- [ ] Native behavior is preserved where appropriate.

---

# 7. Composition Completeness

## 7.1. Definition

Composition completeness measures whether a component can be used naturally within the broader component ecosystem.

A component should not become difficult to customize or combine with other components because of unnecessary internal restrictions.

## 7.2. Composition capabilities

Evaluate:

- Children support.
- Compound component support.
- Slot support.
- Custom content.
- Icon integration.
- Custom rendering.
- Nesting.
- Event composition.
- Ref forwarding where supported.
- Portal compatibility where relevant.

## 7.3. Example: Button

A Button should support common content configurations:

```jsx
<Button>Save</Button>

<Button>
  <SaveIcon />
  Save
</Button>

<Button>
  Save
  <ArrowRightIcon />
</Button>

<Button aria-label="Close">
  <XIcon />
</Button>
```

## 7.4. Example: Card

A Card should allow flexible composition:

```jsx
<Card>
  <Card.Header>
    <Card.Title>Project</Card.Title>
    <Card.Description>
      Project information
    </Card.Description>
  </Card.Header>

  <Card.Content>
    Main content
  </Card.Content>

  <Card.Footer>
    <Button>Open</Button>
  </Card.Footer>
</Card>
```

## 7.5. Rules

- Support natural children composition.
- Allow custom content where useful.
- Avoid restrictive internal layouts.
- Preserve accessibility relationships.
- Avoid unnecessary wrapper requirements.
- Ensure compound APIs work independently and together.

## 7.6. Audit checklist

- [ ] Children composition works.
- [ ] Custom content is supported.
- [ ] Compound components are complete where relevant.
- [ ] Icons can be integrated naturally.
- [ ] Nesting works correctly.
- [ ] Events compose correctly.
- [ ] Internal implementation does not unnecessarily restrict consumers.

---

# 8. Customization Completeness

## 8.1. Definition

Customization completeness evaluates whether consumers can adapt the component to legitimate use cases without breaking the design system.

A component should provide the appropriate extension points while protecting its fundamental visual and behavioral contract.

## 8.2. Customization dimensions

|Dimension|Example|
|---|---|
|Visual variant|Primary, secondary, outline|
|Size|Small, medium, large|
|Content|Custom children|
|Icons|Leading and trailing icons|
|Classes|Consumer class composition|
|Styling|CSS variables and design tokens|
|Rendering|Custom element or render function|
|Behavior|Relevant interaction configuration|
|Layout|Full width or alignment|

## 8.3. Customization boundaries

Prefer:

```jsx
<Button
  variant="secondary"
  size="sm"
  class="custom-class"
>
  Cancel
</Button>
```

Avoid forcing consumers to reproduce the entire component visually.

At the same time, avoid exposing dozens of low-level styling props.

## 8.4. Rules

- Provide meaningful customization points.
- Keep visual customization aligned with design tokens.
- Preserve component semantics.
- Avoid unnecessary low-level props.
- Ensure consumer classes do not break component behavior.
- Document supported extension points.

## 8.5. Audit checklist

- [ ] Essential visual customization is available.
- [ ] Content customization is possible.
- [ ] Styling extension points are defined.
- [ ] Consumer classes are handled predictably.
- [ ] Semantic behavior is preserved.
- [ ] Customization does not require internal implementation knowledge.

---

# 9. Responsive Completeness

## 9.1. Definition

Responsive completeness measures whether the component remains usable and visually coherent across supported viewport sizes and layout constraints.

A component should not assume a single desktop context.

## 9.2. Responsive scenarios

Evaluate:

- Narrow mobile viewport.
- Standard mobile viewport.
- Tablet.
- Desktop.
- Large desktop.
- Narrow parent container.
- Long content.
- Large text.
- Zoomed interface.

## 9.3. Responsive behavior

Examples:

### Dialog

- Appropriate maximum width.
- Viewport-constrained height.
- Scrollable content.
- Visible action area.
- Safe mobile positioning.

### Select

- Content remains within viewport.
- Long option labels are handled.
- Menu positioning adapts to available space.
- Touch targets remain usable.

### Data Table

- Horizontal overflow is controlled.
- Important information remains accessible.
- Column sizing remains predictable.
- Responsive alternatives are considered.

## 9.4. Rules

- Define supported viewport constraints.
- Prevent unintended overflow.
- Handle long content.
- Preserve interaction usability.
- Support constrained parent layouts.
- Do not rely exclusively on fixed dimensions.

## 9.5. Audit checklist

- [ ] Mobile layout works.
- [ ] Desktop layout works.
- [ ] Narrow containers are supported.
- [ ] Long content is handled.
- [ ] Overflow is intentional.
- [ ] Zoom and larger text are considered.
- [ ] Responsive interaction remains usable.

---

# 10. Content and Edge Case Completeness

## 10.1. Definition

A production-ready component must handle content variations and unusual but legitimate conditions.

The default demonstration is not sufficient to establish completeness.

## 10.2. Content scenarios

Evaluate:

- Empty content.
- Missing optional content.
- Very short content.
- Very long content.
- Long unbreakable strings.
- Multiline content.
- Special characters.
- Unicode.
- RTL content.
- Dynamic content changes.
- Large datasets where relevant.

## 10.3. Behavioral edge cases

Examples:

- Component unmounts while open.
- External state changes during interaction.
- A trigger disappears.
- An asynchronous operation fails.
- An option is removed while selected.
- A dialog opens while another overlay is active.
- A controlled value becomes invalid.
- An interaction is interrupted by navigation.

## 10.4. Rules

- Test realistic content variation.
- Avoid assuming static content.
- Handle missing optional elements.
- Define fallback behavior.
- Prevent invalid state combinations.
- Ensure dynamic updates remain coherent.

## 10.5. Audit checklist

- [ ] Empty content is handled.
- [ ] Long content is handled.
- [ ] Missing optional elements are handled.
- [ ] Unicode is supported.
- [ ] RTL behavior is considered.
- [ ] Dynamic content updates work.
- [ ] Invalid external state is handled.
- [ ] Unmounting during interactions is safe.
- [ ] Async failures are handled where relevant.

---

# 11. Accessibility Completeness

## 11.1. Definition

Accessibility completeness measures whether the component can be used by people with different interaction methods and accessibility needs.

Accessibility is a fundamental component requirement, not an optional enhancement.

## 11.2. Accessibility dimensions

Evaluate:

- Semantic HTML.
- Accessible naming.
- Accessible descriptions.
- Keyboard navigation.
- Focus visibility.
- Focus management.
- Screen reader announcements.
- ARIA states.
- Color contrast.
- Motion preferences.
- Touch target size.
- Zoom support.

## 11.3. Component-specific requirements

|Component|Important requirements|
|---|---|
|Button|Native button semantics, accessible name|
|Input|Label association, description, validation|
|Checkbox|Checked state, keyboard interaction|
|Select|Selection semantics, keyboard navigation|
|Dialog|Modal semantics, focus trap where modal, focus restoration|
|Tooltip|Accessible description relationship|
|Tabs|Tablist semantics, keyboard navigation|
|Accordion|Expanded state, trigger relationships|
|Menu|Appropriate menu semantics and keyboard model|

## 11.4. Rules

- Prefer native semantic elements.
- Follow relevant WAI-ARIA Authoring Practices.
- Ensure every interactive element has an accessible name.
- Ensure focus remains visible.
- Keep accessibility states synchronized with visual states.
- Respect reduced motion.
- Test with assistive technologies.

## 11.5. Audit checklist

- [ ] Correct semantic element is used.
- [ ] Accessible name exists.
- [ ] Accessible description exists where necessary.
- [ ] Keyboard navigation works.
- [ ] Focus behavior is correct.
- [ ] ARIA attributes are accurate.
- [ ] Contrast requirements are met.
- [ ] Reduced motion is respected.
- [ ] Screen reader behavior is tested.

---

# 12. Reef.js Reactivity Completeness

## 12.1. Definition

A component is not complete for Reef.js unless it correctly integrates with the framework's state and reactivity model.

This section evaluates whether the component behaves correctly under reactive updates and lifecycle transitions.

## 12.2. Reactive requirements

Evaluate:

- Controlled reactive values.
- Uncontrolled internal state.
- Derived state.
- Reactive prop changes.
- External state updates.
- Dynamic children.
- Conditional rendering.
- Subscription lifecycle.
- Event-driven updates.
- Component unmounting.
- State synchronization.

## 12.3. State ownership

Every stateful component must clearly distinguish:

|State type|Responsibility|
|---|---|
|External state|Owned by consumer|
|Internal state|Owned by component|
|Derived state|Computed from existing state|
|Transient state|Temporary interaction state|
|Shared compound state|Coordinated across related subcomponents|

## 12.4. Reactive test scenarios

Example: controlled Dialog.

```jsx
const [open, setOpen] = createSignal(false);

<Dialog
  open={open()}
  onOpenChange={setOpen}
/>
```

Test:

1. External state changes from false to true.
2. Dialog opens correctly.
3. User closes the Dialog.
4. External state becomes false.
5. External state changes again.
6. Dialog synchronizes correctly.

Example: dynamic options in Select.

1. Select receives an options collection.
2. An option is selected.
3. The collection changes reactively.
4. The selected option remains valid or falls back according to documented rules.
5. The displayed value updates correctly.

## 12.5. Lifecycle requirements

- Event listeners must be removed.
- Subscriptions must be cleaned up.
- Portals must be removed.
- Timers must be cancelled.
- Observers must be disconnected.
- Pending asynchronous operations must not update destroyed components.
- Focus restoration must not target destroyed elements.

## 12.6. Rules

- Respect Reef.js state ownership.
- Avoid duplicated sources of truth.
- Ensure external updates propagate.
- Avoid unnecessary reactive subscriptions.
- Clean up all lifecycle resources.
- Prevent stale state.
- Handle dynamic component trees.
- Keep reactive behavior predictable.

## 12.7. Audit checklist

- [ ] Controlled reactive state works.
- [ ] Uncontrolled state works.
- [ ] Derived state is correct.
- [ ] External updates propagate.
- [ ] Dynamic children are supported.
- [ ] Conditional rendering works.
- [ ] Subscriptions are cleaned up.
- [ ] Event listeners are removed.
- [ ] Unmounting is safe.
- [ ] No stale state remains.
- [ ] No unnecessary reactive computations occur.

---

# 13. Component Variants and States Coverage

## 13.1. Definition

This section measures whether the component exposes all necessary variants and states without creating redundant configurations.

## 13.2. Coverage matrix

For each component, define:

|Dimension|Examples|
|---|---|
|Variants|Primary, secondary, ghost|
|Sizes|XS, SM, MD, LG|
|States|Default, hover, focus, disabled|
|Content|Text, icon, custom content|
|Layout|Inline, full width|
|Behavior|Controlled, uncontrolled|
|Accessibility|Native, custom semantics|
|Theme|Light, dark|

## 13.3. Example: Button

```text
Button
├── Variants
│   ├── Primary
│   ├── Secondary
│   ├── Outline
│   ├── Ghost
│   └── Destructive
│
├── Sizes
│   ├── Small
│   ├── Medium
│   └── Large
│
├── States
│   ├── Default
│   ├── Hover
│   ├── Focus
│   ├── Active
│   ├── Disabled
│   └── Loading
│
└── Content
    ├── Label
    ├── Leading Icon
    ├── Trailing Icon
    └── Icon Only
```

This is a coverage model, not a requirement to implement every possible combination.

## 13.4. Rules

- Define required variants.
- Define supported sizes.
- Define applicable states.
- Define supported content configurations.
- Avoid redundant combinations.
- Ensure all documented configurations work.

## 13.5. Audit checklist

- [ ] Variants are complete.
- [ ] Sizes are complete.
- [ ] States are complete.
- [ ] Content configurations are complete.
- [ ] Theme configurations are complete.
- [ ] Invalid combinations are prevented.
- [ ] Documented configurations are tested.

---

# 14. Component Documentation Completeness

## 14.1. Definition

Documentation is part of component completeness.

A technically complete component is not production-ready if developers cannot understand how to use it.

## 14.2. Required documentation

Every component should document:

1. Purpose.
2. Basic usage.
3. API reference.
4. Variants.
5. Sizes.
6. States.
7. Controlled usage.
8. Uncontrolled usage.
9. Composition.
10. Accessibility.
11. Responsive behavior.
12. Examples.
13. Known limitations.

## 14.3. Usage examples

Provide examples covering:

- Basic usage.
- Common configuration.
- Advanced composition.
- Controlled state.
- Uncontrolled state.
- Disabled state.
- Loading or error state where relevant.
- Custom content.

## 14.4. Rules

- Document public APIs.
- Provide realistic examples.
- Explain non-obvious behavior.
- Document accessibility expectations.
- Keep documentation synchronized with implementation.

## 14.5. Audit checklist

- [ ] Purpose is documented.
- [ ] Public props are documented.
- [ ] Variants are documented.
- [ ] States are documented.
- [ ] Composition is documented.
- [ ] State ownership is documented.
- [ ] Accessibility is documented.
- [ ] Examples cover common scenarios.
- [ ] Limitations are documented.

---

# 15. Component Completeness Anti-Patterns

|Anti-pattern|Problem|Correction|
|---|---|---|
|Happy-path-only implementation|Fails in realistic scenarios|Add edge case coverage|
|Missing interaction states|Inconsistent behavior|Define state matrix|
|Visual-only disabled state|Element remains interactive|Implement semantic disabled behavior|
|Incomplete keyboard support|Accessibility failure|Follow native and ARIA patterns|
|Missing controlled behavior|Consumer cannot manage state|Implement explicit state contract|
|Missing empty state|Unfinished experience|Define empty behavior|
|Hardcoded content structure|Limited composability|Expose appropriate composition points|
|Excessive configuration|Unnecessary complexity|Provide sensible defaults|
|Fixed dimensions everywhere|Responsive failures|Support content and viewport constraints|
|Missing lifecycle cleanup|Memory leaks and stale interactions|Clean up resources|
|Incomplete documentation|Poor developer experience|Document public contract|
|Redundant variants|API proliferation|Consolidate semantic variants|
|Duplicated state|Synchronization bugs|Establish one source of truth|
|Unhandled dynamic content|Reactive inconsistency|Test external updates|

---

# 16. Component Completeness Audit Methodology

Every component must be evaluated across the following dimensions.

## 16.1. Responsibility

- Is its purpose clear?
- Are its boundaries defined?
- Are dependencies justified?

## 16.2. Anatomy

- Are all essential structural elements present?
- Is composition coherent?
- Is semantic HTML preserved?

## 16.3. Functionality

- Does it cover all primary use cases?
- Are secondary operations available where necessary?
- Are errors and empty conditions handled?

## 16.4. Visual states

- Are all relevant states defined?
- Are combined states handled?
- Are theme variations correct?

## 16.5. Interactions

- Do pointer and keyboard interactions work?
- Is focus managed correctly?
- Are dismissal and cancellation handled?

## 16.6. Composition

- Can it be customized naturally?
- Are compound elements complete?
- Are internal restrictions justified?

## 16.7. Responsive behavior

- Does it work on mobile?
- Does it handle narrow containers?
- Does it support long content?

## 16.8. Accessibility

- Are semantics correct?
- Is keyboard support complete?
- Are screen reader interactions correct?

## 16.9. Reef.js integration

- Is reactive state correct?
- Are lifecycle resources cleaned up?
- Are dynamic updates handled?

## 16.10. Documentation

- Are APIs documented?
- Are examples sufficient?
- Are limitations explicit?

---

# 17. Component Completeness Scoring

## 17.1. Global score

|Dimension|Weight|
|---|---|
|Responsibility and scope|5%|
|Anatomy|5%|
|Functional completeness|15%|
|Visual state completeness|10%|
|Interaction completeness|15%|
|Composition|10%|
|Customization|5%|
|Responsive behavior|5%|
|Content and edge cases|5%|
|Accessibility|10%|
|Reef.js reactivity|10%|
|Documentation|5%|

## 17.2. Scoring scale

|Score|Classification|Description|
|---|---|---|
|0|Missing|No implementation|
|1|Incomplete|Major missing capabilities|
|2|Partial|Basic functionality exists|
|3|Good|Production use cases are covered|
|4|Excellent|Robust, complete and well-integrated|

## 17.3. Maturity levels

|Level|Score|Status|
|---|---|---|
|L0|0–0.9|Not implemented|
|L1|1–1.9|Basic implementation|
|L2|2–2.9|Functional but incomplete|
|L3|3–3.5|Production-ready|
|L4|3.6–4|Mature|

## 17.4. Critical constraints

A component cannot be classified as production-ready if it has critical failures in:

- Core functionality.
- Keyboard interaction.
- Essential accessibility.
- Controlled state synchronization.
- Lifecycle cleanup.
- Runtime stability.

A high average score cannot compensate for a critical defect.

---

# 18. Component Remediation Priorities

Corrections should be prioritized in the following order:

## P0 — Critical

Issues preventing safe or correct usage.

Examples:

- Broken core functionality.
- Incorrect state synchronization.
- Keyboard interaction failures.
- Accessibility blockers.
- Runtime errors.
- Memory leaks.

## P1 — High

Important missing capabilities.

Examples:

- Missing essential states.
- Incomplete composition.
- Incorrect responsive behavior.
- Missing empty or error states.
- Inconsistent interaction feedback.

## P2 — Medium

Quality and usability improvements.

Examples:

- Additional useful variants.
- Improved customization.
- Better content handling.
- Improved documentation.
- Better TypeScript ergonomics.

## P3 — Low

Polish and optional improvements.

Examples:

- Minor API refinements.
- Additional convenience props.
- Non-essential customization.
- Small documentation improvements.

---

# 19. Final Acceptance Criteria

A component is considered complete when:

- Its responsibility and scope are documented.
- Its anatomy is defined.
- Its primary functionality is implemented.
- Its relevant visual states are complete.
- Its interaction patterns are correct.
- Its keyboard behavior is correct.
- Its composition capabilities are sufficient.
- Its customization options are appropriate.
- Its responsive behavior is reliable.
- Its edge cases are handled.
- Its accessibility requirements are satisfied.
- Its Reef.js reactive behavior is correct.
- Its lifecycle cleanup is reliable.
- Its public API is documented.
- Its test coverage is sufficient.
- No critical production defect remains.

---

# 20. Final Principle

**A complete component is not the component with the most features. It is the component that reliably fulfills its intended purpose across realistic usage scenarios.**

Completeness should be measured by the quality and coverage of its responsibilities, not by the size of its API.

Every component must feel finished, predictable and dependable, both visually and technically.

The goal is to make the library feel like a cohesive ecosystem rather than a collection of isolated UI implementations.