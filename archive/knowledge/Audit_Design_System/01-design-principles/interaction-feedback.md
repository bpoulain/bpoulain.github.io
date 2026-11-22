# Interaction Feedback

> **Purpose:** Define the feedback principles, interaction states, visual responses and behavioral contracts governing all interactive components in the UI library.
> 
> **Scope:** Hover, focus, active, pressed, selected, disabled, loading, success, error, validation, optimistic updates, asynchronous operations, notifications, state transitions, accessibility feedback and interaction consistency.
> 
> **Related principles:** Minimalism, Color Philosophy, Typography, Visual Hierarchy, Functional Density, Geometric Consistency, Progressive Disclosure, Motion and Composability.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.

---

# 1. Interaction Feedback Philosophy

## 1.1. Definition

Interaction feedback describes how an interface communicates the result, progress and current state of user interactions.

Every interactive component must provide an appropriate response to user input.

Feedback may be:

- Visual.
- Behavioral.
- Textual.
- Auditory, where appropriate.
- Haptic, where supported.

The feedback must help users understand what happened without introducing unnecessary visual noise.

### Core principle

**Every meaningful interaction must have a meaningful, observable and understandable response.**

## 1.2. Expected characteristics

The library must favor:

- Immediate acknowledgment.
- Predictable state changes.
- Clear interaction affordances.
- Consistent feedback patterns.
- Proportional visual responses.
- Explicit asynchronous states.
- Clear error communication.
- Subtle but perceptible transitions.
- Stable component geometry.
- Accessible state communication.

Avoid:

- Silent interactions.
- Ambiguous states.
- Delayed visual acknowledgment.
- Excessive animations.
- Inconsistent feedback between components.
- Decorative feedback without functional meaning.
- Layout shifts during state changes.
- Success indicators without actual success.
- Errors communicated only through color.

## 1.3. Feedback versus decoration

Feedback must communicate a real interaction state.

A visual change that does not help users understand an interaction should not be introduced merely for aesthetic reasons.

|Functional feedback|Decorative behavior|
|---|---|
|Button visibly responds to activation|Arbitrary animation|
|Input communicates validation errors|Random border color changes|
|Loading state indicates pending work|Permanent animated spinner|
|Selected item communicates selection|Decorative highlighting|
|Success message confirms completion|Unrelated success animation|

## 1.4. Rules

- Every interactive component must define its feedback states.
- Feedback must correspond to actual component state.
- Feedback must be proportionate to interaction importance.
- State changes must be perceivable.
- Feedback must not unnecessarily interrupt workflows.
- Visual feedback must be complemented by semantic feedback where required.
- Equivalent interactions must produce equivalent responses.

## 1.5. Audit checklist

- [ ] Every interactive component provides feedback.
- [ ] Feedback corresponds to actual state.
- [ ] Interaction responses are immediately perceivable.
- [ ] Feedback patterns are consistent.
- [ ] Feedback is proportionate to the action.
- [ ] State changes are understandable.
- [ ] No decorative behavior replaces functional feedback.

---

# 2. Standard Interaction State Model

## 2.1. Definition

Every interactive component must implement an appropriate subset of a shared interaction state model.

The objective is to standardize the meaning and visual treatment of interaction states throughout the library.

## 2.2. Core interaction states

|State|Definition|Expected feedback|
|---|---|---|
|Default|Normal resting state|Neutral appearance|
|Hover|Pointer is over the component|Subtle visual emphasis|
|Focus|Component receives keyboard or programmatic focus|Clear focus indicator|
|Active|Component is currently activated or selected|Distinct active appearance|
|Pressed|Pointer or activation input is pressing the component|Immediate pressed feedback|
|Selected|Component is selected as part of a persistent choice|Persistent selection indicator|
|Disabled|Interaction is unavailable|Clearly communicated unavailability|
|Loading|Operation is in progress|Progress indication|
|Success|Operation completed successfully|Confirmation|
|Error|Operation failed or input is invalid|Error indication|

Not every component needs every state.

For example, a static Badge does not require hover, pressed or loading states unless it is interactive.

## 2.3. State independence

Interaction states must not be treated as interchangeable.

For example:

- Hover does not mean selected.
- Focus does not mean active.
- Active does not necessarily mean pressed.
- Loading does not necessarily mean disabled.
- Disabled does not mean visually invisible.
- Error does not necessarily mean an operation has failed.

The library must define how states interact when multiple conditions apply.

## 2.4. State priority

A component may simultaneously be:

- Focused and selected.
- Hovered and selected.
- Loading and disabled.
- Focused and invalid.

The visual system must define predictable combinations.

Example:

|Combination|Expected behavior|
|---|---|
|Hover + Selected|Preserve selection, apply subtle hover emphasis|
|Focus + Selected|Preserve selection and show focus indicator|
|Focus + Error|Preserve error indication and show focus indicator|
|Loading + Disabled|Preserve loading feedback and prevent conflicting interaction|
|Hover + Disabled|No interactive hover treatment|

## 2.5. Rules

- Define supported states per component.
- Keep state semantics consistent.
- Avoid ambiguous combinations.
- Preserve important state indicators.
- Ensure state transitions do not create layout shifts.
- Do not infer functional state exclusively from CSS.
- Keep visual and behavioral states synchronized.

## 2.6. Audit checklist

- [ ] Supported states are documented.
- [ ] State meanings are consistent.
- [ ] State combinations are predictable.
- [ ] Visual and functional states are synchronized.
- [ ] Disabled behavior is correct.
- [ ] Loading behavior is explicit.
- [ ] Error and success states are distinguishable.

---

# 3. Immediate Interaction Acknowledgment

## 3.1. Definition

When users interact with a component, the interface should acknowledge the action immediately.

The system should not leave users wondering whether their input was registered.

This is especially important for buttons, switches, checkboxes, menus and selection controls.

## 3.2. Expected behavior

|Interaction|Immediate feedback|
|---|---|
|Button click|Pressed state|
|Checkbox click|Checked state|
|Switch activation|Toggle state|
|Tab selection|Active tab changes|
|Menu trigger|Menu opens|
|Accordion trigger|Expanded state changes|
|Select option|Selection is reflected|
|Row selection|Selected appearance|
|Drag interaction|Drag state becomes visible|

## 3.3. Rules

- Acknowledge interactions as quickly as possible.
- Do not wait for unrelated asynchronous operations before showing local feedback.
- Provide immediate visual acknowledgment when the interaction is accepted.
- Prevent repeated activation when an operation must be exclusive.
- Avoid showing acknowledgment for interactions that were rejected.
- Preserve predictable pointer and keyboard behavior.

## 3.4. Audit checklist

- [ ] Interactions receive immediate acknowledgment.
- [ ] Accepted actions are visibly reflected.
- [ ] Rejected actions do not produce misleading feedback.
- [ ] Repeated activation is handled correctly.
- [ ] Keyboard interactions receive equivalent feedback.

---

# 4. Hover Feedback

## 4.1. Definition

Hover feedback communicates that an element is interactive and that the pointer is currently positioned over it.

It provides a lightweight indication of available interaction.

## 4.2. Expected visual characteristics

- Subtle background change.
- Controlled border emphasis.
- Small icon or text color adjustment.
- Contextual action appearance.
- No unnecessary scaling.
- No layout displacement.

## 4.3. Component-specific behavior

|Component|Recommended hover feedback|
|---|---|
|Button|Subtle background or border adjustment|
|IconButton|Background emphasis|
|ListItem|Subtle surface emphasis|
|MenuItem|Background emphasis|
|Card|Only when the card is interactive|
|TableRow|Contextual surface emphasis|
|NavigationItem|Background and text emphasis|
|Input|Usually no hover change unless it communicates interactivity|

## 4.4. Rules

- Hover feedback must be subtle.
- Hover must not alter component dimensions.
- Hover must not replace focus feedback.
- Disabled components must not display misleading hover states.
- Non-interactive elements must not appear interactive.
- Hover must not be required for touch accessibility.
- Hover effects must remain consistent across component families.

## 4.5. Audit checklist

- [ ] Interactive components provide hover feedback.
- [ ] Hover intensity is restrained.
- [ ] Non-interactive elements remain visually neutral.
- [ ] Disabled components do not imply interactivity.
- [ ] No layout shifts occur.
- [ ] Hover does not replace focus.

---

# 5. Focus Feedback

## 5.1. Definition

Focus feedback communicates which component currently receives keyboard or programmatic interaction.

It is essential for keyboard navigation and accessibility.

Focus must be clearly distinguishable from hover and selection.

## 5.2. Focus appearance

The library should provide a centralized focus treatment.

Example:

```css
:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```

The exact thickness, color and offset must be defined by the design tokens and visual language.

## 5.3. Rules

- All keyboard-operable controls must expose visible focus.
- Focus must not depend on hover.
- Focus must remain distinguishable against all supported surfaces.
- Focus indicators must not be clipped.
- Focus indicators must not create layout shifts.
- Focus must remain visible in dark and light themes.
- Mouse and keyboard focus behavior may differ, but keyboard focus must never be suppressed.
- Programmatic focus must be visually understandable where appropriate.

## 5.4. Focus versus hover

|Property|Hover|Focus|
|---|---|---|
|Trigger|Pointer position|Keyboard or programmatic navigation|
|Persistence|Pointer-dependent|Until focus moves|
|Accessibility|Not sufficient|Essential|
|Visual treatment|Subtle|Clearly visible|
|Disabled behavior|No interactive treatment|Disabled controls are not normally focusable|

## 5.5. Audit checklist

- [ ] Every interactive component has visible focus.
- [ ] Focus is distinguishable from hover.
- [ ] Focus indicators have sufficient contrast.
- [ ] Focus is not clipped.
- [ ] Focus does not cause layout shifts.
- [ ] Focus remains visible across themes.
- [ ] Keyboard navigation is supported.

---

# 6. Active and Pressed Feedback

## 6.1. Definition

Active and pressed feedback communicates that a component is currently being activated or is in an active interaction state.

These states are particularly important for controls that respond to pointer or keyboard activation.

## 6.2. Expected behavior

|Component|Active / pressed feedback|
|---|---|
|Button|Subtle pressed surface|
|IconButton|Pressed background|
|Toggle|Changed active position|
|Checkbox|Checked indicator|
|Radio|Selected indicator|
|Tab|Active selection treatment|
|MenuItem|Activation feedback|
|SegmentedControl|Selected segment|

## 6.3. Rules

- Pressed feedback must be immediate.
- Active state must be distinguishable from hover.
- Persistent selection must remain visible after activation.
- Pressed feedback must not cause layout changes.
- Keyboard activation must produce equivalent feedback.
- Release behavior must be predictable.
- Avoid excessive movement or scaling.

## 6.4. Audit checklist

- [ ] Pressed feedback is immediate.
- [ ] Active and selected states are distinguishable.
- [ ] Keyboard activation is supported.
- [ ] Selection persists appropriately.
- [ ] No unexpected geometry changes occur.

---

# 7. Selected State Feedback

## 7.1. Definition

Selected feedback communicates a persistent choice or active item within a group.

Unlike hover, selection must remain visible after the pointer leaves the component.

## 7.2. Appropriate applications

- Tabs.
- Radio groups.
- Checkboxes.
- Segmented controls.
- Navigation items.
- Selectable list items.
- Table rows.
- Multi-select controls.
- Filters.
- Toggle groups.

## 7.3. Visual characteristics

Selection may be communicated through:

- Background treatment.
- Border emphasis.
- Indicator icon.
- Text weight.
- Text color.
- Selection marker.
- Checkmark.
- Active underline.

## 7.4. Rules

- Selection must be visually persistent.
- Selection must be distinguishable from hover.
- Selected states must not rely on color alone.
- Selection must be synchronized with actual value.
- Single-selection and multi-selection must be visually distinguishable.
- Selection behavior must remain consistent within component groups.
- Selection must be accessible to assistive technologies.

## 7.5. Audit checklist

- [ ] Selected elements remain visually selected.
- [ ] Selection differs from hover.
- [ ] Selection is not communicated through color alone.
- [ ] Selection reflects actual component value.
- [ ] Single and multiple selection are distinguishable.
- [ ] Accessibility semantics are correct.

---

# 8. Disabled State Feedback

## 8.1. Definition

Disabled feedback communicates that an action or control is currently unavailable.

The component must communicate unavailability without disappearing or becoming visually ambiguous.

## 8.2. Expected characteristics

- Reduced visual emphasis.
- Appropriate text and icon contrast.
- No misleading hover response.
- No activation feedback.
- Consistent cursor behavior where relevant.
- Clear distinction from loading and read-only states.

## 8.3. Disabled versus read-only

These states have different meanings.

|State|Meaning|Interaction|
|---|---|---|
|Disabled|Action is unavailable|Cannot activate|
|Read-only|Value cannot be modified|May remain focusable and readable|
|Loading|Operation is in progress|Depends on operation|
|Inert|Entire region is temporarily non-interactive|No interaction within region|

## 8.4. Rules

- Disabled components must not execute actions.
- Disabled states must be visually identifiable.
- Disabled controls must not appear selected unless selection is independently meaningful.
- Read-only components must remain distinguishable from disabled components.
- Disabled state must be semantically communicated.
- Avoid reducing opacity to a level that makes text unreadable.
- Provide explanations when the reason for unavailability is not obvious.

## 8.5. Audit checklist

- [ ] Disabled controls cannot be activated.
- [ ] Disabled appearance is consistent.
- [ ] Disabled and read-only states are distinguishable.
- [ ] Text remains sufficiently readable.
- [ ] Hover does not imply availability.
- [ ] State is exposed semantically.

---

# 9. Loading and Pending Feedback

## 9.1. Definition

Loading feedback communicates that an operation has started but has not yet completed.

It is essential for asynchronous operations.

Users must be able to distinguish between an interface that is processing a request and an interface that is unresponsive.

## 9.2. Loading patterns

|Pattern|Appropriate usage|
|---|---|
|Spinner|Short indeterminate operation|
|Skeleton|Content structure loading|
|Progress bar|Measurable operation progress|
|Button loading|Action execution|
|Inline loader|Local asynchronous operation|
|Pending indicator|Background processing|

## 9.3. Button loading

Example:

```text
DEFAULT

[ Save changes ]


LOADING

[ Spinner  Saving... ]


SUCCESS

[ Check  Saved ]
```

## 9.4. Rules

- Loading feedback must appear promptly.
- Loading must be associated with the relevant operation.
- Preserve component dimensions during loading.
- Prevent duplicate submissions when appropriate.
- Keep the user informed for longer operations.
- Avoid unnecessary full-page blocking.
- Prefer localized loading indicators.
- Distinguish indeterminate from determinate progress.
- Do not display indefinite loading without appropriate recovery or cancellation options.

## 9.5. Audit checklist

- [ ] Loading states are defined.
- [ ] Loading feedback appears promptly.
- [ ] Loading is associated with the correct operation.
- [ ] Component geometry remains stable.
- [ ] Duplicate submissions are handled.
- [ ] Long-running operations communicate progress where possible.
- [ ] Loading and success states are distinguishable.

---

# 10. Success Feedback

## 10.1. Definition

Success feedback confirms that an operation has completed successfully.

It should provide sufficient confirmation without interrupting the user's workflow.

## 10.2. Feedback hierarchy

|Operation|Recommended feedback|
|---|---|
|Toggle|Updated control state|
|Checkbox|Checked state|
|Save field|Inline confirmation|
|Save form|Confirmation message|
|Create entity|Updated list or confirmation|
|Delete entity|Updated interface and confirmation|
|Export file|Completion notification|
|Copy action|Brief contextual confirmation|

## 10.3. Rules

- Success must reflect actual completion.
- Do not show success before the operation has succeeded.
- Prefer contextual confirmation.
- Avoid unnecessary confirmation dialogs.
- Use notifications for operations whose result is not otherwise visible.
- Keep confirmation messages concise.
- Preserve the user's workflow.
- Avoid excessive celebratory animation.

## 10.4. Audit checklist

- [ ] Success is shown only after actual completion.
- [ ] Confirmation is associated with the correct action.
- [ ] Feedback is proportionate.
- [ ] Success messages are concise.
- [ ] Confirmation does not unnecessarily interrupt.
- [ ] The resulting interface state reflects the successful operation.

---

# 11. Error Feedback

## 11.1. Definition

Error feedback communicates that an action could not be completed or that an input violates a defined requirement.

It must help users understand what went wrong and how to recover.

## 11.2. Error categories

|Category|Example|Recommended feedback|
|---|---|---|
|Validation|Invalid email|Inline field error|
|Required field|Missing value|Field-level message|
|Network|Connection unavailable|Contextual error or notification|
|Permission|Access denied|Clear explanation|
|Server|Request failed|Operation-level error|
|Conflict|Duplicate resource|Contextual explanation|
|Unexpected|Unknown failure|Recoverable error message|

## 11.3. Error presentation

An error should communicate:

1. What happened.
2. Which element or operation is affected.
3. What the user can do next.

Example:

```text
Email address

[ invalid-email ]

Please enter a valid email address.
```

## 11.4. Rules

- Errors must be clearly identifiable.
- Error messages must be specific.
- Explain how to resolve the issue where possible.
- Associate errors with the relevant control.
- Do not rely exclusively on red color.
- Preserve user-entered values whenever possible.
- Avoid generic messages when specific information is available.
- Do not show errors for interactions that have not yet been meaningfully validated unless required.
- Clear or update errors when their underlying conditions change.

## 11.5. Audit checklist

- [ ] Errors are visually identifiable.
- [ ] Error messages are specific.
- [ ] Errors identify the affected control.
- [ ] Recovery guidance is provided where possible.
- [ ] Errors are not communicated through color alone.
- [ ] User input is preserved.
- [ ] Error states are accessible.
- [ ] Stale errors are cleared appropriately.

---

# 12. Validation Feedback

## 12.1. Definition

Validation feedback communicates whether a value satisfies the requirements of a control or form.

It must provide useful information without interrupting input unnecessarily.

## 12.2. Validation timing

|Validation strategy|Appropriate usage|
|---|---|
|On input|Immediate formatting and simple constraints|
|On blur|Field validation after interaction|
|On submit|Form-level validation|
|Async validation|Remote or server-dependent checks|
|Cross-field validation|Relationships between multiple values|

## 12.3. Rules

- Choose validation timing according to the interaction.
- Avoid premature error messages.
- Keep validation messages close to affected controls.
- Communicate valid states only when useful.
- Distinguish invalid, pending and valid states.
- Preserve entered values.
- Avoid repeatedly announcing unchanged errors to screen readers.
- Ensure asynchronous validation does not overwrite newer input.

## 12.4. Audit checklist

- [ ] Validation timing is intentional.
- [ ] Errors appear at appropriate moments.
- [ ] Valid and invalid states are distinguishable.
- [ ] Async validation is race-safe.
- [ ] Validation feedback is accessible.
- [ ] Field values are preserved.

---

# 13. Optimistic Updates and Asynchronous Feedback

## 13.1. Definition

Optimistic updates immediately reflect an expected result before the server confirms completion.

They improve perceived responsiveness but require clear handling of failures.

## 13.2. Appropriate applications

- Favorite toggles.
- Checklists.
- Task completion.
- Lightweight status changes.
- Reactions.
- Simple local preferences.

## 13.3. Feedback lifecycle

```text
USER ACTION
    |
    v
IMMEDIATE UI UPDATE
    |
    v
PENDING REQUEST
    |
    +------------------+
    |                  |
    v                  v
SUCCESS              FAILURE
    |                  |
    v                  v
CONFIRM STATE       ROLLBACK / RECOVER
                       |
                       v
                 ERROR FEEDBACK
```

## 13.4. Rules

- Use optimistic updates only when rollback is manageable.
- Keep pending state distinguishable where necessary.
- Roll back failed optimistic updates.
- Communicate failures clearly.
- Prevent stale requests from overwriting newer state.
- Preserve user intent during retries.
- Avoid optimistic behavior for operations with irreversible consequences unless explicitly justified.
- Keep local and remote state synchronized.

## 13.5. Audit checklist

- [ ] Optimistic updates are justified.
- [ ] Pending state is handled correctly.
- [ ] Failed updates are rolled back or recovered.
- [ ] Errors are communicated.
- [ ] Concurrent requests are handled safely.
- [ ] Local and remote states remain synchronized.

---

# 14. Feedback for Selection and Data Entry

## 14.1. Definition

Selection and data-entry components must communicate the relationship between user input and the current value.

## 14.2. Component expectations

|Component|Required feedback|
|---|---|
|Input|Focus, invalid, disabled, read-only|
|Textarea|Focus, invalid, disabled, character limits where relevant|
|Checkbox|Checked, unchecked, indeterminate|
|Radio|Selected and unselected|
|Switch|On and off|
|Select|Open, focused, selected|
|Combobox|Query, active option, selected option|
|Slider|Current value and interaction|
|DatePicker|Selected date, active date, disabled dates|

## 14.3. Rules

- Current values must be visually understandable.
- Selection changes must be immediate when locally controlled.
- Focus must remain visible.
- Invalid values must be clearly communicated.
- Disabled options must be distinguishable.
- Multi-selection must be visually identifiable.
- Complex controls must expose meaningful active-option feedback.

## 14.4. Audit checklist

- [ ] Current values are visible.
- [ ] Selection feedback is immediate.
- [ ] Focus and selection are distinguishable.
- [ ] Invalid values are communicated.
- [ ] Disabled options are identifiable.
- [ ] Complex controls communicate active options.

---

# 15. Feedback Consistency Across Components

## 15.1. Definition

Equivalent interactions must produce consistent feedback across the library.

Users should not need to relearn interaction behavior for every component.

## 15.2. Examples

|Interaction|Consistency requirement|
|---|---|
|Hover|Comparable emphasis|
|Focus|Shared focus treatment|
|Disabled|Shared availability semantics|
|Loading|Consistent progress language|
|Error|Consistent error hierarchy|
|Success|Consistent confirmation language|
|Selected|Predictable selection semantics|
|Pressed|Comparable activation response|

## 15.3. Rules

- Centralize shared feedback tokens.
- Reuse interaction-state primitives where appropriate.
- Avoid independent state styling in every component.
- Maintain consistent feedback intensity.
- Keep semantic meaning consistent.
- Document justified exceptions.

## 15.4. Audit checklist

- [ ] Equivalent states look and behave consistently.
- [ ] Shared state tokens are used.
- [ ] Feedback intensity is predictable.
- [ ] Semantic meanings are preserved.
- [ ] Exceptions are documented.

---

# 16. Feedback and Visual Hierarchy

## 16.1. Definition

Interaction feedback must respect the overall visual hierarchy.

Not every state change deserves the same visual intensity.

A subtle hover should not compete with an important error or critical notification.

## 16.2. Feedback intensity hierarchy

|Intensity|Purpose|Examples|
|---|---|---|
|Minimal|Acknowledge minor interaction|Hover|
|Low|Communicate local state|Selected tab|
|Medium|Communicate meaningful status|Saved confirmation|
|High|Communicate important failure|Form submission error|
|Critical|Communicate severe or blocking conditions|Permission or system failure|

## 16.3. Rules

- Match visual intensity to functional importance.
- Avoid using high-emphasis colors for minor interactions.
- Keep hover and focus visually restrained.
- Make important errors sufficiently prominent.
- Reserve critical treatments for genuinely critical conditions.
- Avoid competing feedback signals.

## 16.4. Audit checklist

- [ ] Feedback intensity matches importance.
- [ ] Minor interactions remain subtle.
- [ ] Errors receive appropriate emphasis.
- [ ] Critical states are distinguishable.
- [ ] No competing visual feedback exists.

---

# 17. Feedback Timing and Persistence

## 17.1. Definition

Feedback must appear and disappear at appropriate moments.

Incorrect timing can make even a visually refined interaction feel unreliable.

## 17.2. Timing categories

|Feedback|Timing behavior|
|---|---|
|Hover|Follows pointer state|
|Focus|Persists while focused|
|Pressed|Follows activation|
|Selected|Persists while selected|
|Loading|Persists while operation is pending|
|Success toast|Temporarily visible|
|Validation error|Persists while condition remains unresolved|
|Critical error|Remains visible until understood or resolved|

## 17.3. Rules

- Do not dismiss important errors automatically.
- Avoid success messages that disappear before users can perceive them.
- Keep selected states persistent.
- Keep loading states synchronized with operation lifecycle.
- Avoid feedback flickering.
- Avoid unnecessary repeated notifications.
- Ensure transitions do not obscure important state changes.

## 17.4. Audit checklist

- [ ] Feedback timing is intentional.
- [ ] Persistent states remain visible.
- [ ] Temporary feedback has appropriate duration.
- [ ] Errors are not dismissed prematurely.
- [ ] Loading follows the actual operation lifecycle.
- [ ] Feedback does not flicker.

---

# 18. Feedback and Motion

## 18.1. Definition

Motion reinforces feedback by making state transitions perceivable.

It should help users understand the relationship between an interaction and its result.

## 18.2. Appropriate motion

- Subtle hover transitions.
- Button pressed transitions.
- Checkbox state transitions.
- Switch movement.
- Menu appearance.
- Dialog presentation.
- Loading indicators.
- Success indicator appearance.
- Progress updates.

## 18.3. Rules

- Motion must communicate state change.
- Avoid excessive animation.
- Use consistent duration and easing tokens.
- Preserve component geometry.
- Respect reduced-motion preferences.
- Avoid decorative animation during routine operations.
- Do not use animation as the only communication mechanism.

## 18.4. Audit checklist

- [ ] Motion communicates meaningful changes.
- [ ] Transitions are consistent.
- [ ] Durations are appropriate.
- [ ] Geometry remains stable.
- [ ] Reduced-motion preferences are respected.
- [ ] Important feedback remains understandable without motion.

---

# 19. Accessibility of Interaction Feedback

## 19.1. Definition

Feedback must be perceivable and understandable regardless of input method or assistive technology.

Visual changes alone are insufficient for some interaction states.

## 19.2. Rules

- Never rely exclusively on color.
- Expose selection state semantically.
- Expose disabled state semantically.
- Communicate validation errors programmatically.
- Use appropriate live regions for asynchronous feedback.
- Avoid excessively frequent live announcements.
- Ensure focus indicators are visible.
- Preserve keyboard interaction.
- Provide accessible names for icon-only controls.
- Ensure status messages do not steal focus unnecessarily.

## 19.3. Semantic considerations

Depending on component type, evaluate:

- `aria-invalid`.
- `aria-describedby`.
- `aria-pressed`.
- `aria-checked`.
- `aria-selected`.
- `aria-disabled`.
- `aria-busy`.
- `role="status"`.
- `role="alert"`.

These attributes must be applied according to the actual semantic role, not indiscriminately.

## 19.4. Audit checklist

- [ ] Feedback is not color-only.
- [ ] Component state is semantically exposed.
- [ ] Validation errors are programmatically associated.
- [ ] Async feedback is accessible.
- [ ] Live announcements are appropriately timed.
- [ ] Keyboard feedback is preserved.
- [ ] Focus is not unnecessarily stolen.

---

# 20. Interaction Feedback in Reef.js State-Based Architecture

## 20.1. Definition

The interaction feedback system must remain synchronized with Reef.js reactive state.

Visual feedback must be derived from the actual component state rather than maintained through unrelated DOM mutations.

## 20.2. State ownership

Distinguish:

- Interaction state.
- Component value state.
- Async operation state.
- Validation state.
- Presentation state.

These states may interact, but they should not be unnecessarily duplicated.

## 20.3. Recommended conceptual state model

```ts
type InteractionState = {
  hovered: boolean
  focused: boolean
  pressed: boolean
  disabled: boolean
}

type AsyncState =
  | "idle"
  | "pending"
  | "success"
  | "error"

type ValidationState =
  | "pristine"
  | "valid"
  | "invalid"
  | "validating"
```

This is a conceptual model, not a requirement to expose every property in every component API.

## 20.4. Architecture rules

- Derive visual feedback from reactive state.
- Avoid direct DOM manipulation to simulate component states.
- Keep component value and visual state synchronized.
- Avoid redundant state storage.
- Clean up event listeners and subscriptions.
- Prevent stale asynchronous updates.
- Preserve state across component updates where appropriate.
- Separate interaction logic from visual presentation.
- Ensure state transitions are deterministic.

## 20.5. Audit checklist

- [ ] Visual feedback derives from actual state.
- [ ] Reactive updates are synchronized.
- [ ] State duplication is minimized.
- [ ] Event listeners are cleaned up.
- [ ] Async updates cannot corrupt current state.
- [ ] DOM state is not maintained independently without justification.
- [ ] State transitions are deterministic.

---

# 21. Interaction Feedback Anti-Patterns

|Anti-pattern|Problem|Expected correction|
|---|---|---|
|No click feedback|Interaction uncertainty|Add immediate acknowledgment|
|Hover-only state|Inaccessible interaction|Implement focus feedback|
|Focus without indicator|Poor keyboard usability|Centralize focus treatment|
|Selection communicated only by color|Ambiguous state|Add additional visual indicators|
|Disabled opacity too low|Poor readability|Calibrate disabled contrast|
|Loading without indication|Perceived unresponsiveness|Add contextual loading state|
|Spinner without context|Unclear operation|Associate loader with action|
|Success before completion|Misleading feedback|Confirm actual success|
|Generic error messages|Poor recovery|Provide specific guidance|
|Error only through color|Accessibility failure|Add text and semantics|
|Excessive notifications|Workflow interruption|Use contextual feedback|
|State flickering|Perceived instability|Stabilize state transitions|
|Layout shift during loading|Visual instability|Reserve component dimensions|
|Uncontrolled optimistic update|State inconsistency|Implement rollback|
|Inconsistent state styling|Fragmented design language|Centralize feedback tokens|
|Animation without purpose|Visual distraction|Use functional motion|

---

# 22. Interaction Feedback Audit Methodology

Every interactive component must be audited through the following dimensions.

## 22.1. State completeness

- Are all relevant interaction states defined?
- Are state combinations predictable?
- Are states visually distinguishable?
- Are states synchronized with functionality?

## 22.2. Immediate acknowledgment

- Does the component respond immediately?
- Is the interaction visibly registered?
- Is feedback proportional?

## 22.3. Visual feedback

- Are hover, focus and pressed treatments consistent?
- Are selected and disabled states distinguishable?
- Are error and success treatments appropriate?

## 22.4. Asynchronous feedback

- Is loading visible?
- Is progress communicated where appropriate?
- Are success and failure handled correctly?
- Are optimistic updates recoverable?

## 22.5. Validation

- Is validation timing appropriate?
- Are errors specific?
- Is recovery possible?
- Is user input preserved?

## 22.6. Timing

- Does feedback appear at the right moment?
- Does persistent feedback remain visible?
- Are temporary messages appropriately timed?
- Are transitions stable?

## 22.7. Accessibility

- Is feedback perceivable without color?
- Are semantic states exposed?
- Is keyboard feedback correct?
- Are asynchronous updates announced appropriately?

## 22.8. Reef.js reactivity

- Does feedback derive from reactive state?
- Are state transitions deterministic?
- Is asynchronous state synchronized?
- Are redundant state sources avoided?

---

# 23. Interaction Feedback Scoring

Each component must receive a score from 0 to 4 across eight dimensions.

|Dimension|Weight|
|---|---|
|State completeness|15%|
|Immediate acknowledgment|10%|
|Visual feedback consistency|15%|
|Async feedback|15%|
|Validation and errors|15%|
|Timing and persistence|10%|
|Accessibility|10%|
|Reactive state integration|10%|

### Scoring scale

|Score|Classification|Description|
|---|---|---|
|0|Missing|No meaningful interaction feedback|
|1|Poor|Inconsistent or misleading feedback|
|2|Partial|Basic states implemented with significant gaps|
|3|Good|Consistent, understandable and accessible feedback|
|4|Excellent|Precise, immediate and highly refined feedback|

Weighted score:

`(States × 0.15) + (Acknowledgment × 0.10) + (Visual × 0.15) + (Async × 0.15) + (Validation × 0.15) + (Timing × 0.10) + (Accessibility × 0.10) + (Reactivity × 0.10)`

### Mandatory constraints

A component cannot be considered compliant if:

- An interactive state has no appropriate feedback.
- Keyboard focus is not visible.
- Errors are communicated only through color.
- Loading states are misleading.
- Success is displayed before completion.
- Visual state is inconsistent with actual component state.
- Important asynchronous feedback is inaccessible.

Accessibility failures must be tracked independently of the average score.

---

# 24. Remediation Guidelines

When a component fails the interaction feedback audit, apply corrections in the following order:

1. Identify every possible interaction state.
2. Document the expected behavior of each state.
3. Define state combinations and priorities.
4. Correct immediate interaction acknowledgment.
5. Standardize hover, focus, active and pressed feedback.
6. Correct selected and disabled treatments.
7. Implement loading and pending feedback.
8. Correct success and error communication.
9. Review validation timing.
10. Verify asynchronous state synchronization.
11. Validate feedback timing and persistence.
12. Test accessibility semantics.
13. Verify keyboard and touch behavior.
14. Test reactive state updates in Reef.js.
15. Validate the component inside realistic compositions.

Do not begin by adjusting colors and animations.

First establish the semantic and behavioral correctness of every state.

Then refine its visual presentation.

---

# 25. Final Acceptance Criteria

The interaction feedback system is considered successfully implemented when:

- Every interactive component defines relevant states.
- State semantics are consistent throughout the library.
- User interactions receive immediate acknowledgment.
- Hover, focus and pressed states are visually coherent.
- Selected states remain persistent.
- Disabled states are clearly communicated.
- Loading states accurately represent pending operations.
- Success feedback reflects actual completion.
- Error feedback provides actionable information.
- Validation timing is appropriate.
- Optimistic updates can recover from failures.
- Feedback timing is predictable.
- Motion is restrained and purposeful.
- Accessibility is preserved.
- Feedback derives from actual Reef.js reactive state.
- No misleading or contradictory feedback exists.

---

# 26. Final Principle

Interaction feedback is the communication layer between the user's intentions and the system's behavior.

A refined interface does not merely respond to interactions.

It continuously communicates what is happening, what has changed and what the user can expect next.

Every state should be perceptible, every response should be meaningful and every transition should reinforce confidence in the system.

**The objective is immediate acknowledgment, clear state communication and consistent behavioral feedback without unnecessary visual noise.**