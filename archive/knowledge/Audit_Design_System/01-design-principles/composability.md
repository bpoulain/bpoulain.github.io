# Composability

> **Purpose:** Define how UI components can be combined, extended, customized and orchestrated while preserving visual consistency, behavioral predictability, accessibility and API coherence.
> 
> **Scope:** Component composition, primitive composition, compound components, slots, children, controlled and uncontrolled state, customization, extensibility, component boundaries, polymorphism, variants, composition patterns and framework integration.
> 
> **Related principles:** Minimalism, Functional Density, Geometric Consistency, Progressive Disclosure, Interaction Feedback, Motion and Visual Hierarchy.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.
> 
> **Framework context:** Reef.js — state-based reactive framework.

---

# 1. Composability Philosophy

## 1.1. Definition

Composability is the ability to combine independent UI components into more complex interfaces without breaking their individual responsibilities.

A composable component should:

- Work independently.
- Be combined with other components.
- Expose a predictable API.
- Accept external content.
- Support controlled customization.
- Preserve its internal behavior.
- Maintain accessibility.
- Remain consistent with the design system.

Composition must be preferred over unnecessary component duplication and monolithic abstractions.

### Core principle

**Components should provide capabilities, not impose complete interface structures.**

## 1.2. Expected characteristics

A composable design system must favor:

- Independence.
- Reusability.
- Explicit composition.
- Predictable APIs.
- Flexible content.
- Controlled extensibility.
- Separation of concerns.
- Behavioral consistency.
- Visual consistency.
- Progressive complexity.

Avoid:

- Monolithic components.
- Excessive configuration props.
- Implicit component relationships.
- Hidden dependencies.
- Tight coupling.
- Unnecessary component duplication.
- Arbitrary internal DOM structures.
- Composition that breaks accessibility.
- Customization that bypasses design tokens.

## 1.3. Composition versus configuration

Composition and configuration are two different mechanisms.

|Configuration|Composition|
|---|---|
|Changes predefined behavior|Combines independent capabilities|
|Uses props and variants|Uses component relationships|
|Selects predefined presentation|Allows custom structures|
|Works within predefined boundaries|Creates new interface structures|
|Example: `Button variant="outline"`|Example: `Dialog.Trigger` + `Dialog.Content`|

Both are necessary.

However, configuration should not become a substitute for composition.

A component with 25 boolean props is often a sign that several responsibilities should be separated.

## 1.4. Rules

- Prefer composition when interface structure varies significantly.
- Prefer variants when only presentation changes.
- Prefer props for simple behavioral configuration.
- Keep component responsibilities explicit.
- Avoid components that accumulate unrelated responsibilities.
- Do not force developers to recreate existing primitives.
- Preserve component behavior regardless of composition structure.

## 1.5. Audit checklist

- [ ] Components can work independently.
- [ ] Components can be combined.
- [ ] Responsibilities are clearly separated.
- [ ] Configuration and composition are not confused.
- [ ] Excessive boolean props are avoided.
- [ ] Components do not impose unnecessary structures.
- [ ] Composition preserves behavior and accessibility.

---

# 2. Component Independence

## 2.1. Definition

A component must have a clearly defined responsibility and should not depend unnecessarily on the internal implementation of another component.

Independence does not mean that components cannot communicate.

It means their relationships must be explicit and based on stable contracts.

## 2.2. Expected behavior

A Button should not depend on a Dialog.

A Dialog should not depend on a particular Button implementation.

A Dropdown should not require a specific Icon component.

A Card should not require a specific Typography component.

These components may be composed together, but each should remain independently usable.

## 2.3. Good composition

```tsx
<Card>
  <Card.Header>
    <Heading>Account settings</Heading>
    <Text>Manage your account.</Text>
  </Card.Header>

  <Card.Content>
    <Input />
  </Card.Content>

  <Card.Footer>
    <Button variant="outline">
      Cancel
    </Button>

    <Button>
      Save changes
    </Button>
  </Card.Footer>
</Card>
```

The Card provides structural organization.

Heading, Text, Input and Button remain independent components.

## 2.4. Bad composition

```tsx
<AccountSettingsCard
  title="Account settings"
  description="Manage your account."
  inputType="email"
  showCancelButton
  showSaveButton
  cancelLabel="Cancel"
  saveLabel="Save changes"
/>
```

This may be appropriate as a domain-specific application component, but it should not become a foundational design-system primitive.

## 2.5. Rules

- Avoid unnecessary dependencies between components.
- Keep foundational components independently usable.
- Avoid importing high-level components into low-level primitives.
- Prefer explicit relationships.
- Separate design-system components from application-specific compositions.
- Do not introduce abstractions solely to avoid a few lines of markup.

## 2.6. Audit checklist

- [ ] Each component has a defined responsibility.
- [ ] Components work independently.
- [ ] Dependencies are explicit.
- [ ] Low-level components do not depend on high-level components.
- [ ] Domain-specific components are separated from foundational primitives.

---

# 3. Primitive-Based Architecture

## 3.1. Definition

Complex components should be built from smaller, reusable primitives.

A primitive provides a focused capability that can be reused across multiple components.

Examples:

|Primitive|Responsibility|
|---|---|
|Button|Action|
|Text|Text presentation|
|Icon|Icon presentation|
|Separator|Visual separation|
|Label|Field labeling|
|Portal|DOM placement|
|VisuallyHidden|Accessible hidden content|
|Slot|Controlled composition|
|FocusScope|Focus management|
|Presence|Mount and unmount lifecycle|
|DismissableLayer|Outside interaction and dismissal|

Not every primitive needs to be publicly exposed.

Some can remain internal implementation details.

## 3.2. Composition hierarchy

A useful architecture separates four levels.

```text
FOUNDATIONAL PRIMITIVES
        |
        v
BEHAVIORAL PRIMITIVES
        |
        v
COMPOSITE COMPONENTS
        |
        v
APPLICATION COMPOSITIONS
```

### Level 1 — Foundational primitives

Small reusable building blocks.

Examples:

- Button.
- Icon.
- Text.
- Label.
- Separator.

### Level 2 — Behavioral primitives

Reusable interaction capabilities.

Examples:

- Focus management.
- Popover positioning.
- Dismissal.
- Keyboard navigation.
- Presence.
- Selection management.

### Level 3 — Composite components

Components combining multiple primitives and behaviors.

Examples:

- Dialog.
- Dropdown Menu.
- Select.
- Combobox.
- Tooltip.
- Command Palette.

### Level 4 — Application compositions

Domain-specific structures.

Examples:

- User settings panel.
- Project navigation.
- Search toolbar.
- Data table toolbar.
- Authentication form.

## 3.3. Rules

- Build complex components from reusable capabilities.
- Avoid duplicating behavioral logic.
- Keep primitive responsibilities narrow.
- Separate behavior from visual presentation where appropriate.
- Do not expose every internal primitive automatically.
- Avoid abstraction layers that add complexity without reuse.

## 3.4. Audit checklist

- [ ] A clear component hierarchy exists.
- [ ] Reusable primitives are identified.
- [ ] Behavioral logic is shared where appropriate.
- [ ] Composite components reuse foundational capabilities.
- [ ] Application-specific structures are not incorrectly promoted to foundational components.

---

# 4. Compound Components

## 4.1. Definition

Compound components are groups of related components that work together to provide a unified interaction.

They allow developers to control the structure of a component while preserving its shared behavior.

This pattern is particularly useful for complex interactive components.

Examples:

- Dialog.
- Dropdown Menu.
- Tabs.
- Accordion.
- Select.
- Navigation Menu.
- Radio Group.

## 4.2. Example

```tsx
<Dialog>
  <Dialog.Trigger>
    Open settings
  </Dialog.Trigger>

  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>
        Settings
      </Dialog.Title>

      <Dialog.Description>
        Manage your preferences.
      </Dialog.Description>
    </Dialog.Header>

    <Dialog.Footer>
      <Dialog.Close>
        Cancel
      </Dialog.Close>

      <Button>
        Save
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

The developer controls the structure.

The Dialog system manages:

- Open and closed state.
- Focus management.
- Escape key handling.
- Outside interaction.
- Accessibility attributes.
- Overlay lifecycle.
- Portal behavior.

## 4.3. Compound component requirements

Related components must share a coherent behavioral contract.

For example:

|Part|Responsibility|
|---|---|
|Dialog.Root|Shared state and context|
|Dialog.Trigger|Opens the Dialog|
|Dialog.Content|Displays the Dialog|
|Dialog.Title|Accessible title|
|Dialog.Description|Accessible description|
|Dialog.Close|Closes the Dialog|
|Dialog.Overlay|Backdrop|

Not every component needs every part.

The public API should expose only meaningful composition points.

## 4.4. Context and relationships

Compound components may need a shared state mechanism.

For example:

```text
Dialog.Root
    |
    +-- Dialog.Trigger
    |
    +-- Dialog.Content
           |
           +-- Dialog.Title
           |
           +-- Dialog.Description
           |
           +-- Dialog.Close
```

The relationship between these parts must be explicit and predictable.

Avoid relying on accidental DOM structure or undocumented global state.

## 4.5. Rules

- Use compound components for genuinely related structures.
- Share state through an explicit mechanism.
- Keep individual parts focused.
- Allow flexible child composition.
- Preserve accessibility relationships.
- Provide meaningful errors for invalid compositions.
- Avoid excessive nesting.
- Document which parts are required and optional.

## 4.6. Audit checklist

- [ ] Compound components have a clear root.
- [ ] Shared state is correctly managed.
- [ ] Component relationships are explicit.
- [ ] Parts can be composed flexibly.
- [ ] Invalid compositions are handled predictably.
- [ ] Accessibility relationships are preserved.
- [ ] Public APIs remain understandable.

---

# 5. Slots and Content Composition

## 5.1. Definition

A slot is an explicit insertion point where developers can provide custom content.

Slots allow a component to provide a structural foundation without controlling every element inside it.

This is essential for flexible components.

## 5.2. Example

```tsx
<Card>
  <Card.Header>
    <div class="flex items-center gap-2">
      <Avatar />
      <div>
        <Heading>Project Alpha</Heading>
        <Text>Updated recently</Text>
      </div>
    </div>
  </Card.Header>

  <Card.Content>
    <CustomChart />
  </Card.Content>

  <Card.Footer>
    <CustomActions />
  </Card.Footer>
</Card>
```

The Card provides structural slots.

The application provides the actual content.

## 5.3. Slot design principles

Slots should:

- Accept arbitrary valid child content.
- Preserve the parent's structural responsibility.
- Avoid imposing unnecessary markup.
- Maintain predictable spacing.
- Support accessible composition.
- Work with reactive content.
- Remain independent of specific child components.

## 5.4. Slot API

A component may expose named slots:

```tsx
<Card
  header={<CardHeader />}
  footer={<CardFooter />}
>
  <CardContent />
</Card>
```

Or compound components:

```tsx
<Card>
  <Card.Header />
  <Card.Content />
  <Card.Footer />
</Card>
```

These are alternative composition strategies.

The library should choose the most appropriate pattern based on framework capabilities and component complexity.

## 5.5. Rules

- Provide slots where content structure needs flexibility.
- Avoid slots for trivial components.
- Avoid excessive named slots.
- Do not force specific child component types unnecessarily.
- Define slot behavior clearly.
- Preserve accessibility and layout contracts.

## 5.6. Audit checklist

- [ ] Components expose appropriate insertion points.
- [ ] Custom content can be supplied.
- [ ] Slots preserve structural consistency.
- [ ] Slot APIs are not unnecessarily complex.
- [ ] Reactive child content works correctly.
- [ ] Accessibility is preserved.

---

# 6. Controlled and Uncontrolled Components

## 6.1. Definition

A composable component must provide a predictable state ownership model.

There are two principal approaches.

### Controlled

The parent owns the state.

```tsx
const [open, setOpen] = createSignal(false);

<Dialog
  open={open()}
  onOpenChange={setOpen}
>
  ...
</Dialog>
```

### Uncontrolled

The component owns its internal state.

```tsx
<Dialog defaultOpen={false}>
  ...
</Dialog>
```

The exact syntax depends on Reef.js.

## 6.2. Expected behavior

A component should clearly distinguish:

- Current state.
- Initial state.
- State change notification.
- Internal state ownership.

Avoid APIs where `open` sometimes means initial state and sometimes means controlled state.

## 6.3. Rules

- Controlled state must remain controlled.
- Uncontrolled state must remain internally managed.
- Initial values must not continuously overwrite user interaction.
- State ownership must be explicit.
- State transitions must be predictable.
- Controlled and uncontrolled modes must not conflict.
- Callback behavior must be documented.

## 6.4. Audit checklist

- [ ] Controlled mode exists where appropriate.
- [ ] Uncontrolled mode exists where appropriate.
- [ ] Initial and current values are distinguished.
- [ ] State ownership is predictable.
- [ ] State change callbacks are consistent.
- [ ] No synchronization loops occur.
- [ ] Reef.js reactivity remains correct.

---

# 7. Customization Without Breaking Consistency

## 7.1. Definition

Composability requires customization.

However, customization must not allow arbitrary changes that destroy the design system's visual and behavioral consistency.

A good component exposes controlled extension points.

## 7.2. Customization hierarchy

Prefer customization in this order:

1. Semantic variants.
2. Component size.
3. Component-specific props.
4. Slots and children.
5. Design-token overrides.
6. Explicit extension APIs.
7. Custom component implementation.

Avoid requiring consumers to override internal styles or implementation details.

## 7.3. Example

```tsx
<Button
  variant="outline"
  size="sm"
  disabled={false}
>
  Save changes
</Button>
```

For more complex customization:

```tsx
<Dialog.Content>
  <CustomDialogLayout />
</Dialog.Content>
```

## 7.4. CSS customization

Components should expose stable styling hooks.

Examples:

```css
.dialog-content {}
.dialog-overlay {}
.button {}
.button[data-variant="outline"] {}
.button[data-size="sm"] {}
```

Consumers should not need to target fragile internal DOM selectors.

## 7.5. Rules

- Expose meaningful customization points.
- Prefer semantic variants over arbitrary styling props.
- Avoid excessive boolean variants.
- Preserve token consistency.
- Avoid relying on internal class names.
- Document supported extension points.
- Do not make every internal element customizable by default.

## 7.6. Audit checklist

- [ ] Variants cover legitimate presentation differences.
- [ ] Customization APIs are documented.
- [ ] Styling hooks are stable.
- [ ] Consumers can provide custom content.
- [ ] Internal implementation details are not required.
- [ ] Customization does not break accessibility.
- [ ] Token consistency is preserved.

---

# 8. Polymorphism and Element Flexibility

## 8.1. Definition

Polymorphism allows a component to adapt its underlying HTML element or behavior without changing its visual identity.

For example, a styled Button may need to render as a link.

## 8.2. Example

```tsx
<Button>
  Save
</Button>
```

```tsx
<Button as="a" href="/settings">
  Settings
</Button>
```

The visual presentation can remain consistent while the semantic element changes.

## 8.3. Semantic requirements

Polymorphism must preserve the correct HTML semantics.

A link must behave like a link.

A button must behave like a button.

Changing the rendered element must not automatically transfer inappropriate behavior.

Examples:

- Links navigate.
- Buttons trigger actions.
- Inputs accept values.
- Headings communicate document hierarchy.

## 8.4. Rules

- Support polymorphism only where it adds meaningful value.
- Preserve semantic HTML.
- Do not turn every component into an arbitrary element.
- Maintain appropriate keyboard behavior.
- Avoid invalid attribute forwarding.
- Ensure types reflect the rendered element.
- Keep accessibility requirements explicit.

## 8.5. Audit checklist

- [ ] Polymorphism is used selectively.
- [ ] HTML semantics remain correct.
- [ ] Attributes are forwarded appropriately.
- [ ] Keyboard interactions remain correct.
- [ ] Type definitions reflect the rendered element.
- [ ] Invalid element combinations are prevented where possible.

---

# 9. Component Boundaries and Responsibilities

## 9.1. Definition

Every component must have a clear boundary.

A component should own only the responsibilities necessary to fulfill its purpose.

Poorly defined boundaries lead to monolithic components, duplicated behavior and difficult maintenance.

## 9.2. Example: Dialog

A Dialog may own:

- Visibility state.
- Focus management.
- Escape handling.
- Overlay interaction.
- Accessibility relationships.
- Presence lifecycle.

It should not own:

- Form validation.
- API requests.
- Business rules.
- Application navigation.
- Specific domain data.

## 9.3. Rules

- Separate UI behavior from business logic.
- Keep components focused.
- Avoid unrelated responsibilities.
- Extract reusable behaviors when appropriate.
- Avoid unnecessary abstraction.
- Keep component boundaries stable.

## 9.4. Audit checklist

- [ ] Component responsibilities are explicit.
- [ ] Business logic is not embedded in generic UI primitives.
- [ ] Reusable behaviors are separated.
- [ ] Components do not duplicate unrelated responsibilities.
- [ ] Boundaries remain understandable.

---

# 10. Composition and Design Tokens

## 10.1. Definition

Composition must preserve the design system's visual language.

A component should not lose its visual consistency simply because it is combined with other components.

Spacing, color, typography, surfaces and geometry must remain governed by shared tokens.

## 10.2. Expected behavior

For example:

```tsx
<Card>
  <Card.Header>
    <Heading>Notifications</Heading>
  </Card.Header>

  <Card.Content>
    <Switch />
    <Text>Enable notifications</Text>
  </Card.Content>
</Card>
```

The Card and its children must maintain coherent:

- Spacing.
- Typography.
- Color.
- Alignment.
- Border treatment.
- Focus behavior.

## 10.3. Rules

- Use semantic tokens across composed components.
- Avoid arbitrary spacing overrides.
- Define predictable internal spacing.
- Ensure nested surfaces remain coherent.
- Avoid conflicting typography defaults.
- Preserve light and dark theme consistency.
- Avoid visual coupling between unrelated components.

## 10.4. Audit checklist

- [ ] Composed components use shared tokens.
- [ ] Nested spacing is coherent.
- [ ] Typography remains consistent.
- [ ] Surface treatments are compatible.
- [ ] Dark and light themes remain coherent.
- [ ] No arbitrary styling is required for basic composition.

---

# 11. Composition and Layout Ownership

## 11.1. Definition

A component must clearly define which aspects of layout it controls and which aspects remain the responsibility of its parent.

This distinction is essential for predictable composition.

## 11.2. Example

A Button should control:

- Internal alignment.
- Icon-to-label spacing.
- Content centering.
- Minimum interaction dimensions.

Its parent should control:

- Position in the page.
- External margins.
- Grid placement.
- Flex distribution.
- Overall layout.

A Card should control its internal structure but should not dictate the entire page layout.

## 11.3. Rules

- Components own internal layout.
- Parents own external layout.
- Avoid unexpected external margins.
- Avoid hardcoded page positioning.
- Avoid assumptions about parent display mode.
- Document intrinsic sizing behavior.
- Make stretch and full-width behavior explicit.

## 11.4. Audit checklist

- [ ] Internal and external layout responsibilities are separated.
- [ ] Components do not impose unexpected margins.
- [ ] Parent layouts remain flexible.
- [ ] Intrinsic dimensions are predictable.
- [ ] Full-width behavior is explicit.
- [ ] Components work in flex and grid contexts.

---

# 12. Composition and Accessibility

## 12.1. Definition

Composition must not break accessibility.

A component can be visually correct and functionally composable while still producing an inaccessible interface.

Accessibility must therefore be preserved across component boundaries.

## 12.2. Requirements

- Semantic HTML.
- Correct ARIA relationships.
- Predictable focus management.
- Keyboard navigation.
- Accessible naming.
- Appropriate heading hierarchy.
- Correct form associations.
- Logical reading order.
- No nested interactive controls.
- Correct disabled and expanded states.

## 12.3. Example: Dialog

The following composition must establish valid relationships:

```tsx
<Dialog>
  <Dialog.Trigger>
    Open dialog
  </Dialog.Trigger>

  <Dialog.Content>
    <Dialog.Title>
      Delete project
    </Dialog.Title>

    <Dialog.Description>
      This action cannot be undone.
    </Dialog.Description>
  </Dialog.Content>
</Dialog>
```

The Dialog must correctly associate its title and description with its accessible container.

These relationships must not depend on the developer manually managing internal identifiers.

## 12.4. Rules

- Accessibility must survive arbitrary valid composition.
- Manage generated IDs consistently.
- Prevent invalid interactive nesting.
- Preserve logical focus order.
- Make semantic relationships explicit.
- Test composed interfaces, not only isolated components.

## 12.5. Audit checklist

- [ ] Composition preserves semantic HTML.
- [ ] ARIA relationships remain valid.
- [ ] Focus management works.
- [ ] Keyboard navigation is preserved.
- [ ] Accessible names are correctly generated.
- [ ] Interactive nesting is valid.
- [ ] Composed interfaces are tested with assistive technologies.

---

# 13. Composition and Keyboard Interaction

## 13.1. Definition

Composite components often require coordinated keyboard behavior.

The individual parts must cooperate to provide a consistent interaction model.

Examples:

- Tabs with arrow-key navigation.
- Menus with directional navigation.
- Comboboxes with selection navigation.
- Dialogs with focus trapping.
- Accordions with optional keyboard navigation.

## 13.2. Rules

- Define keyboard ownership at the composite level.
- Avoid conflicting keyboard handlers.
- Preserve native browser behavior where appropriate.
- Ensure focus movement is predictable.
- Support nested components.
- Avoid duplicate event handling.

## 13.3. Audit checklist

- [ ] Composite keyboard behavior is documented.
- [ ] Nested components do not conflict.
- [ ] Focus ownership is explicit.
- [ ] Keyboard navigation is predictable.
- [ ] Native interactions are preserved where appropriate.

---

# 14. Composition and Reactive State in Reef.js

## 14.1. Definition

Composition must work naturally with Reef.js reactivity.

A component must remain synchronized with its reactive dependencies regardless of how deeply it is composed.

The design system must not require developers to manually synchronize internal DOM state.

## 14.2. Core requirements

- Reactive props must remain reactive.
- Child content must update correctly.
- Shared component state must remain synchronized.
- Event propagation must be predictable.
- Derived state must not become duplicated state.
- Subscriptions must be cleaned up.
- Component disposal must release resources.
- Nested components must not introduce stale references.

## 14.3. Example

Conceptual example:

```tsx
const [selected, setSelected] = createSignal("overview");

<Tabs value={selected()} onValueChange={setSelected}>
  <Tabs.List>
    <Tabs.Trigger value="overview">
      Overview
    </Tabs.Trigger>

    <Tabs.Trigger value="activity">
      Activity
    </Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="overview">
    <OverviewPanel />
  </Tabs.Content>

  <Tabs.Content value="activity">
    <ActivityPanel />
  </Tabs.Content>
</Tabs>
```

The Tabs component must coordinate:

- Active selection.
- Trigger state.
- Panel visibility.
- Keyboard navigation.
- Accessibility attributes.

All of these must remain synchronized with Reef.js state.

## 14.4. Reactivity anti-patterns

Avoid:

- Reading reactive values only once during initialization.
- Copying controlled props into internal state without synchronization rules.
- Maintaining duplicated selected states.
- Creating subscriptions without cleanup.
- Capturing stale values in event handlers.
- Updating the DOM independently of the reactive rendering model.
- Making child components dependent on render order unless explicitly documented.

## 14.5. Rules

- Treat Reef.js reactivity as the source of truth.
- Avoid duplicated state.
- Keep shared state ownership explicit.
- Ensure reactive updates propagate through compound components.
- Clean up subscriptions and effects.
- Avoid hidden global state.
- Make composition independent of incidental rendering behavior.

## 14.6. Audit checklist

- [ ] Reactive props remain reactive.
- [ ] Controlled state remains synchronized.
- [ ] Derived state is not duplicated unnecessarily.
- [ ] Compound component state is consistent.
- [ ] Nested composition does not create stale references.
- [ ] Subscriptions are cleaned up.
- [ ] Component disposal is correct.
- [ ] DOM updates remain compatible with Reef.js.

---

# 15. Composition and API Design

## 15.1. Definition

The composition model must be reflected in a coherent public API.

Developers should be able to understand how components fit together without inspecting their internal implementation.

## 15.2. API characteristics

A good composition API must be:

- Discoverable.
- Predictable.
- Consistent.
- Explicit.
- Type-safe.
- Documented.
- Extensible.

## 15.3. Naming consistency

Related components should follow consistent naming conventions.

Example:

```tsx
Dialog.Root
Dialog.Trigger
Dialog.Content
Dialog.Title
Dialog.Description
Dialog.Close
```

Or a flattened namespace:

```tsx
Dialog
DialogTrigger
DialogContent
DialogTitle
DialogDescription
DialogClose
```

Both approaches are valid.

The important requirement is consistency throughout the library.

## 15.4. Rules

- Standardize compound component naming.
- Standardize root and child responsibilities.
- Avoid unnecessary API variation.
- Keep required props explicit.
- Provide useful type definitions.
- Avoid undocumented implicit behavior.
- Make component relationships easy to discover.

## 15.5. Audit checklist

- [ ] Naming conventions are consistent.
- [ ] Root components are clearly identifiable.
- [ ] Child component responsibilities are documented.
- [ ] Public APIs are predictable.
- [ ] Types support valid composition.
- [ ] Invalid composition is detected where possible.
- [ ] Examples cover realistic use cases.

---

# 16. Composition Anti-Patterns

|Anti-pattern|Problem|Expected correction|
|---|---|---|
|Monolithic components|Too many responsibilities|Split into composable parts|
|Excessive boolean props|API complexity|Use variants or composition|
|Tight coupling|Components cannot be reused independently|Introduce explicit contracts|
|Excessive configuration|Difficult to understand|Prefer composition|
|Arbitrary child restrictions|Limits extensibility|Accept flexible content|
|Hidden shared state|Unpredictable dependencies|Use explicit state ownership|
|Internal DOM dependencies|Fragile implementation|Use stable composition APIs|
|Uncontrolled styling overrides|Visual inconsistency|Use semantic tokens|
|Unnecessary polymorphism|Semantic ambiguity|Support selectively|
|Business logic in primitives|Poor separation of concerns|Move logic to application layer|
|Duplicated interaction logic|Inconsistent behavior|Extract behavioral primitives|
|Over-abstraction|Unnecessary complexity|Keep abstractions justified|
|Nested interactive elements|Accessibility failure|Define correct semantic boundaries|
|Reactive state duplication|Synchronization bugs|Establish one source of truth|
|Parent-controlled internal layout|Reduced flexibility|Separate internal and external layout|

---

# 17. Composability Audit Methodology

Every component must be audited across the following dimensions.

## 17.1. Independence

- Can the component work independently?
- Does it depend on unrelated components?
- Are its responsibilities clearly defined?

## 17.2. Composition

- Can developers insert custom content?
- Can the component be combined with other components?
- Are compound relationships explicit?
- Are composition points sufficient?

## 17.3. Flexibility

- Can consumers customize meaningful aspects?
- Are variants sufficient?
- Are slots available where necessary?
- Are extension points stable?

## 17.4. API consistency

- Are naming conventions coherent?
- Are controlled and uncontrolled modes consistent?
- Are component contracts predictable?
- Are types accurate?

## 17.5. Visual consistency

- Does composition preserve design tokens?
- Is spacing coherent?
- Does nested composition preserve hierarchy?
- Are surface treatments compatible?

## 17.6. Accessibility

- Does composition preserve semantic structure?
- Are focus relationships correct?
- Are keyboard interactions coordinated?
- Are ARIA relationships maintained?

## 17.7. Reef.js integration

- Does reactivity propagate correctly?
- Is state ownership explicit?
- Are subscriptions cleaned up?
- Are nested updates reliable?
- Does component disposal work correctly?

---

# 18. Composability Scoring

Each component must receive a score from 0 to 4 across eight dimensions.

|Dimension|Weight|
|---|---|
|Independence|15%|
|Composition flexibility|20%|
|API consistency|15%|
|Customization|10%|
|State ownership|10%|
|Visual consistency|10%|
|Accessibility|10%|
|Reef.js integration|10%|

### Scoring scale

|Score|Classification|Description|
|---|---|---|
|0|Missing|Component cannot be meaningfully composed|
|1|Poor|Tightly coupled or severely restrictive|
|2|Partial|Basic composition with significant limitations|
|3|Good|Flexible, predictable and consistent|
|4|Excellent|Highly composable, extensible and fully integrated|

Weighted score:

`(Independence × 0.15) + (Composition × 0.20) + (API × 0.15) + (Customization × 0.10) + (State × 0.10) + (Visual × 0.10) + (Accessibility × 0.10) + (Reef × 0.10)`

### Mandatory constraints

A component cannot be considered compliant if:

- Composition produces invalid interactive nesting.
- Reactive state becomes inconsistent.
- Accessibility relationships are broken.
- Its public API requires undocumented internal knowledge.
- Component disposal leaves active subscriptions or listeners.
- Controlled state cannot be reliably synchronized.

---

# 19. Remediation Guidelines

When a component fails the composability audit, apply corrections in this order:

1. Identify the component's primary responsibility.
2. Remove unrelated responsibilities.
3. Identify reusable foundational primitives.
4. Separate behavioral logic from presentation where appropriate.
5. Define component boundaries.
6. Introduce compound components when justified.
7. Introduce slots for variable content.
8. Standardize controlled and uncontrolled behavior.
9. Reduce excessive configuration props.
10. Define stable customization points.
11. Validate semantic HTML and accessibility.
12. Validate Reef.js reactive state propagation.
13. Verify lifecycle and cleanup.
14. Test composition in realistic application interfaces.

Do not attempt to make every component infinitely customizable.

The goal is to expose the right amount of flexibility without sacrificing simplicity.

---

# 20. Final Acceptance Criteria

The composability system is considered successfully implemented when:

- Foundational components are independently usable.
- Complex components are built from reusable capabilities.
- Component responsibilities are clearly separated.
- Compound components expose predictable APIs.
- Slots support meaningful content customization.
- Controlled and uncontrolled state are consistently implemented.
- Customization does not compromise visual consistency.
- Polymorphism preserves semantic HTML.
- Internal and external layout responsibilities are separated.
- Accessibility survives composition.
- Keyboard interactions remain predictable.
- Design tokens remain consistent across composed interfaces.
- Reef.js reactive state propagates correctly.
- Component lifecycle and cleanup remain reliable.
- Developers can build complex interfaces without modifying internal component implementations.

---

# 21. Final Principle

Composability is not simply the ability to nest components.

It is the ability to combine independent capabilities into coherent interfaces while preserving their individual responsibilities.

A good component provides a useful capability.

A good composition system allows those capabilities to become something greater without introducing unnecessary complexity.

**The objective is not to create components that do everything. It is to create components that work exceptionally well together.**