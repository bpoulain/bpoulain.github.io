# Interaction Patterns

> **Purpose:** Define a unified interaction model across all Reef.js UI components.
> 
> **Scope:** Interaction conventions, input modalities, feedback, focus management, selection, overlays, forms, navigation, state ownership and interaction accessibility.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.
> 
> **Framework:** Reef.js — state-based reactive framework.

---

# 1. Interaction Philosophy

## 1.1. Definition

An interaction pattern defines a reusable behavioral convention governing how users interact with UI components.

It specifies:

- How an interaction starts.
- How the component responds.
- How its state changes.
- What visual feedback is provided.
- How the interaction ends.
- How the interaction can be interrupted.
- How keyboard and assistive technologies interact with it.

Interaction consistency ensures that users do not need to relearn basic behaviors when moving between components.

## 1.2. Core Interaction Principles

### Principle 1 — Predictability

Identical interactions should produce consistent outcomes.

Examples:

- Escape closes dismissible overlays.
- Enter activates the focused action where appropriate.
- Disabled controls cannot be activated.
- Focus indicators follow a consistent visual language.

### Principle 2 — Immediate Feedback

Every meaningful user action should receive an understandable response.

Examples:

- Buttons provide pressed feedback.
- Inputs expose focus and validation states.
- Selects communicate their open and selected states.
- Loading operations communicate that an action is processing.

### Principle 3 — Interaction Restraint

Interactions should remain subtle and purposeful.

Avoid:

- Excessive animations.
- Unnecessary hover effects.
- Aggressive color changes.
- Decorative movement.
- Unexpected layout shifts.

### Principle 4 — Consistency Across Input Modalities

Mouse, keyboard, touch and assistive technologies should provide equivalent access to functionality.

### Principle 5 — State Transparency

The user should understand the current state of a component and the result of interacting with it.

### Principle 6 — Reversibility

Where appropriate, users should be able to cancel, dismiss, undo or reverse an action.

### Principle 7 — Respect for User Intent

Never trigger consequential actions unexpectedly.

Avoid accidental activation, surprising focus changes and unexpected dismissal.

## 1.3. Global Audit Checklist

- [ ] Interactions are predictable.
- [ ] Feedback is immediate.
- [ ] Interaction behavior is consistent.
- [ ] Keyboard alternatives exist.
- [ ] Touch interactions are supported.
- [ ] State changes are communicated.
- [ ] Actions can be cancelled where appropriate.
- [ ] Destructive actions are protected.
- [ ] Interactions respect reduced-motion preferences.
- [ ] No interaction produces unexpected layout shifts.

---

# 2. Interaction State Model

## 2.1. Definition

Every interactive component must have a clearly defined state model.

A component's state model describes its possible states and the transitions between them.

## 2.2. Common Interaction States

|State|Description|Typical feedback|
|---|---|---|
|Idle|Default state|Base appearance|
|Hover|Pointer is over the component|Subtle surface change|
|Focus|Component has keyboard or programmatic focus|Visible focus indicator|
|Active|Component is being activated|Pressed appearance|
|Selected|Component is selected|Selection indicator|
|Disabled|Interaction is unavailable|Reduced emphasis and blocked interaction|
|Loading|Operation is processing|Loading indicator|
|Error|Operation or validation failed|Error treatment|
|Success|Operation completed|Confirmation feedback|

Not all states apply to all components.

## 2.3. State Independence

Interaction states must not be implemented as mutually exclusive visual conditions when they can coexist.

For example:

- A Button can be hovered and focused.
- A Checkbox can be selected and focused.
- An Input can be focused and invalid.
- A Select can be open while an option is highlighted.

Define state precedence explicitly.

Recommended conceptual precedence:

1. Disabled behavior.
2. Loading restrictions, when applicable.
3. Component interaction state.
4. Validation or semantic state.
5. Default visual state.

This is not a universal CSS cascade order. It is a behavioral priority model.

## 2.4. State Transition Requirements

Every transition must define:

- Trigger.
- Previous state.
- Next state.
- Visual feedback.
- Callback behavior.
- Side effects.
- Cancellation behavior.

Example:

```text
Button

Idle
  ├── Pointer enters → Hover
  ├── Keyboard focus → Focus
  ├── Pointer down → Active
  ├── Activation → Action
  └── Disabled → Disabled

Hover
  ├── Pointer leaves → Idle
  ├── Pointer down → Active
  └── Keyboard focus → Focus + Hover

Active
  ├── Pointer release → Action / Hover / Idle
  └── Pointer cancellation → Hover / Idle
```

## 2.5. Audit Checklist

- [ ] All applicable states are identified.
- [ ] State transitions are documented.
- [ ] Overlapping states are supported.
- [ ] Invalid transitions are prevented.
- [ ] State changes produce appropriate feedback.
- [ ] External state changes are handled.
- [ ] State transitions are deterministic.

---

# 3. Pointer Interaction Patterns

## 3.1. Hover

Hover communicates that an element is interactive or that additional information is available.

### Rules

- Use hover feedback only for pointer-capable interactions.
- Keep visual changes subtle.
- Do not communicate essential information through hover alone.
- Avoid layout shifts.
- Do not make hover the only way to access functionality.
- Avoid hover feedback on disabled elements.
- Ensure nested interactive elements behave correctly.

### Recommended behavior

|Component|Hover behavior|
|---|---|
|Button|Subtle background or border change|
|IconButton|Surface emphasis|
|Card (interactive)|Subtle surface or border change|
|Link|Text or underline emphasis|
|MenuItem|Highlighted surface|
|Input|Usually no significant visual change|
|Badge|Only if interactive|

## 3.2. Active / Pressed

Active communicates that an interactive element is currently being activated.

### Rules

- Provide immediate pressed feedback.
- Avoid excessive scaling.
- Preserve component geometry.
- Release feedback when the pointer or key is released.
- Handle pointer cancellation.
- Do not trigger actions multiple times unintentionally.

### Recommended behavior

A subtle background adjustment is generally preferable to noticeable movement.

## 3.3. Pointer Capture

Components implementing drag or continuous pointer interactions must manage pointer ownership correctly.

Requirements:

- Track the initiating pointer.
- Handle pointer movement outside component bounds.
- Handle pointer release.
- Handle pointer cancellation.
- Clean up listeners.
- Avoid interfering with unrelated page interactions.

Relevant components:

- Slider.
- RangeSlider.
- Drag and Drop.
- Resizable panels.
- ColorPicker.
- Custom scroll controls.

## 3.4. Outside Click

Outside-click dismissal is appropriate for certain floating interfaces.

Typical applications:

- Popover.
- Dropdown Menu.
- Context Menu.
- Combobox popup.

Rules:

- Distinguish clicks inside from clicks outside.
- Handle nested overlays.
- Avoid dismissing when interacting with a child overlay.
- Coordinate with pointer event propagation.
- Define behavior for multiple open overlays.
- Do not automatically apply outside-click dismissal to every component.

## 3.5. Double Click

Double-click must only be supported when it represents an intentional interaction.

Examples:

- Renaming a file.
- Opening a document in certain desktop-style interfaces.
- Selecting a word or item where appropriate.

Never make essential functionality accessible only through double-click.

## 3.6. Audit Checklist

- [ ] Hover behavior is intentional.
- [ ] Active feedback is immediate.
- [ ] No unwanted layout shifts occur.
- [ ] Pointer cancellation is handled.
- [ ] Pointer capture is correctly managed where required.
- [ ] Outside-click behavior is predictable.
- [ ] Nested interactions work correctly.

---

# 4. Keyboard Interaction Patterns

Keyboard behavior must be treated as a first-class interaction model, not as an accessibility feature added after implementation.

## 4.1. Fundamental Keyboard Rules

|Key|Expected behavior|
|---|---|
|Tab|Move to the next focusable element|
|Shift + Tab|Move to the previous focusable element|
|Enter|Activate buttons and links where appropriate|
|Space|Activate buttons and toggle controls where appropriate|
|Escape|Dismiss or cancel when supported|
|Arrow keys|Navigate within composite widgets where appropriate|
|Home|Move to the first item where supported|
|End|Move to the last item where supported|

Exact behavior depends on the semantic role and established interaction pattern.

## 4.2. Button

- Enter activates.
- Space activates.
- Space should not unexpectedly scroll the page when the button is activated.
- Disabled buttons cannot be activated.
- Focus remains predictable after activation.

## 4.3. Checkbox

- Space toggles checked state.
- Enter is not required to toggle a native checkbox.
- Indeterminate state must be communicated correctly.
- Disabled state prevents interaction.

## 4.4. Switch

- Space toggles the switch.
- State changes are communicated to assistive technology.
- The switch must have an accessible name.

## 4.5. Radio Group

- Arrow keys navigate between radio options.
- Selection follows the appropriate native or ARIA radio-group interaction pattern.
- Tab enters and exits the group predictably.
- Home and End may navigate to the first and last options when supported.

## 4.6. Tabs

- Arrow keys navigate between tabs.
- Home moves to the first tab.
- End moves to the last tab.
- Enter or Space activates a tab in manual activation mode.
- Automatic activation is appropriate when panel changes are immediate and do not introduce noticeable latency.
- Tab moves into the active panel according to the chosen pattern.

## 4.7. Menu

- Arrow keys navigate menu items.
- Home and End navigate to boundaries.
- Enter or Space activates the focused item.
- Escape closes the menu.
- Focus returns to the trigger when the menu closes through dismissal.

## 4.8. Dialog

- Focus moves into the dialog when opened.
- Tab remains within a modal dialog.
- Shift + Tab moves backward within the dialog.
- Escape closes a dismissible dialog.
- Focus returns to the invoking element when closed.
- Initial focus is selected according to dialog content and purpose.

## 4.9. Combobox

- Arrow keys navigate suggestions.
- Enter selects an option.
- Escape closes the popup or cancels the current suggestion interaction according to the pattern.
- Input editing remains functional.
- Active and selected options are distinguished.

## 4.10. Audit Checklist

- [ ] All interactive components are keyboard accessible.
- [ ] Keyboard conventions match semantic roles.
- [ ] Focus order is logical.
- [ ] Composite widgets implement appropriate arrow-key navigation.
- [ ] Escape behavior is consistent where applicable.
- [ ] Focus restoration works.
- [ ] No keyboard traps exist outside intended modal behavior.

---

# 5. Focus Management Patterns

## 5.1. Focus Philosophy

Focus must always communicate where keyboard interaction currently occurs.

The focus system must be visible, predictable and consistent across the library.

## 5.2. Focus Indicator

Every keyboard-operable control must provide a visible focus indicator.

Recommended design characteristics:

- Clear contrast.
- Consistent appearance.
- Appropriate offset.
- No unexpected layout shift.
- Compatibility with light and dark themes.
- Sufficient visibility against adjacent surfaces.

Focus must not be removed simply to achieve a cleaner visual appearance.

## 5.3. Focus vs Hover

Hover and focus must remain visually distinguishable.

A pointer hover is not equivalent to keyboard focus.

The library should support `:focus-visible` where appropriate, while preserving visible focus for programmatic and keyboard navigation.

## 5.4. Focus Restoration

Components that temporarily move focus must define where focus returns.

|Component|Expected focus behavior|
|---|---|
|Dialog|Return to trigger|
|Popover|Return to trigger when dismissed|
|Dropdown Menu|Return to trigger|
|Command Palette|Restore previous logical focus|
|Combobox|Keep focus in input where appropriate|
|Tooltip|Must not unexpectedly steal focus|

## 5.5. Focus Trapping

Use focus trapping only when the interaction pattern requires it.

Typical case:

- Modal Dialog.

Do not automatically trap focus in:

- Non-modal Dialog.
- Popover.
- Tooltip.
- Dropdown-like non-modal surfaces.

## 5.6. Audit Checklist

- [ ] Focus indicators are visible.
- [ ] Focus appearance is consistent.
- [ ] Focus is not lost unexpectedly.
- [ ] Focus restoration is implemented.
- [ ] Focus trapping is used only when appropriate.
- [ ] Nested overlays preserve logical focus ownership.

---

# 6. Selection Patterns

Selection behavior must be consistent across components that expose selectable content.

## 6.1. Selection Models

### Single Selection

Only one item can be selected.

Examples:

- Radio Group.
- Single Select.
- Tabs.
- Single-select Listbox.

### Multiple Selection

Multiple items can be selected.

Examples:

- Multi Select.
- Checkbox Group.
- Multi-select Listbox.

### No Selection

Items can be focused or highlighted without becoming selected.

Examples:

- Command Palette navigation.
- Menu navigation.
- Autocomplete suggestions before confirmation.

## 6.2. Selected vs Highlighted

These concepts must remain distinct.

|Concept|Meaning|
|---|---|
|Selected|Current committed selection|
|Highlighted|Current navigation target|
|Focused|Element receiving keyboard focus|
|Active|Element currently being interacted with|

For example, a Combobox can have:

- An existing selected value.
- A different highlighted suggestion.
- Focus on the input.

These states must not be conflated.

## 6.3. Selection Feedback

Selection should be communicated through more than color alone.

Possible indicators:

- Checkmark.
- Radio indicator.
- Checkbox state.
- Active tab indicator.
- Selected surface treatment.
- Appropriate ARIA state.

## 6.4. Audit Checklist

- [ ] Single and multiple selection are clearly defined.
- [ ] Selected and highlighted states are distinct.
- [ ] Selection feedback is visible.
- [ ] Selection callbacks are consistent.
- [ ] Keyboard selection works.
- [ ] Disabled options cannot be selected.
- [ ] Selection survives relevant external state updates.

---

# 7. Form Interaction Patterns

Forms must use consistent interaction and validation behavior across all form components.

## 7.1. Input Focus

- Focus must be visually apparent.
- Labels must remain associated with inputs.
- Focus must not unexpectedly modify the value.
- Input selection and cursor behavior must remain predictable.

## 7.2. Validation

Define when validation occurs.

Possible validation triggers:

- On input.
- On blur.
- On submit.
- On explicit validation.

Recommended behavior:

- Avoid displaying aggressive validation errors before the user has had an opportunity to interact.
- Clearly identify invalid fields.
- Associate error messages with the relevant field.
- Preserve entered values after validation errors.
- Provide actionable error messages.

## 7.3. Error State

An invalid field should communicate:

- Which field is invalid.
- Why it is invalid.
- How to correct it.

Example:

```text
Email address
[invalid@example]

Please enter a valid email address.
```

## 7.4. Submission

Define:

- Submission initiation.
- Loading state.
- Duplicate submission prevention.
- Success feedback.
- Error feedback.
- Retry behavior.
- Focus behavior after submission.

## 7.5. Form Reset

Reset behavior must be predictable.

- Restore initial values.
- Reset validation state where appropriate.
- Clear transient feedback.
- Synchronize controlled values with their owner.
- Avoid stale internal state.

## 7.6. Audit Checklist

- [ ] Input focus behavior is consistent.
- [ ] Labels are correctly associated.
- [ ] Validation timing is documented.
- [ ] Error messages are actionable.
- [ ] Error relationships are accessible.
- [ ] Submission prevents unintended duplicates.
- [ ] Loading feedback is provided.
- [ ] Reset behavior is predictable.

---

# 8. Overlay Interaction Patterns

Overlays include:

- Dialog.
- AlertDialog.
- Popover.
- Tooltip.
- DropdownMenu.
- ContextMenu.
- Sheet.
- Drawer.
- Command Palette.

These components require particularly consistent interaction contracts.

## 8.1. Opening

Define:

- Trigger interaction.
- Initial focus.
- Animation.
- Positioning.
- State ownership.
- Nested overlay behavior.

## 8.2. Closing

Define whether the overlay closes through:

- Escape.
- Close button.
- Outside click.
- Selection.
- Navigation.
- Programmatic state change.

Not every dismissal mechanism applies to every overlay.

For example, an AlertDialog requesting confirmation of a destructive action should not necessarily close through an accidental outside click.

## 8.3. Modal vs Non-Modal

|Behavior|Modal|Non-modal|
|---|---|---|
|Background interaction|Blocked|Available|
|Focus trap|Usually required|Not required|
|Background overlay|Often present|Usually absent|
|Escape|Usually dismisses if allowed|Usually dismisses if allowed|
|Focus restoration|Required|Required when focus was moved|
|Outside click|Component-specific|Common where appropriate|

## 8.4. Nested Overlays

Examples:

- Dialog containing a Popover.
- Dialog containing a Dropdown Menu.
- Command Palette containing a secondary Dialog.

Requirements:

- Correct overlay stacking.
- Correct pointer event handling.
- Correct focus ownership.
- Correct Escape handling.
- Correct dismissal order.
- No premature closing of parent overlays.

## 8.5. Overlay Priority

Establish a centralized overlay management strategy.

Recommended conceptual responsibilities:

- Z-index allocation.
- Focus ownership.
- Escape handling.
- Outside interaction detection.
- Scroll locking.
- Portal management.
- Nested overlay coordination.

Avoid implementing independent and conflicting overlay systems in every component.

## 8.6. Audit Checklist

- [ ] Opening behavior is predictable.
- [ ] Closing behavior is documented.
- [ ] Modal semantics are correct.
- [ ] Focus management is correct.
- [ ] Escape behavior is correct.
- [ ] Outside-click behavior is correct.
- [ ] Nested overlays work correctly.
- [ ] Stacking order is predictable.
- [ ] Scroll locking is cleaned up correctly.

---

# 9. Navigation Interaction Patterns

## 9.1. Navigation vs Action

Preserve the distinction between navigation and actions.

- Links navigate.
- Buttons perform actions.
- Menu items can perform actions or navigation depending on their semantics.
- Tabs switch between related content views.

Do not use a button as a link merely because it looks like one.

## 9.2. Navigation Feedback

- Active route is visually identifiable.
- Current navigation context is communicated.
- Hover and focus are consistent.
- Disabled navigation is clearly represented.
- Navigation does not cause unexpected state loss.

## 9.3. Breadcrumbs

- Each navigable ancestor is a link.
- Current location is clearly identified.
- Separators are decorative.
- Keyboard navigation follows natural document order.

## 9.4. Tabs

- Selected tab is visually distinct.
- Keyboard navigation follows the chosen tab pattern.
- Associated panels are correctly identified.
- Focus and selection remain distinct in manual activation mode.

## 9.5. Audit Checklist

- [ ] Navigation and actions are semantically distinct.
- [ ] Current location is communicated.
- [ ] Active states are consistent.
- [ ] Tabs follow an established keyboard pattern.
- [ ] Navigation remains predictable.

---

# 10. Drag and Drop Interaction Patterns

Drag and drop interactions require clear visual feedback and alternative input mechanisms.

## 10.1. Drag Initiation

Define:

- Activation threshold.
- Pointer behavior.
- Touch behavior.
- Keyboard alternative.
- Drag handle behavior.

## 10.2. Drag Feedback

During dragging:

- Source item is identifiable.
- Dragged item is visually distinct.
- Valid drop targets are communicated.
- Invalid drop targets are communicated.
- Layout changes are predictable.
- Dragging does not cause accidental selection.

## 10.3. Drop Behavior

Define:

- Valid drop conditions.
- Invalid drop handling.
- Reordering behavior.
- Cancellation behavior.
- State synchronization.
- Success feedback.

## 10.4. Accessibility

Drag and drop must not be the only way to reorder or move content.

Provide alternatives such as:

- Move up/down controls.
- Keyboard-accessible commands.
- Accessible action menus.

## 10.5. Audit Checklist

- [ ] Drag initiation is predictable.
- [ ] Drag state is visible.
- [ ] Drop targets are communicated.
- [ ] Invalid drops are handled.
- [ ] Cancellation works.
- [ ] Keyboard alternatives exist.
- [ ] Touch behavior works.
- [ ] State synchronization is reliable.

---

# 11. Loading and Asynchronous Interaction Patterns

## 11.1. Loading States

Loading indicates that an operation is in progress.

Examples:

- Button submission.
- Data fetching.
- Search.
- File upload.
- Background processing.

## 11.2. Loading Behavior

Define:

- When loading starts.
- What visual feedback appears.
- Whether the component remains interactive.
- Whether duplicate actions are prevented.
- When loading ends.
- How failure is communicated.

## 11.3. Visual Guidelines

- Prefer subtle indicators.
- Preserve component geometry.
- Avoid unnecessary layout shifts.
- Use consistent spinner dimensions.
- Avoid excessive animations.
- Preserve accessible naming.

## 11.4. Optimistic Interactions

Optimistic updates may be appropriate when the expected action is reversible and the system can reconcile failures.

Requirements:

- Update feedback is immediate.
- Failure can be communicated.
- State can be rolled back.
- Duplicate requests are controlled.
- Final state is synchronized with the authoritative source.

## 11.5. Audit Checklist

- [ ] Loading is visible.
- [ ] Duplicate submissions are handled.
- [ ] Component geometry is preserved.
- [ ] Failure feedback is clear.
- [ ] Retry behavior is defined.
- [ ] Async completion synchronizes correctly with Reef.js state.
- [ ] Unmounted components do not trigger invalid updates.

---

# 12. Tooltip and Hover Information Patterns

## 12.1. Tooltip Purpose

Tooltips provide supplementary information about an interface element.

They must not contain essential instructions or interactive content that users cannot otherwise access.

## 12.2. Trigger Behavior

Define:

- Pointer hover delay.
- Keyboard focus behavior.
- Touch behavior.
- Opening delay.
- Closing delay.
- Escape behavior.

## 12.3. Visual Behavior

- Compact dimensions.
- Clear typography.
- Appropriate contrast.
- Consistent positioning.
- Minimal animation.
- No unexpected layout shifts.

## 12.4. Interaction Rules

- Tooltips should not steal focus.
- Tooltips should remain available to keyboard users.
- Hover-triggered tooltips must not disappear before users can reach their content when the tooltip is interactive; genuinely interactive content should generally use a Popover instead.
- Essential information must not be tooltip-only.

## 12.5. Audit Checklist

- [ ] Pointer trigger works.
- [ ] Keyboard focus trigger works.
- [ ] Delay is appropriate.
- [ ] Escape behavior works.
- [ ] Tooltip does not steal focus.
- [ ] Content is supplementary.
- [ ] Touch alternatives exist.

---

# 13. Search and Command Interaction Patterns

Search and command interfaces are central to productivity-oriented applications.

## 13.1. Search Input

Define:

- Input focus.
- Text editing.
- Clear action.
- Loading feedback.
- Empty results.
- No-results state.
- Error state.
- Keyboard navigation.

## 13.2. Command Palette

A Command Palette should provide:

- Predictable keyboard activation.
- Search filtering.
- Keyboard navigation.
- Highlighted result.
- Enter activation.
- Escape dismissal.
- Logical grouping.
- Empty state.
- Loading state where applicable.

## 13.3. Command Shortcuts

Keyboard shortcuts must:

- Be discoverable.
- Avoid browser and operating-system conflicts.
- Respect text-input contexts.
- Be customizable where appropriate.
- Be documented.
- Avoid unexpected activation.

## 13.4. Audit Checklist

- [ ] Search is responsive.
- [ ] Search state is synchronized.
- [ ] Keyboard navigation works.
- [ ] Highlighted and selected results are distinct.
- [ ] Empty and loading states are defined.
- [ ] Shortcuts are predictable.
- [ ] Input contexts are respected.

---

# 14. Motion and Interaction Feedback

Motion is part of the interaction system, not merely decoration.

## 14.1. Motion Purpose

Every animation should communicate at least one of:

- State transition.
- Spatial relationship.
- Hierarchy.
- Action feedback.
- Content appearance or disappearance.

## 14.2. Motion Rules

- Use short transitions for micro-interactions.
- Use consistent easing.
- Avoid excessive movement.
- Preserve interaction responsiveness.
- Avoid animation that delays essential actions.
- Respect reduced-motion preferences.
- Avoid layout shifts when possible.

## 14.3. Motion Categories

|Category|Examples|Purpose|
|---|---|---|
|Micro-interaction|Button press|Immediate feedback|
|State transition|Toggle|Communicate state change|
|Entrance|Dialog opening|Establish spatial context|
|Exit|Popover closing|Communicate dismissal|
|Layout transition|Accordion|Explain content movement|
|Loading|Spinner|Communicate ongoing work|

## 14.4. Audit Checklist

- [ ] Motion has a purpose.
- [ ] Duration is consistent.
- [ ] Easing is consistent.
- [ ] Motion does not obstruct interaction.
- [ ] Reduced motion is supported.
- [ ] Animations do not cause unnecessary layout recalculation.

---

# 15. Disabled and Read-Only Interaction Patterns

These states must not be treated as interchangeable.

## 15.1. Disabled

A disabled component is unavailable for interaction.

Expected behavior:

- Cannot be activated.
- Cannot change its value through user interaction.
- Communicates its unavailable state.
- Is excluded from interaction according to its semantic contract.

Use native `disabled` where applicable.

For custom controls, implement the corresponding ARIA and keyboard behavior.

## 15.2. Read-Only

A read-only component can be inspected but not modified.

Expected behavior:

- Remains readable.
- May remain focusable depending on the native element and interaction model.
- Prevents value modification.
- Communicates its read-only status where appropriate.

## 15.3. Audit Checklist

- [ ] Disabled and read-only are distinct.
- [ ] Disabled interactions are blocked.
- [ ] Read-only values remain accessible.
- [ ] Visual states are distinguishable.
- [ ] Keyboard behavior is correct.
- [ ] Native semantics are preserved.

---

# 16. Touch Interaction Patterns

## 16.1. Touch Principles

Touch interfaces do not have hover as a reliable interaction state.

Essential functionality must never depend exclusively on hover.

## 16.2. Touch Requirements

- Appropriate target dimensions.
- Adequate spacing between targets.
- No hover-only functionality.
- Predictable tap behavior.
- Correct handling of long press where required.
- Correct gesture cancellation.
- No accidental activation during scrolling.

## 16.3. Gesture Conflicts

Avoid unnecessary custom gestures.

When gestures are required:

- Define gesture boundaries.
- Respect browser scrolling.
- Support cancellation.
- Provide alternatives.
- Avoid conflicting horizontal and vertical gestures.

## 16.4. Audit Checklist

- [ ] Touch targets are sufficiently large.
- [ ] Hover is not required.
- [ ] Tap behavior is predictable.
- [ ] Scrolling is not accidentally blocked.
- [ ] Gestures can be cancelled.
- [ ] Alternatives exist for complex gestures.

---

# 17. Interaction Pattern Consistency Matrix

Maintain a centralized matrix describing the expected behavior of each component.

|Component|Hover|Focus|Keyboard|Escape|Outside click|Selection|
|---|---|---|---|---|---|---|
|Button|Yes|Yes|Enter / Space|No|No|No|
|Input|Optional|Yes|Native|No|No|Text|
|Checkbox|Optional|Yes|Space|No|No|Toggle|
|Switch|Optional|Yes|Space|No|No|Toggle|
|Radio Group|Optional|Yes|Arrows / Space|No|No|Single|
|Select|Yes|Yes|Arrows / Enter / Escape|Yes|Usually|Single|
|MultiSelect|Yes|Yes|Arrows / Enter / Escape|Yes|Usually|Multiple|
|Tabs|Yes|Yes|Arrows|No|No|Single|
|Dialog|No|Yes|Tab / Escape|Usually|Optional|No|
|Popover|No|Yes|Tab / Escape|Usually|Usually|Optional|
|Dropdown Menu|Yes|Yes|Arrows / Enter / Escape|Yes|Usually|Action|
|Tooltip|Yes|Focus|Escape|Yes|No|No|
|Command Palette|Yes|Yes|Arrows / Enter / Escape|Yes|Usually|Command|

This matrix is a starting point. Each component must follow its appropriate semantic and accessibility pattern.

---

# 18. Interaction Anti-Patterns

|Anti-pattern|Problem|Correction|
|---|---|---|
|Hover-only actions|Inaccessible to touch and keyboard users|Provide alternative access|
|Invisible focus|Keyboard navigation becomes difficult|Standardize focus indicators|
|Unexpected dismissal|User loses context|Define dismissal contracts|
|Excessive animations|Slower, distracting interactions|Apply motion restraint|
|Inconsistent Escape behavior|Unpredictable overlays|Standardize where appropriate|
|Focus loss after closing overlays|Disrupts navigation|Restore focus|
|Clickable non-interactive elements|Incorrect semantics|Use native interactive elements|
|Disabled elements still respond|Contradictory behavior|Enforce disabled state|
|Selected equals highlighted|Ambiguous state|Separate concepts|
|Loading without feedback|User cannot understand system state|Provide loading indicators|
|Double submission|Duplicate actions|Control pending interactions|
|Unclear validation timing|Frustrating form experience|Define validation policy|
|Outside-click conflicts|Nested overlays close unexpectedly|Centralize overlay coordination|
|Drag-only functionality|Excludes keyboard users|Provide alternatives|
|Motion ignoring preferences|Accessibility issue|Respect reduced motion|

---

# 19. Interaction Audit Methodology

For every component, perform the following tests.

## 19.1. Default Interaction Test

- Render the component.
- Verify initial state.
- Verify default appearance.
- Verify available interactions.

## 19.2. Pointer Test

- Hover.
- Press.
- Release.
- Click.
- Click outside where relevant.
- Repeat rapidly.
- Test nested interactions.

## 19.3. Keyboard Test

- Tab.
- Shift + Tab.
- Enter.
- Space.
- Arrow keys where relevant.
- Home and End where relevant.
- Escape where relevant.

## 19.4. State Synchronization Test

- Change internal state.
- Change external state.
- Reset state.
- Disable the component.
- Re-enable the component.
- Unmount and remount.
- Verify callbacks.

## 19.5. Accessibility Test

- Verify accessible name.
- Verify role.
- Verify state.
- Verify keyboard behavior.
- Verify focus visibility.
- Verify screen reader announcements where relevant.

## 19.6. Edge Case Test

- Rapid interactions.
- Nested overlays.
- Empty content.
- Long content.
- Asynchronous actions.
- Component unmount during interaction.
- External state changes during interaction.

---

# 20. Interaction Quality Scoring

|Dimension|Weight|
|---|---|
|Predictability|15%|
|Pointer interactions|10%|
|Keyboard interactions|15%|
|Focus management|15%|
|Selection behavior|10%|
|State feedback|10%|
|Overlay behavior|10%|
|Touch support|5%|
|Motion quality|5%|
|Edge-case handling|5%|
|**Total**|**100%**|

Each dimension is scored from 0 to 4.

## 20.1. Scoring Scale

|Score|Meaning|
|---|---|
|0|Missing|
|1|Broken or inconsistent|
|2|Partially implemented|
|3|Correct and consistent|
|4|Refined and production-grade|

A component with broken keyboard access or serious focus-management issues cannot be considered production-ready regardless of its average score.

---

# 21. Interaction Remediation Priorities

## P0 — Critical

- Keyboard functionality is inaccessible.
- Focus is lost unexpectedly.
- Modal focus management is broken.
- Disabled controls can still perform actions.
- State changes are not communicated.
- Critical interaction causes duplicate or destructive actions.

## P1 — High

- Inconsistent interaction behavior.
- Broken nested overlay interactions.
- Incorrect Escape handling.
- Missing focus restoration.
- Incorrect selection behavior.
- Unreliable state synchronization.

## P2 — Medium

- Missing interaction feedback.
- Inconsistent hover states.
- Motion inconsistencies.
- Incomplete touch behavior.
- Missing edge-case handling.

## P3 — Low

- Minor transition refinements.
- Small interaction timing improvements.
- Non-essential micro-interactions.
- Minor visual feedback refinements.

---

# 22. Final Acceptance Criteria

The Reef.js interaction system is considered mature when:

- All components follow documented interaction patterns.
- Interaction states are explicit.
- State transitions are deterministic.
- Pointer behavior is consistent.
- Keyboard behavior follows semantic conventions.
- Focus management is reliable.
- Selection and highlighting are distinct.
- Forms behave predictably.
- Overlays share consistent contracts.
- Touch interactions are supported.
- Asynchronous operations provide feedback.
- Motion is restrained and purposeful.
- Disabled and read-only states are distinct.
- Nested interactions work correctly.
- All important interaction paths are tested.
- No unresolved P0 issues remain.

---

# 23. Final Interaction Principle

**An excellent interaction should feel immediate, predictable and almost invisible.**

The user should not need to think about how to interact with a component.

They should understand what is possible, receive immediate feedback, and remain in control of the experience.

Interaction quality does not come from adding more animations or keyboard shortcuts.

It comes from reducing friction at every interaction point.

Behavioral quality does not come from implementing more events.

It comes from making every state transition, focus behavior and interaction contract reliable.

For Reef.js, these principles must be implemented as reusable interaction contracts, not as isolated component-specific solutions.

**The objective is one coherent interaction language across the entire component library.**