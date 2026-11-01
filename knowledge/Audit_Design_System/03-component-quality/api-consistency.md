# API Consistency

> **Purpose:** Establish a consistent, predictable and ergonomic public API across all Reef.js UI components.
> 
> **Scope:** Naming conventions, props, variants, sizes, state ownership, controlled and uncontrolled patterns, events, composition, slots, polymorphism, styling, TypeScript contracts and developer experience.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.
> 
> **Framework context:** Reef.js — state-based reactive framework.

---

# 1. API Design Philosophy

## 1.1. Definition

API consistency measures how consistently components expose their capabilities, behavior and configuration to consumers.

A consistent API allows developers to:

- Predict prop names.
- Understand component behavior.
- Reuse knowledge across components.
- Compose components naturally.
- Control component state predictably.
- Customize appearance without fighting the design system.
- Discover capabilities without inspecting implementation details.

## 1.2. Core principles

### Principle 1 — Predictability

Identical concepts should use identical API conventions.

If a component uses `disabled`, another component should not use `isDisabled` for the same concept.

### Principle 2 — Consistency without forced uniformity

Components should share conventions when their concepts are equivalent.

Different interaction models may legitimately require different APIs.

For example, a Checkbox and a Select both expose selection state, but their interaction contracts are not identical.

### Principle 3 — Explicitness

Component APIs should make important behavior understandable.

Avoid ambiguous props, implicit behavior and undocumented side effects.

### Principle 4 — Minimalism

Expose only meaningful configuration.

Avoid adding props simply because a capability could theoretically be configurable.

### Principle 5 — Composability

Components should expose APIs that support natural composition and customization.

### Principle 6 — Framework alignment

Public APIs must respect Reef.js reactivity, state ownership and lifecycle conventions.

## 1.3. Audit checklist

- [ ] API conventions are consistent across components.
- [ ] Equivalent concepts use equivalent names.
- [ ] Different concepts are not artificially unified.
- [ ] Props have clear responsibilities.
- [ ] APIs are explicit and predictable.
- [ ] Unnecessary configuration is avoided.
- [ ] Composition is supported naturally.
- [ ] Reef.js conventions are respected.

---

# 2. Prop Naming Conventions

## 2.1. Definition

Prop naming consistency ensures that equivalent concepts are represented using the same terminology throughout the library.

## 2.2. Recommended naming conventions

|Concept|Standard API|Avoid|
|---|---|---|
|Disabled|`disabled`|`isDisabled`, `disable`|
|Read-only|`readOnly`|`readonly`, `isReadonly`|
|Required|`required`|`isRequired`|
|Invalid|`invalid`|`hasError`, `isInvalid`|
|Loading|`loading`|`isLoading`, `pending`|
|Variant|`variant`|`type`, `appearance`|
|Size|`size`|`scale`, `dimension`|
|Class|`class`|`className`, `customClass`|
|Style|`style`|`customStyle`|
|Children|`children`|`content`, `body`|
|Open state|`open`|`visible`, `expanded`|
|Selected value|`value`|`selectedValue`, `currentValue`|
|Placeholder|`placeholder`|`emptyText`|
|Name|`name`|`fieldName`|
|ID|`id`|`elementId`|

These are recommended public conventions, not an instruction to rename native HTML attributes or established framework contracts indiscriminately.

## 2.3. Boolean naming

Prefer descriptive boolean properties.

```ts
interface ButtonProps {
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}
```

Avoid:

```ts
interface ButtonProps {
  isDisabled?: boolean;
  isLoading?: boolean;
  widthFull?: boolean;
}
```

## 2.4. Naming rules

- Use consistent terminology.
- Prefer established HTML terminology where applicable.
- Use camelCase for multiword JavaScript props.
- Avoid abbreviations.
- Avoid ambiguous names.
- Avoid redundant prefixes.
- Avoid synonyms for equivalent concepts.
- Do not rename native attributes without a strong reason.

## 2.5. Audit checklist

- [ ] Equivalent props use identical names.
- [ ] Boolean props are descriptive.
- [ ] Native terminology is preserved where appropriate.
- [ ] Multiword props use consistent casing.
- [ ] No unnecessary abbreviations exist.
- [ ] No ambiguous synonyms exist.

---

# 3. Variant API Consistency

## 3.1. Definition

Variants represent meaningful visual or semantic differences between component configurations.

They should express design intent rather than implementation details.

## 3.2. Recommended variant vocabulary

|Variant|Intended meaning|
|---|---|
|`default`|Standard component appearance|
|`primary`|Main action or emphasis|
|`secondary`|Supporting action|
|`outline`|Bordered, transparent treatment|
|`ghost`|Minimal surface treatment|
|`destructive`|Dangerous or irreversible action|
|`subtle`|Reduced visual emphasis|
|`link`|Link-like presentation|

Not every component needs every variant.

## 3.3. Example

```tsx
<Button variant="primary">
  Save
</Button>

<Button variant="secondary">
  Cancel
</Button>

<Button variant="destructive">
  Delete
</Button>

<Button variant="ghost">
  More options
</Button>
```

## 3.4. Avoid inconsistent variants

```tsx
<Button variant="primary" />

<Badge variant="success" />

<Card variant="elevated" />

<Alert variant="warning" />
```

These variants are not necessarily incorrect, but the library must distinguish two categories:

- Shared semantic variants.
- Component-specific variants.

A Badge's `success` status and a Button's `primary` emphasis describe different concepts.

Do not force them into one universal vocabulary.

## 3.5. Variant taxonomy

Maintain a central vocabulary with two levels.

### Shared variants

Reusable concepts such as:

- `default`
- `primary`
- `secondary`
- `destructive`
- `ghost`
- `outline`

### Component-specific variants

Examples:

- Badge: `success`, `warning`, `error`, `info`.
- Card: `elevated`, `interactive`, `outlined`.
- Alert: `success`, `warning`, `error`, `info`.
- Input: `default`, `filled`, `unstyled`.

## 3.6. Rules

- Variants must represent meaningful differences.
- Equivalent visual concepts should share vocabulary.
- Semantic status must not be confused with visual emphasis.
- Avoid redundant variants.
- Avoid variants that only change arbitrary CSS values.
- Document variant behavior.
- Define a sensible default.

## 3.7. Audit checklist

- [ ] Variant names are consistent.
- [ ] Shared concepts use shared terminology.
- [ ] Component-specific variants are justified.
- [ ] Variants express design intent.
- [ ] Defaults are defined.
- [ ] No redundant variants exist.
- [ ] All variants have documented visual behavior.

---

# 4. Size API Consistency

## 4.1. Definition

Size consistency ensures that components use a predictable vocabulary for dimensions and visual scale.

## 4.2. Recommended size vocabulary

```ts
type ComponentSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl";
```

Not every component needs all sizes.

## 4.3. Example

```tsx
<Button size="sm" />

<Input size="md" />

<Badge size="lg" />

<Avatar size="xl" />
```

## 4.4. Size consistency rules

Components using the same size should have a coherent visual scale.

For example:

|Size|Typical usage|
|---|---|
|`xs`|Compact metadata or dense interfaces|
|`sm`|Secondary controls and compact layouts|
|`md`|Default interface scale|
|`lg`|Prominent controls|
|`xl`|Large or specialized presentation|

The same size token does not necessarily imply identical dimensions across all component categories.

A Button and an Avatar have different geometries.

## 4.5. Avoid

```tsx
<Button size="small" />

<Input size="compact" />

<Badge size="medium" />

<Avatar size="large" />
```

When these values represent equivalent scales, the vocabulary should be unified.

## 4.6. Rules

- Use a shared size vocabulary.
- Define component-specific exceptions.
- Establish a consistent scale.
- Avoid arbitrary dimension props when presets are sufficient.
- Define defaults.
- Ensure sizes remain visually coherent.

## 4.7. Audit checklist

- [ ] Size names are standardized.
- [ ] Equivalent sizes use identical terminology.
- [ ] Size scales are documented.
- [ ] Defaults are consistent.
- [ ] Exceptions are justified.
- [ ] Size changes preserve accessibility.

---

# 5. Controlled and Uncontrolled State APIs

## 5.1. Definition

State API consistency determines how components expose and manage their state.

This is particularly important in Reef.js because its state-based architecture makes reactive synchronization a fundamental part of component behavior.

## 5.2. Core rule

Every stateful component must have a clearly documented state ownership model.

The recommended convention is:

- `value` for value-oriented state.
- `open` for visibility or expansion state.
- `checked` for checkbox-like state.
- `onValueChange` for value changes.
- `onOpenChange` for visibility changes.
- `onCheckedChange` for checked-state changes.

## 5.3. Controlled state

The consumer owns the state.

```tsx
const [value, setValue] = createSignal("");

<Input
  value={value()}
  onValueChange={setValue}
/>
```

The component must reflect external state changes.

## 5.4. Uncontrolled state

The component owns its internal state.

```tsx
<Input
  defaultValue="Initial value"
/>
```

## 5.5. Recommended API contract

```ts
interface InputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}
```

The component must define what happens when controlled and uncontrolled props are mixed.

Recommended policy:

- `value` establishes controlled mode.
- `defaultValue` establishes the initial uncontrolled value.
- `defaultValue` does not continuously override internal state.
- Switching ownership modes after initialization should be discouraged or explicitly handled.
- Controlled state must not be silently modified internally.

## 5.6. State API vocabulary

|Component|State prop|Initial prop|Change callback|
|---|---|---|---|
|Input|`value`|`defaultValue`|`onValueChange`|
|Textarea|`value`|`defaultValue`|`onValueChange`|
|Select|`value`|`defaultValue`|`onValueChange`|
|Checkbox|`checked`|`defaultChecked`|`onCheckedChange`|
|Switch|`checked`|`defaultChecked`|`onCheckedChange`|
|Dialog|`open`|`defaultOpen`|`onOpenChange`|
|Popover|`open`|`defaultOpen`|`onOpenChange`|
|Accordion|`value`|`defaultValue`|`onValueChange`|
|Tabs|`value`|`defaultValue`|`onValueChange`|

## 5.7. Special cases

Components with multiple independent state dimensions should expose separate state contracts.

For example, a Combobox may have:

- `value`: selected value.
- `inputValue`: text entered in the search field.
- `open`: popup visibility.

These are distinct states and should not be conflated.

## 5.8. Rules

- Establish clear state ownership.
- Use predictable state prop names.
- Provide initial values for uncontrolled components.
- Provide change callbacks for controlled components.
- Avoid duplicated sources of truth.
- Handle external updates.
- Document controlled/uncontrolled transitions.
- Define reset behavior.
- Use callbacks to communicate proposed state changes.

## 5.9. Audit checklist

- [ ] State ownership is explicit.
- [ ] Controlled behavior is implemented.
- [ ] Uncontrolled behavior is implemented where appropriate.
- [ ] Initial state props follow conventions.
- [ ] Change callbacks follow conventions.
- [ ] External updates propagate correctly.
- [ ] No duplicated sources of truth exist.
- [ ] Mode transitions are defined.
- [ ] Reset behavior is documented.

---

# 6. Event API Consistency

## 6.1. Definition

Event API consistency ensures that components communicate interactions through predictable callback conventions.

## 6.2. Recommended naming conventions

|Event|Naming convention|
|---|---|
|Value changes|`onValueChange`|
|Checked changes|`onCheckedChange`|
|Open changes|`onOpenChange`|
|Selection changes|`onSelectionChange`|
|Input changes|`onInput` or `onValueChange`, depending on semantics|
|Click|`onClick`|
|Focus|`onFocus`|
|Blur|`onBlur`|
|Submit|`onSubmit`|
|Cancel|`onCancel`|
|Close|`onClose`|

## 6.3. Semantic callbacks versus DOM events

Prefer semantic callbacks for component-owned state.

```tsx
<Select
  value={selected()}
  onValueChange={setSelected}
/>
```

This is preferable to requiring consumers to understand internal DOM event structures.

However, preserve native event handlers when they are meaningful and expected.

```tsx
<Button onClick={handleClick}>
  Save
</Button>
```

## 6.4. Callback payload consistency

Define callback payloads explicitly.

```ts
type ValueChangeHandler<T> = (
  value: T
) => void;
```

For more complex components:

```ts
interface SelectionChangeDetails<T> {
  value: T;
  previousValue: T;
  reason: "pointer" | "keyboard" | "programmatic";
}
```

Use detail objects when additional context is genuinely useful, not as unnecessary ceremony.

## 6.5. Rules

- Use semantic callbacks for semantic state changes.
- Preserve native event conventions.
- Define callback payloads.
- Avoid inconsistent callback signatures.
- Avoid redundant event callbacks.
- Document callback execution timing.
- Ensure callbacks behave consistently in controlled and uncontrolled modes.

## 6.6. Audit checklist

- [ ] Callback names are consistent.
- [ ] Callback payloads are documented.
- [ ] Native events are preserved where appropriate.
- [ ] Semantic state callbacks are available.
- [ ] Callback timing is predictable.
- [ ] No redundant callbacks exist.

---

# 7. Boolean Props and Configuration Consistency

## 7.1. Definition

Boolean props control optional behavior or component capabilities.

Their names and defaults should communicate their meaning without requiring consumers to understand implementation details.

## 7.2. Recommended patterns

```tsx
<Button
  disabled
  loading
  fullWidth
/>

<Dialog
  open
  modal
/>

<Tooltip
  open
  disabled
/>
```

## 7.3. Avoid contradictory configuration

```tsx
<Dialog
  open
  defaultOpen
/>
```

Controlled and uncontrolled state should not be configured simultaneously without a documented reason.

## 7.4. Default behavior

Defaults should be consistent and unsurprising.

|Prop|Recommended default|
|---|---|
|`disabled`|`false`|
|`loading`|`false`|
|`required`|`false`|
|`readOnly`|`false`|
|`fullWidth`|`false`|
|`modal`|Component-specific|
|`open`|`false` in uncontrolled mode|

## 7.5. Rules

- Prefer positive boolean names.
- Avoid unnecessary `is` prefixes.
- Document defaults.
- Avoid contradictory configurations.
- Keep defaults consistent where concepts are equivalent.
- Use boolean props only for meaningful configuration.

## 7.6. Audit checklist

- [ ] Boolean naming is consistent.
- [ ] Defaults are documented.
- [ ] Positive naming is preferred.
- [ ] Contradictory props are handled.
- [ ] No redundant boolean props exist.

---

# 8. Styling API Consistency

## 8.1. Definition

Styling API consistency ensures that consumers can customize components through predictable mechanisms without bypassing the design system.

This is especially important for a library where customization and ownership of styling are central principles.

## 8.2. Recommended styling conventions

```tsx
<Button
  class="custom-button"
/>

<Card
  class="custom-card"
/>

<Dialog.Content
  class="custom-dialog"
/>
```

## 8.3. CSS variables

Prefer design-token-based customization.

```css
:root {
  --button-height: 2.25rem;
  --button-radius: var(--radius-md);
  --button-background: var(--color-primary);
}
```

## 8.4. Styling mechanisms

|Mechanism|Purpose|
|---|---|
|`class`|Consumer CSS customization|
|`style`|Dynamic inline styles|
|CSS variables|Design-token customization|
|`variant`|Semantic visual configuration|
|`size`|Standardized dimensions|
|Slots|Styling individual structural parts|

## 8.5. Class composition

A component should merge consumer classes with its internal classes predictably.

It must avoid accidentally replacing required structural or accessibility styles.

Define conflict-resolution behavior, especially if consumers use utility-class systems.

## 8.6. Avoid

- Excessive individual color props.
- Arbitrary CSS properties exposed as component props.
- Multiple competing styling APIs.
- Inconsistent `class` and `className` usage.
- Styling APIs that expose internal implementation details.

## 8.7. Rules

- Standardize class customization.
- Preserve design-token usage.
- Support styling of compound parts where necessary.
- Define class merging behavior.
- Keep semantic variants separate from arbitrary styling.
- Avoid excessive styling props.

## 8.8. Audit checklist

- [ ] Styling conventions are consistent.
- [ ] Class customization works.
- [ ] CSS variables are available where appropriate.
- [ ] Design tokens remain the source of truth.
- [ ] Compound parts can be customized.
- [ ] Class conflicts are handled predictably.
- [ ] No redundant styling APIs exist.

---

# 9. Children, Slots and Composition API

## 9.1. Definition

Composition APIs determine how consumers provide content and customize component structure.

A good API should allow developers to compose complex interfaces without requiring excessive configuration.

## 9.2. Children convention

Use children for the primary content of a component.

```tsx
<Button>
  Save changes
</Button>
```

```tsx
<Card>
  <Card.Content>
    Project details
  </Card.Content>
</Card>
```

## 9.3. Slots

Use named slots or compound components when a component has meaningful structural regions.

Example:

```tsx
<Dialog>
  <Dialog.Trigger>
    Open
  </Dialog.Trigger>

  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Confirm action</Dialog.Title>
    </Dialog.Header>

    <Dialog.Footer>
      <Button>Confirm</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

## 9.4. Composition patterns

Standardize the preferred approach for:

- Children.
- Named slots.
- Compound components.
- Render props.
- Custom rendering.
- Portals.
- Trigger elements.

Avoid implementing multiple composition mechanisms for the same use case without a clear benefit.

## 9.5. Rules

- Prefer natural children composition.
- Use compound components for meaningful structures.
- Keep slot naming consistent.
- Avoid unnecessary render-prop complexity.
- Preserve semantic relationships.
- Make composition patterns discoverable.

## 9.6. Audit checklist

- [ ] Children usage is consistent.
- [ ] Slot conventions are documented.
- [ ] Compound APIs are predictable.
- [ ] Custom rendering is justified.
- [ ] Composition is not unnecessarily restrictive.
- [ ] Structural semantics are preserved.

---

# 10. Icon API Consistency

## 10.1. Definition

Icon APIs define how icons are provided, positioned and customized across the library.

## 10.2. Recommended conventions

Use consistent prop names for icon positions.

```tsx
<Button
  leadingIcon={<SaveIcon />}
  trailingIcon={<ArrowRightIcon />}
>
  Save
</Button>
```

Alternatively, prefer children composition when this is more natural.

```tsx
<Button>
  <SaveIcon />
  Save
</Button>
```

The library should select one primary convention and document the alternative where supported.

## 10.3. Icon-only components

```tsx
<IconButton
  aria-label="Close"
>
  <XIcon />
</IconButton>
```

An icon-only interactive control must always have an accessible name.

## 10.4. Rules

- Standardize icon placement terminology.
- Avoid inconsistent `leftIcon`, `startIcon`, `iconLeft` naming.
- Define icon sizing conventions.
- Preserve accessible naming.
- Avoid unnecessary icon-specific props.

## 10.5. Audit checklist

- [ ] Icon conventions are consistent.
- [ ] Position names are standardized.
- [ ] Icon sizing follows design tokens.
- [ ] Icon-only controls have accessible names.
- [ ] Icons do not break alignment.

---

# 11. Polymorphism and Element Customization

## 11.1. Definition

Polymorphism allows a component to render different underlying elements while retaining its visual or behavioral contract.

It can be useful, but should not become a universal requirement.

## 11.2. Example

```tsx
<Button as="a" href="/settings">
  Settings
</Button>
```

Alternative composition:

```tsx
<Button asChild>
  <a href="/settings">
    Settings
  </a>
</Button>
```

## 11.3. Evaluation criteria

A polymorphic API must preserve:

- Correct semantic HTML.
- Valid attribute forwarding.
- Keyboard behavior.
- Accessible naming.
- Event behavior.
- Ref behavior where supported.
- TypeScript correctness.

## 11.4. Important distinction

A Button and a Link are not interchangeable simply because they look similar.

Use:

- Button for actions.
- Link for navigation.

Polymorphism must not encourage invalid semantics.

## 11.5. Rules

- Use polymorphism only when it provides real value.
- Preserve semantic meaning.
- Define prop forwarding.
- Define ref behavior.
- Avoid invalid HTML structures.
- Prefer dedicated components when behavior differs substantially.

## 11.6. Audit checklist

- [ ] Polymorphism is justified.
- [ ] Semantic HTML is preserved.
- [ ] Props are forwarded correctly.
- [ ] Event behavior is predictable.
- [ ] Refs work correctly where supported.
- [ ] TypeScript inference is correct.

---

# 12. Accessibility API Consistency

## 12.1. Definition

Accessibility APIs should expose predictable mechanisms for labels, descriptions, relationships and interaction semantics.

## 12.2. Recommended conventions

|Purpose|API|
|---|---|
|Accessible label|`aria-label`|
|Accessible description|`aria-describedby`|
|Label relationship|`id` / `htmlFor`|
|Invalid state|`aria-invalid`|
|Expanded state|`aria-expanded`|
|Controls relationship|`aria-controls`|
|Required state|`required` / `aria-required` where appropriate|

Prefer native HTML attributes whenever possible.

## 12.3. Component examples

```tsx
<Input
  id="email"
  aria-describedby="email-description"
  aria-invalid={hasError()}
/>
```

```tsx
<IconButton aria-label="Delete item">
  <TrashIcon />
</IconButton>
```

## 12.4. Rules

- Preserve native accessibility attributes.
- Do not invent unnecessary accessibility prop aliases.
- Standardize generated IDs and relationships.
- Keep ARIA state synchronized with actual behavior.
- Ensure compound components establish the correct relationships.

## 12.5. Audit checklist

- [ ] Native attributes are supported.
- [ ] Accessible naming is predictable.
- [ ] Descriptions are supported.
- [ ] IDs are handled correctly.
- [ ] ARIA state reflects actual component state.
- [ ] Compound accessibility relationships work.

---

# 13. TypeScript API Consistency

## 13.1. Definition

TypeScript contracts define the developer-facing guarantees of every component.

They must be predictable, precise and aligned with the runtime implementation.

## 13.2. Common prop contracts

Standardize reusable types for:

- Variants.
- Sizes.
- State callbacks.
- Component children.
- Class customization.
- Native HTML attributes.
- Event handlers.

Example:

```ts
type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

type ButtonSize =
  | "sm"
  | "md"
  | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReefNode;
  class?: string;
}
```

`ReefNode` is illustrative here; use the actual public renderable type exposed by Reef.js.

## 13.3. Native attribute inheritance

Components should inherit relevant native HTML attributes where appropriate.

For example, a Button should expose appropriate button attributes such as:

- `type`
- `name`
- `value`
- `form`
- `disabled`
- `aria-*`
- `data-*`

Do not inherit every native attribute indiscriminately.

A custom Select does not automatically have the same contract as a native HTML select.

## 13.4. Type safety

Evaluate:

- Correct optionality.
- Correct default types.
- Callback signatures.
- Discriminated unions.
- Controlled/uncontrolled contracts.
- Polymorphic inference.
- Event types.
- Generic value types.
- Invalid configuration prevention.

## 13.5. Rules

- Reuse shared types where concepts are equivalent.
- Avoid unnecessary type duplication.
- Keep runtime and TypeScript behavior aligned.
- Avoid excessive `any`.
- Prevent invalid configurations where possible.
- Ensure public types are exported consistently.

## 13.6. Audit checklist

- [ ] Public props are correctly typed.
- [ ] Shared types are reused.
- [ ] Native attributes are supported appropriately.
- [ ] Callback signatures are consistent.
- [ ] Controlled/uncontrolled contracts are typed.
- [ ] Invalid combinations are prevented.
- [ ] No unnecessary `any` exists.
- [ ] Public types are exported consistently.

---

# 14. Prop Surface and API Minimalism

## 14.1. Definition

API minimalism measures whether a component exposes the smallest set of meaningful public options required by its responsibilities.

This is particularly important for achieving powerful interfaces without unnecessary complexity.

## 14.2. Signs of API bloat

- Too many boolean props.
- Multiple props controlling the same behavior.
- Redundant variants.
- Arbitrary dimension props.
- Configuration for implementation details.
- Props that only exist to compensate for poor defaults.
- Unnecessary aliases.
- Props used by only one internal scenario.

## 14.3. Example

Over-configured API:

```tsx
<Button
  background="#111"
  textColor="#fff"
  borderRadius="8px"
  height="36px"
  fontSize="14px"
  fontWeight="500"
  paddingX="16px"
/>
```

Preferred API:

```tsx
<Button
  variant="primary"
  size="md"
>
  Save
</Button>
```

Advanced customization should be handled by the styling system rather than a large collection of component props.

## 14.4. Prop necessity test

For every public prop, ask:

1. Does it solve a real consumer need?
2. Is the behavior already covered by another prop?
3. Could a sensible default eliminate it?
4. Does it expose an implementation detail?
5. Is it consistent with other components?
6. Does it introduce additional interaction complexity?
7. Is it documented and tested?

## 14.5. Rules

- Minimize public props.
- Avoid redundant configuration.
- Prefer semantic variants over arbitrary styling props.
- Prefer composition over excessive configuration.
- Keep defaults intelligent.
- Do not expose internal state unnecessarily.

## 14.6. Audit checklist

- [ ] Every prop has a clear purpose.
- [ ] No redundant props exist.
- [ ] Defaults eliminate unnecessary configuration.
- [ ] Implementation details remain internal.
- [ ] Styling is not over-configured.
- [ ] Composition replaces unnecessary props.
- [ ] API complexity is proportional to component complexity.

---

# 15. Cross-Component API Consistency Matrix

Maintain a central matrix covering the entire library.

|Convention|Button|Input|Select|Dialog|Checkbox|
|---|---|---|---|---|---|
|`variant`|Yes|Optional|Optional|Optional|Optional|
|`size`|Yes|Yes|Yes|Context-specific|Yes|
|`disabled`|Yes|Yes|Yes|Context-specific|Yes|
|`class`|Yes|Yes|Yes|Yes|Yes|
|`value`|No|Yes|Yes|No|No|
|`defaultValue`|No|Yes|Yes|No|No|
|`onValueChange`|No|Yes|Yes|No|No|
|`checked`|No|No|No|No|Yes|
|`defaultChecked`|No|No|No|No|Yes|
|`onCheckedChange`|No|No|No|No|Yes|
|`open`|No|No|Yes|Yes|No|
|`defaultOpen`|No|No|Yes|Yes|No|
|`onOpenChange`|No|No|Yes|Yes|No|

This matrix is a starting point. Each component must be evaluated according to its actual semantics.

## 15.1. Audit requirements

- Identify naming deviations.
- Identify inconsistent callback conventions.
- Identify missing common capabilities.
- Identify unnecessary props.
- Identify inconsistent defaults.
- Identify undocumented exceptions.
- Identify API duplication.

---

# 16. API Consistency Anti-Patterns

|Anti-pattern|Problem|Correction|
|---|---|---|
|`isDisabled` vs `disabled`|Naming inconsistency|Standardize|
|`small` vs `sm`|Inconsistent size vocabulary|Use shared scale|
|`onChange` vs `onValueChange` for identical contracts|Unpredictable callbacks|Standardize semantic events|
|`className` vs `class`|Styling inconsistency|Select one convention|
|Multiple props for the same state|Ambiguous ownership|Consolidate|
|Excessive boolean props|API bloat|Prefer composition or variants|
|Different defaults for equivalent concepts|Unexpected behavior|Standardize defaults|
|Component-specific aliases|Learning overhead|Reuse shared vocabulary|
|Arbitrary styling props|Design-system fragmentation|Use tokens and classes|
|Incorrect polymorphism|Broken semantics|Preserve native roles|
|Missing native attributes|Limited integration|Forward relevant attributes|
|Overly complex TypeScript types|Poor DX|Simplify public contracts|
|Inconsistent slot names|Composition friction|Establish conventions|
|Internal implementation props exposed publicly|Tight coupling|Hide internal details|

---

# 17. API Consistency Audit Methodology

Every component must be evaluated across these dimensions:

## 17.1. Naming

- Are prop names consistent?
- Are boolean names predictable?
- Are callback names standardized?

## 17.2. Variants

- Are shared variants standardized?
- Are component-specific variants justified?
- Are defaults consistent?

## 17.3. Sizes

- Is there a shared size vocabulary?
- Are exceptions documented?
- Is the visual scale coherent?

## 17.4. State

- Is state ownership explicit?
- Are controlled and uncontrolled patterns consistent?
- Are initial values and callbacks predictable?

## 17.5. Events

- Are callback conventions consistent?
- Are payloads correctly typed?
- Are native events preserved?

## 17.6. Styling

- Is class customization consistent?
- Are design tokens respected?
- Is class merging predictable?

## 17.7. Composition

- Are children and slots consistent?
- Are compound APIs coherent?
- Are custom rendering mechanisms justified?

## 17.8. Accessibility

- Are native attributes preserved?
- Are ARIA relationships predictable?
- Are accessibility states synchronized?

## 17.9. TypeScript

- Are public types consistent?
- Are shared types reused?
- Are invalid configurations prevented?

## 17.10. Minimalism

- Is every prop necessary?
- Are there redundant capabilities?
- Are defaults sufficiently intelligent?

---

# 18. API Consistency Scoring

## 18.1. Scoring dimensions

|Dimension|Weight|
|---|---|
|Naming conventions|15%|
|Variant consistency|10%|
|Size consistency|5%|
|State API consistency|15%|
|Event API consistency|10%|
|Boolean and defaults|5%|
|Styling API|10%|
|Composition API|10%|
|Accessibility API|5%|
|TypeScript contracts|10%|
|API minimalism|5%|

## 18.2. Scoring scale

|Score|Classification|Description|
|---|---|---|
|0|Missing|No established conventions|
|1|Inconsistent|Major API differences|
|2|Partial|Some conventions exist|
|3|Consistent|Most APIs follow shared rules|
|4|Excellent|Highly predictable and coherent|

## 18.3. Maturity levels

|Level|Score|Status|
|---|---|---|
|L0|0–0.9|No API standard|
|L1|1–1.9|Fragmented API|
|L2|2–2.9|Partially standardized|
|L3|3–3.5|Consistent API|
|L4|3.6–4|Mature API system|

A high average score must not conceal critical issues such as inconsistent state ownership or broken native semantics.

---

# 19. API Remediation Priorities

## P0 — Critical

- Conflicting state ownership.
- Incorrect controlled behavior.
- Broken TypeScript contracts.
- Invalid semantic element behavior.
- Incompatible event contracts.

## P1 — High

- Inconsistent prop naming.
- Inconsistent state callbacks.
- Inconsistent variants.
- Missing native attributes.
- Inconsistent styling mechanisms.

## P2 — Medium

- Redundant props.
- Inconsistent size vocabulary.
- Composition API improvements.
- TypeScript ergonomics.
- Documentation gaps.

## P3 — Low

- Minor naming refinements.
- Convenience aliases.
- Non-essential type improvements.
- Additional composition shortcuts.

---

# 20. Final Acceptance Criteria

The Reef.js component library is considered API-consistent when:

- Public naming conventions are standardized.
- Shared variants follow a common vocabulary.
- Size conventions are predictable.
- Controlled and uncontrolled patterns are documented.
- Event callbacks use consistent semantics.
- Boolean props have clear defaults.
- Styling customization follows shared conventions.
- Children and slots follow predictable patterns.
- Accessibility attributes are preserved.
- TypeScript contracts are consistent.
- Polymorphism is used appropriately.
- Unnecessary props have been removed.
- Component-specific exceptions are documented.
- Cross-component API deviations have been audited.

---

# 21. Final Principle

**A good component API should feel familiar before the developer has learned it.**

The developer should not need to remember a different naming convention, state model or composition pattern for every component.

Consistency reduces cognitive load, improves discoverability and makes the entire library feel like a coherent product.

The objective is not to make every component identical.

It is to establish a common language while preserving the specific requirements of each component.

A mature component library is not a collection of APIs. It is a unified API system.