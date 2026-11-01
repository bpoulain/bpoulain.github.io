# Progressive Disclosure

> **Purpose:** Define the principles, interaction patterns, component behaviors and evaluation criteria governing progressive disclosure throughout the UI library.
> 
> **Scope:** Information visibility, action discoverability, contextual actions, expandable content, menus, popovers, dialogs, collapsible sections, advanced forms, navigation, interaction states, keyboard accessibility and disclosure state management.
> 
> **Related principles:** DP-01 Functional Minimalism, DP-04 Typographic Precision, DP-05 Geometric Consistency, DP-06 Functional Density, DP-07 Clear Information Hierarchy, DP-08 Progressive Disclosure.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.

---

# 1. Progressive Disclosure Philosophy

## 1.1. Definition

Progressive disclosure is the principle of presenting information and functionality progressively, according to user needs, interaction context and task complexity.

Instead of exposing every available option simultaneously, the interface prioritizes essential content and makes secondary functionality accessible through intentional interactions.

The goal is to reduce unnecessary cognitive load while preserving access to advanced functionality.

### Core principle

**Show what is necessary now, reveal what is useful next, and keep advanced functionality accessible without making it permanently visible.**

## 1.2. Expected visual characteristics

The library must favor:

- Minimal initial visual complexity.
- Clearly prioritized information.
- Contextual action visibility.
- Predictable disclosure interactions.
- Discoverable secondary functionality.
- Lightweight contextual surfaces.
- Consistent expanded and collapsed states.
- Clear visual indications of available actions.
- Minimal interruption to the current workflow.

Avoid:

- Displaying every possible action simultaneously.
- Hiding essential functionality.
- Excessive nested menus.
- Unpredictable disclosure behavior.
- Deep interaction hierarchies.
- Unnecessary modal dialogs.
- Hidden functionality without discoverability cues.
- Requiring too many interactions to perform common tasks.

## 1.3. Progressive disclosure versus hiding functionality

Progressive disclosure is not a justification for hiding functionality arbitrarily.

There must be a clear relationship between the information initially visible and the information revealed through interaction.

|Progressive disclosure|Poor information hiding|
|---|---|
|Primary actions remain visible|Important actions are hidden|
|Secondary actions are contextual|Actions are difficult to discover|
|Advanced options are organized|Advanced options are inaccessible|
|Disclosure is predictable|Disclosure is inconsistent|
|Interaction reduces complexity|Interaction introduces friction|
|Context determines visibility|Visibility is arbitrary|

## 1.4. Rules

- Essential information must be visible by default.
- Primary actions must remain immediately accessible.
- Secondary functionality may be contextual.
- Advanced functionality must remain discoverable.
- Disclosure interactions must be predictable.
- Avoid unnecessary interaction depth.
- Preserve the user's current context.
- Never hide information necessary to understand the current state.

## 1.5. Audit checklist

- [ ] Initial interfaces expose essential information.
- [ ] Secondary information is accessible.
- [ ] Advanced functionality is discoverable.
- [ ] Primary actions are not unnecessarily hidden.
- [ ] Disclosure interactions are predictable.
- [ ] Interaction depth is controlled.
- [ ] Users can understand what is available without exploring every control.

---

# 2. Information Visibility Hierarchy

## 2.1. Definition

Every component must establish a hierarchy of information visibility.

Not all information has the same importance, frequency or relevance.

The library must provide a consistent model for determining what is immediately visible and what requires interaction.

## 2.2. Visibility levels

|Level|Name|Behavior|Examples|
|---|---|---|---|
|L0|Essential|Always visible when relevant|Title, primary value, primary action|
|L1|Secondary|Visible in the default composition when useful|Description, status, metadata|
|L2|Contextual|Revealed through interaction or context|Row actions, additional controls|
|L3|Advanced|Available through explicit navigation or expansion|Advanced settings, filters|
|L4|Exceptional|Reserved for specialized workflows|Expert configuration, technical details|

These levels represent an information hierarchy, not necessarily five mandatory interaction layers.

A component should use only the levels that provide meaningful value.

## 2.3. Examples

### List item

```text
DEFAULT

[Icon]  Issue title                [Status]
        Short description


HOVER / FOCUS

[Icon]  Issue title        [Edit] [More] [Status]
        Short description


MORE MENU

[Icon]  Issue title
        Short description

        Edit
        Duplicate
        Move
        Archive
        Delete
```

### Form

```text
DEFAULT

Account settings

Email address
[ user@example.com ]

Password
[ *************** ]

[ Save changes ]


ADVANCED OPTIONS

+ Show advanced settings

  Session expiration
  [ 30 days ]

  Security preferences
  [ Configure ]
```

## 2.4. Rules

- Establish visibility levels for complex components.
- Prioritize information by functional importance.
- Avoid exposing advanced options by default.
- Keep frequently needed secondary information accessible.
- Ensure contextual controls have visible activation cues.
- Avoid excessive disclosure levels.
- Preserve consistent hierarchy across related components.

## 2.5. Audit checklist

- [ ] Information is classified by importance.
- [ ] Essential information is immediately visible.
- [ ] Secondary information is appropriately presented.
- [ ] Contextual functionality is accessible.
- [ ] Advanced functionality is organized.
- [ ] No unnecessary disclosure levels exist.

---

# 3. Action Visibility Strategy

## 3.1. Definition

Actions should be visible according to their importance, frequency and contextual relevance.

Displaying every available action simultaneously creates visual competition.

Hiding every secondary action behind menus creates unnecessary interaction friction.

The library must balance direct access and contextual availability.

## 3.2. Action visibility model

|Action category|Visibility strategy|Example|
|---|---|---|
|Critical|Always visible when applicable|Save, Submit|
|Primary|Directly visible|Create, Confirm|
|Frequent secondary|Directly accessible or contextual|Edit, Assign|
|Occasional|Contextual menu|Duplicate, Move|
|Rare|Advanced menu|Export configuration|
|Destructive|Contextual with clear identification|Delete, Remove|

Action visibility must consider task context, not just frequency.

A destructive action may be rare but must remain easy to locate when explicitly needed.

## 3.3. Contextual actions

Contextual actions should appear when the user focuses on the relevant object or interaction region.

Examples:

- List row actions on hover or keyboard focus.
- Toolbar actions after selecting items.
- Selection-specific bulk actions.
- Text editing actions when text is selected.
- Contextual commands in menus.

## 3.4. Rules

- Primary actions should not require unnecessary discovery.
- Secondary actions may be revealed contextually.
- Destructive actions must be visually distinguishable.
- Actions must not appear or disappear unpredictably.
- Hover-revealed actions must also be available through keyboard navigation.
- Touch interfaces must provide an alternative to hover.
- Contextual actions must remain associated with their target.

## 3.5. Audit checklist

- [ ] Primary actions are visible.
- [ ] Secondary actions are discoverable.
- [ ] Contextual actions appear in the correct context.
- [ ] Hover actions have keyboard equivalents.
- [ ] Touch users can access contextual actions.
- [ ] Destructive actions are appropriately distinguished.
- [ ] No important action requires excessive navigation.

---

# 4. Hover-Revealed Functionality

## 4.1. Definition

Hover is an effective mechanism for revealing secondary functionality in desktop interfaces.

It allows interfaces to remain visually minimal while providing additional functionality when the pointer enters a relevant region.

However, hover must never be the only way to access essential functionality.

## 4.2. Appropriate applications

- List row actions.
- Table row actions.
- Navigation item controls.
- Secondary toolbar controls.
- Contextual action icons.
- Preview information.
- Tooltips.

## 4.3. Interaction states

A hover-revealed component should support:

|State|Expected behavior|
|---|---|
|Default|Secondary controls are visually restrained or hidden|
|Hover|Relevant controls become visible|
|Focus|Equivalent controls become accessible|
|Active|Selected action receives clear feedback|
|Disabled|Disabled controls remain distinguishable|
|Touch|Equivalent actions remain accessible|

## 4.4. Rules

- Hover must not change layout dimensions unexpectedly.
- Revealed controls must not overlap primary content.
- Visibility transitions should be restrained.
- Focus must expose the same functionality.
- Hover-only interactions must not be used for essential actions.
- Touch interfaces must provide an equivalent interaction.
- Pointer movement between trigger and revealed content must not accidentally dismiss it.

## 4.5. Audit checklist

- [ ] Hover reveals only relevant functionality.
- [ ] Primary content remains stable.
- [ ] No unexpected layout shift occurs.
- [ ] Keyboard focus reveals equivalent controls.
- [ ] Touch access is preserved.
- [ ] Pointer interactions are reliable.
- [ ] Transitions are subtle and consistent.

---

# 5. Expandable and Collapsible Content

## 5.1. Definition

Expandable components allow secondary information to remain hidden until explicitly requested.

They are particularly useful when content is long, hierarchical or optional.

## 5.2. Appropriate applications

- Accordion sections.
- Advanced settings.
- Navigation groups.
- Tree views.
- Expandable table rows.
- Detailed list items.
- Disclosure panels.
- Additional descriptions.

## 5.3. Disclosure patterns

### Collapsible section

```text
DEFAULT

Advanced settings                    [v]


EXPANDED

Advanced settings                    [^]

Session expiration
[ 30 days ]

Security preferences
[ Configure ]
```

### Expandable list item

```text
COLLAPSED

[>] Deployment
    Production environment


EXPANDED

[v] Deployment
    Production environment

    Created: October 30
    Last updated: 14:30
    Owner: Engineering
```

## 5.4. Rules

- Expandable regions must have clear triggers.
- Expanded state must be visually distinguishable.
- Disclosure indicators must communicate the current state.
- Content should remain in logical reading order.
- Expansion must not unexpectedly destroy surrounding context.
- Avoid excessive accordion nesting.
- Allow multiple sections to remain open when the task requires comparison.
- Use exclusive expansion only when it provides a meaningful benefit.

## 5.5. Audit checklist

- [ ] Expandable regions are identifiable.
- [ ] Expanded states are clear.
- [ ] Disclosure indicators are consistent.
- [ ] Keyboard activation works.
- [ ] Content remains in logical reading order.
- [ ] Expansion preserves context.
- [ ] Nested disclosure is limited.

---

# 6. Menus and Contextual Navigation

## 6.1. Definition

Menus expose secondary actions and navigation without permanently occupying interface space.

They are one of the most important progressive disclosure mechanisms.

## 6.2. Menu hierarchy

The library should distinguish:

|Component|Responsibility|
|---|---|
|Dropdown Menu|Contextual commands|
|Context Menu|Actions associated with an object|
|Navigation Menu|Navigation between destinations|
|Command Menu|Searchable commands|
|Submenu|Secondary action hierarchy|
|Select|Choosing a value|
|Combobox|Searching and selecting values|

These components must not be treated as interchangeable visual containers.

## 6.3. Rules

- Menus must expose contextually relevant options.
- Menu labels must be concise.
- Related actions must be grouped.
- Destructive actions must be visually distinguished.
- Submenus should be used sparingly.
- Avoid deep menu hierarchies.
- Keyboard navigation must be predictable.
- Menus must preserve the context of the triggering component.
- Menu dismissal must follow consistent rules.

## 6.4. Menu depth

Recommended design constraint:

- Level 1: Primary contextual menu.
- Level 2: Submenu when necessary.
- Level 3: Exceptional; reconsider the information architecture.

This is a design guideline, not a universal technical limitation.

## 6.5. Audit checklist

- [ ] Menus expose relevant actions.
- [ ] Actions are logically grouped.
- [ ] Menu labels are understandable.
- [ ] Destructive actions are distinguishable.
- [ ] Menu depth is controlled.
- [ ] Keyboard navigation is supported.
- [ ] Dismissal behavior is predictable.

---

# 7. Popovers and Contextual Surfaces

## 7.1. Definition

Popovers reveal contextual information or controls close to the element that triggered them.

They are useful when the user needs additional functionality without leaving the current workflow.

## 7.2. Appropriate applications

- Inline filters.
- Date pickers.
- Color selectors.
- Contextual settings.
- Rich tooltips.
- Quick-edit interfaces.
- Lightweight configuration.
- Selection controls.

## 7.3. Rules

- Keep popovers contextually attached to their triggers.
- Display only relevant functionality.
- Avoid turning every popover into a full dialog.
- Preserve predictable positioning.
- Avoid clipping important content.
- Ensure interaction remains possible when the pointer enters the popover.
- Dismiss according to consistent interaction rules.
- Support keyboard navigation and focus management.

## 7.4. Audit checklist

- [ ] Popovers have clear triggers.
- [ ] Positioning is predictable.
- [ ] Content is contextually relevant.
- [ ] Popover dimensions are appropriate.
- [ ] Dismissal behavior is consistent.
- [ ] Keyboard interactions are supported.
- [ ] Focus behavior is correct.

---

# 8. Dialogs and Modal Disclosure

## 8.1. Definition

Dialogs expose a separate interaction context for tasks requiring focused attention.

They should be reserved for interactions that justify temporarily interrupting the current workflow.

## 8.2. Appropriate applications

- Creating complex entities.
- Editing substantial configurations.
- Confirming destructive operations.
- Completing multi-field workflows.
- Presenting critical decisions.

## 8.3. Avoid using dialogs for

- Simple contextual actions.
- Short descriptions.
- Basic metadata.
- Minor configuration.
- Information that belongs directly in the current interface.

## 8.4. Rules

- Use dialogs only when the interaction justifies a separate context.
- Keep dialog content focused.
- Avoid unnecessary nested dialogs.
- Preserve the triggering context.
- Provide a clear dismissal mechanism.
- Ensure keyboard focus is managed correctly.
- Avoid overwhelming users with too many fields.
- Use progressive disclosure inside complex dialogs.

## 8.5. Audit checklist

- [ ] Dialog usage is justified.
- [ ] Content is focused.
- [ ] Dialog hierarchy is simple.
- [ ] Nested dialogs are avoided.
- [ ] Dismissal is predictable.
- [ ] Focus management is correct.
- [ ] Complex workflows are appropriately structured.

---

# 9. Advanced Forms and Optional Configuration

## 9.1. Definition

Forms often contain a mixture of essential fields, optional information and advanced configuration.

Progressive disclosure helps reduce initial complexity while preserving access to advanced options.

## 9.2. Recommended organization

```text
CREATE PROJECT

Project name
[ __________________ ]

Description
[ __________________ ]

Visibility
[ Private          v ]

[ Show advanced options ]

                       [Cancel] [Create]
```

Expanded:

```text
ADVANCED OPTIONS

Project identifier
[ __________________ ]

Default branch
[ main             ]

Access permissions
[ Configure        ]

Notifications
[ Enabled          ]
```

## 9.3. Rules

- Required fields must be visible.
- Optional fields should remain accessible.
- Advanced configuration should be grouped.
- Do not hide important validation requirements.
- Preserve entered values when sections collapse.
- Avoid making essential information dependent on expansion.
- Clearly indicate which fields are optional.
- Keep advanced options close to their relevant configuration.

## 9.4. Audit checklist

- [ ] Required fields are visible.
- [ ] Optional fields are accessible.
- [ ] Advanced options are grouped.
- [ ] Validation requirements are clear.
- [ ] Collapsing sections preserves values.
- [ ] Advanced configuration is understandable.

---

# 10. Progressive Disclosure in Navigation

## 10.1. Definition

Navigation systems must provide access to a potentially large information architecture without displaying every destination simultaneously.

## 10.2. Appropriate mechanisms

- Collapsible navigation groups.
- Secondary navigation.
- Contextual navigation.
- Command menus.
- Search-based navigation.
- Recently visited destinations.
- Nested navigation.

## 10.3. Rules

- Primary destinations must remain discoverable.
- Secondary destinations may be grouped.
- Collapsed groups must communicate their expandable state.
- Active destinations must remain identifiable.
- Navigation depth must remain controlled.
- Search should complement navigation, not replace essential navigation.
- Preserve orientation when navigating between levels.

## 10.4. Audit checklist

- [ ] Primary navigation is clear.
- [ ] Secondary destinations are discoverable.
- [ ] Navigation groups are meaningful.
- [ ] Active states remain visible.
- [ ] Navigation depth is controlled.
- [ ] Collapsed navigation preserves orientation.

---

# 11. Command Interfaces and Keyboard-Driven Disclosure

## 11.1. Definition

Command interfaces allow users to access advanced functionality through searchable commands and keyboard interactions.

They are particularly useful in information-dense applications.

## 11.2. Appropriate applications

- Command palettes.
- Quick navigation.
- Searchable actions.
- Entity selection.
- Quick creation.
- Contextual commands.
- Keyboard shortcuts.

## 11.3. Rules

- Commands must have understandable names.
- Search must reduce discovery effort.
- Frequently used commands should be easy to access.
- Keyboard shortcuts must be discoverable.
- Commands must preserve contextual relevance.
- Avoid exposing an overwhelming number of commands simultaneously.
- Group commands logically.
- Provide clear feedback when commands execute.

## 11.4. Audit checklist

- [ ] Commands are searchable.
- [ ] Labels are understandable.
- [ ] Common actions are easy to discover.
- [ ] Keyboard shortcuts are documented.
- [ ] Commands are contextually relevant.
- [ ] Execution feedback is clear.

---

# 12. Disclosure State Model

## 12.1. Definition

Progressive disclosure depends on consistent state management.

The library must define predictable state models for components that reveal or hide functionality.

## 12.2. Standard disclosure states

|State|Description|
|---|---|
|Closed|Content is not visible|
|Opening|Content is transitioning into view|
|Open|Content is visible and interactive|
|Closing|Content is transitioning out of view|
|Disabled|Disclosure interaction is unavailable|

Not every component needs explicit transition states in its public API.

They may be internal rendering states.

## 12.3. State ownership

The library should distinguish:

- Uncontrolled disclosure state.
- Controlled disclosure state.
- Default disclosure state.
- Disabled disclosure behavior.
- State synchronization between related components.

## 12.4. Controlled and uncontrolled behavior

Conceptual API:

```jsx
// Uncontrolled
<Accordion defaultOpen={false} />

// Controlled
<Accordion
  open={isOpen}
  onOpenChange={setIsOpen}
/>
```

These examples are illustrative. Reef.js should implement the equivalent behavior using its own state-based architecture.

## 12.5. Rules

- Disclosure state must be predictable.
- Controlled components must respect external state ownership.
- Uncontrolled components must provide consistent internal state.
- Default state must not override subsequent controlled updates.
- Disabled components must not open.
- State changes must preserve component identity.
- Avoid unnecessary state duplication.
- Keep visual state synchronized with actual interaction state.

## 12.6. Audit checklist

- [ ] Open and closed states are consistent.
- [ ] Controlled behavior is supported where appropriate.
- [ ] Uncontrolled behavior is predictable.
- [ ] Disabled behavior is correct.
- [ ] Visual and functional states are synchronized.
- [ ] State ownership is documented.
- [ ] No unnecessary duplicate state exists.

---

# 13. Disclosure Transitions and Motion

## 13.1. Definition

Motion helps communicate the transition between visible and hidden content.

It must reinforce the information hierarchy rather than draw attention to itself.

## 13.2. Expected characteristics

- Short transitions.
- Subtle opacity changes.
- Controlled movement.
- Predictable expansion.
- Consistent easing.
- Stable surrounding content.
- Respect for reduced-motion preferences.

## 13.3. Appropriate motion

- Accordion expansion.
- Popover appearance.
- Menu opening.
- Dialog presentation.
- Navigation group expansion.
- Contextual action appearance.

## 13.4. Rules

- Motion must communicate a meaningful state change.
- Avoid exaggerated movement.
- Avoid unnecessary scale animations.
- Keep transitions consistent across components.
- Prevent interaction blocking during transitions.
- Respect reduced-motion preferences.
- Avoid motion that makes content difficult to track.

## 13.5. Audit checklist

- [ ] Disclosure transitions are consistent.
- [ ] Motion is restrained.
- [ ] State changes are visually understandable.
- [ ] Transitions do not block interaction unnecessarily.
- [ ] Reduced-motion preferences are respected.
- [ ] Content remains easy to track.

---

# 14. Accessibility and Discoverability

## 14.1. Definition

Progressive disclosure must preserve access to functionality for keyboard, screen reader, touch and pointer users.

A function that is visually hidden must not become inaccessible to assistive technologies.

## 14.2. Rules

- Disclosure triggers must be keyboard accessible.
- Expanded state must be communicated semantically.
- Use appropriate ARIA attributes.
- Hidden content must not remain accidentally keyboard focusable.
- Focus must be managed correctly when content opens or closes.
- Hover interactions must have equivalent keyboard behavior.
- Touch users must have equivalent access.
- State changes must be understandable to assistive technologies.

## 14.3. Semantic requirements

For disclosure controls, evaluate:

- `aria-expanded`.
- `aria-controls`.
- Accessible names.
- Focus order.
- Keyboard activation.
- Appropriate hidden-state semantics.
- Focus restoration where appropriate.

For dialogs and menus, apply their respective interaction and accessibility patterns rather than assuming all disclosure components behave identically.

## 14.4. Audit checklist

- [ ] All disclosure triggers are keyboard accessible.
- [ ] Expanded state is exposed semantically.
- [ ] Hidden content is correctly excluded from interaction.
- [ ] Focus behavior is predictable.
- [ ] Screen readers receive appropriate state information.
- [ ] Hover functionality has alternatives.
- [ ] Touch access is preserved.

---

# 15. Progressive Disclosure and Responsive Interfaces

## 15.1. Definition

The amount and presentation of visible functionality must adapt to viewport constraints and interaction capabilities.

Desktop interfaces can expose functionality through hover and pointer interactions.

Mobile interfaces require more explicit interaction mechanisms.

## 15.2. Responsive strategies

|Context|Recommended behavior|
|---|---|
|Desktop|Contextual hover and keyboard disclosure|
|Tablet|Mixed contextual and explicit controls|
|Mobile|Explicit touch-accessible controls|
|Small viewport|Prioritized information and reorganized actions|

## 15.3. Rules

- Never rely exclusively on hover.
- Provide touch-accessible alternatives.
- Preserve access to primary functionality.
- Reorganize secondary actions when space is limited.
- Avoid excessive nested menus on small screens.
- Maintain consistent semantics across viewports.
- Do not simply hide essential controls to reduce visual complexity.

## 15.4. Audit checklist

- [ ] Desktop interactions are appropriate.
- [ ] Keyboard disclosure is supported.
- [ ] Mobile interactions do not depend on hover.
- [ ] Essential actions remain available.
- [ ] Secondary actions are reorganized appropriately.
- [ ] Disclosure patterns remain consistent across viewports.

---

# 16. Disclosure Composition Rules

## 16.1. Definition

Disclosure components are frequently composed together.

The library must establish rules to prevent complex and unpredictable interaction hierarchies.

## 16.2. Examples

- Dropdown inside a Dialog.
- Popover inside a Table.
- Accordion inside a Card.
- Context Menu inside a List.
- Nested Navigation groups.
- Select inside a Form.

## 16.3. Rules

- Avoid unnecessary nested disclosure layers.
- Keep the active interaction context clear.
- Define dismissal behavior consistently.
- Prevent accidental simultaneous opening of unrelated surfaces.
- Preserve focus ownership.
- Avoid competing overlays.
- Ensure parent components do not unintentionally intercept child interactions.

## 16.4. Audit checklist

- [ ] Nested disclosure is justified.
- [ ] Overlay relationships are predictable.
- [ ] Focus ownership is correct.
- [ ] Dismissal behavior is coherent.
- [ ] Parent and child interactions do not conflict.
- [ ] No unnecessary interaction depth exists.

---

# 17. Progressive Disclosure Anti-Patterns

|Anti-pattern|Problem|Expected correction|
|---|---|---|
|Everything visible by default|Cognitive overload|Establish visibility hierarchy|
|Primary actions hidden|Unnecessary friction|Keep primary actions visible|
|Hover-only functionality|Inaccessible interaction|Add keyboard and touch alternatives|
|Excessive nested menus|High interaction cost|Simplify action hierarchy|
|Deep accordion nesting|Fragmented information|Reorganize content|
|Unnecessary dialogs|Workflow interruption|Use contextual surfaces|
|Hidden essential settings|Poor discoverability|Promote essential configuration|
|Too many disclosure triggers|Visual clutter|Consolidate functionality|
|Unclear expand indicators|Unpredictable interaction|Standardize disclosure affordances|
|Uncontrolled overlay stacking|Interaction conflicts|Define overlay relationships|
|State reset on collapse|Data loss|Preserve component state|
|Inconsistent dismissal|Unpredictable behavior|Centralize interaction conventions|
|Mobile hover dependency|Inaccessible functionality|Provide explicit controls|
|Excessive animation|Cognitive distraction|Use restrained transitions|

---

# 18. Progressive Disclosure Audit Methodology

Every component must be audited through the following dimensions.

## 18.1. Information hierarchy

- Is essential information immediately visible?
- Is secondary information appropriately presented?
- Is advanced functionality organized?
- Are visibility levels justified?

## 18.2. Action discoverability

- Are primary actions accessible?
- Are secondary actions discoverable?
- Are contextual actions associated with the right elements?
- Are destructive actions identifiable?

## 18.3. Disclosure patterns

- Are expandable elements identifiable?
- Are disclosure triggers consistent?
- Are menus and popovers appropriate?
- Is interaction depth controlled?

## 18.4. State management

- Are open and closed states predictable?
- Is controlled behavior supported?
- Is internal state synchronized?
- Is state preserved appropriately?

## 18.5. Motion

- Are transitions consistent?
- Is motion restrained?
- Are reduced-motion preferences respected?
- Do transitions preserve interaction usability?

## 18.6. Accessibility

- Are disclosure triggers keyboard accessible?
- Is expanded state communicated?
- Is focus management correct?
- Are hidden controls correctly excluded from interaction?

## 18.7. Responsive behavior

- Does disclosure adapt to viewport constraints?
- Are hover interactions replaced on touch devices?
- Are primary actions preserved?
- Is functionality accessible on every supported device?

## 18.8. Composition

- Are nested disclosure layers justified?
- Do overlays behave predictably?
- Is focus ownership maintained?
- Are dismissal rules consistent?

---

# 19. Progressive Disclosure Scoring

Each component must receive a score from 0 to 4 across eight dimensions.

|Dimension|Weight|
|---|---|
|Information hierarchy|20%|
|Action discoverability|15%|
|Disclosure patterns|15%|
|State management|15%|
|Motion consistency|5%|
|Accessibility|15%|
|Responsive behavior|10%|
|Composition consistency|5%|

### Scoring scale

|Score|Classification|Description|
|---|---|---|
|0|Missing|No coherent disclosure strategy|
|1|Poor|Important information hidden or excessive complexity exposed|
|2|Partial|Basic disclosure with inconsistent behavior|
|3|Good|Predictable, accessible and contextually appropriate|
|4|Excellent|Highly refined visibility hierarchy and interaction experience|

Weighted score:

`(Hierarchy × 0.20) + (Discoverability × 0.15) + (Patterns × 0.15) + (State × 0.15) + (Motion × 0.05) + (Accessibility × 0.15) + (Responsive × 0.10) + (Composition × 0.05)`

### Mandatory constraints

A component cannot be considered compliant if:

- Essential functionality is inaccessible.
- Primary actions are unnecessarily hidden.
- Hover is the only access mechanism for important functionality.
- Disclosure states are not communicated accessibly.
- Opening or closing content causes unexpected state loss.
- Nested overlays create inaccessible interaction states.

Accessibility failures must be tracked independently of the average score.

---

# 20. Remediation Guidelines

When a component fails the progressive disclosure audit, apply corrections in the following order:

1. Identify all information and functionality exposed by default.
2. Classify information according to importance.
3. Identify primary, secondary and advanced actions.
4. Remove unnecessary visible complexity.
5. Establish the appropriate disclosure mechanism.
6. Reduce unnecessary interaction depth.
7. Standardize expanded and collapsed states.
8. Correct controlled and uncontrolled state behavior.
9. Validate keyboard and touch interactions.
10. Correct focus management.
11. Validate responsive disclosure behavior.
12. Test interactions inside composed components.
13. Verify that no essential functionality has become difficult to discover.

Do not hide functionality simply to make the interface look cleaner.

Every disclosure decision must improve the relationship between information visibility, interaction cost and cognitive load.

---

# 21. Final Acceptance Criteria

The progressive disclosure system is considered successfully implemented when:

- Information visibility follows a clear hierarchy.
- Essential information is visible by default.
- Primary actions remain accessible.
- Secondary actions are contextually discoverable.
- Advanced functionality is organized.
- Hover interactions have equivalent alternatives.
- Expandable content behaves predictably.
- Menus and popovers follow consistent patterns.
- Dialogs are reserved for justified interactions.
- Disclosure states are synchronized with component state.
- Transitions are restrained and consistent.
- Accessibility is preserved.
- Responsive interfaces do not depend on hover.
- Nested disclosure remains understandable.
- No essential functionality is hidden behind unnecessary interaction layers.

---

# 22. Final Principle

Progressive disclosure is not about hiding complexity.

It is about controlling when complexity becomes relevant.

A sophisticated interface does not need to expose every capability simultaneously. It must make the right capability available at the right moment without interrupting the user's workflow.

**The objective is minimum unnecessary visibility, maximum functional discoverability and controlled interaction complexity.**