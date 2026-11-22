# Component Inventory

> **Purpose:** Establish a complete, structured and measurable inventory of the UI component library. Identify missing components, incomplete component families, redundant implementations, architectural inconsistencies and opportunities for consolidation.
> 
> **Scope:** Component taxonomy, component families, primitives, foundational components, composite components, complex components, component coverage, functional completeness, composability, maturity, redundancy, dependencies and implementation priorities.
> 
> **Related principles:** Minimalism, Composability, Functional Density, Visual Hierarchy, Interaction Feedback, Accessibility and Component API Consistency.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.
> 
> **Framework context:** Reef.js — state-based reactive framework.

---

# 1. Inventory Philosophy

## 1.1. Definition

A component inventory is a structured catalog of all reusable UI elements available in the design system.

It describes:

- What components exist.
- What responsibilities they fulfill.
- Which component family they belong to.
- Which components depend on other components.
- Which components are foundational.
- Which components are composable.
- Which components are incomplete.
- Which components are redundant.
- Which components are missing.

It is not simply a list of exported components.

It is a map of the capabilities and architecture of the UI library.

## 1.2. Core principle

**A component library should be organized around reusable interface capabilities, not around an arbitrary number of components.**

Every component must have a clearly identifiable purpose.

Every component family must provide sufficient coverage for its intended use cases.

Components should be reusable independently while remaining composable with the rest of the library.

## 1.3. Inventory objectives

The inventory must answer six questions.

|Question|Objective|
|---|---|
|What exists?|Identify all implemented components|
|What is missing?|Identify gaps in the library|
|What is incomplete?|Detect insufficient variants or capabilities|
|What is redundant?|Identify overlapping responsibilities|
|What depends on what?|Understand architectural relationships|
|What should be prioritized?|Establish implementation priorities|

## 1.4. Rules

- Every public component must be inventoried.
- Every component must have a documented responsibility.
- Every component must belong to a defined category.
- Every component must have a maturity status.
- Every component must have a clear dependency model.
- Missing components must be documented.
- Redundant components must be identified.
- Inventory data must be maintained as the library evolves.

## 1.5. Audit checklist

- [ ] A complete component inventory exists.
- [ ] Public and internal components are distinguished.
- [ ] Components are classified into families.
- [ ] Component responsibilities are documented.
- [ ] Component maturity is tracked.
- [ ] Dependencies are documented.
- [ ] Missing capabilities are identified.
- [ ] Redundancies are identified.

---

# 2. Component Taxonomy

## 2.1. Definition

Component taxonomy defines how components are classified according to their responsibilities and complexity.

A coherent taxonomy prevents the library from becoming a flat collection of unrelated components.

## 2.2. Recommended component hierarchy

The inventory should distinguish four architectural levels.

```text
UI Component Library
|
+-- Level 1: Foundations
|   |
|   +-- Design Tokens
|   +-- Typography
|   +-- Icons
|   +-- Layout Primitives
|
+-- Level 2: Primitive Components
|   |
|   +-- Button
|   +-- Input
|   +-- Checkbox
|   +-- Radio
|   +-- Switch
|   +-- Separator
|
+-- Level 3: Composite Components
|   |
|   +-- Select
|   +-- Combobox
|   +-- Dropdown Menu
|   +-- Popover
|   +-- Tabs
|   +-- Accordion
|
+-- Level 4: Complex Components
    |
    +-- Data Table
    +-- Date Picker
    +-- Command Palette
    +-- Navigation Menu
    +-- Sidebar
    +-- Form
```

This hierarchy describes increasing composition complexity, not necessarily a strict dependency hierarchy.

For example, a Date Picker may be composed of a Calendar, Popover and Button, but a Button does not need to depend on a Date Picker.

## 2.3. Level 1 — Foundations

Foundations define the underlying visual and structural language.

Examples:

- Design tokens.
- Typography primitives.
- Icon system.
- Spacing system.
- Layout utilities.
- Animation primitives.

Foundations may not all be UI components in the traditional sense, but they must be included in the architecture inventory.

## 2.4. Level 2 — Primitive Components

Primitive components provide basic interaction and presentation capabilities.

Examples:

- Button.
- Input.
- Textarea.
- Checkbox.
- Radio.
- Switch.
- Label.
- Separator.
- Badge.
- Avatar.

Characteristics:

- Limited responsibility.
- Reusable independently.
- Small API surface.
- Predictable behavior.
- Minimal dependencies.
- Strong accessibility foundations.

## 2.5. Level 3 — Composite Components

Composite components combine multiple primitives into reusable interaction patterns.

Examples:

- Select.
- Combobox.
- Dropdown Menu.
- Popover.
- Tooltip.
- Tabs.
- Accordion.
- Toggle Group.
- Input Group.

Characteristics:

- Multiple internal elements.
- Coordinated interaction states.
- Composition of primitives.
- More complex accessibility requirements.
- Reusable interaction patterns.

## 2.6. Level 4 — Complex Components

Complex components provide complete interface capabilities.

Examples:

- Data Table.
- Calendar.
- Date Picker.
- Command Palette.
- Navigation Menu.
- Sidebar.
- Tree View.
- File Upload.
- Data Grid.

Characteristics:

- Multiple interaction patterns.
- Potentially complex state management.
- Composition of several component families.
- Higher implementation complexity.
- More demanding testing requirements.

## 2.7. Rules

- Every component must have an architectural classification.
- Classification must reflect responsibility and complexity.
- Avoid treating every component as an independent primitive.
- Complex components should reuse existing primitives whenever appropriate.
- Do not introduce artificial abstractions simply to increase reuse.
- Keep foundational utilities distinct from user-facing components.

## 2.8. Audit checklist

- [ ] Component taxonomy is documented.
- [ ] Every component has a classification.
- [ ] Primitive and composite components are distinguishable.
- [ ] Complex components reuse existing foundations.
- [ ] Component responsibilities are not duplicated.
- [ ] Architectural dependencies follow a coherent direction.

---

# 3. Component Family Coverage

## 3.1. Definition

A component family groups components that address the same general interface domain.

A library may contain many individual components while still having incomplete functional coverage.

For example, having an Input component does not mean the form component family is complete.

A complete form ecosystem may also require:

- Label.
- Description.
- Error message.
- Field container.
- Input.
- Textarea.
- Checkbox.
- Radio.
- Select.
- Validation states.
- Form composition patterns.

## 3.2. Recommended component families

The following taxonomy should serve as a coverage baseline, not as a mandatory implementation checklist.

### A. Actions

<text color="secondary" size="xs" weight="medium">USER ACTIONS AND COMMANDS</text>

|Component|Responsibility|Priority|
|---|---|---|
|Button|Primary action|Essential|
|Icon Button|Compact icon action|Essential|
|Button Group|Group related actions|Important|
|Toggle|Binary or pressed action|Important|
|Toggle Group|Group mutually exclusive or multiple actions|Important|
|Link|Navigation action|Essential|
|Dropdown Menu|Contextual actions|Essential|
|Context Menu|Context-sensitive actions|Important|

### B. Forms and Inputs

<text color="secondary" size="xs" weight="medium">DATA ENTRY AND VALIDATION</text>

|Component|Responsibility|Priority|
|---|---|---|
|Input|Single-line text|Essential|
|Textarea|Multiline text|Essential|
|Label|Field identification|Essential|
|Field|Field composition|Essential|
|Input Group|Combined input elements|Important|
|Checkbox|Multiple selection|Essential|
|Radio Group|Single selection|Essential|
|Switch|Boolean setting|Essential|
|Select|Option selection|Essential|
|Combobox|Searchable selection|Important|
|Slider|Numeric range selection|Important|
|Number Input|Numeric entry|Important|
|Form Message|Field feedback|Essential|
|File Upload|File selection|Important|

### C. Data Display

<text color="secondary" size="xs" weight="medium">INFORMATION PRESENTATION</text>

|Component|Responsibility|Priority|
|---|---|---|
|Typography|Text hierarchy|Essential|
|Badge|Compact status|Essential|
|Avatar|Identity representation|Essential|
|Avatar Group|Grouped identities|Important|
|Card|Content container|Essential|
|Table|Structured data|Essential|
|Data Table|Advanced data presentation|Important|
|List|Repeated content|Essential|
|Skeleton|Loading placeholder|Essential|
|Progress|Completion indicator|Important|
|Spinner|Activity indicator|Essential|
|Empty State|No-content feedback|Important|
|Kbd|Keyboard shortcut display|Useful|
|Code|Code presentation|Useful|

### D. Navigation

<text color="secondary" size="xs" weight="medium">NAVIGATION AND INFORMATION ARCHITECTURE</text>

|Component|Responsibility|Priority|
|---|---|---|
|Tabs|Local navigation|Essential|
|Breadcrumb|Hierarchical navigation|Important|
|Navigation Menu|Structured navigation|Important|
|Sidebar|Application navigation|Important|
|Pagination|Multi-page navigation|Important|
|Command Palette|Global command access|Important|
|Tree View|Hierarchical navigation|Useful|
|Menubar|Application-level commands|Useful|

### E. Overlays and Floating UI

<text color="secondary" size="xs" weight="medium">TEMPORARY AND CONTEXTUAL INTERFACES</text>

|Component|Responsibility|Priority|
|---|---|---|
|Dialog|Modal interaction|Essential|
|Alert Dialog|Critical confirmation|Essential|
|Popover|Contextual floating content|Essential|
|Tooltip|Contextual explanation|Essential|
|Dropdown Menu|Floating action list|Essential|
|Context Menu|Pointer-triggered contextual actions|Important|
|Sheet / Drawer|Sliding panel|Important|
|Hover Card|Rich contextual preview|Useful|

### F. Feedback and Status

<text color="secondary" size="xs" weight="medium">SYSTEM FEEDBACK</text>

|Component|Responsibility|Priority|
|---|---|---|
|Alert|Persistent contextual message|Essential|
|Toast|Temporary notification|Essential|
|Sonner / Notification Stack|Notification presentation|Important|
|Progress|Task progression|Important|
|Spinner|Indeterminate activity|Essential|
|Skeleton|Content loading|Essential|
|Empty State|Missing content|Important|
|Error State|Failure presentation|Important|

### G. Disclosure and Organization

<text color="secondary" size="xs" weight="medium">CONTENT ORGANIZATION</text>

|Component|Responsibility|Priority|
|---|---|---|
|Accordion|Expandable sections|Essential|
|Collapsible|Expandable content|Important|
|Separator|Content separation|Essential|
|Resizable Panels|Adjustable layouts|Useful|
|Scroll Area|Controlled scrolling|Important|
|Aspect Ratio|Proportional content|Useful|

### H. Date and Time

<text color="secondary" size="xs" weight="medium">TEMPORAL DATA AND SELECTION</text>

|Component|Responsibility|Priority|
|---|---|---|
|Calendar|Date navigation|Important|
|Date Picker|Date selection|Important|
|Date Range Picker|Range selection|Useful|
|Time Picker|Time selection|Useful|
|Date Input|Direct date entry|Useful|

### I. Media and Files

<text color="secondary" size="xs" weight="medium">MEDIA AND FILE INTERACTION</text>

|Component|Responsibility|Priority|
|---|---|---|
|Image|Image presentation|Essential|
|Image Gallery|Multiple image presentation|Useful|
|File Upload|File selection|Important|
|File Preview|File representation|Useful|
|Carousel|Sequential content navigation|Useful|

### J. Layout and Structure

<text color="secondary" size="xs" weight="medium">SPATIAL COMPOSITION</text>

|Component|Responsibility|Priority|
|---|---|---|
|Box|Generic layout container|Foundation|
|Stack|Vertical composition|Foundation|
|Inline|Horizontal composition|Foundation|
|Grid|Grid composition|Foundation|
|Container|Content width management|Foundation|
|Center|Centered content|Foundation|
|Spacer|Flexible spacing|Foundation|
|Separator|Structural separation|Essential|
|Resizable Panels|Dynamic layout|Useful|

## 3.3. Important distinction: component versus pattern

Not every recurring interface pattern deserves its own component.

For example:

- A settings page is a composition pattern.
- A dashboard is a composition pattern.
- A user profile page is a composition pattern.
- A login form is a composition pattern.

These may be documented as patterns or templates rather than foundational components.

The distinction prevents the component inventory from becoming an application-template catalog.

## 3.4. Rules

- Every major interface domain must be represented.
- Each family must have documented responsibilities.
- Identify incomplete families.
- Distinguish components from composition patterns.
- Prioritize based on real interface requirements.
- Avoid implementing every possible component without a use case.

## 3.5. Audit checklist

- [ ] Major component families are documented.
- [ ] Essential components are present.
- [ ] Important capabilities are covered.
- [ ] Incomplete families are identified.
- [ ] Component patterns are distinguished from page templates.
- [ ] Redundant implementations are identified.
- [ ] Missing capabilities have priorities.

---

# 4. Component Responsibility and Boundaries

## 4.1. Definition

Every component must have a clearly defined responsibility and a well-defined boundary.

A component should solve a recognizable UI problem without absorbing unrelated responsibilities.

## 4.2. Single responsibility principle

A component should have one primary responsibility.

Examples:

|Component|Appropriate responsibility|
|---|---|
|Button|Trigger an action|
|Tooltip|Explain an element contextually|
|Popover|Display contextual floating content|
|Dialog|Present a modal interaction|
|Select|Select from a predefined set|
|Combobox|Search and select options|
|Tabs|Switch between related content panels|

A component may expose several variants and capabilities while preserving one coherent responsibility.

## 4.3. Responsibility overlap

Examples of potential problems:

- Tooltip and Popover share too much behavior.
- Select and Combobox implement duplicated selection logic.
- Dialog and Drawer independently implement the same modal infrastructure.
- Alert and Toast have unclear responsibility boundaries.
- Multiple button-like components implement inconsistent action semantics.

Overlap is not necessarily incorrect.

For example, Dialog and Alert Dialog may share an internal primitive while exposing different interaction contracts.

## 4.4. Component boundary audit

For each component, answer:

1. What problem does it solve?
2. What does it own?
3. What does it not own?
4. Which components can compose with it?
5. Which responsibilities are delegated to primitives?
6. Does another component already solve the same problem?
7. Can the component be used independently?

## 4.5. Rules

- Define one primary responsibility per component.
- Avoid mixing layout, domain logic and presentation unnecessarily.
- Share implementation infrastructure when responsibilities overlap.
- Avoid duplicating interaction logic.
- Keep component boundaries understandable.
- Avoid components that require unrelated features to be useful.

## 4.6. Audit checklist

- [ ] Every component has a defined responsibility.
- [ ] Responsibilities do not overlap unnecessarily.
- [ ] Component boundaries are documented.
- [ ] Shared behavior is identified.
- [ ] Domain-specific logic is not embedded unnecessarily.
- [ ] Components can be composed independently.

---

# 5. Component Completeness

## 5.1. Definition

A component is complete when it provides the capabilities expected from its responsibility.

A component may technically exist but still be incomplete.

For example, a Button that only supports a default state and one size is not necessarily a complete production-ready Button.

## 5.2. Completeness dimensions

Every component should be evaluated against the following dimensions.

|Dimension|Questions|
|---|---|
|Visual variants|Are required variants available?|
|Sizes|Are appropriate density levels supported?|
|States|Are all interaction states implemented?|
|Accessibility|Are semantic and keyboard requirements covered?|
|Composition|Can the component be used with related components?|
|Customization|Can consumers customize legitimate aspects?|
|Responsiveness|Does it work in relevant viewport conditions?|
|Theming|Does it support every theme?|
|Events|Are interaction events correctly exposed?|
|Lifecycle|Does it clean up resources correctly?|
|Reactivity|Does it integrate correctly with Reef state?|
|Testing|Are expected behaviors validated?|

## 5.3. Example: Button completeness

Expected inventory:

```text
Button
|
+-- Variants
|   +-- Primary
|   +-- Secondary
|   +-- Outline
|   +-- Ghost
|   +-- Destructive
|   +-- Link
|
+-- Sizes
|   +-- Small
|   +-- Default
|   +-- Large
|   +-- Icon
|
+-- States
|   +-- Default
|   +-- Hover
|   +-- Active
|   +-- Focus-visible
|   +-- Disabled
|   +-- Loading
|
+-- Capabilities
    +-- Native button semantics
    +-- Keyboard activation
    +-- Icon support
    +-- Full-width support
    +-- Loading feedback
    +-- Accessible naming
```

Not every Button needs every possible variant.

The goal is to identify the capabilities that are relevant to the design system.

## 5.4. Rules

- Define completeness criteria per component.
- Distinguish missing functionality from optional enhancements.
- Document supported variants and sizes.
- Document all relevant states.
- Validate accessibility.
- Validate theme support.
- Validate composition.
- Track incomplete implementations explicitly.

## 5.5. Audit checklist

- [ ] Component capabilities are documented.
- [ ] Required variants exist.
- [ ] Required sizes exist.
- [ ] All relevant states are implemented.
- [ ] Accessibility is addressed.
- [ ] Composition is supported.
- [ ] Customization is predictable.
- [ ] Theme support is complete.
- [ ] Reactive behavior is correct.
- [ ] Tests cover expected behavior.

---

# 6. Composability Coverage

## 6.1. Definition

Composability measures how effectively components can be combined to build more complex interfaces.

This is one of the most important characteristics of a composable component architecture.

A component library should provide building blocks rather than forcing developers to use predefined monolithic interfaces.

## 6.2. Composition levels

### Level 1 — Standalone usage

A component works independently.

Example:

```jsx
<Button>Save</Button>
```

### Level 2 — Primitive composition

Several primitives can be combined.

```jsx
<div class="flex gap-2">
  <Input placeholder="Search..." />
  <Button>Search</Button>
</div>
```

### Level 3 — Compound composition

A component exposes coordinated subcomponents.

```jsx
<Tabs>
  <Tabs.List>
    <Tabs.Trigger value="overview">
      Overview
    </Tabs.Trigger>

    <Tabs.Trigger value="settings">
      Settings
    </Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="overview">
    Overview content
  </Tabs.Content>

  <Tabs.Content value="settings">
    Settings content
  </Tabs.Content>
</Tabs>
```

### Level 4 — Application composition

Several components combine into a complete interface.

```jsx
<Card>
  <Card.Header>
    <Card.Title>Project settings</Card.Title>
    <Card.Description>
      Manage your project configuration.
    </Card.Description>
  </Card.Header>

  <Card.Content>
    <Input placeholder="Project name" />
  </Card.Content>

  <Card.Footer>
    <Button>Save changes</Button>
  </Card.Footer>
</Card>
```

These examples illustrate API shapes rather than mandatory Reef syntax.

## 6.3. Composability principles

- Components should accept appropriate child content.
- Compound components should coordinate their internal state.
- Components should not impose unnecessary layout restrictions.
- Consumers should be able to customize content.
- Internal implementation details should remain encapsulated.
- Composition should not require undocumented workarounds.

## 6.4. Rules

- Support standalone usage where appropriate.
- Support primitive composition.
- Provide compound APIs for coordinated interactions.
- Avoid monolithic components when composition is more appropriate.
- Avoid excessive internal coupling.
- Preserve accessibility during composition.
- Ensure predictable state ownership.

## 6.5. Audit checklist

- [ ] Components can be composed.
- [ ] Child content is customizable.
- [ ] Compound components expose coherent APIs.
- [ ] Internal state coordination is reliable.
- [ ] Components do not impose unnecessary structure.
- [ ] Composition preserves accessibility.
- [ ] Complex interfaces can be built without workarounds.

---

# 7. Component Variants and Capability Coverage

## 7.1. Definition

Variants represent intentional visual or behavioral alternatives within a component family.

They allow components to adapt to different contexts without creating separate components for every variation.

## 7.2. Variant dimensions

Common dimensions include:

|Dimension|Examples|
|---|---|
|Visual variant|Primary, Secondary, Outline, Ghost|
|Size|Small, Medium, Large|
|Emphasis|High, Medium, Low|
|State|Default, Disabled, Loading|
|Density|Compact, Comfortable|
|Orientation|Horizontal, Vertical|
|Appearance|Solid, Soft, Subtle|
|Behavior|Single, Multiple, Controlled|

Not all dimensions apply to every component.

## 7.3. Variant explosion

Avoid uncontrolled combinations.

For example:

```text
6 visual variants
× 4 sizes
× 3 densities
× 7 states
```

This can create a large number of combinations that are difficult to implement, document and test.

Instead, define only meaningful combinations.

## 7.4. Rules

- Variants must represent meaningful differences.
- Keep variant naming consistent.
- Avoid duplicating components for simple styling variations.
- Avoid unnecessary variant combinations.
- Separate visual variants from behavioral capabilities.
- Document supported combinations.

## 7.5. Audit checklist

- [ ] Variant dimensions are documented.
- [ ] Naming is consistent.
- [ ] Variants have distinct purposes.
- [ ] Unnecessary combinations are removed.
- [ ] Visual and behavioral variants are distinguished.
- [ ] All supported combinations are tested.

---

# 8. Primitive and Infrastructure Coverage

## 8.1. Definition

A component library needs more than visible components.

It also requires internal infrastructure to support accessibility, interactions and composition.

This infrastructure is often invisible to consumers but essential to component quality.

## 8.2. Recommended infrastructure inventory

|Infrastructure|Responsibility|
|---|---|
|Portal|Render floating elements outside local stacking contexts|
|Focus Manager|Manage keyboard focus|
|Focus Trap|Contain focus inside modal contexts|
|Dismissable Layer|Handle outside interactions|
|Positioning Engine|Position floating elements|
|Presence|Manage mount and unmount transitions|
|Roving Focus|Manage keyboard navigation within groups|
|ID Generator|Generate stable accessible identifiers|
|Visually Hidden|Hide content visually while preserving accessibility|
|Scroll Lock|Control background scrolling|
|Keyboard Manager|Coordinate keyboard interactions|
|Overlay Manager|Coordinate nested overlays|

Some of these may be implemented as internal utilities rather than public components.

## 8.3. Why this matters

Without shared infrastructure:

- Dialogs may implement focus handling differently.
- Popovers may behave inconsistently.
- Menus may have different keyboard navigation.
- Nested overlays may conflict.
- Components may leak event listeners.
- Accessibility behavior may become fragmented.

A mature library centralizes shared infrastructure wherever appropriate.

## 8.4. Rules

- Inventory internal primitives.
- Identify duplicated infrastructure.
- Centralize shared interaction mechanisms.
- Keep internal utilities separate from public APIs.
- Validate infrastructure independently.
- Ensure reusable primitives do not create unnecessary coupling.

## 8.5. Audit checklist

- [ ] Internal infrastructure is inventoried.
- [ ] Shared overlay behavior is centralized.
- [ ] Focus management is consistent.
- [ ] Floating positioning is consistent.
- [ ] Keyboard navigation infrastructure exists.
- [ ] Lifecycle cleanup is reliable.
- [ ] Public and internal primitives are distinguished.

---

# 9. Component Dependencies and Architecture Graph

## 9.1. Definition

A dependency graph describes how components depend on each other.

It helps identify:

- Architectural coupling.
- Circular dependencies.
- Duplicated primitives.
- Incorrect dependency direction.
- Components that are unnecessarily complex.

## 9.2. Example dependency graph

```text
Button
  |
  +--------------------+

Input                 Dialog
                       |
                       +-- Portal
                       +-- Focus Manager
                       +-- Dismissable Layer

Popover
  |
  +-- Portal
  +-- Positioning Engine
  +-- Dismissable Layer
  +-- Focus Manager

Select
  |
  +-- Popover Infrastructure
  +-- List Navigation
  +-- Selection State
```

The exact relationships depend on implementation choices.

For example, Select and Popover may share infrastructure without Select depending on the public Popover component.

That distinction is important.

## 9.3. Dependency principles

- Prefer shared internal primitives over duplicated implementations.
- Avoid circular dependencies.
- Avoid unnecessary dependencies on complex components.
- Keep low-level components independent.
- Separate shared infrastructure from public component APIs.
- Keep dependency direction predictable.

## 9.4. Audit checklist

- [ ] Component dependencies are documented.
- [ ] Circular dependencies are absent.
- [ ] Foundational components remain independent.
- [ ] Shared infrastructure is reused.
- [ ] Dependencies do not unnecessarily expose implementation details.
- [ ] Complex components do not contaminate primitive components.

---

# 10. Component Maturity and Lifecycle

## 10.1. Definition

Component maturity describes how ready a component is for production usage.

A component should not be considered complete simply because it renders correctly.

Its implementation, behavior, accessibility, documentation and testing must also be considered.

## 10.2. Recommended maturity levels

|Status|Meaning|
|---|---|
|Planned|Identified but not implemented|
|Experimental|Initial implementation|
|Alpha|Basic functionality available|
|Beta|Functionally complete but still under validation|
|Stable|Production-ready and documented|
|Deprecated|Scheduled for removal|
|Removed|No longer supported|

## 10.3. Maturity requirements

A component can reach Stable only when it satisfies:

- Functional completeness.
- Visual consistency.
- API consistency.
- Accessibility requirements.
- Keyboard interaction requirements.
- Reactive integration.
- Lifecycle cleanup.
- Documentation.
- Automated tests.
- Theme compatibility.

## 10.4. Rules

- Assign a maturity status to every component.
- Do not mark components Stable prematurely.
- Document experimental limitations.
- Provide migration guidance for deprecated components.
- Maintain compatibility expectations.
- Track maturity changes over time.

## 10.5. Audit checklist

- [ ] Every component has a maturity status.
- [ ] Stable components satisfy acceptance criteria.
- [ ] Experimental components are identified.
- [ ] Deprecated components have migration guidance.
- [ ] Component maturity is visible to consumers.
- [ ] Breaking changes are documented.

---

# 11. Component Redundancy and Consolidation

## 11.1. Definition

Component redundancy occurs when multiple components provide substantially overlapping capabilities without a meaningful distinction.

It increases:

- Maintenance costs.
- API complexity.
- Documentation overhead.
- Testing requirements.
- Design inconsistencies.

## 11.2. Common redundancy patterns

|Components|Potential issue|Possible correction|
|---|---|---|
|IconButton / Button with icon-only variant|Duplicate responsibility|Consolidate where appropriate|
|TextInput / Input|Naming or implementation duplication|Standardize|
|Modal / Dialog|Overlapping APIs|Define one canonical abstraction|
|Select / Dropdown|Unclear semantic distinction|Separate selection from actions|
|Notification / Toast|Duplicate feedback infrastructure|Define shared architecture|
|Panel / Card|Unclear surface responsibility|Establish distinct roles|

## 11.3. Important distinction

Two components can look similar while having different responsibilities.

For example:

- Select chooses a value.
- Dropdown Menu triggers an action.
- Popover displays contextual content.
- Dialog interrupts the current interaction flow.

They may share infrastructure, but they should not necessarily become one public component.

## 11.4. Consolidation criteria

Before merging two components, evaluate:

1. Do they solve the same problem?
2. Do they share the same interaction model?
3. Do they have compatible accessibility requirements?
4. Can their differences be expressed through meaningful variants?
5. Would consolidation make the API harder to understand?
6. Would one component become excessively complex?

## 11.5. Rules

- Identify duplicated responsibilities.
- Distinguish visual similarity from functional similarity.
- Share infrastructure before merging public APIs.
- Consolidate only when it improves clarity.
- Avoid unnecessary component proliferation.
- Preserve meaningful semantic distinctions.

## 11.6. Audit checklist

- [ ] Similar components have been reviewed.
- [ ] Functional overlap is documented.
- [ ] Duplicate implementations are identified.
- [ ] Shared infrastructure is considered.
- [ ] Consolidation decisions are justified.
- [ ] Distinct interaction patterns remain distinct.

---

# 12. Component Naming and Discoverability

## 12.1. Definition

Naming and discoverability determine how easily developers can find, understand and use components.

A technically complete library can still be difficult to use when its organization and naming are inconsistent.

## 12.2. Naming principles

- Use recognizable UI terminology.
- Prefer established naming conventions.
- Avoid unnecessary abbreviations.
- Keep component names consistent.
- Distinguish visual concepts from behavioral concepts.
- Avoid multiple names for the same responsibility.

## 12.3. Example

Prefer:

```text
Button
Input
Textarea
Checkbox
RadioGroup
DropdownMenu
AlertDialog
DatePicker
```

Avoid inconsistent naming such as:

```text
UiBtn
TextField
InputBox
Check
RadioSelect
DropDown
ConfirmModal
DateSelect
```

The issue is not that every alternative name is inherently wrong.

It is that inconsistent naming creates unnecessary cognitive overhead.

## 12.4. Inventory discoverability

Developers should be able to discover components by:

- Name.
- Family.
- Responsibility.
- Interaction type.
- Maturity.
- Dependencies.
- Usage examples.

## 12.5. Audit checklist

- [ ] Component names follow conventions.
- [ ] Similar components use consistent terminology.
- [ ] Components are discoverable by family.
- [ ] Public exports are documented.
- [ ] Internal components are distinguished.
- [ ] Aliases are justified.
- [ ] Deprecated names have migration guidance.

---

# 13. Component Inventory Data Model

## 13.1. Definition

The inventory should be represented as structured data rather than maintained only as a manually written document.

This enables automation, reporting and continuous auditing.

## 13.2. Recommended component metadata

```ts
type ComponentLevel =
  | "foundation"
  | "primitive"
  | "composite"
  | "complex";

type ComponentStatus =
  | "planned"
  | "experimental"
  | "alpha"
  | "beta"
  | "stable"
  | "deprecated"
  | "removed";

type ComponentPriority =
  | "essential"
  | "important"
  | "useful"
  | "optional";

interface ComponentInventoryItem {
  name: string;

  description: string;

  family: string;

  level: ComponentLevel;

  status: ComponentStatus;

  priority: ComponentPriority;

  public: boolean;

  dependencies: string[];

  capabilities: string[];

  variants: string[];

  states: string[];

  themes: string[];

  accessibility: {
    semantic: boolean;
    keyboard: boolean;
    screenReader: boolean;
  };

  testing: {
    unit: boolean;
    interaction: boolean;
    visual: boolean;
    accessibility: boolean;
  };

  documentation: boolean;
}
```

This is an inventory metadata model, not a substitute for detailed component specifications.

## 13.3. Example inventory entry

```ts
const buttonInventory: ComponentInventoryItem = {
  name: "Button",

  description: "Triggers a user action.",

  family: "actions",

  level: "primitive",

  status: "stable",

  priority: "essential",

  public: true,

  dependencies: [],

  capabilities: [
    "native-button-semantics",
    "keyboard-activation",
    "icon-support",
    "loading-state",
    "disabled-state"
  ],

  variants: [
    "primary",
    "secondary",
    "outline",
    "ghost",
    "destructive"
  ],

  states: [
    "default",
    "hover",
    "active",
    "focus-visible",
    "disabled",
    "loading"
  ],

  themes: ["light", "dark"],

  accessibility: {
    semantic: true,
    keyboard: true,
    screenReader: true
  },

  testing: {
    unit: true,
    interaction: true,
    visual: true,
    accessibility: true
  },

  documentation: true
};
```

The values are illustrative and should reflect the actual implementation.

## 13.4. Rules

- Maintain structured inventory metadata.
- Keep inventory data synchronized with public exports.
- Distinguish implemented capabilities from planned capabilities.
- Avoid manually claiming capabilities that are not tested.
- Use inventory data to generate reports.
- Validate metadata completeness.

## 13.5. Audit checklist

- [ ] Inventory uses a structured data model.
- [ ] Metadata is complete.
- [ ] Public exports are synchronized.
- [ ] Dependencies are accurate.
- [ ] Maturity is accurate.
- [ ] Capabilities reflect actual implementation.
- [ ] Reports can be generated automatically.

---

# 14. Inventory Automation

## 14.1. Definition

Inventory automation detects discrepancies between the declared architecture and the actual codebase.

It should help answer:

- Are all exported components inventoried?
- Are some components undocumented?
- Are internal components accidentally exported?
- Are there unused components?
- Are component families incomplete?
- Are duplicate names or responsibilities present?
- Are required capabilities missing?

## 14.2. Recommended automation checks

|Check|Expected result|
|---|---|
|Export discovery|All public components detected|
|Inventory comparison|No missing metadata|
|Duplicate detection|Potential overlaps identified|
|Dependency analysis|Circular dependencies detected|
|Status validation|All components have valid maturity|
|Documentation validation|Public components documented|
|Capability validation|Required capabilities tracked|
|Theme validation|Supported themes declared|
|Test coverage validation|Missing test categories identified|

## 14.3. Suggested generated report

```text
REEF COMPONENT INVENTORY
========================

Total components: 68

Foundations: 8
Primitives: 24
Composites: 22
Complex: 14

Stable: 35
Beta: 12
Alpha: 8
Experimental: 5
Planned: 8

Issues:
- 4 components missing documentation
- 3 components missing keyboard tests
- 2 components have incomplete dark theme support
- 3 potential responsibility overlaps
- 5 missing family capabilities
```

The figures are illustrative.

## 14.4. Rules

- Automate export discovery.
- Detect missing inventory metadata.
- Identify duplicate responsibilities.
- Generate coverage reports.
- Track component maturity.
- Detect dependency issues.
- Integrate checks into continuous integration.

## 14.5. Audit checklist

- [ ] Public components are automatically discovered.
- [ ] Inventory discrepancies are detected.
- [ ] Documentation gaps are detected.
- [ ] Missing capabilities are reported.
- [ ] Dependencies are analyzed.
- [ ] Reports can be regenerated.
- [ ] Inventory validation runs in CI.

---

# 15. Component Inventory Anti-Patterns

|Anti-pattern|Problem|Expected correction|
|---|---|---|
|Flat component catalog|No architectural organization|Define taxonomy|
|Too many components|API proliferation|Consolidate responsibilities|
|Too few components|Missing reusable capabilities|Identify family gaps|
|Monolithic components|Poor composability|Extract reusable primitives|
|Duplicate implementations|Maintenance overhead|Share infrastructure|
|Incomplete families|Inconsistent developer experience|Define family coverage|
|Unclear component responsibility|Overlapping behavior|Document boundaries|
|Everything marked stable|False maturity|Define maturity criteria|
|Internal utilities exposed publicly|API pollution|Separate internal infrastructure|
|Components without documentation|Poor discoverability|Require documentation|
|Components without tests|Unverified behavior|Define test requirements|
|Arbitrary component naming|Cognitive overhead|Standardize naming|
|Inventory maintained only manually|Architecture drift|Automate metadata validation|

---

# 16. Component Inventory Audit Methodology

Every component must be evaluated across the following dimensions.

## 16.1. Classification

- Does the component belong to a defined family?
- Is its architectural level clear?
- Is it foundational, primitive, composite or complex?

## 16.2. Responsibility

- Does it have one primary responsibility?
- Is its boundary clearly defined?
- Does it overlap with other components?

## 16.3. Coverage

- Are all essential component families represented?
- Are required capabilities missing?
- Are composition patterns covered?

## 16.4. Completeness

- Are variants implemented?
- Are sizes implemented?
- Are states implemented?
- Is accessibility supported?
- Is theme support complete?

## 16.5. Composability

- Can the component be used independently?
- Can it be composed with other components?
- Does it support compound composition where appropriate?
- Does it impose unnecessary structure?

## 16.6. Architecture

- Are dependencies coherent?
- Are internal primitives shared?
- Are circular dependencies absent?
- Is the component unnecessarily coupled?

## 16.7. Maturity

- Is its status documented?
- Does it meet its maturity requirements?
- Is its documentation complete?
- Is it tested?

## 16.8. Discoverability

- Is the component correctly named?
- Is it exported appropriately?
- Is it discoverable by family?
- Are examples available?

---

# 17. Component Inventory Scoring

The inventory should be evaluated globally, but individual components should also receive their own maturity assessment.

## 17.1. Global inventory score

|Dimension|Weight|
|---|---|
|Component taxonomy|10%|
|Family coverage|20%|
|Responsibility boundaries|10%|
|Component completeness|15%|
|Composability coverage|15%|
|Infrastructure coverage|10%|
|Dependency architecture|5%|
|Maturity and documentation|10%|
|Inventory automation|5%|

### Scoring scale

|Score|Classification|Description|
|---|---|---|
|0|Missing|No inventory or architecture|
|1|Poor|Incomplete and inconsistent catalog|
|2|Partial|Basic organization with important gaps|
|3|Good|Structured and sufficiently complete library|
|4|Excellent|Comprehensive, composable and continuously validated ecosystem|

Weighted score:

`(Taxonomy × 0.10) + (Coverage × 0.20) + (Responsibilities × 0.10) + (Completeness × 0.15) + (Composability × 0.15) + (Infrastructure × 0.10) + (Dependencies × 0.05) + (Maturity × 0.10) + (Automation × 0.05)`

## 17.2. Mandatory constraints

A library cannot be considered mature if:

- Public components are not inventoried.
- Essential component families have significant gaps.
- Components have undocumented responsibilities.
- Core interaction infrastructure is duplicated inconsistently.
- Stable components lack basic documentation.
- Critical accessibility capabilities are missing.
- Component dependencies contain unresolved architectural problems.

The global score must not hide critical component-level deficiencies.

---

# 18. Remediation Guidelines

When the inventory audit identifies problems, apply corrections in the following order:

1. Discover all public and internal components.
2. Build the complete inventory.
3. Classify components into families and architectural levels.
4. Identify missing essential capabilities.
5. Identify incomplete component families.
6. Review component responsibilities.
7. Identify redundant implementations.
8. Consolidate shared infrastructure where appropriate.
9. Improve primitive and compound composition.
10. Define maturity statuses.
11. Document component dependencies.
12. Complete missing documentation and tests.
13. Automate inventory validation.
14. Establish an ongoing component maintenance process.

Do not start by implementing every missing component.

First determine whether the missing capability is actually required and whether it can be provided through existing composable components.

---

# 19. Final Acceptance Criteria

The component inventory is considered successfully implemented when:

- Every public component is inventoried.
- Every component belongs to a documented family.
- Component responsibilities are clearly defined.
- Architectural levels are documented.
- Essential component families are sufficiently covered.
- Missing capabilities are identified and prioritized.
- Incomplete components are identified.
- Redundant components are reviewed.
- Primitive and composite components are distinguishable.
- Shared internal infrastructure is inventoried.
- Dependencies are documented.
- Maturity statuses are assigned.
- Public component naming is consistent.
- Inventory metadata is structured.
- Inventory discrepancies can be detected automatically.

---

# 20. Public Components and Internal Primitives

Distinguish the public API from the internal infrastructure.

```text
Public API
|
+-- Dialog
+-- Popover
+-- Select
+-- DropdownMenu

Internal Infrastructure
|
+-- Portal
+-- DismissableLayer
+-- FocusManager
+-- PositioningEngine
+-- RovingFocus
+-- Presence
```

Public components form the developer API.

Internal primitives form the technical infrastructure. They may share a lot of code without exposing their abstractions to consumers.

---

# 21. Functional Coverage Matrix

Build a matrix that shows gaps at a glance.

|Family|Coverage|Priority|
|---|---|---|
|Actions|90%|High|
|Forms|65%|High|
|Data Display|80%|High|
|Navigation|45%|Medium|
|Overlays|75%|High|
|Feedback|60%|High|
|Date & Time|20%|Low|
|Layout|90%|High|

These figures are fictional. What matters is measuring real coverage.

Do not compute coverage from the number of components alone. A family can contain ten unnecessary components and still miss the only one it really needs.

---

# 22. Reef Compatibility

Audit every component for its compatibility with the Reef reactive model:

- Prop reactivity.
- Controlled value reactivity.
- Synchronization of internal and external state.
- Event handling.
- Subscription cleanup.
- Lifecycle management.
- Absence of unnecessary updates.
- Handling of dynamic components.
- Composition of several state sources.

This separates a library that merely looks refined from one that also has a robust technical architecture.

---

# 23. Final Principle

A mature UI library is not defined by the number of components it contains.

It is defined by the quality of its component ecosystem.

Every component should have a reason to exist.

Every family should provide coherent capabilities.

Every primitive should contribute to larger compositions.

Every complex component should build upon reliable foundations.

**The objective is to build a complete, minimal, composable and coherent component ecosystem in which developers can create complex interfaces without fighting the library or reinventing its foundations.**
