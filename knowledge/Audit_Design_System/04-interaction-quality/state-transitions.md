# State Transitions

> **Purpose:** Define a unified state management and transition system across all Reef.js UI components.
> 
> **Scope:** State modeling, state ownership, transitions, derived states, synchronization, interaction states, asynchronous states, lifecycle, visual feedback and state consistency.
> 
> **Design direction:** Predictable, explicit, deterministic and minimal state transitions.
> 
> **Framework:** Reef.js — state-based reactive framework.

---

# 1. State Transition Philosophy

## 1.1. Definition

A state transition describes how a component moves from one state to another following an event, user interaction, external update or asynchronous operation.

A state model defines:

- Which states exist.
- Which states are valid.
- Which transitions are allowed.
- Which events trigger transitions.
- Which side effects occur.
- Which visual feedback is produced.
- How external changes are synchronized.

A component must never enter an undefined or contradictory state.

## 1.2. Core Principles

### Principle 1 — Explicit State

Every meaningful component state must be identifiable.

Avoid implicit state changes that cannot be understood from the component's public contract.

### Principle 2 — Deterministic Transitions

Given the same initial state and event, a component should produce the same result.

### Principle 3 — Single Source of Truth

Each state dimension must have one authoritative owner.

Avoid independently maintaining the same state in multiple places.

### Principle 4 — State Separation

Different concepts must remain independent.

For example:

- `open` is not `selected`.
- `focused` is not `active`.
- `highlighted` is not `selected`.
- `loading` is not `disabled`.
- `invalid` is not `disabled`.

These states can coexist, but they must not be conflated.

### Principle 5 — Observable Feedback

Meaningful state changes must be reflected in the UI.

### Principle 6 — Controlled Transitions

Components must not silently override externally controlled state.

### Principle 7 — Lifecycle Safety

State transitions must remain valid when components mount, update, unmount or receive external changes.

### Principle 8 — Minimal State

Do not store information that can be reliably derived from existing state.

## 1.3. Global Audit Checklist

- [ ] All meaningful states are identified.
- [ ] State ownership is explicit.
- [ ] Valid transitions are documented.
- [ ] Invalid transitions are prevented.
- [ ] State dimensions are separated.
- [ ] Derived state is not unnecessarily duplicated.
- [ ] External state synchronization works.
- [ ] Visual feedback reflects actual state.
- [ ] Asynchronous transitions are safe.
- [ ] Lifecycle cleanup is correct.

---

# 2. State Architecture

## 2.1. State Categories

Reef.js components should distinguish between different categories of state.

|Category|Definition|Examples|
|---|---|---|
|Interaction state|State resulting from user interaction|Hover, focus, active|
|Semantic state|State representing component meaning|Selected, invalid, disabled|
|Visibility state|State controlling presentation|Open, closed, expanded|
|Value state|State containing user data|Input value, selected option|
|Async state|State representing ongoing operations|Loading, success, error|
|Derived state|State calculated from other states|HasValue, canSubmit|
|Internal state|State owned by the component|Temporary highlight|
|External state|State owned by the consumer|Controlled value|

These categories may overlap. They describe responsibilities rather than mutually exclusive implementation types.

## 2.2. State Ownership

Every state variable must have a defined owner.

### Internal State

The component owns and manages the state.

Example:

```tsx
<Dialog defaultOpen={false}>
  ...
</Dialog>
```

### Controlled State

The consumer owns the state.

Example:

```tsx
<Dialog
  open={isOpen()}
  onOpenChange={setIsOpen}
>
  ...
</Dialog>
```

### Derived State

The state is computed from other values.

Example:

```ts
const isEmpty = () => value().length === 0;
const canSubmit = () => !isEmpty() && !isLoading();
```

Derived state should not become an independent source of truth.

## 2.3. Ownership Rules

- Every state dimension has one authoritative owner.
- Controlled state must reflect external updates.
- Internal state must not silently override controlled state.
- Derived state should be computed whenever practical.
- Temporary interaction state should remain local when appropriate.
- State ownership must be documented.

## 2.4. State Inventory Template

```md
### State Inventory: [ComponentName]

| State | Category | Owner | Initial value | Mutable by |
|---|---|---|---|---|
| value | Value | External/Internal | | |
| open | Visibility | External/Internal | | |
| focused | Interaction | Browser/DOM | | |
| highlighted | Interaction | Internal | | |
| loading | Async | External/Internal | | |
| disabled | Semantic | External | | |
```

---

# 3. State Modeling

## 3.1. Definition

State modeling describes all valid states and the relationships between them.

A component should have a documented state model before implementation.

## 3.2. Simple State Model

Example: Switch.

```text
OFF
 |
 | User activation
 v
ON
 |
 | User activation
 v
OFF
```

The Switch has two semantic states:

- Checked.
- Unchecked.

Focus, hover and disabled are additional interaction dimensions.

## 3.3. Multi-Dimensional State Model

Example: Input.

```text
Interaction:
  idle
  focused

Validation:
  valid
  invalid

Availability:
  enabled
  disabled
  read-only

Content:
  empty
  populated
```

These dimensions are independent.

An Input can be:

- Focused + Invalid + Populated.
- Focused + Valid + Empty.
- Disabled + Invalid + Populated.
- Read-only + Valid + Populated.

Avoid implementing every possible combination as a separate explicit state.

## 3.4. State Explosion

A common implementation mistake is creating a single state variable representing every possible combination.

Bad:

```ts
type InputState =
  | "idle"
  | "focused"
  | "focused-invalid"
  | "focused-valid"
  | "disabled-invalid"
  | "disabled-valid"
  | "readonly-valid";
```

Prefer independent state dimensions:

```ts
interface InputState {
  focused: boolean;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  value: string;
}
```

The rendered appearance is derived from these dimensions.

## 3.5. State Modeling Rules

- Separate independent state dimensions.
- Avoid excessive enumerated combinations.
- Define mutually exclusive states explicitly.
- Define valid combinations.
- Identify impossible combinations.
- Prefer derived presentation states.
- Avoid storing redundant information.

---

# 4. State Transition Contracts

## 4.1. Definition

A transition contract defines how a state changes in response to an event.

Every meaningful transition should specify:

1. Initial state.
2. Triggering event.
3. Preconditions.
4. Resulting state.
5. Side effects.
6. Callback behavior.
7. Visual feedback.

## 4.2. Transition Table

Example: Dialog.

|Current state|Event|Next state|Side effect|
|---|---|---|---|
|Closed|Trigger click|Open|Move focus into dialog|
|Closed|External open=true|Open|Initialize focus|
|Open|Escape|Closed|Restore focus|
|Open|Close button|Closed|Restore focus|
|Open|External open=false|Closed|Restore focus when appropriate|
|Open|Outside click|Component-specific|Dismiss if allowed|

## 4.3. Transition Guards

A transition must only occur when its preconditions are satisfied.

Example:

```ts
function toggle() {
  if (disabled()) return;

  setChecked(!checked());
}
```

A more explicit conceptual model:

```ts
function canToggle() {
  return !disabled() && !readOnly();
}
```

## 4.4. Transition Side Effects

Side effects must be separated from the state transition itself where possible.

Examples:

- Focus management.
- Event callbacks.
- DOM measurements.
- Network requests.
- Analytics.
- Scroll locking.
- Subscription management.

Do not hide unrelated side effects inside state calculations.

## 4.5. Transition Rules

- Every transition has a defined trigger.
- Preconditions are explicit.
- Invalid transitions are ignored or handled intentionally.
- State updates are deterministic.
- Side effects are controlled.
- Callback timing is predictable.
- Transitions remain safe under rapid interactions.

## 4.6. Audit Checklist

- [ ] Transition tables exist for complex components.
- [ ] Preconditions are documented.
- [ ] Invalid transitions are handled.
- [ ] Side effects are identified.
- [ ] Callbacks occur at predictable moments.
- [ ] Rapid transitions do not create inconsistent state.

---

# 5. Controlled and Uncontrolled State Transitions

## 5.1. Controlled State

In controlled mode, the consumer is the source of truth.

The component communicates a proposed change through a callback.

Example:

```tsx
const [open, setOpen] = createSignal(false);

<Dialog
  open={open()}
  onOpenChange={setOpen}
/>
```

The component must not independently assume that its state changed before the controlled value is updated.

## 5.2. Uncontrolled State

In uncontrolled mode, the component manages its own state.

Example:

```tsx
<Dialog defaultOpen={false}>
  ...
</Dialog>
```

Internal state is updated when valid interactions occur.

## 5.3. Controlled Transition Flow

```text
User interaction
      |
      v
Transition requested
      |
      v
onOpenChange(nextValue)
      |
      v
Consumer updates state
      |
      v
New open prop received
      |
      v
Component reflects new state
```

## 5.4. Uncontrolled Transition Flow

```text
User interaction
      |
      v
Transition requested
      |
      v
Internal state updated
      |
      v
UI reacts
      |
      v
Callback emitted
```

## 5.5. Important Rules

- `value` establishes controlled mode.
- `defaultValue` initializes uncontrolled mode.
- `open` establishes controlled visibility.
- `defaultOpen` initializes uncontrolled visibility.
- Controlled state must always reflect the latest external value.
- Uncontrolled state must not reset on every render.
- Callbacks must communicate proposed changes consistently.
- Mixing controlled and uncontrolled contracts must be documented and handled.

## 5.6. External Synchronization

Test:

- Parent updates state.
- Parent resets state.
- Parent disables the component.
- Parent changes the selected value.
- Parent closes an open overlay.
- Parent changes state during an asynchronous operation.

## 5.7. Audit Checklist

- [ ] Controlled transitions work.
- [ ] Uncontrolled transitions work.
- [ ] External updates propagate.
- [ ] No duplicated sources of truth exist.
- [ ] Default values are applied only at initialization.
- [ ] Callbacks do not falsely imply committed controlled state.
- [ ] Controlled/uncontrolled mode changes are handled consistently.

---

# 6. Derived State and State Dependencies

## 6.1. Definition

Derived state is calculated from other state values.

It should be used to express conditions without introducing redundant mutable state.

## 6.2. Example

```ts
const hasValue = () => value().length > 0;

const isEmpty = () => !hasValue();

const canSubmit = () =>
  hasValue() &&
  !disabled() &&
  !loading() &&
  !invalid();
```

## 6.3. Avoid Redundant State

Bad:

```ts
const [value, setValue] = createSignal("");
const [isEmpty, setIsEmpty] = createSignal(true);
```

Both states represent the same underlying information.

They can become inconsistent.

Better:

```ts
const [value, setValue] = createSignal("");

const isEmpty = () => value().length === 0;
```

## 6.4. State Dependency Graph

Document important dependencies.

Example: Button.

```text
disabled ─────────┐
                  |
loading ──────────┼──> canInteract
                  |
readOnly ─────────┘

canInteract ─────────> interaction behavior
loading ─────────────> loading indicator
disabled ────────────> disabled appearance
```

## 6.5. Dependency Rules

- Derived state must use authoritative source values.
- Avoid duplicated state.
- Avoid circular dependencies.
- Derived calculations should remain deterministic.
- Expensive computations should be optimized appropriately.
- Reactive dependencies must be tracked correctly by Reef.js.

## 6.6. Audit Checklist

- [ ] Derived state is identified.
- [ ] Redundant state is removed.
- [ ] Dependency relationships are documented.
- [ ] Circular dependencies do not exist.
- [ ] Reactive dependencies are tracked correctly.
- [ ] Derived values remain synchronized.

---

# 7. Interaction State Transitions

## 7.1. Hover

```text
Idle
  └── Pointer Enter → Hover

Hover
  └── Pointer Leave → Idle
```

Rules:

- Hover is pointer-dependent.
- Hover must not be required for functionality.
- Hover must not override disabled behavior.
- Hover should not cause layout shifts.

## 7.2. Focus

```text
Unfocused
  └── Focus → Focused

Focused
  └── Blur → Unfocused
```

Rules:

- Focus may be triggered by keyboard, pointer or programmatic navigation.
- Focus visibility must be appropriate to the input modality.
- Focus should not disappear unexpectedly.
- Focus must be synchronized with the actual DOM element.

## 7.3. Active

```text
Idle
  └── Pointer Down → Active

Active
  ├── Pointer Up → Idle / Hover
  └── Pointer Cancel → Idle / Hover
```

Rules:

- Active feedback must be immediate.
- Pointer cancellation must be handled.
- Active must not persist after interaction ends.

## 7.4. Disabled

Disabled is an availability condition rather than a transient pointer state.

When a component becomes disabled:

- Prevent new user interactions.
- Cancel or resolve active interactions according to component semantics.
- Remove unavailable actions.
- Preserve externally controlled values.
- Update accessibility state.

## 7.5. Audit Checklist

- [ ] Hover transitions work.
- [ ] Focus transitions work.
- [ ] Active transitions work.
- [ ] Disabled transitions are handled.
- [ ] Overlapping states are supported.
- [ ] State changes reflect actual DOM interaction.

---

# 8. Visibility State Transitions

Visibility state controls whether component content is presented.

Common examples:

- Dialog.
- Popover.
- Dropdown Menu.
- Tooltip.
- Accordion.
- Collapsible.
- Drawer.

## 8.1. Standard Visibility Model

```text
CLOSED
   |
   | Open request
   v
OPENING
   |
   | Entrance animation completed
   v
OPEN
   |
   | Close request
   v
CLOSING
   |
   | Exit animation completed
   v
CLOSED
```

For components without animations, `OPENING` and `CLOSING` may not need to exist as explicit runtime states.

## 8.2. Transition Requirements

Opening:

- Update logical visibility.
- Render content.
- Initialize focus where appropriate.
- Position the floating surface.
- Apply required modal behavior.
- Start entrance motion if enabled.

Closing:

- Process dismissal request.
- Update logical visibility according to the controlled/uncontrolled contract.
- Handle exit animation.
- Restore focus where appropriate.
- Release modal resources.
- Clean up temporary listeners.

## 8.3. Logical State vs Visual Presence

A crucial distinction:

- `open` describes logical component state.
- `present` describes whether content remains mounted or rendered.
- `animating` describes a transition in progress.

These concepts must not be conflated.

Example:

A Dialog may be logically closed while its content remains temporarily rendered to complete an exit animation.

## 8.4. Audit Checklist

- [ ] Open and closed states are defined.
- [ ] Animated transitions do not corrupt logical state.
- [ ] Content presence is handled correctly.
- [ ] Focus is initialized correctly.
- [ ] Focus restoration works.
- [ ] Resources are released after closing.
- [ ] Rapid open/close interactions are handled.

---

# 9. Selection State Transitions

Selection components must distinguish between the committed value and temporary navigation state.

## 9.1. Single Selection

```text
No Selection
     |
     | Select A
     v
Selected A
     |
     | Select B
     v
Selected B
```

## 9.2. Multiple Selection

```text
[]
 |
 | Select A
 v
[A]
 |
 | Select B
 v
[A, B]
 |
 | Deselect A
 v
[B]
```

## 9.3. Highlighted State

A highlighted option is not necessarily selected.

Example:

```text
Selected value: Apple
Highlighted option: Banana
Focused element: Combobox input
```

Pressing Enter may commit the highlighted option.

Pressing Escape may dismiss the popup without changing the committed value.

## 9.4. Selection Rules

- Selected state is the committed value.
- Highlighted state is temporary navigation state.
- Disabled options cannot be selected.
- Selection changes must be observable.
- External selected values must synchronize.
- Multiple selection must preserve value integrity.
- Selection order must be defined where relevant.

## 9.5. Audit Checklist

- [ ] Single selection works.
- [ ] Multiple selection works where supported.
- [ ] Highlighted and selected states are separate.
- [ ] Disabled options are protected.
- [ ] Selection callbacks are correct.
- [ ] External values synchronize correctly.

---

# 10. Validation State Transitions

Validation state represents the result of evaluating user input.

## 10.1. Validation States

```text
Pristine
   |
   | User interaction
   v
Dirty
   |
   | Validation
   v
Valid / Invalid
```

Additional concepts:

- Touched.
- Pending validation.
- Server error.
- Warning.
- Reset.

These should remain distinct when they have different meanings.

## 10.2. Validation Timing

Support clearly defined validation policies:

- On input.
- On blur.
- On submit.
- Explicit validation.

The component should not arbitrarily change validation timing.

## 10.3. State Transition Example

```text
Pristine
   |
   | Blur
   v
Touched
   |
   | Invalid value
   v
Invalid
   |
   | Correct value
   v
Valid
```

## 10.4. Reset Behavior

Reset should define what happens to:

- Value.
- Dirty state.
- Touched state.
- Validation result.
- Error messages.
- Pending validation.

## 10.5. Audit Checklist

- [ ] Pristine and dirty are distinct.
- [ ] Touched state is handled.
- [ ] Validation timing is documented.
- [ ] Pending validation is handled.
- [ ] Errors synchronize correctly.
- [ ] Reset restores the expected state.

---

# 11. Asynchronous State Transitions

Asynchronous operations require a dedicated state model.

## 11.1. Standard Async State

```text
IDLE
  |
  | Start
  v
PENDING
  |
  ├── Resolve → SUCCESS
  |
  ├── Reject → ERROR
  |
  └── Cancel → IDLE
```

## 11.2. Recommended State Representation

```ts
type AsyncStatus =
  | "idle"
  | "pending"
  | "success"
  | "error";

interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: Error | null;
}
```

This is an illustrative contract. Adapt nullable values and result types to the actual Reef.js type conventions.

## 11.3. Transition Rules

- Prevent unintended duplicate requests.
- Define whether repeated requests replace or queue previous requests.
- Handle cancellation.
- Handle stale responses.
- Handle component unmounting.
- Preserve or reset previous data intentionally.
- Expose errors consistently.
- Communicate pending state visually.

## 11.4. Race Conditions

Example:

```text
Request A starts
     |
Request B starts
     |
Request B resolves
     |
Request A resolves later
```

The older response must not overwrite newer state when the component uses latest-request-wins semantics.

Use an explicit request identity, cancellation mechanism or equivalent strategy.

## 11.5. Audit Checklist

- [ ] Async states are explicit.
- [ ] Duplicate requests are controlled.
- [ ] Race conditions are handled.
- [ ] Cancellation works.
- [ ] Stale responses are ignored where appropriate.
- [ ] Errors are recoverable.
- [ ] Unmounted components do not produce invalid updates.

---

# 12. State Synchronization

## 12.1. Definition

State synchronization ensures that internal state, external state, derived state and rendered UI remain consistent.

## 12.2. Synchronization Sources

- Parent component updates.
- User interactions.
- Browser-native events.
- Asynchronous operations.
- Form reset.
- Component initialization.
- Component remounting.
- URL or application state changes where applicable.

## 12.3. Synchronization Rules

- Establish one authoritative source per state dimension.
- Do not overwrite newer external values with stale internal values.
- Do not reinitialize uncontrolled state on every update.
- Do not emit redundant callbacks for unchanged values unless explicitly required.
- Ensure derived values update with their dependencies.
- Define conflict-resolution behavior.

## 12.4. Synchronization Test Matrix

|Scenario|Expected result|
|---|---|
|Parent changes value|Component updates|
|User changes controlled value|Callback emitted|
|Parent rejects proposed value|Component retains external value|
|Parent resets value|Component reflects reset|
|Component becomes disabled|User interaction blocked|
|Component unmounts|Resources cleaned up|
|Component remounts|Initialization contract respected|

## 12.5. Audit Checklist

- [ ] External updates propagate.
- [ ] Internal updates are correct.
- [ ] No stale values are displayed.
- [ ] No redundant callbacks occur.
- [ ] Reset behavior works.
- [ ] Remount behavior is documented.
- [ ] Synchronization conflicts are handled.

---

# 13. State Transition Atomicity

## 13.1. Definition

Atomicity means that a logically related state change should not expose an inconsistent intermediate result.

Example: selecting an option in a Select may involve:

- Updating the selected value.
- Closing the popup.
- Clearing the highlighted option.
- Emitting the selection callback.

These changes should behave as one coherent interaction.

## 13.2. Requirements

- Related state updates must remain consistent.
- Intermediate UI states should not contradict the interaction.
- Callbacks must occur at defined points.
- Reactive updates must not introduce flickering.
- Side effects should execute in a predictable order.

## 13.3. Audit Checklist

- [ ] Related state updates are coordinated.
- [ ] No contradictory intermediate state is exposed.
- [ ] Callbacks occur at defined points.
- [ ] Reactive rendering remains stable.
- [ ] Side effects have predictable ordering.

---

# 14. State Persistence and Reset

## 14.1. State Persistence

Define whether state should survive:

- Re-rendering.
- Parent updates.
- Temporary hiding.
- Unmounting.
- Remounting.
- Route changes.

Not every state should persist.

Examples:

|State|Typical persistence|
|---|---|
|Input value|Consumer-dependent|
|Dialog open|Usually temporary|
|Selected tab|Consumer-dependent|
|Hover|Never persist|
|Focus|Never persist independently of DOM|
|Search query|Component/application-dependent|
|Loading|Until operation completes or is cancelled|

## 14.2. Reset

Every stateful component must define its reset contract where reset is meaningful.

Potential reset operations:

- Restore default value.
- Clear selection.
- Close overlay.
- Clear validation.
- Cancel pending operation.
- Clear temporary interaction state.

## 14.3. Audit Checklist

- [ ] Persistence behavior is documented.
- [ ] Transient states are not persisted accidentally.
- [ ] Reset behavior is predictable.
- [ ] Controlled reset synchronizes correctly.
- [ ] Pending operations are handled during reset.

---

# 15. State Transitions and Motion

State changes frequently trigger visual transitions.

However, visual transitions must never become the authoritative source of component state.

## 15.1. Logical State vs Animation State

Keep separate concepts:

```text
Logical state:
  open = false

Visual state:
  exit animation in progress

Presence:
  content still mounted
```

The component must not remain logically open simply because an animation has not completed.

## 15.2. Motion Rules

- Motion reflects state changes.
- Animation does not determine business logic.
- Interrupted animations must resolve correctly.
- Rapid transitions must not produce stale visual states.
- Reduced-motion preferences must be respected.
- Animation completion must not trigger duplicate state changes.

## 15.3. Audit Checklist

- [ ] Logical and visual states are separate.
- [ ] Interrupted transitions are handled.
- [ ] Rapid toggling works.
- [ ] Exit animations do not break cleanup.
- [ ] Reduced-motion behavior is supported.

---

# 16. State Transition Anti-Patterns

|Anti-pattern|Problem|Correction|
|---|---|---|
|Multiple sources of truth|Inconsistent UI|Define state ownership|
|Duplicated derived state|Synchronization bugs|Compute derived values|
|Implicit transitions|Unpredictable behavior|Define transition contracts|
|State explosion|Complex maintenance|Separate state dimensions|
|Controlled state overwritten internally|Broken ownership|Emit proposed changes|
|Uncontrolled state reinitialized|Lost user input|Initialize once|
|Selected equals highlighted|Incorrect selection|Separate state concepts|
|Animation controls logical state|Race conditions|Separate presence and logical state|
|Unhandled async responses|Stale data|Use request identity or cancellation|
|Missing reset contract|Inconsistent forms|Define reset semantics|
|Uncleaned transient state|Memory and behavior bugs|Lifecycle cleanup|
|Invalid state combinations|Contradictory appearance|Define constraints|
|Redundant callbacks|Unnecessary updates|Emit meaningful changes only|

---

# 17. Component State Transition Audit Template

Use this template for each stateful component.

```md
# State Transition Audit: [ComponentName]

## 1. State Inventory

| State | Category | Owner | Default |
|---|---|---|---|
| | | | |

## 2. Valid State Combinations

- [Combination 1]
- [Combination 2]

## 3. Invalid State Combinations

- [Combination 1]
- [Combination 2]

## 4. Transition Table

| Current State | Event | Next State | Side Effects |
|---|---|---|---|
| | | | |

## 5. Controlled Behavior

[Describe external state ownership]

## 6. Uncontrolled Behavior

[Describe internal state ownership]

## 7. Derived State

| Derived state | Source dependencies |
|---|---|
| | |

## 8. Synchronization

[Describe external and internal updates]

## 9. Async Behavior

[Describe pending, success, error and cancellation]

## 10. Lifecycle

[Describe cleanup and remount behavior]

## 11. Visual Feedback

[Describe how each state is communicated]

## 12. Issues

| ID | Issue | Severity | Correction |
|---|---|---|---|

## 13. Acceptance Criteria

- [ ] State ownership is explicit.
- [ ] All transitions are documented.
- [ ] Invalid transitions are prevented.
- [ ] Derived state is correct.
- [ ] Controlled behavior works.
- [ ] Uncontrolled behavior works.
- [ ] External synchronization works.
- [ ] Async operations are safe.
- [ ] Lifecycle cleanup works.
- [ ] Visual feedback is correct.
```

---

# 18. State Transition Testing Matrix

Every stateful component should be tested against the following scenarios.

|Test|Expected behavior|
|---|---|
|Initial mount|Correct initial state|
|User interaction|Correct transition|
|Repeated interaction|No inconsistent state|
|External state update|UI synchronizes|
|External reset|State resets correctly|
|Disabled transition|Interaction becomes unavailable|
|Rapid state changes|Latest valid state wins|
|Async completion|Correct result is applied|
|Async cancellation|No stale result is applied|
|Unmount|Resources are cleaned|
|Remount|Initialization contract is respected|
|Reduced motion|State remains correct without motion|

---

# 19. State Transition Quality Scoring

|Dimension|Weight|
|---|---|
|State modeling|15%|
|State ownership|15%|
|Transition determinism|15%|
|Controlled/uncontrolled behavior|15%|
|Derived state|10%|
|Synchronization|10%|
|Async safety|10%|
|Lifecycle safety|5%|
|Motion synchronization|5%|
|**Total**|**100%**|

Each dimension is scored from 0 to 4.

## 19.1. Scoring Scale

|Score|Meaning|
|---|---|
|0|Missing|
|1|Broken|
|2|Partially implemented|
|3|Correct and consistent|
|4|Robust and production-grade|

## 19.2. Critical Quality Conditions

A component cannot be considered production-ready if:

- Controlled state is unreliable.
- Multiple sources of truth exist.
- Invalid transitions produce contradictory UI.
- Asynchronous operations can corrupt state.
- Lifecycle cleanup is broken.
- Logical state and visual state become inconsistent.

---

# 20. Remediation Priorities

## P0 — Critical

- Broken controlled state.
- Multiple conflicting sources of truth.
- Incorrect state synchronization.
- Invalid transitions causing data corruption.
- Unhandled asynchronous race conditions.
- Lifecycle leaks.

## P1 — High

- Missing state transitions.
- Incorrect reset behavior.
- Duplicated derived state.
- Incorrect loading and error transitions.
- Inconsistent external state updates.

## P2 — Medium

- Incomplete transition documentation.
- Inconsistent visual state feedback.
- Unnecessary state complexity.
- Motion synchronization issues.

## P3 — Low

- Minor state-model simplifications.
- Non-essential transition refinements.
- Documentation improvements.

---

# 21. Final Acceptance Criteria

The Reef.js state transition system is considered mature when:

- Every stateful component has a documented state model.
- Every state dimension has a clear owner.
- State combinations are valid and predictable.
- Transitions are deterministic.
- Controlled and uncontrolled behavior is consistent.
- Derived state is calculated correctly.
- External state updates propagate reliably.
- Async operations are safe.
- Reset and persistence contracts are explicit.
- Logical state is separated from animation state.
- Lifecycle cleanup is correct.
- All important transitions are tested.
- No unresolved P0 issues remain.

---

# 22. Final State Transition Principle

**A component should never have to guess what state it is in, and a consumer should never have to guess how that state will change.**

For Reef.js, state transitions are not merely an implementation detail.

They are part of the component's public behavioral contract.

A refined UI system requires more than beautiful surfaces and consistent APIs. It requires state changes that are deterministic, observable, synchronized and reversible where appropriate.

The goal is not to introduce a complex state machine into every component.

The goal is to introduce exactly the amount of state structure necessary to make each component reliable.

**Model states explicitly. Keep ownership clear. Derive what can be derived. Make every transition predictable.**