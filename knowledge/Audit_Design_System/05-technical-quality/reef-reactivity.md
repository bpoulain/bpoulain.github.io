# Reef Reactivity Guidelines

> **Purpose:** Define the technical standards for integrating UI components with Reef.js reactivity.
> 
> **Scope:** State management, reactive updates, derived state, subscriptions, rendering, lifecycle, event handling, synchronization, DOM ownership and performance.
> 
> **Framework:** Reef.js — state-based reactive framework.
> 
> **Design direction:** Predictable, explicit, efficient and state-driven.
> 
> **Code examples:** Illustrative pseudo-code. `signal`, `computed` and `effect` are not a Nodus API. See `07-nodus-adapter/adapter.md`.

---

# 1. Reactivity Philosophy

## 1.1. Definition

Reactivity defines how changes in application or component state propagate to the user interface.

A reactive UI component must:

- Reflect state changes correctly.
- Update only the necessary DOM elements.
- Maintain consistency between internal and external state.
- Avoid unnecessary computations.
- Clean up reactive subscriptions.
- Preserve interaction behavior during updates.
- Remain predictable under rapid state changes.

Reactivity is not simply the ability to update the DOM when a variable changes.

It is a contract between component state, framework state and rendered output.

## 1.2. Core Principles

### Principle 1 — State Is the Source of Truth

The rendered UI must reflect the authoritative component state.

Avoid maintaining multiple independent representations of the same information.

For example, a Checkbox should not maintain one internal checked value while its parent independently maintains another without an explicit synchronization contract.

### Principle 2 — Reactivity Must Be Predictable

Given the same state and inputs, the component must produce the same UI.

Avoid hidden dependencies, implicit synchronization and side effects that make updates difficult to reason about.

### Principle 3 — Update Only What Changes

A state change should update only the necessary part of the component.

Avoid unnecessary DOM replacement, full component reconstruction and unrelated reactive computations.

### Principle 4 — Separate State, Behavior and Presentation

A component should distinguish:

- State: what the component currently represents.
- Behavior: how the component responds to interactions.
- Presentation: how the current state is rendered.

These responsibilities should not become tightly coupled.

### Principle 5 — External and Internal State Must Have Explicit Ownership

A component must clearly define whether its state is:

- Controlled externally.
- Managed internally.
- Initialized externally but managed internally afterward.
- Derived from another reactive source.

Never allow ambiguous state ownership.

### Principle 6 — Lifecycle Must Be Explicit

Every subscription, effect, listener, observer and asynchronous operation must have a defined lifecycle.

### Principle 7 — Reactivity Must Not Compromise Interaction

A reactive update must not unexpectedly:

- Reset keyboard focus.
- Interrupt text input.
- Reset selection.
- Close an active overlay.
- Reinitialize a component unnecessarily.
- Cancel an ongoing interaction.

### Principle 8 — Reactive Behavior Must Scale

The architecture must remain efficient when components are nested, repeated or used in large collections.

---

# 2. State Ownership

State ownership is one of the most important architectural decisions in a component library.

## 2.1. Controlled Components

A controlled component receives its authoritative state from its parent.

Example:

```js
const checked = signal(false);

Checkbox({
  checked,
  onCheckedChange: (value) => {
    checked.set(value);
  }
});
```

The parent owns the state.

The component communicates user interactions but does not independently determine the authoritative value.

Requirements:

- External state changes must update the component.
- User interactions must communicate proposed changes.
- The component must not silently override external state.
- The component must not maintain a conflicting internal copy.

## 2.2. Uncontrolled Components

An uncontrolled component manages its own state.

Example:

```js
Checkbox({
  defaultChecked: true,
  onCheckedChange: (value) => {
    console.log(value);
  }
});
```

Requirements:

- Initial state is configurable.
- Internal interactions update state.
- External updates are not expected after initialization.
- The component must document its uncontrolled behavior.

## 2.3. Controlled and Uncontrolled Contracts

A component must define its ownership model explicitly.

|Property|Controlled|Uncontrolled|
|---|---|---|
|Initial state|External|`defaultValue`|
|State owner|Parent|Component|
|Updates|Parent-driven|Internal|
|User interaction|Emits change|Updates internally|
|External synchronization|Required|Not required|
|Reset|Parent-controlled|Component-defined|

## 2.4. Ownership Rules

- Never mix controlled and uncontrolled ownership implicitly.
- Never silently switch ownership during the component lifecycle.
- Define behavior when controlled state is absent.
- Define behavior when controlled state changes externally.
- Document whether `defaultValue` is read only once.

## 2.5. Controlled-to-Uncontrolled Transitions

If a component changes from controlled to uncontrolled during its lifetime, the behavior must be explicitly defined.

Recommended policy:

- Detect the transition.
- Emit a development warning.
- Preserve deterministic behavior.
- Avoid silently creating a second state source.

The same applies to uncontrolled-to-controlled transitions.

## 2.6. Audit Checklist

- [ ] Every component has a documented ownership model.
- [ ] Controlled behavior is predictable.
- [ ] Uncontrolled behavior is predictable.
- [ ] Controlled and uncontrolled modes are distinguishable.
- [ ] Ownership cannot change silently.
- [ ] External state changes are handled correctly.
- [ ] Default values are initialized according to contract.

---

# 3. State Management

## 3.1. Single Source of Truth

A logical state should have one authoritative owner.

Bad pattern:

```js
const internalOpen = signal(false);
const externalOpen = signal(false);
```

If both represent the same logical state, synchronization becomes fragile.

Prefer one authoritative source with explicit adapters where necessary.

## 3.2. Local Component State

Local state should only contain information that belongs to the component.

Examples:

- Open state of an uncontrolled Dropdown.
- Internal selected value of an uncontrolled Select.
- Temporary input composition state.
- Internal visual presence state.

Avoid duplicating parent-owned application data.

## 3.3. Derived State

Derived values should be computed from their source state.

Example:

```js
const isDisabled = computed(() => {
  return props.disabled || props.loading;
});
```

Do not store a derived value independently if it can be reliably computed.

Bad pattern:

```js
const isDisabled = signal(false);

effect(() => {
  isDisabled.set(props.disabled || props.loading);
});
```

This creates an unnecessary synchronization layer.

## 3.4. State Normalization

State must be normalized at clear boundaries.

Examples:

- Empty values.
- Nullable selections.
- Boolean states.
- Arrays of selected items.
- Numeric ranges.
- Validation states.

Avoid inconsistent representations of equivalent states.

For example, a checkbox should not unpredictably alternate between `true`, `"true"`, `1` and `"checked"`.

## 3.5. State Invariants

Every component should define its valid states and invariants.

Example: Dialog.

```text
closed
open
```

Possible additional visual states:

```text
closed
opening
open
closing
```

Invariants:

- Only one logical open state exists.
- Closing must eventually remove visual presence.
- Reopening during closing must not produce duplicate overlays.
- Closed dialogs must not remain interactive.

## 3.6. Audit Checklist

- [ ] There is one authoritative source per logical state.
- [ ] Derived state is not unnecessarily duplicated.
- [ ] State representations are normalized.
- [ ] Valid states are documented.
- [ ] State invariants are defined.
- [ ] Impossible states cannot be reached through normal interactions.

---

# 4. Reactive Update Granularity

Reactivity should operate at the smallest meaningful update boundary.

## 4.1. Minimal DOM Updates

When a property changes, only the corresponding DOM representation should update.

Examples:

- Changing a button's loading state should not reconstruct the entire button.
- Changing an active tab should not unnecessarily rebuild every tab.
- Changing one table row should not recreate the entire table.
- Updating a badge should not invalidate unrelated components.

## 4.2. Fine-Grained Reactivity

Prefer fine-grained updates when the Reef.js architecture supports them.

A component should avoid broad reactive dependencies that invalidate its entire rendered structure for minor changes.

## 4.3. Dependency Boundaries

Reactive dependencies should be intentional.

Examples:

- A button label depends on its label property.
- A button disabled state depends on disabled and loading.
- A Dialog visibility depends on its open state.
- A selected item style depends on its selection state.

Avoid reading unrelated state inside the same reactive computation.

## 4.4. DOM Identity

Preserve DOM identity whenever possible.

Unnecessary DOM replacement can cause:

- Focus loss.
- Input cursor resets.
- Selection loss.
- Scroll position changes.
- Interrupted transitions.
- Event listener recreation.
- Third-party integration failures.

## 4.5. List Identity

Collections require stable identity.

For lists, tables, trees and menus:

- Use stable keys.
- Avoid using array indexes when items can be reordered.
- Preserve existing item instances when their identity remains unchanged.
- Avoid rebuilding entire collections after a single item update.

## 4.6. Audit Checklist

- [ ] Reactive updates are granular.
- [ ] Unrelated DOM nodes remain stable.
- [ ] Input focus survives updates.
- [ ] Selection survives updates.
- [ ] Stable keys are used for collections.
- [ ] Single-item updates do not rebuild entire collections.
- [ ] Reactive dependencies are intentional.

---

# 5. Reactive Effects

Effects are useful for synchronizing reactive state with external systems.

They must not become a substitute for correct state architecture.

## 5.1. Appropriate Uses

Effects may be used for:

- DOM measurements.
- Event listener registration.
- External subscriptions.
- Synchronization with browser APIs.
- Focus management.
- Imperative integrations.
- Side effects triggered by state changes.

## 5.2. Inappropriate Uses

Avoid effects for:

- Computing simple derived values.
- Duplicating existing state.
- Updating state from another state unnecessarily.
- Performing ordinary rendering work.
- Synchronizing values that can be derived directly.

## 5.3. Effect Dependencies

Every effect must have a clear dependency model.

Requirements:

- Dependencies are tracked correctly.
- Unrelated updates do not trigger unnecessary effects.
- Effect execution is deterministic.
- Effect cleanup is reliable.
- Effects do not create uncontrolled update loops.

## 5.4. Reactive Loops

Avoid patterns where effects repeatedly modify the state that triggers them.

Example of a dangerous pattern:

```js
effect(() => {
  const value = count.get();
  count.set(value + 1);
});
```

The update creates another execution indefinitely.

## 5.5. Effect Cleanup

Every effect that creates an external resource must clean it up.

Examples:

```js
effect(() => {
  const unsubscribe = externalStore.subscribe(update);

  return () => {
    unsubscribe();
  };
});
```

The exact cleanup API must follow Reef.js conventions.

## 5.6. Audit Checklist

- [ ] Effects have clear responsibilities.
- [ ] Derived state is not unnecessarily implemented with effects.
- [ ] Dependencies are correct.
- [ ] Reactive loops are prevented.
- [ ] Cleanup is implemented.
- [ ] Effects do not trigger unrelated work.
- [ ] External resources are released.

---

# 6. Props and Reactive Inputs

A component must handle changing inputs correctly.

## 6.1. Reactive Props

If a prop can change after initialization, the component must respond appropriately.

Examples:

- `disabled`
- `loading`
- `open`
- `value`
- `items`
- `placeholder`
- `size`
- `variant`

Do not assume props are immutable unless the component contract explicitly says so.

## 6.2. Prop Normalization

Normalize props at the component boundary.

Examples:

- Default values.
- Boolean coercion where supported.
- Nullable values.
- Invalid variants.
- Numeric boundaries.

Normalization should not create unnecessary reactive work.

## 6.3. Prop Changes During Interaction

Consider changes occurring while a component is active.

Examples:

- A Select's options change while its menu is open.
- A Dialog becomes disabled while open.
- A Dropdown's trigger is removed.
- An Accordion item disappears while expanded.
- A controlled input receives a new value while the user is typing.

These cases require explicit behavior.

## 6.4. Audit Checklist

- [ ] Reactive props update correctly.
- [ ] Immutable props are documented.
- [ ] Defaults are consistent.
- [ ] Invalid values are handled.
- [ ] Prop changes during interaction are tested.
- [ ] Prop updates do not reset unrelated state.

---

# 7. Event Handling and State Synchronization

Events are the communication mechanism between component interactions and state changes.

## 7.1. Event Semantics

Events must describe meaningful interactions.

Examples:

- `onOpenChange`
- `onValueChange`
- `onCheckedChange`
- `onSelectionChange`
- `onExpandedChange`

Avoid inconsistent event names for equivalent behaviors.

## 7.2. Controlled Interaction Flow

Recommended flow:

```text
User interaction
      ↓
Component validates interaction
      ↓
Component emits proposed value
      ↓
Parent updates authoritative state
      ↓
Reef.js propagates state change
      ↓
Component updates its DOM
```

The component must not assume that the parent accepted the proposed value.

For example, a controlled Dialog may remain open if the parent rejects a close request.

## 7.3. Uncontrolled Interaction Flow

```text
User interaction
      ↓
Component validates interaction
      ↓
Component updates internal state
      ↓
Reef.js propagates state change
      ↓
Component updates its DOM
      ↓
Change callback is emitted
```

The callback contract must specify whether it fires before or after the internal update.

## 7.4. Event Ordering

Document event ordering.

Examples:

- `onOpenChange` before or after state mutation.
- `onValueChange` when selection changes.
- `onClose` after a successful dismissal.
- `onSubmit` after validation.

Equivalent components should follow equivalent conventions.

## 7.5. Audit Checklist

- [ ] Event names are consistent.
- [ ] Event payloads are documented.
- [ ] Event ordering is deterministic.
- [ ] Controlled interactions emit proposals.
- [ ] Rejected external updates are handled correctly.
- [ ] Callbacks are not emitted for unchanged values unless explicitly documented.

---

# 8. Asynchronous State

UI components frequently interact with asynchronous operations.

Examples:

- Form submission.
- Remote Select options.
- Autocomplete.
- Search.
- File uploads.
- Validation.
- Infinite scrolling.

## 8.1. Async State Model

Define explicit states.

Example:

```text
idle
loading
success
error
```

For more complex components, define separate operation and presentation states.

## 8.2. Race Conditions

Consider this sequence:

```text
Request A starts
Request B starts
Request B completes
Request A completes
```

The older request must not overwrite the newer result when the latest request is authoritative.

Use:

- Request identifiers.
- Cancellation.
- AbortController where appropriate.
- Explicit latest-request policies.

## 8.3. Async Lifecycle

When a component is destroyed:

- Pending operations must not update destroyed component state.
- Event handlers must not reference invalid DOM.
- Subscriptions must be released.
- Cancellation should occur when appropriate.

## 8.4. Loading State Consistency

Loading indicators must reflect the actual operation.

Avoid:

- Loading state that never ends.
- Success state appearing before completion.
- Errors being silently discarded.
- Multiple requests producing inconsistent indicators.

## 8.5. Audit Checklist

- [ ] Async states are explicit.
- [ ] Race conditions are handled.
- [ ] Obsolete requests cannot overwrite newer state.
- [ ] Destroyed components cannot receive stale updates.
- [ ] Cancellation is supported where appropriate.
- [ ] Loading and error states remain consistent.

---

# 9. Nested Reactivity and Composition

Components are frequently composed into larger structures.

Their reactive behavior must remain isolated and predictable.

## 9.1. Parent and Child State

A parent must not unexpectedly overwrite child-owned state.

A child must not mutate parent-owned state without an explicit contract.

## 9.2. Compound Components

Related components may share state through a parent context.

Examples:

- Tabs / TabsList / TabsTrigger / TabsContent.
- Accordion / AccordionItem / AccordionTrigger / AccordionContent.
- Select / SelectTrigger / SelectContent / SelectItem.
- Menu / MenuTrigger / MenuContent / MenuItem.

Requirements:

- Shared state has a clear owner.
- Child registration and cleanup are reliable.
- Child identity is stable.
- Missing providers produce understandable behavior.
- Nested instances do not share accidental state.

## 9.3. Context Isolation

Nested component groups must not accidentally consume the state of another group.

Example:

```text
Tabs A
  TabsList A
    TabsTrigger A1
  TabsContent A

Tabs B
  TabsList B
    TabsTrigger B1
  TabsContent B
```

The two instances must remain independent.

## 9.4. Composition and Reactive Boundaries

Composition should not create unnecessary dependencies between unrelated children.

A change in one child should not invalidate the entire component tree unless required.

## 9.5. Audit Checklist

- [ ] Parent and child ownership is explicit.
- [ ] Compound components share state correctly.
- [ ] Nested instances are isolated.
- [ ] Child registration is cleaned up.
- [ ] Context boundaries are correct.
- [ ] Composition does not cause unnecessary invalidation.

---

# 10. DOM Ownership and External Mutations

Reef.js must have a clear ownership model for the DOM.

## 10.1. Single DOM Owner

Avoid multiple systems independently controlling the same DOM subtree.

Potential conflicts include:

- Reef.js reactive rendering.
- Direct DOM mutations.
- Third-party libraries.
- Animation libraries.
- External widgets.

## 10.2. Imperative DOM Operations

Imperative operations may be appropriate for:

- Focus.
- Selection.
- Scroll positioning.
- Measurements.
- Native element APIs.
- Canvas and SVG integrations.

They should not conflict with Reef.js's reactive rendering.

## 10.3. Third-Party Integrations

When integrating external libraries:

- Define which system owns the DOM.
- Define which system owns state.
- Define synchronization boundaries.
- Ensure cleanup.
- Prevent external mutations from invalidating Reef.js assumptions.

## 10.4. Audit Checklist

- [ ] DOM ownership is explicit.
- [ ] Direct DOM mutations are justified.
- [ ] Third-party integrations have clear boundaries.
- [ ] External mutations do not corrupt reactive rendering.
- [ ] Cleanup is implemented.

---

# 11. Input Reactivity

Inputs require special attention because user input is continuous and highly sensitive to DOM replacement.

## 11.1. Text Inputs

Requirements:

- Typing must remain uninterrupted.
- Cursor position must be preserved.
- Selection must be preserved.
- Composition events must be respected.
- External value changes must follow a documented policy.

## 11.2. IME Composition

Input components must correctly handle composition events.

Examples:

- Japanese input.
- Chinese input.
- Korean input.

Do not prematurely process incomplete composition values as finalized input.

## 11.3. Controlled Input Synchronization

A controlled input must avoid unnecessary value assignments.

Writing the same value repeatedly can cause cursor and selection problems in some implementations.

## 11.4. Input Debouncing

Debouncing should apply to expensive operations such as remote searches, not necessarily to the visual representation of typed characters.

The displayed input value should remain responsive.

## 11.5. Audit Checklist

- [ ] Typing is uninterrupted.
- [ ] Cursor position is preserved.
- [ ] Selection is preserved.
- [ ] IME composition works.
- [ ] External updates have defined semantics.
- [ ] Debouncing does not delay visible input.
- [ ] No unnecessary input DOM replacement occurs.

---

# 12. Reactive Performance

Reactivity must remain efficient under realistic application workloads.

## 12.1. Performance Principles

- Minimize unnecessary dependency tracking.
- Minimize redundant computations.
- Minimize DOM mutations.
- Avoid broad invalidation.
- Preserve stable DOM identity.
- Batch updates where supported.
- Avoid synchronous work in hot interaction paths.

## 12.2. High-Frequency Updates

Some components generate frequent updates.

Examples:

- Slider.
- Drag and drop.
- Search input.
- Virtualized list.
- Data table.
- Progress indicator.
- Resize observer.

Requirements:

- Updates must not block interaction.
- Expensive work should be scheduled appropriately.
- Rendering should avoid unnecessary full-tree updates.
- State changes should be batched when possible.

## 12.3. Large Collections

For large collections:

- Use stable identity.
- Avoid recreating all child components.
- Consider virtualization.
- Avoid expensive derived computations on every update.
- Ensure event delegation or listener strategies are appropriate.

## 12.4. Audit Checklist

- [ ] Reactive computations are efficient.
- [ ] DOM updates are minimal.
- [ ] High-frequency updates remain responsive.
- [ ] Large collections scale.
- [ ] Expensive computations are controlled.
- [ ] Update batching is used where beneficial.

---

# 13. Error Handling and Reactive Stability

Reactive components must recover predictably from invalid states and runtime failures.

## 13.1. Invalid State

Examples:

- Selected value no longer exists.
- Active tab has been removed.
- Current page exceeds the available page range.
- Expanded item has been deleted.
- Controlled value becomes invalid.

Define a deterministic recovery strategy for each case.

## 13.2. Reactive Exceptions

A failure in one component should not unnecessarily corrupt unrelated components.

Where supported by the framework, define error isolation boundaries.

## 13.3. Recovery

A component should be able to recover from:

- Invalid external props.
- Rapid updates.
- Failed asynchronous operations.
- Removed collection items.
- Interrupted interactions.

## 13.4. Audit Checklist

- [ ] Invalid states are detected.
- [ ] Recovery policies are defined.
- [ ] Reactive exceptions are handled.
- [ ] One component failure does not unnecessarily affect others.
- [ ] No stale state remains after recovery.

---

# 14. Reef.js Reactivity Architecture

The component library should expose consistent integration patterns rather than inventing a different reactive strategy for each component.

Recommended conceptual architecture:

```text
Reef UI Component
│
├── Public API
│   ├── Props
│   ├── Events
│   └── Slots / Composition
│
├── State Layer
│   ├── Controlled State
│   ├── Uncontrolled State
│   └── Derived State
│
├── Behavior Layer
│   ├── Interaction Logic
│   ├── Validation
│   ├── Keyboard Behavior
│   └── Async Behavior
│
├── Reactive Integration
│   ├── State Subscriptions
│   ├── Effects
│   ├── Dependency Tracking
│   └── Cleanup
│
├── DOM Layer
│   ├── Stable Nodes
│   ├── Reactive Bindings
│   └── Event Handlers
│
└── Lifecycle
    ├── Initialization
    ├── Updates
    ├── Destruction
    └── Resource Cleanup
```

This architecture describes responsibility boundaries. It does not require every component to implement all these layers independently.

---

# 15. Component Reactivity Audit Template

Use this template for every component.

```md
# Reactivity Audit: [ComponentName]

## 1. State Ownership

- Controlled:
- Uncontrolled:
- Default state:
- Authoritative state:
- Ownership transitions:

## 2. State Model

- Internal state:
- External state:
- Derived state:
- Valid states:
- Invariants:

## 3. Reactive Dependencies

| Dependency | Consumer | Update Trigger | Expected Result |
|---|---|---|---|
| | | | |

## 4. Update Granularity

- DOM nodes updated:
- Unrelated nodes affected:
- DOM identity preserved:
- List identity strategy:

## 5. Props

- Reactive props:
- Immutable props:
- Defaults:
- Normalization:
- Dynamic updates:

## 6. Effects and Subscriptions

- Effects:
- Dependencies:
- Cleanup:
- Loop risks:
- External resources:

## 7. Events

- Event names:
- Payloads:
- Ordering:
- Controlled behavior:
- Uncontrolled behavior:

## 8. Async Behavior

- Async states:
- Race condition strategy:
- Cancellation:
- Stale update protection:

## 9. Lifecycle

- Initialization:
- Update:
- Destruction:
- Subscription cleanup:
- Pending operation cleanup:

## 10. Input and DOM Stability

- Focus preservation:
- Selection preservation:
- Cursor preservation:
- External DOM mutations:

## 11. Performance

- Computation cost:
- DOM mutation cost:
- Update frequency:
- Large collection behavior:

## 12. Issues

| ID | Issue | Severity | Correction |
|---|---|---|---|

## 13. Acceptance Criteria

- [ ] State ownership is explicit.
- [ ] No conflicting state sources exist.
- [ ] Derived state is correctly implemented.
- [ ] Reactive dependencies are intentional.
- [ ] DOM updates are minimal.
- [ ] DOM identity is preserved.
- [ ] Effects are cleaned up.
- [ ] Controlled behavior is correct.
- [ ] Uncontrolled behavior is correct.
- [ ] Async race conditions are handled.
- [ ] Input behavior is stable.
- [ ] No unresolved P0 issues remain.
```

---

# 16. Reactivity Testing Matrix

Every component should be tested against the following conditions.

|Scenario|Expected behavior|
|---|---|
|Initial render|Correct initial state|
|Internal state update|Correct DOM update|
|External state update|Component synchronizes|
|Repeated state update|No unnecessary invalidation|
|Rapid state changes|Deterministic result|
|Controlled mode|Parent remains authoritative|
|Uncontrolled mode|Internal state remains authoritative|
|Ownership transition|Documented behavior|
|Dynamic prop changes|Correct synchronization|
|Component destruction|Full cleanup|
|Nested composition|Correct isolation|
|Async completion|Correct result|
|Async cancellation|No stale update|
|Large collection update|Minimal invalidation|
|Input typing|Cursor and focus preserved|
|IME composition|Composition remains valid|
|External DOM mutation|No rendering corruption|

---

# 17. Reactivity Quality Scoring

|Dimension|Weight|
|---|---|
|State ownership|15%|
|State correctness|15%|
|Reactive update granularity|15%|
|DOM stability|10%|
|Effects and cleanup|10%|
|Event synchronization|10%|
|Async correctness|10%|
|Composition isolation|5%|
|Input stability|5%|
|Performance|5%|
|**Total**|**100%**|

Each dimension is scored from 0 to 4.

## 17.1. Scoring Scale

|Score|Meaning|
|---|---|
|0|Missing|
|1|Broken|
|2|Partially implemented|
|3|Correct and consistent|
|4|Refined and production-grade|

## 17.2. Critical Conditions

A component cannot be considered production-ready if:

- Controlled state can become inconsistent with the parent.
- Reactive updates produce infinite loops.
- Destroyed components continue receiving updates.
- User input is interrupted by unnecessary DOM replacement.
- Async race conditions produce incorrect results.
- Nested component instances share unintended state.
- Reactive subscriptions leak resources.

---

# 18. Remediation Priorities

## P0 — Critical

- Infinite reactive loops.
- Incorrect controlled state synchronization.
- Updates after component destruction.
- Memory leaks from subscriptions.
- Input cursor or focus corruption.
- Severe DOM inconsistency.
- Uncontrolled asynchronous race conditions.

## P1 — High

- Unnecessary full component reconstruction.
- Incorrect reactive dependencies.
- Missing cleanup.
- Broken nested component isolation.
- Unstable collection identity.
- Incorrect event ordering.

## P2 — Medium

- Redundant derived state.
- Excessive reactive computations.
- Unnecessary DOM mutations.
- Inefficient large collection updates.
- Inconsistent prop normalization.

## P3 — Low

- Minor API refinements.
- Documentation improvements.
- Small performance optimizations.
- Internal implementation simplifications.

---

# 19. Final Acceptance Criteria

The Reef.js reactivity integration is considered mature when:

- Every component has an explicit state ownership model.
- Controlled and uncontrolled behavior is predictable.
- Derived state is implemented correctly.
- Reactive dependencies are intentional.
- Updates are granular.
- DOM identity is preserved where appropriate.
- Effects and subscriptions have reliable cleanup.
- Event semantics are consistent.
- Asynchronous operations are safe.
- Nested components remain isolated.
- Inputs remain stable during reactive updates.
- Large collections remain performant.
- Invalid states have deterministic recovery behavior.
- No unresolved P0 issues remain.

---

# 20. Final Reactivity Principle

**Reactivity should make the interface feel immediate without making its behavior unpredictable.**

A good reactive component does not simply update when state changes.

It updates the correct things, at the correct time, without disturbing anything else.

For Reef.js, this means:

- One authoritative state per logical concern.
- Explicit ownership.
- Fine-grained updates.
- Stable DOM identity.
- Predictable lifecycle.
- Reliable cleanup.
- Minimal unnecessary computation.

The goal is not maximum reactivity.

The goal is precise reactivity.

**Update what matters. Preserve what works. Never lose synchronization.**