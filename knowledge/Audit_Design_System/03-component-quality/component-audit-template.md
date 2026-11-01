# Component Audit Template

> **Purpose:** Provide a standardized, exhaustive and actionable audit framework for every component in the Reef.js UI library.
> 
> **Scope:** Design philosophy, visual quality, API quality, interaction quality, accessibility, framework integration, performance, testing and documentation.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.
> 
> **Framework:** Reef.js — state-based reactive framework.

---

# 1. Component Identification

## 1.1. Component Information

|Property|Value|
|---|---|
|Component name|`[ComponentName]`|
|Category|`[Primitive / Form / Navigation / Overlay / Data Display / Layout]`|
|Component status|`[Stable / Beta / Experimental / Deprecated]`|
|Implementation file|`[Path]`|
|Stylesheet|`[Path]`|
|Public export|`[Path]`|
|Documentation|`[URL or Path]`|
|Tests|`[Path]`|
|Audit date|`[Date]`|
|Auditor|`[Name]`|
|Version|`[Version]`|

## 1.2. Component Purpose

Describe the component's responsibility.

- What problem does it solve?
- What is its primary use case?
- What are its secondary use cases?
- What semantic role does it represent?
- What should it explicitly not be responsible for?

## 1.3. Component Boundaries

Identify:

- Internal responsibilities.
- External responsibilities.
- Dependencies on other components.
- Dependencies on design tokens.
- Dependencies on Reef.js primitives.
- Browser and DOM dependencies.

---

# 2. Design Intent Audit

Before inspecting implementation details, establish what the component is supposed to communicate.

## 2.1. Design Philosophy Alignment

Evaluate the component against the global Reef.js design philosophy.

|Principle|Audit question|Score|
|---|---|---|
|Minimalism|Does the component avoid unnecessary visual elements?|0–4|
|Clarity|Is its purpose immediately understandable?|0–4|
|Functional density|Does it maximize useful information without visual clutter?|0–4|
|Visual hierarchy|Is the primary information or action immediately identifiable?|0–4|
|Consistency|Does it belong naturally to the Reef.js visual language?|0–4|
|Composability|Can it be combined with other components naturally?|0–4|
|Predictability|Does it behave as users expect?|0–4|
|Restraint|Does it avoid unnecessary decoration and emphasis?|0–4|

## 2.2. Design Intent Definition

Document the intended visual and behavioral identity.

```md
### Component: [ComponentName]

Primary purpose:
[Description]

Visual personality:
[Description]

Interaction personality:
[Description]

Information hierarchy:
[Description]

Expected density:
[Compact / Balanced / Spacious]

Expected emphasis:
[Low / Medium / High]

Design constraints:
[Description]
```

## 2.3. Prior Art

Note comparable implementations worth learning from. This section is not scored.

|Source|Design decision worth examining|
|---|---|
|[Source]|[Decision]|

Do not blindly reproduce a source. Extract the underlying design decision and evaluate its relevance.

---

# 3. Visual Quality Audit

## 3.1. Geometry

Evaluate:

- Width and height.
- Minimum dimensions.
- Border radius.
- Border thickness.
- Internal padding.
- Icon dimensions.
- Alignment.
- Aspect ratio.
- Responsive behavior.

|Criterion|Expected|Actual|Score|
|---|---|---|---|
|Dimensions|Token-based|||
|Border radius|Consistent geometry|||
|Internal spacing|Spacing tokens|||
|Alignment|Pixel-consistent|||
|Icon sizing|Standardized|||
|Responsive sizing|Predictable|||

## 3.2. Surface Treatment

Evaluate:

- Background color.
- Border color.
- Surface hierarchy.
- Shadows.
- Elevation.
- Transparency.
- Hover surface.
- Focus surface.
- Disabled surface.

Questions:

- Does the component use the correct semantic surface tokens?
- Are borders sufficiently subtle?
- Are shadows used only when necessary?
- Does the component feel visually integrated with the rest of the library?
- Does its surface treatment remain coherent in dark and light themes?

## 3.3. Typography

Evaluate:

- Font family.
- Font size.
- Font weight.
- Line height.
- Letter spacing.
- Text color.
- Text truncation.
- Multiline behavior.

Questions:

- Is typography consistent with the Reef.js typographic scale?
- Is the information hierarchy immediately recognizable?
- Are secondary labels visually subordinate?
- Are font weights used intentionally?
- Does text remain readable at compact sizes?

## 3.4. Color

Evaluate:

- Foreground.
- Background.
- Border.
- Interactive states.
- Semantic states.
- Disabled states.
- Dark theme.
- Light theme.

Questions:

- Are semantic tokens used instead of primitive colors?
- Is contrast sufficient?
- Is color used consistently to express meaning?
- Does the component avoid unnecessary accent colors?
- Are destructive and status states visually distinct?

## 3.5. Visual Refinement

Inspect details that distinguish a polished component from a merely functional one.

- [ ] No unexpected one-pixel misalignment.
- [ ] No inconsistent border thickness.
- [ ] No awkward icon positioning.
- [ ] No unnecessary shadows.
- [ ] No inconsistent text baselines.
- [ ] No visual jumps between states.
- [ ] No accidental clipping.
- [ ] No inconsistent corner radii.
- [ ] No unexplained spacing differences.
- [ ] No unnecessary decorative elements.

## 3.6. Visual Quality Score

|Dimension|Weight|Score|
|---|---|---|
|Geometry|20%||
|Surface treatment|20%||
|Typography|15%||
|Color|15%||
|Spacing and alignment|15%||
|Visual refinement|15%||
|**Total**|**100%**||

---

# 4. Design Token Audit

## 4.1. Token Usage

Verify that the component consumes the correct design tokens.

|Token category|Expected usage|Actual usage|Status|
|---|---|---|---|
|Primitive colors|Through semantic mapping|||
|Semantic colors|Component surfaces and states|||
|Typography|Shared typographic scale|||
|Spacing|Shared spacing scale|||
|Radius|Shared radius scale|||
|Shadows|Shared elevation system|||
|Borders|Shared border system|||
|Motion|Shared duration and easing|||
|Focus|Shared focus tokens|||

## 4.2. Hardcoded Values

Identify:

- Hardcoded colors.
- Hardcoded dimensions.
- Hardcoded spacing.
- Hardcoded radii.
- Hardcoded typography.
- Hardcoded shadows.
- Hardcoded transitions.

For each hardcoded value, determine whether it is justified or should be replaced by a token.

Important: not every numeric value is necessarily incorrect. Some implementation-specific values may legitimately remain local.

## 4.3. Token Integrity

- [ ] Semantic tokens are preferred.
- [ ] Primitive tokens are not used directly when semantic tokens exist.
- [ ] Component tokens are justified.
- [ ] Dark and light themes use corresponding semantic values.
- [ ] No duplicated token definitions exist.
- [ ] No obsolete token references remain.

---

# 5. API Quality Audit

## 5.1. Props Inventory

Document every public prop.

|Prop|Type|Default|Purpose|Required?|
|---|---|---|---|---|
|`variant`|||||
|`size`|||||
|`disabled`|||||
|`loading`|||||
|`class`|||||
|`style`|||||
|`children`|||||

Add component-specific properties.

## 5.2. Naming Consistency

- [ ] Prop names follow Reef.js conventions.
- [ ] Boolean names are predictable.
- [ ] Event names are standardized.
- [ ] State names are standardized.
- [ ] No unnecessary aliases exist.
- [ ] Native HTML terminology is preserved where appropriate.

## 5.3. Variant Audit

|Variant|Exists|Documented|Visually correct|Necessary|
|---|---|---|---|---|
|default|||||
|primary|||||
|secondary|||||
|outline|||||
|ghost|||||
|destructive|||||

Only evaluate variants relevant to the component.

## 5.4. Size Audit

|Size|Exists|Token-based|Consistent|Accessible|
|---|---|---|---|---|
|xs|||||
|sm|||||
|md|||||
|lg|||||
|xl|||||

## 5.5. API Minimalism

For every prop, ask:

- Is this capability genuinely needed?
- Is it already covered by another prop?
- Could a better default eliminate it?
- Is it exposing an implementation detail?
- Could composition solve the problem more naturally?

Identify:

- Redundant props.
- Missing props.
- Ambiguous props.
- Unnecessary configuration.
- Missing defaults.
- Inconsistent types.

## 5.6. TypeScript Contract

- [ ] Public props are strongly typed.
- [ ] Native attributes are correctly inherited.
- [ ] Shared types are reused.
- [ ] Callback signatures are documented.
- [ ] Generic types are correct where needed.
- [ ] Invalid prop combinations are prevented where practical.
- [ ] No unnecessary `any` exists.
- [ ] Public exports are complete.

---

# 6. Component Completeness Audit

Evaluate whether the component offers all capabilities expected for its role.

## 6.1. Functional Completeness

|Capability|Expected|Implemented|Tested|
|---|---|---|---|
|Primary functionality||||
|Secondary functionality||||
|Disabled state||||
|Loading state||||
|Empty state||||
|Error state||||
|Read-only state||||
|Responsive behavior||||

Not every state applies to every component.

## 6.2. State Completeness

For every stateful component:

- [ ] Initial state.
- [ ] Default state.
- [ ] Hover state.
- [ ] Focus state.
- [ ] Active state.
- [ ] Disabled state.
- [ ] Loading state, if relevant.
- [ ] Error state, if relevant.
- [ ] Selected state, if relevant.
- [ ] Open state, if relevant.
- [ ] Empty state, if relevant.

## 6.3. State Transition Completeness

Document all meaningful transitions.

Example for a Button:

```text
Idle
 ├── Hover
 ├── Focus
 ├── Active
 ├── Disabled
 └── Loading
```

Example for a Select:

```text
Closed
 ├── Open
 │    ├── Option highlighted
 │    ├── Option selected
 │    ├── No results
 │    └── Disabled
 └── Closed
```

Verify that every transition is visually and behaviorally correct.

---

# 7. Interaction Quality Audit

## 7.1. Interaction Feedback

Evaluate:

- Hover feedback.
- Press feedback.
- Focus feedback.
- Selection feedback.
- Loading feedback.
- Success feedback.
- Error feedback.
- Disabled feedback.

Questions:

- Does every interaction produce understandable feedback?
- Is feedback immediate?
- Are interactive states visually distinct?
- Are there unnecessary transitions?
- Is feedback consistent across similar components?

## 7.2. Interaction Behavior

- [ ] Pointer interaction works.
- [ ] Keyboard interaction works.
- [ ] Touch interaction works.
- [ ] Focus behavior is predictable.
- [ ] Escape behavior is correct where applicable.
- [ ] Outside-click behavior is correct where applicable.
- [ ] Selection behavior is correct.
- [ ] Disabled interactions are prevented.
- [ ] Repeated interactions do not create inconsistent states.

## 7.3. Interaction Edge Cases

Test:

- Rapid repeated interactions.
- External state updates.
- Component unmounting.
- Parent state changes.
- Nested interactive elements.
- Long content.
- Empty content.
- Invalid input.
- Delayed asynchronous operations.

---

# 8. Reef.js Reactivity Audit

This section is specific to the Reef.js framework and must be evaluated against its actual state and lifecycle contracts.

## 8.1. State Ownership

- [ ] Controlled state is correctly supported.
- [ ] Uncontrolled state is correctly supported where appropriate.
- [ ] No duplicated source of truth exists.
- [ ] External state updates propagate.
- [ ] Internal state does not overwrite controlled state.
- [ ] State initialization is deterministic.

## 8.2. Reactivity

- [ ] Reactive values update the DOM correctly.
- [ ] Derived values remain synchronized.
- [ ] No stale values are rendered.
- [ ] No unnecessary reactive subscriptions exist.
- [ ] State dependencies are correctly tracked.
- [ ] Conditional rendering updates correctly.

## 8.3. Lifecycle

- [ ] Event listeners are cleaned up.
- [ ] Subscriptions are cleaned up.
- [ ] Observers are disconnected.
- [ ] Timers are cleared.
- [ ] Portals are removed correctly.
- [ ] Detached DOM references are not retained.
- [ ] Unmounting does not produce side effects.

## 8.4. Framework Integration

- [ ] Component APIs follow Reef.js conventions.
- [ ] Components do not introduce unnecessary framework abstractions.
- [ ] Reactive primitives are used appropriately.
- [ ] DOM updates are efficient.
- [ ] Component composition is compatible with Reef.js.
- [ ] Framework-native patterns are preferred over unnecessary React-style abstractions.

---

# 9. Accessibility Audit

## 9.1. Semantic HTML

- [ ] Correct HTML elements are used.
- [ ] Interactive elements use appropriate semantics.
- [ ] Heading hierarchy is respected.
- [ ] Form relationships are correct.
- [ ] Native browser behavior is preserved where appropriate.

## 9.2. Keyboard Accessibility

- [ ] Tab navigation works.
- [ ] Shift+Tab works.
- [ ] Enter works where expected.
- [ ] Space works where expected.
- [ ] Arrow keys work where expected.
- [ ] Escape works where expected.
- [ ] Focus is not lost unexpectedly.
- [ ] Focus is restored appropriately after overlays close.

## 9.3. Screen Reader Accessibility

- [ ] Accessible names exist.
- [ ] Descriptions are available.
- [ ] ARIA roles are appropriate.
- [ ] ARIA states are synchronized.
- [ ] Dynamic changes are announced where necessary.
- [ ] Hidden content is handled correctly.

## 9.4. Visual Accessibility

- [ ] Text meets its APCA floor, with its WCAG 2.2 ratio reported.
- [ ] Focus indicators are visible.
- [ ] State is not communicated through color alone.
- [ ] Text remains readable at supported sizes.
- [ ] Interactive targets are sufficiently large.
- [ ] Reduced-motion preferences are respected.

---

# 10. Visual State Matrix

Every component must have a visual state matrix.

|State|Light theme|Dark theme|Screenshot|Validated|
|---|---|---|---|---|
|Default|||||
|Hover|||||
|Focus|||||
|Active|||||
|Disabled|||||
|Loading|||||
|Selected|||||
|Error|||||
|Open|||||

Only applicable states should be included.

## 10.1. Visual Comparison

Compare Reef.js against relevant references.

Evaluate:

- Proportions.
- Density.
- Contrast.
- Typography.
- Border treatment.
- Surface treatment.
- Interaction states.
- Motion.
- Overall refinement.

The objective is to identify design decisions and quality gaps, not to reproduce screenshots pixel by pixel.

---

# 11. Performance Audit

## 11.1. Rendering

- [ ] No unnecessary DOM nodes.
- [ ] No unnecessary reactive computations.
- [ ] No excessive subscriptions.
- [ ] No unnecessary layout recalculations.
- [ ] No unnecessary DOM mutations.

## 11.2. Resource Management

- [ ] Listeners are properly removed.
- [ ] Observers are properly disconnected.
- [ ] Timers are properly cleared.
- [ ] Large resources are not retained unnecessarily.
- [ ] Animations do not create unnecessary overhead.

## 11.3. Scalability

Evaluate behavior with:

- Many component instances.
- Large data collections.
- Nested components.
- Frequent state changes.
- Rapid interaction sequences.

---

# 12. Testing Audit

## 12.1. Unit Tests

- [ ] Default rendering.
- [ ] Prop behavior.
- [ ] Variant rendering.
- [ ] Size rendering.
- [ ] State updates.
- [ ] Event callbacks.
- [ ] Controlled mode.
- [ ] Uncontrolled mode.
- [ ] Disabled behavior.
- [ ] Edge cases.

## 12.2. Interaction Tests

- [ ] Pointer interactions.
- [ ] Keyboard interactions.
- [ ] Focus management.
- [ ] State transitions.
- [ ] Form integration.
- [ ] External state updates.

## 12.3. Visual Regression Tests

- [ ] Default state.
- [ ] Interactive states.
- [ ] Dark theme.
- [ ] Light theme.
- [ ] Responsive layouts.
- [ ] Edge cases.

## 12.4. Accessibility Tests

- [ ] Automated accessibility checks.
- [ ] Keyboard navigation.
- [ ] Screen reader verification.
- [ ] Contrast verification.
- [ ] Accessible name verification.

---

# 13. Documentation Audit

- [ ] Component purpose is documented.
- [ ] Installation is documented.
- [ ] Import path is documented.
- [ ] Props are documented.
- [ ] Variants are documented.
- [ ] Sizes are documented.
- [ ] Examples are available.
- [ ] Composition is documented.
- [ ] State management is documented.
- [ ] Accessibility behavior is documented.
- [ ] Known limitations are documented.

Documentation should show realistic usage, not just isolated prop demonstrations.

---

# 14. Component Issue Register

Every identified issue must be recorded.

|ID|Category|Issue|Severity|Impact|Proposed correction|
|---|---|---|---|---|---|
|C-001|Visual|||||
|C-002|API|||||
|C-003|Interaction|||||
|C-004|Accessibility|||||
|C-005|Reactivity|||||

## 14.1. Severity Levels

|Priority|Meaning|Example|
|---|---|---|
|P0 — Critical|Broken functionality or serious accessibility issue|Controlled state does not update|
|P1 — High|Major quality or consistency issue|Incorrect interaction behavior|
|P2 — Medium|Noticeable design or API inconsistency|Incorrect spacing or variant|
|P3 — Low|Minor refinement|Small visual alignment issue|

## 14.2. Issue Description Template

```md
### [ISSUE-ID] — [Issue title]

Category:
[Visual / API / Interaction / Accessibility / Reactivity / Performance]

Severity:
[P0 / P1 / P2 / P3]

Current behavior:
[Describe what currently happens]

Expected behavior:
[Describe what should happen]

Evidence:
[Screenshot / Code / Test / Reference]

Root cause:
[Explain why the issue exists]

Proposed correction:
[Describe the required change]

Affected components:
[List related components]

Dependencies:
[List required token, API or framework changes]

Acceptance criteria:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
```

---

# 15. Component Scorecard

## 15.1. Scoring Dimensions

|Dimension|Weight|Score|
|---|---|---|
|Design philosophy alignment|10%||
|Visual quality|15%||
|Design token integration|10%||
|API quality|10%||
|Component completeness|10%||
|Interaction quality|10%||
|Reef.js integration|10%||
|Accessibility|10%||
|Performance|5%||
|Testing and documentation|10%||
|**Total**|**100%**||

Each dimension receives a score from 0 to 4.

Weighted score:

```text
Total score =
Σ (dimension score / 4 × dimension weight)
```

## 15.2. Quality Levels

|Score|Level|Meaning|
|---|---|---|
|0–39|L0|Fundamentally incomplete|
|40–59|L1|Functional but immature|
|60–74|L2|Acceptable|
|75–89|L3|High quality|
|90–100|L4|Production-grade refinement|

A high score cannot compensate for a critical P0 issue.

---

# 16. Remediation Plan

## 16.1. Corrections

|Priority|Issue|Required action|Estimated effort|Status|
|---|---|---|---|---|
|P0|||||
|P1|||||
|P2|||||
|P3|||||

## 16.2. Correction Order

Recommended remediation sequence:

1. Critical functional and accessibility issues.
2. Reef.js state and lifecycle issues.
3. Structural API inconsistencies.
4. Missing component capabilities.
5. Design token corrections.
6. Visual hierarchy and geometry.
7. Interaction refinement.
8. Motion and micro-interactions.
9. Documentation and examples.
10. Minor visual polish.

Fix shared design-token or API issues at their source rather than introducing component-specific workarounds.

---

# 17. Final Component Assessment

```md
# Component Audit Result

Component:
[ComponentName]

Overall score:
[XX / 100]

Quality level:
[L0 / L1 / L2 / L3 / L4]

Status:
[Approved / Approved with limitations / Requires correction / Rejected]

Critical issues:
[Number]

High priority issues:
[Number]

Medium priority issues:
[Number]

Low priority issues:
[Number]

### Main strengths

- [Strength 1]
- [Strength 2]

### Main weaknesses

- [Weakness 1]
- [Weakness 2]

### Required corrections

- [Correction 1]
- [Correction 2]

### Final recommendation

[Detailed assessment and next steps]
```

---

# 18. Final Acceptance Criteria

A component can be considered production-ready when:

- Its design intent is clearly defined.
- It respects the Reef.js visual language.
- Its visual hierarchy is correct.
- Its geometry and spacing are consistent.
- It uses semantic design tokens correctly.
- Its public API follows shared conventions.
- Its props are necessary and predictable.
- Its state ownership is explicit.
- Its interaction states are complete.
- Its behavior is predictable.
- Its Reef.js integration is correct.
- Its accessibility requirements are satisfied.
- Its performance is acceptable.
- Its tests cover important behavior.
- Its documentation is complete.
- It has no unresolved P0 or P1 issues.

---

# 19. Audit Philosophy

**Do not audit components as isolated pieces of code. Audit them as expressions of a unified design system.**

A component can be technically correct and still be visually inconsistent.

A component can look beautiful and still expose a poor API.

A component can have a clean API and still violate Reef.js reactivity contracts.

All dimensions must be evaluated together.

The objective is not to maximize the number of features or props.

The objective is to produce components that are:

- Visually restrained.
- Functionally complete.
- Behaviorally predictable.
- Technically reliable.
- Naturally composable.
- Consistent with the Reef.js design philosophy.

**A production-grade component should feel inevitable: every visual detail, interaction, state and API decision should have a clear reason to exist.**