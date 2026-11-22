# Keyboard Interactions

> **Purpose:** Define a consistent, accessible and predictable keyboard interaction system across all Reef.js components.
> 
> **Scope:** Keyboard navigation, key bindings, focus management, activation, selection, shortcuts, composite widgets, text editing, overlays and keyboard accessibility.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.
> 
> **Framework:** Reef.js — state-based reactive framework.

---

# 1. Keyboard Interaction Philosophy

## 1.1. Definition

Keyboard interaction defines how users navigate, operate and interact with UI components without relying on a pointer.

Every interactive component must have a documented keyboard interaction contract.

This contract specifies:

- Supported keys.
- Expected actions.
- Focus movement.
- State transitions.
- Selection behavior.
- Cancellation behavior.
- Interaction boundaries.
- Accessibility semantics.

Keyboard support must not be treated as an optional enhancement.

It is part of the component's fundamental behavior.

## 1.2. Core Principles

### Principle 1 — Keyboard First-Class Support

Every essential functionality available through pointer interaction must have an equivalent keyboard interaction, unless the functionality inherently depends on pointer-specific input.

### Principle 2 — Native Behavior Preservation

Prefer native HTML keyboard behavior whenever it already provides the expected interaction.

Do not recreate native behavior unnecessarily.

Examples:

- Native buttons already support Enter and Space.
- Native inputs already support text editing and selection.
- Native checkboxes already support Space.
- Native links already support Enter.

### Principle 3 — Predictable Navigation

The same key should produce consistent behavior within the same semantic interaction pattern.

Examples:

- Escape dismisses dismissible overlays.
- Arrow keys navigate composite widgets.
- Enter activates actions or commits selections where appropriate.
- Tab moves between focusable elements.

### Principle 4 — Focus Ownership

Every keyboard interaction must have a clear focus owner.

The library must never lose focus unexpectedly or create inaccessible focus traps.

### Principle 5 — Minimal Keyboard Complexity

Do not introduce custom shortcuts when native behavior is sufficient.

Do not require users to memorize unnecessary key combinations.

### Principle 6 — Context Awareness

Keyboard shortcuts must respect the current interaction context.

For example:

- Typing inside an Input must not trigger unrelated global shortcuts.
- Arrow keys in a Combobox must navigate suggestions rather than move the text cursor when the popup interaction pattern owns those keys.
- Escape should dismiss the topmost applicable overlay rather than close every open layer.

### Principle 7 — Consistent Cancellation

Users must be able to cancel temporary interactions where appropriate.

Escape is the primary cancellation mechanism for many overlay and selection patterns.

### Principle 8 — Observable Keyboard Feedback

Keyboard navigation must provide visible feedback.

Focused, highlighted and selected states must remain distinguishable.

## 1.3. Global Audit Checklist

- [ ] Every interactive component has a keyboard contract.
- [ ] Native keyboard behavior is preserved where possible.
- [ ] Keyboard navigation follows established conventions.
- [ ] Focus ownership is explicit.
- [ ] Focus indicators are visible.
- [ ] Escape behavior is predictable.
- [ ] Shortcuts respect interaction context.
- [ ] Keyboard functionality is equivalent to pointer functionality.
- [ ] No unexpected keyboard traps exist.
- [ ] Keyboard behavior is tested independently of pointer interactions.

---

# 2. Global Keyboard Conventions

## 2.1. Fundamental Key Mapping

|Key|General convention|Context|
|---|---|---|
|Tab|Move forward through focusable elements|Document navigation|
|Shift + Tab|Move backward through focusable elements|Document navigation|
|Enter|Activate or confirm|Buttons, links, selections|
|Space|Activate or toggle|Buttons, checkboxes, switches|
|Escape|Cancel or dismiss|Overlays, temporary interactions|
|Arrow Up|Move to previous item|Composite widgets|
|Arrow Down|Move to next item|Composite widgets|
|Arrow Left|Move to previous or left|Horizontal widgets|
|Arrow Right|Move to next or right|Horizontal widgets|
|Home|Move to first item|Composite widgets|
|End|Move to last item|Composite widgets|
|Page Up|Move backward by a larger increment|Scrollable or paginated widgets|
|Page Down|Move forward by a larger increment|Scrollable or paginated widgets|
|Backspace|Delete preceding content|Editable controls|
|Delete|Delete following content or selected item|Editable controls|
|Ctrl / Cmd + A|Select all|Editable controls|
|Ctrl / Cmd + C|Copy|Supported contexts|
|Ctrl / Cmd + V|Paste|Editable controls|

These are contextual conventions, not universal bindings.

A component must only intercept keys that belong to its interaction contract.

## 2.2. Platform Differences

The library must account for operating-system conventions.

|Platform|Primary modifier|
|---|---|
|Windows|Ctrl|
|Linux|Ctrl|
|macOS|Meta / Cmd|

Recommended abstraction:

```ts
type ModifierKey = "ctrl" | "meta";

function isPrimaryModifier(event: KeyboardEvent) {
  return event.ctrlKey || event.metaKey;
}
```

This is illustrative. A production implementation should distinguish platform-specific shortcuts when Ctrl and Meta have different meanings.

## 2.3. Key Identification

Prefer `event.key` for semantic keyboard behavior.

Use `event.code` when physical keyboard position matters.

Examples:

```ts
event.key === "Escape"
event.key === "Enter"
event.key === "ArrowDown"
event.code === "KeyK"
```

Avoid deprecated key-code properties.

## 2.4. Event Handling Rules

- Intercept only relevant keys.
- Avoid unnecessary global event listeners.
- Prevent default browser behavior only when required.
- Stop propagation only when the interaction contract requires it.
- Preserve native text editing.
- Handle repeated key events intentionally.
- Clean up event listeners during component teardown.
- Avoid duplicate handling between parent and child widgets.

## 2.5. Audit Checklist

- [ ] Key mappings are documented.
- [ ] Platform conventions are respected.
- [ ] `event.key` is used appropriately.
- [ ] Browser defaults are preserved when possible.
- [ ] Event propagation is intentional.
- [ ] Repeated key events are handled.
- [ ] Listeners are cleaned up.

---

# 3. Tab Navigation and Focus Order

## 3.1. Tab Navigation

Tab navigation must follow a logical document order.

Expected behavior:

- Tab moves to the next available focusable element.
- Shift + Tab moves to the previous available focusable element.
- Disabled controls are not included in normal tab navigation.
- Hidden elements are not focusable.
- Focus order follows the visual and semantic structure.

## 3.2. Native Tab Order

Prefer natural DOM order.

Avoid manually implementing tab navigation unless the widget requires a composite interaction model.

Do not use positive `tabindex` values to force an artificial navigation sequence.

Recommended:

```html
<button>First action</button>
<input type="text" />
<button>Second action</button>
```

Avoid:

```html
<button tabindex="3">First action</button>
<input tabindex="1" />
<button tabindex="2">Second action</button>
```

## 3.3. Composite Widgets

Some components intentionally manage their internal focus behavior.

Examples:

- Tabs.
- Radio Group.
- Menu.
- Listbox.
- Tree.
- Toolbar.
- Grid.

These components may use roving tabindex or `aria-activedescendant`.

The strategy must be documented per widget.

## 3.4. Audit Checklist

- [ ] Tab order follows logical document order.
- [ ] Positive tabindex is avoided.
- [ ] Hidden elements are not focusable.
- [ ] Disabled elements are handled correctly.
- [ ] Composite widgets define their focus strategy.
- [ ] No unexpected focus jumps occur.

---

# 4. Button Keyboard Interaction

## 4.1. Native Button

Native buttons should be preferred for action controls.

|Key|Behavior|
|---|---|
|Enter|Activate|
|Space|Activate|
|Tab|Move focus|
|Shift + Tab|Move focus backward|

## 4.2. Interaction Rules

- Enter activates the button.
- Space activates the button using native button semantics.
- Disabled buttons cannot be activated.
- Repeated key events must not cause unintended duplicate actions.
- Focus remains predictable after activation.
- Loading behavior must be explicitly defined.

## 4.3. Icon Button

Icon buttons follow the same keyboard behavior as regular buttons.

Requirements:

- Accessible name.
- Visible focus indicator.
- Tooltip is supplementary, not the only accessible name.
- Keyboard activation works identically.

## 4.4. Toggle Button

Toggle buttons must communicate their pressed state.

Use the appropriate semantic state, such as `aria-pressed`, when implementing a toggle button pattern.

## 4.5. Audit Checklist

- [ ] Enter activates.
- [ ] Space activates.
- [ ] Disabled state blocks activation.
- [ ] Toggle state is communicated.
- [ ] Accessible name exists.
- [ ] Focus remains predictable.

---

# 5. Form Control Keyboard Interactions

## 5.1. Input

Text inputs should preserve native editing behavior.

|Key|Expected behavior|
|---|---|
|Arrow Left|Move cursor backward|
|Arrow Right|Move cursor forward|
|Home|Move to beginning of line|
|End|Move to end of line|
|Ctrl / Cmd + A|Select all|
|Backspace|Delete preceding content|
|Delete|Delete following content|
|Enter|Submit or confirm only when the form contract specifies it|
|Escape|Clear or cancel only when explicitly defined|

Do not intercept editing keys unnecessarily.

## 5.2. Textarea

Textarea must preserve native multiline editing behavior.

Important rules:

- Enter inserts a newline by default.
- Ctrl / Cmd + Enter may submit when explicitly supported.
- Arrow keys navigate text.
- Home and End follow native text-editing behavior.
- Tab normally moves focus rather than inserting indentation.

If indentation is supported, provide an explicit and documented interaction contract.

## 5.3. Checkbox

|Key|Behavior|
|---|---|
|Space|Toggle checked state|
|Tab|Move focus|
|Shift + Tab|Move focus backward|

Rules:

- Native checkbox semantics are preferred.
- Indeterminate state is communicated.
- Disabled checkboxes cannot change through keyboard interaction.

## 5.4. Switch

|Key|Behavior|
|---|---|
|Space|Toggle switch|
|Tab|Move focus|

Do not introduce a different toggle key convention without a compelling reason.

## 5.5. Radio Group

Radio groups use a composite keyboard interaction pattern.

|Key|Behavior|
|---|---|
|Arrow Right / Down|Move to next radio option|
|Arrow Left / Up|Move to previous radio option|
|Space|Select focused radio|
|Tab|Enter or leave the group|
|Home|First option, when supported|
|End|Last option, when supported|

Native radio inputs should be preferred where possible.

## 5.6. Slider

|Key|Behavior|
|---|---|
|Arrow Right / Up|Increase value|
|Arrow Left / Down|Decrease value|
|Page Up|Increase by a larger increment|
|Page Down|Decrease by a larger increment|
|Home|Set minimum|
|End|Set maximum|

The increment must respect the slider's configured step.

For range sliders, define whether keyboard focus belongs to each thumb independently.

## 5.7. Audit Checklist

- [ ] Native text editing remains intact.
- [ ] Checkbox and switch toggling work.
- [ ] Radio navigation works.
- [ ] Slider controls follow expected conventions.
- [ ] Disabled controls cannot be modified.
- [ ] Keyboard interactions do not interfere with form submission unexpectedly.

---

# 6. Tabs Keyboard Interaction

Tabs must implement an established tab interaction pattern.

## 6.1. Horizontal Tabs

|Key|Behavior|
|---|---|
|Arrow Right|Focus next tab|
|Arrow Left|Focus previous tab|
|Home|Focus first tab|
|End|Focus last tab|
|Enter / Space|Activate focused tab in manual mode|
|Tab|Move into active panel|

Navigation should wrap between the first and last tabs unless the component explicitly documents another convention.

## 6.2. Vertical Tabs

|Key|Behavior|
|---|---|
|Arrow Down|Focus next tab|
|Arrow Up|Focus previous tab|
|Home|Focus first tab|
|End|Focus last tab|

Left and Right should remain available for their appropriate navigation or browser contexts.

## 6.3. Activation Modes

### Automatic Activation

Moving focus also activates the tab.

Recommended when:

- Panels are available immediately.
- Switching does not introduce noticeable latency.
- Navigation remains responsive.

### Manual Activation

Moving focus does not change the selected tab.

The user activates the focused tab using Enter or Space.

Recommended when:

- Panel changes are expensive.
- Content loading is asynchronous.
- Frequent arrow navigation would trigger unnecessary work.

## 6.4. State Separation

Tabs must distinguish:

- Focused tab.
- Selected tab.
- Disabled tab.

## 6.5. Audit Checklist

- [ ] Arrow navigation works.
- [ ] Home and End work.
- [ ] Automatic/manual activation is documented.
- [ ] Focused and selected states are distinct in manual mode.
- [ ] Disabled tabs are skipped appropriately.
- [ ] Tab panel relationships are accessible.

---

# 7. Menu and Dropdown Menu Keyboard Interaction

Menus are action-oriented composite widgets.

## 7.1. Opening

|Key|Behavior|
|---|---|
|Enter|Open menu from trigger|
|Space|Open menu from trigger|
|Arrow Down|Open and focus first item where supported|
|Arrow Up|Open and focus last item where supported|

## 7.2. Navigation

|Key|Behavior|
|---|---|
|Arrow Down|Next menu item|
|Arrow Up|Previous menu item|
|Home|First item|
|End|Last item|
|Enter|Activate focused item|
|Space|Activate focused item|
|Escape|Close menu and restore focus|
|Tab|Close menu and continue normal document navigation|

## 7.3. Typeahead

Menus containing multiple items should support typeahead navigation where appropriate.

Example:

Typing `s` moves focus to the next item beginning with S.

Typing `se` searches for an item beginning with SE.

Requirements:

- Case-insensitive matching.
- Repeated character handling.
- Predictable timeout.
- No interference with editable content.
- Disabled items are handled appropriately.

## 7.4. Submenus

Submenus require explicit directional behavior.

For a conventional horizontal menu:

- Arrow Right opens a submenu.
- Arrow Left closes the submenu and returns focus to its parent item.
- Escape closes the appropriate menu layer.

Direction must account for right-to-left layouts where applicable.

## 7.5. Audit Checklist

- [ ] Opening keys work.
- [ ] Arrow navigation works.
- [ ] Home and End work.
- [ ] Typeahead works.
- [ ] Escape closes correctly.
- [ ] Focus returns to the trigger.
- [ ] Submenu navigation works.
- [ ] Tab does not create an unexpected focus trap.

---

# 8. Select and Listbox Keyboard Interaction

## 8.1. Select

A Select is a value-selection widget, not an action menu.

Its keyboard behavior must distinguish between navigating options and committing a selection.

|Key|Behavior|
|---|---|
|Enter / Space|Open or commit selection according to state|
|Arrow Down|Highlight next option|
|Arrow Up|Highlight previous option|
|Home|First option|
|End|Last option|
|Escape|Close without committing temporary selection|
|Enter|Commit highlighted option|
|Type characters|Navigate by matching text|

## 8.2. Highlighted vs Selected

The component must maintain separate concepts:

- Current selected value.
- Current highlighted option.
- Current focus owner.
- Popup visibility.

In a single-select widget, keyboard navigation may change the highlighted option before committing the value.

## 8.3. Listbox

A standalone listbox follows the listbox interaction pattern.

|Key|Behavior|
|---|---|
|Arrow Down|Next option|
|Arrow Up|Previous option|
|Home|First option|
|End|Last option|
|Enter / Space|Select focused option, according to pattern|
|Ctrl / Cmd + A|Select all, when multiple selection supports it|
|Type characters|Typeahead|

For multi-select listboxes, selection behavior must follow the documented selection model.

## 8.4. Audit Checklist

- [ ] Navigation and selection are distinct.
- [ ] Arrow keys navigate correctly.
- [ ] Home and End work.
- [ ] Escape cancels temporary interaction.
- [ ] Typeahead works.
- [ ] Disabled options are skipped.
- [ ] Multi-select behavior is documented.

---

# 9. Combobox and Autocomplete Keyboard Interaction

Comboboxes combine editable text input with a suggestion popup.

Their keyboard model requires special attention because text editing and option navigation coexist.

## 9.1. Keyboard Mapping

|Key|Behavior|
|---|---|
|Arrow Down|Open popup or highlight next suggestion|
|Arrow Up|Highlight previous suggestion|
|Enter|Commit highlighted suggestion|
|Escape|Close popup or revert according to the contract|
|Tab|Commit or preserve current value according to the contract, then move focus|
|Home / End|Preserve text cursor behavior in editable mode|
|Backspace / Delete|Edit text normally|
|Printable characters|Update query|

## 9.2. State Model

A Combobox must distinguish:

```text
inputValue
selectedValue
highlightedOption
open
focused
```

These values have different responsibilities.

## 9.3. Keyboard Rules

- Arrow navigation must not destroy the input query.
- Enter must not submit the surrounding form unexpectedly when it is committing a suggestion.
- Escape behavior must be documented.
- Disabled suggestions cannot be committed.
- Tab must not trap the user in the popup.
- Screen readers must receive appropriate active-descendant and selection information.

## 9.4. Audit Checklist

- [ ] Input editing works normally.
- [ ] Arrow navigation works.
- [ ] Enter commits correctly.
- [ ] Escape behaves predictably.
- [ ] Tab navigation remains available.
- [ ] Selected and highlighted values are separate.
- [ ] Active descendant is synchronized.
- [ ] Form submission conflicts are handled.

---

# 10. Dialog and AlertDialog Keyboard Interaction

## 10.1. Dialog

|Key|Behavior|
|---|---|
|Tab|Move to next focusable element inside modal dialog|
|Shift + Tab|Move to previous focusable element inside modal dialog|
|Escape|Close if dismissible|
|Enter / Space|Activate focused control|

## 10.2. Focus Initialization

When opened:

- Move focus into the dialog.
- Choose the initial focus target according to content and purpose.
- For complex content, consider focusing a static introductory element.
- Avoid automatically focusing a destructive confirmation action.

## 10.3. Focus Containment

A modal dialog must contain keyboard focus while open.

Tab from the last focusable element returns to the first.

Shift + Tab from the first returns to the last.

## 10.4. Focus Restoration

When closed:

- Return focus to the invoking element where possible.
- If the invoking element no longer exists, move focus to a logical fallback.
- Do not restore focus to a disabled or hidden element.

## 10.5. AlertDialog

AlertDialog is intended for important decisions.

Requirements:

- Clear initial focus.
- Explicit action hierarchy.
- Escape dismissal according to the destructive-action contract.
- Predictable confirmation and cancellation.
- No accidental activation of destructive actions.

## 10.6. Audit Checklist

- [ ] Initial focus is correct.
- [ ] Tab is contained in modal dialogs.
- [ ] Escape behavior is defined.
- [ ] Focus restoration works.
- [ ] Destructive actions are not accidentally focused or activated.
- [ ] Nested overlays maintain correct focus ownership.

---

# 11. Popover and Tooltip Keyboard Interaction

## 11.1. Popover

A Popover is generally non-modal.

|Key|Behavior|
|---|---|
|Enter / Space|Open from trigger when appropriate|
|Escape|Close and restore focus where appropriate|
|Tab|Continue normal keyboard navigation|
|Shift + Tab|Navigate backward normally|

If the Popover contains a composite widget, that widget manages its own internal arrow-key navigation.

Do not automatically trap focus in a non-modal Popover.

## 11.2. Tooltip

A tooltip should appear when its trigger receives keyboard focus.

Requirements:

- Focus does not move into the tooltip.
- Escape dismisses the tooltip when appropriate.
- Tooltip content is not independently interactive.
- The tooltip supplements the accessible name or description.
- Tooltip visibility does not interfere with keyboard navigation.

## 11.3. Audit Checklist

- [ ] Popover can be opened by keyboard.
- [ ] Escape closes appropriately.
- [ ] Non-modal focus behavior is preserved.
- [ ] Tooltip appears on keyboard focus.
- [ ] Tooltip does not steal focus.
- [ ] Essential content is not tooltip-only.

---

# 12. Accordion and Collapsible Keyboard Interaction

## 12.1. Accordion

Native button triggers should be used.

|Key|Behavior|
|---|---|
|Enter|Toggle expanded state|
|Space|Toggle expanded state|
|Tab|Move between triggers and focusable content|
|Arrow Down / Up|Optional navigation between triggers|
|Home / End|Optional first/last trigger navigation|

Arrow-key navigation is appropriate when implementing a composite accordion pattern, but it should not be added indiscriminately.

## 12.2. Collapsible

|Key|Behavior|
|---|---|
|Enter|Toggle|
|Space|Toggle|

The trigger must communicate its expanded state.

## 12.3. Audit Checklist

- [ ] Native button activation works.
- [ ] Expanded state is communicated.
- [ ] Focus order is logical.
- [ ] Optional arrow navigation is documented.
- [ ] Collapsed content is not keyboard-focusable.

---

# 13. Navigation and Breadcrumb Keyboard Interaction

## 13.1. Links

Native links should preserve browser keyboard behavior.

|Key|Behavior|
|---|---|
|Enter|Navigate|
|Tab|Move focus|
|Shift + Tab|Move focus backward|

Space should not be redefined as link activation.

## 13.2. Breadcrumbs

- Each navigable ancestor is a link.
- Current location is represented semantically.
- Tab follows document order.
- Separators are not focusable.
- Current location is not presented as an unnecessary interactive link.

## 13.3. Toolbar

Toolbars may use a roving tabindex pattern.

Expected behavior:

- Tab enters the toolbar.
- Arrow keys navigate between controls.
- Tab exits the toolbar.

The exact arrow-key direction must follow the toolbar orientation and documented pattern.

## 13.4. Audit Checklist

- [ ] Native link behavior is preserved.
- [ ] Breadcrumb navigation is logical.
- [ ] Separators are not focusable.
- [ ] Toolbar navigation is documented.
- [ ] No unnecessary keyboard interception exists.

---

# 14. Tree View and Hierarchical Navigation

Tree views require an explicit keyboard model.

## 14.1. Standard Keyboard Mapping

|Key|Behavior|
|---|---|
|Arrow Down|Next visible node|
|Arrow Up|Previous visible node|
|Arrow Right|Expand closed node or move to first child|
|Arrow Left|Collapse expanded node or move to parent|
|Home|First visible node|
|End|Last visible node|
|Enter|Activate or select node according to contract|
|Space|Select node where appropriate|
|Type characters|Typeahead navigation|

## 14.2. Tree State

Separate:

- Focused node.
- Selected node.
- Expanded nodes.
- Checked nodes where applicable.
- Disabled nodes.

## 14.3. Audit Checklist

- [ ] Vertical navigation works.
- [ ] Expansion and collapse work.
- [ ] Parent navigation works.
- [ ] Focus and selection are distinct.
- [ ] Hidden descendants are not navigable.
- [ ] Tree hierarchy is communicated accessibly.

---

# 15. Data Grid and Table Keyboard Interaction

Not every table requires a complex keyboard model.

Use a native semantic table when the purpose is primarily reading and navigating tabular information.

Use a grid interaction pattern when users interact with cells as a composite widget.

## 15.1. Grid Navigation

|Key|Behavior|
|---|---|
|Arrow Down|Next row|
|Arrow Up|Previous row|
|Arrow Right|Next cell|
|Arrow Left|Previous cell|
|Home|First cell in row|
|End|Last cell in row|
|Ctrl / Cmd + Home|First cell in grid, where supported|
|Ctrl / Cmd + End|Last cell in grid, where supported|
|Enter|Activate or enter edit mode|
|Escape|Cancel edit mode|

## 15.2. Editing

When a cell enters editing mode:

- Text-editing keys belong to the editor.
- Arrow keys must not unexpectedly navigate the grid.
- Escape cancels editing where appropriate.
- Enter commits editing where appropriate.
- Focus returns to the relevant cell after editing.

## 15.3. Audit Checklist

- [ ] Native tables remain simple and semantic.
- [ ] Interactive grids implement a documented model.
- [ ] Navigation and editing modes are distinct.
- [ ] Focus restoration works.
- [ ] Cell selection is communicated.
- [ ] Keyboard shortcuts do not conflict with text editing.

---

# 16. Command Palette and Productivity Shortcuts

This section defines keyboard conventions for productivity interfaces.

## 16.1. Command Palette Activation

A Command Palette may expose a global shortcut.

Recommended example:

```text
Cmd / Ctrl + K
```

Requirements:

- Shortcut must be discoverable.
- Shortcut must not conflict with browser or operating-system behavior.
- Shortcut must respect editable contexts.
- Shortcut must be configurable or overridable.
- Shortcut must not open multiple palettes.

## 16.2. Command Palette Navigation

|Key|Behavior|
|---|---|
|Arrow Down|Next command|
|Arrow Up|Previous command|
|Enter|Execute selected command|
|Escape|Close palette|
|Printable characters|Filter commands|
|Backspace|Modify query|
|Tab|Follow documented focus behavior|

## 16.3. Command Search

- Search should respond immediately.
- Highlighted command should remain visible.
- Empty results must be communicated.
- Disabled commands must not execute.
- Command execution should provide feedback.
- Focus should return to the previous context after dismissal when appropriate.

## 16.4. Shortcut System

A shortcut registry should centralize:

- Shortcut identifier.
- Key combination.
- Platform-specific display.
- Description.
- Context.
- Priority.
- Enablement condition.
- Execution callback.

Example:

```ts
interface KeyboardShortcut {
  id: string;
  key: string;
  modifiers?: {
    meta?: boolean;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
  };
  description: string;
  scope?: string;
  enabled?: () => boolean;
  handler: () => void;
}
```

This is an illustrative API, not a requirement to adopt this exact shape.

## 16.5. Shortcut Conflict Resolution

When multiple shortcuts match:

1. Prefer the most specific active scope.
2. Prefer component-level behavior over unrelated global behavior.
3. Respect editable controls.
4. Avoid executing multiple commands for one key event.
5. Define explicit priority for intentional overlaps.

## 16.6. Audit Checklist

- [ ] Global shortcuts are documented.
- [ ] Platform modifiers are correct.
- [ ] Editable contexts are respected.
- [ ] Shortcut conflicts are resolved.
- [ ] Command execution is deterministic.
- [ ] Shortcuts are discoverable.
- [ ] Shortcut registration is cleaned up.

---

# 17. Typeahead and Character Navigation

Typeahead enables navigation through collections using typed characters.

Typical components:

- Menu.
- Select.
- Listbox.
- Tree.
- Command Palette.

## 17.1. Behavior

Typing characters moves focus to the next matching item.

Example:

```text
Available options:
Apple
Banana
Blueberry
Cherry
```

Typing `b` moves to Banana.

Typing `bl` moves to Blueberry.

## 17.2. Requirements

- Case-insensitive matching.
- Appropriate character normalization.
- Repeated character cycling.
- Defined search timeout.
- Disabled-item handling.
- Predictable wrapping behavior.
- International character support where feasible.

## 17.3. Audit Checklist

- [ ] Typeahead works.
- [ ] Multi-character matching works.
- [ ] Repeated characters cycle correctly.
- [ ] Search timeout is consistent.
- [ ] Disabled items are handled.
- [ ] International input is considered.

---

# 18. Keyboard Interaction in Disabled and Read-Only Components

## 18.1. Disabled

Disabled controls must not respond to activation keys.

For native controls, prefer native disabled semantics.

For custom widgets, define the corresponding focus and accessibility behavior.

## 18.2. Read-Only

Read-only controls remain available for inspection.

They must preserve appropriate keyboard navigation and text selection behavior.

## 18.3. Disabled Items in Composite Widgets

Disabled items may remain discoverable through arrow navigation or be skipped, depending on the established widget pattern.

The policy must be consistent within each component family.

Do not apply one universal disabled-item navigation rule to every widget.

## 18.4. Audit Checklist

- [ ] Disabled controls cannot activate.
- [ ] Read-only values remain inspectable.
- [ ] Native semantics are preserved.
- [ ] Composite-widget behavior is documented.
- [ ] Focus behavior is predictable.

---

# 19. Keyboard Shortcuts and Global Event Management

## 19.1. Global Listener Strategy

Global keyboard listeners should be centralized where possible.

Avoid attaching duplicate `window` listeners independently to every component.

A shared shortcut manager can provide:

- Registration.
- Unregistration.
- Context scopes.
- Conflict resolution.
- Platform modifiers.
- Enablement conditions.
- Lifecycle cleanup.

## 19.2. Event Scoping

A shortcut must define where it is active.

Possible scopes:

- Global application.
- Dialog.
- Command Palette.
- Editor.
- Toolbar.
- Specific component.

## 19.3. Editable Context Protection

Global shortcuts should generally avoid intercepting keys when the user is interacting with:

- Input.
- Textarea.
- Contenteditable.
- Rich text editor.
- Custom editable surfaces.

Exceptions must be intentional and documented.

## 19.4. Event Lifecycle

When registering shortcuts:

- Register at the correct lifecycle phase.
- Unregister on teardown.
- Prevent duplicate registration.
- Avoid stale closures.
- Handle changing callback references.
- Support nested scopes.

## 19.5. Audit Checklist

- [ ] Global listeners are centralized.
- [ ] Shortcut scopes are defined.
- [ ] Editable contexts are respected.
- [ ] Duplicate registration is prevented.
- [ ] Cleanup occurs on unmount.
- [ ] Callback references remain current.
- [ ] Nested scopes resolve correctly.

---

# 20. Internationalization and Keyboard Layouts

Keyboard interaction must not assume that every user has a US QWERTY keyboard.

## 20.1. Requirements

- Avoid relying exclusively on physical key positions for semantic shortcuts.
- Support platform conventions.
- Consider non-Latin input.
- Handle composition events.
- Preserve IME behavior.
- Avoid interfering with dead keys.
- Support right-to-left interfaces where directional navigation matters.

## 20.2. Input Method Editors

When users compose text through an IME:

- Do not treat intermediate composition events as committed text.
- Avoid triggering Enter-based actions during composition.
- Check `event.isComposing` where relevant.
- Preserve the native composition lifecycle.

## 20.3. Audit Checklist

- [ ] Non-US keyboard layouts are considered.
- [ ] IME composition is respected.
- [ ] Semantic key handling is used appropriately.
- [ ] Directional navigation supports RTL.
- [ ] Character matching handles international text.

---

# 21. Keyboard Interaction Anti-Patterns

|Anti-pattern|Problem|Correction|
|---|---|---|
|Missing keyboard support|Inaccessible component|Define a keyboard contract|
|Reimplementing native behavior|Inconsistent behavior|Prefer native elements|
|Positive tabindex|Broken navigation order|Use natural DOM order|
|Invisible focus|Users lose navigation context|Standardize focus indicators|
|Global shortcut conflicts|Unexpected actions|Introduce scopes|
|Shortcuts intercept typing|Broken text editing|Protect editable contexts|
|Arrow keys everywhere|Conflicting interactions|Follow semantic patterns|
|Escape closes every overlay|Unexpected dismissal|Dismiss topmost applicable layer|
|Selected equals focused|Confusing state|Separate state dimensions|
|No typeahead|Slow collection navigation|Implement where appropriate|
|Keyboard-only inaccessible actions|Pointer users only|Provide equivalent keyboard actions|
|Tab trapped in non-modal overlay|Navigation obstruction|Preserve normal tab flow|
|Enter submits unexpectedly|Accidental form submission|Define activation and submission contracts|
|IME interference|Broken international text entry|Respect composition events|

---

# 22. Keyboard Interaction Audit Template

Use this template for every interactive component.

```md
# Keyboard Interaction Audit: [ComponentName]

## 1. Semantic Role

- Native element:
- ARIA role:
- Interaction pattern:

## 2. Supported Keys

| Key | Action | State transition |
|---|---|---|
| | | |

## 3. Focus Strategy

- Natural tab order:
- Roving tabindex:
- Active descendant:
- Focus trapping:
- Focus restoration:

## 4. Navigation Behavior

- Arrow navigation:
- Home / End:
- Typeahead:
- Tab behavior:

## 5. Activation Behavior

- Enter:
- Space:
- Other:

## 6. Cancellation Behavior

- Escape:
- Other cancellation keys:

## 7. Context Constraints

- Editable context:
- Nested widgets:
- Shortcut conflicts:

## 8. Accessibility

- Accessible name:
- Accessible role:
- Accessible state:
- Screen reader feedback:

## 9. Edge Cases

- Disabled items:
- Empty content:
- Dynamic content:
- External state changes:
- Rapid key presses:
- IME composition:

## 10. Issues

| ID | Issue | Severity | Correction |
|---|---|---|---|

## 11. Acceptance Criteria

- [ ] Keyboard contract documented.
- [ ] Native behavior preserved.
- [ ] Focus strategy correct.
- [ ] Navigation works.
- [ ] Activation works.
- [ ] Cancellation works.
- [ ] Accessibility semantics correct.
- [ ] Context conflicts handled.
- [ ] Lifecycle cleanup verified.
```

---

# 23. Keyboard Interaction Testing Matrix

Every component must be tested independently using keyboard-only navigation.

|Test|Expected result|
|---|---|
|Tab into component|Correct focus entry|
|Shift + Tab|Correct reverse navigation|
|Enter|Correct activation|
|Space|Correct activation or toggle|
|Arrow keys|Correct contextual navigation|
|Home|First item where supported|
|End|Last item where supported|
|Escape|Correct cancellation|
|Repeated keys|Stable navigation|
|Disabled state|No prohibited activation|
|Dynamic content|Focus remains valid|
|Unmount|Listeners and resources cleaned|
|IME composition|Native text composition preserved|
|Reduced motion|Interaction remains functional|

## 23.1. Testing Tools

Recommended testing layers:

- Unit tests for keyboard event handling.
- Component tests for focus and state transitions.
- Browser tests for real keyboard navigation.
- Accessibility audits for semantics and focus behavior.
- Manual testing with screen readers.

Automated accessibility scans alone are insufficient to validate keyboard interaction quality.

---

# 24. Keyboard Interaction Quality Scoring

|Dimension|Weight|
|---|---|
|Keyboard coverage|15%|
|Native behavior preservation|10%|
|Focus management|15%|
|Navigation consistency|15%|
|Activation behavior|10%|
|Composite widget behavior|10%|
|Shortcut management|10%|
|Internationalization|5%|
|Accessibility semantics|5%|
|Lifecycle safety|5%|
|**Total**|**100%**|

Each dimension is scored from 0 to 4.

## 24.1. Scoring Scale

|Score|Meaning|
|---|---|
|0|Missing|
|1|Broken|
|2|Partially implemented|
|3|Correct and consistent|
|4|Refined and production-grade|

## 24.2. Critical Conditions

A component cannot be considered production-ready if:

- Essential functionality is inaccessible through keyboard.
- Focus is lost unexpectedly.
- Keyboard navigation creates a trap.
- Native text editing is broken.
- Global shortcuts interfere with text input.
- Modal focus containment is incorrect.
- Destructive actions can be triggered accidentally.

---

# 25. Remediation Priorities

## P0 — Critical

- Missing keyboard access to essential functionality.
- Broken modal focus management.
- Keyboard traps.
- Native text editing interference.
- Unintended destructive keyboard activation.
- Global shortcuts blocking normal input.

## P1 — High

- Inconsistent arrow navigation.
- Incorrect focus restoration.
- Missing Escape behavior.
- Incorrect composite widget semantics.
- Missing keyboard activation.
- Shortcut scope conflicts.

## P2 — Medium

- Missing typeahead.
- Inconsistent Home / End behavior.
- Incomplete shortcut discoverability.
- Minor focus-navigation inconsistencies.
- Incomplete internationalization support.

## P3 — Low

- Shortcut display refinements.
- Minor navigation optimizations.
- Additional productivity shortcuts.
- Documentation improvements.

---

# 26. Final Acceptance Criteria

The Reef.js keyboard interaction system is considered mature when:

- Every interactive component has a documented keyboard contract.
- Native keyboard behavior is preserved wherever possible.
- All essential actions are keyboard accessible.
- Focus order is logical.
- Focus indicators are visible.
- Composite widgets follow established interaction patterns.
- Focus ownership is explicit.
- Escape behavior is predictable.
- Global shortcuts are scoped.
- Editable contexts are protected.
- International keyboard layouts are considered.
- IME composition is supported.
- Dynamic content does not break focus.
- Keyboard interactions are tested in real browsers.
- No unresolved P0 issues remain.

---

# 27. Final Keyboard Interaction Principle

**Keyboard interaction should feel like a natural extension of the interface, not like a separate accessibility mode.**

Users should be able to navigate, select, execute, dismiss and edit without having to understand the internal implementation of a component.

Behavioral quality comes from respecting established interaction contracts.

Efficiency comes from making frequent actions fast, discoverable and predictable.

For Reef.js, keyboard behavior must be implemented as a shared interaction language, supported by reusable primitives and semantic component patterns.

The goal is not to add as many shortcuts as possible.

The goal is to make every interaction possible, understandable and efficient without a pointer.

**Preserve native behavior. Make focus predictable. Respect context. Keep keyboard interactions intentional.**