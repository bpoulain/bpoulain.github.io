# Visual Hierarchy

> **Purpose:** Define the rules, mechanisms and evaluation criteria governing visual hierarchy throughout the UI library.
> 
> **Scope:** Information priority, visual emphasis, typography, color, contrast, positioning, spacing, grouping, scale, density, component hierarchy and visual scanning.
> 
> **Related principles:** DP-01 Functional Minimalism, DP-02 Neutral-First Color, DP-04 Typographic Precision, DP-06 Functional Density, DP-07 Clear Information Hierarchy, DP-08 Progressive Disclosure.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.

---

# 1. Visual Hierarchy Philosophy

## 1.1. Definition

Visual hierarchy is the organization of interface elements according to their relative importance.

It determines what users notice first, what they notice next and what they can safely ignore until needed.

A coherent visual hierarchy makes an interface understandable before the user reads all its content.

The hierarchy must emerge from the coordinated use of:

- Position.
- Size.
- Typography.
- Weight.
- Color.
- Contrast.
- Spacing.
- Grouping.
- Surface treatment.
- Interaction state.

These mechanisms must work together rather than independently.

### Core principle

**Visual emphasis must reflect functional importance.**

The most visually prominent element should generally be the element with the greatest relevance to the user's current task.

## 1.2. Expected visual characteristics

The library must favor:

- Clear primary and secondary information.
- Restrained visual emphasis.
- Predictable scanning patterns.
- Consistent component hierarchy.
- Meaningful spatial grouping.
- Strong information structure.
- Minimal decorative competition.
- Clear distinction between content and actions.

Avoid:

- Multiple competing focal points.
- Excessive boldness.
- Unnecessary accent colors.
- Equal visual weight for unrelated elements.
- Decorative borders replacing hierarchy.
- Excessive surface differentiation.
- Random emphasis across components.

## 1.3. Hierarchy versus decoration

A visual distinction is justified when it helps users understand structure, importance or interaction.

A visual distinction is not justified simply because it makes an element look more interesting.

For every emphasized element, ask:

1. What information or action does it represent?
2. Why is it more important than neighboring elements?
3. Does its visual treatment communicate that importance?
4. Would reducing its emphasis improve the overall hierarchy?

---

# 2. Information Priority Model

## 2.1. Definition

Every interface must establish a logical priority between its information elements.

The hierarchy must originate from the information architecture and user task, not from arbitrary visual styling.

## 2.2. Recommended priority levels

|Level|Name|Purpose|Typical examples|
|---|---|---|---|
|I0|Critical|Requires immediate attention|Critical error, destructive confirmation|
|I1|Primary|Main task or content|Page title, primary action, main data|
|I2|Secondary|Supporting information|Descriptions, secondary actions|
|I3|Tertiary|Contextual information|Metadata, timestamps, helper text|
|I4|Decorative|No essential informational role|Purely decorative elements|

These levels represent information priority, not a mandatory visual token scale.

I0 should be used selectively. Critical importance must never become a default styling convention.

## 2.3. Rules

- Primary information must be immediately identifiable.
- Secondary information must support primary content.
- Tertiary information must remain accessible without competing for attention.
- Critical information must be visually distinguishable.
- Decorative elements must never compete with functional content.
- Information priority must remain consistent across related components.
- A component must not assign primary emphasis to every element.

## 2.4. Priority mapping

Every significant component should be auditable using the following mapping:

|Element|Functional priority|Visual priority|Expected result|
|---|---|---|---|
|Main title|Primary|High|Clearly identifiable|
|Main content|Primary|High|Dominant information|
|Supporting description|Secondary|Medium|Visually subordinate|
|Metadata|Tertiary|Low|Readable but discreet|
|Decorative separator|Decorative|Minimal|Structurally useful without emphasis|

The visual priority should reflect the functional priority.

## 2.5. Audit checklist

- [ ] Information priorities are identifiable.
- [ ] Primary content is visually dominant.
- [ ] Secondary information supports primary content.
- [ ] Metadata remains subordinate.
- [ ] Critical information is distinguishable.
- [ ] Decorative elements do not compete with content.
- [ ] Every component has a coherent priority structure.

---

# 3. Visual Emphasis Model

## 3.1. Definition

Visual emphasis is the degree of attention an element attracts.

The library must define a limited and predictable set of emphasis levels.

## 3.2. Recommended emphasis levels

|Level|Name|Characteristics|Typical usage|
|---|---|---|---|
|E0|Minimal|Barely differentiated|Decorative details|
|E1|Subtle|Muted, low contrast|Metadata, secondary information|
|E2|Standard|Normal foreground and structure|Standard content|
|E3|Emphasized|Stronger typography or contrast|Important content|
|E4|Prominent|Strong visual emphasis|Primary actions and critical content|

These levels describe visual prominence rather than fixed color or typography values.

## 3.3. Rules

- Use the lowest emphasis level that preserves usability.
- Reserve prominent treatments for genuinely important elements.
- Avoid applying E4 to multiple unrelated elements in the same visual region.
- Use emphasis consistently for equivalent functional roles.
- Do not use color as the only emphasis mechanism.
- Avoid combining every emphasis mechanism simultaneously.
- Ensure the hierarchy remains understandable in monochrome.

## 3.4. Emphasis mechanisms

The following mechanisms can increase visual emphasis:

|Mechanism|Typical effect|
|---|---|
|Larger size|Increases perceived importance|
|Stronger weight|Increases textual emphasis|
|Higher contrast|Improves visibility|
|Accent color|Attracts attention|
|Spatial isolation|Separates an element|
|Surface differentiation|Establishes a visual region|
|Position|Establishes reading priority|
|Motion|Attracts attention through change|

Not every mechanism should be used simultaneously.

## 3.5. Audit checklist

- [ ] Emphasis levels are consistent.
- [ ] Primary elements receive appropriate emphasis.
- [ ] Secondary elements remain subordinate.
- [ ] Accent colors are used selectively.
- [ ] No unnecessary combination of emphasis mechanisms exists.
- [ ] Multiple competing focal points are avoided.

---

# 4. Primary, Secondary and Tertiary Hierarchy

## 4.1. Definition

Every functional interface should establish a clear relationship between primary, secondary and tertiary information.

This relationship must be visible through typography, color, spacing and positioning.

## 4.2. Primary elements

Primary elements represent the main task, information or action.

Examples:

- Page titles.
- Main content.
- Primary actions.
- Selected navigation destinations.
- Important data values.
- Active task information.

Expected treatment:

- Clear positioning.
- Stronger typographic hierarchy.
- Appropriate contrast.
- Sufficient surrounding space.
- Minimal competition from neighboring elements.

## 4.3. Secondary elements

Secondary elements support primary information.

Examples:

- Descriptions.
- Supporting actions.
- Secondary navigation.
- Additional controls.
- Contextual information.

Expected treatment:

- Moderate typography.
- Neutral foreground colors.
- Clear grouping with primary content.
- Less emphasis than primary elements.

## 4.4. Tertiary elements

Tertiary elements provide context without dominating the interface.

Examples:

- Timestamps.
- Author information.
- Supplementary labels.
- Item counts.
- Helper descriptions.
- Non-essential metadata.

Expected treatment:

- Smaller typography where appropriate.
- Muted foreground.
- Compact presentation.
- Consistent positioning.

## 4.5. Rules

- Do not visually equate primary and tertiary content.
- Do not hide important information merely to make the interface look minimal.
- Avoid excessive reduction of secondary text contrast.
- Ensure metadata remains readable.
- Keep hierarchy consistent across component categories.

## 4.6. Audit checklist

- [ ] Primary information is immediately recognizable.
- [ ] Secondary information has supporting prominence.
- [ ] Tertiary information is appropriately subdued.
- [ ] Hierarchy is consistent across components.
- [ ] Important content is never sacrificed for visual minimalism.

---

# 5. Typography as a Hierarchy Mechanism

## 5.1. Definition

Typography is one of the primary mechanisms for expressing information hierarchy.

It must provide distinction between information levels without requiring excessive color or surface variations.

## 5.2. Hierarchy dimensions

Use typography through a controlled combination of:

- Font size.
- Font weight.
- Line height.
- Letter spacing.
- Foreground color.
- Text alignment.

## 5.3. Rules

- Primary headings must be distinguishable from body content.
- Section headings must establish predictable structural levels.
- Labels must remain visually distinct from values when necessary.
- Metadata must not compete with primary information.
- Strong weights must be used selectively.
- Typography must remain consistent across equivalent roles.
- Avoid excessive size differences inside compact functional components.

## 5.4. Example hierarchy

```text
Workspace settings                 I1
Manage your workspace preferences I2

General                            I1
Workspace name                     I2
My workspace                       I2
Last updated 2 hours ago           I3

[Save changes]                     I1
[Cancel]                           I2
```

The visual hierarchy must be recognizable without relying on decorative cards or colored backgrounds.

## 5.5. Audit checklist

- [ ] Typography expresses information priority.
- [ ] Heading levels are distinguishable.
- [ ] Labels and values have appropriate relationships.
- [ ] Metadata is subordinate.
- [ ] Strong font weights are restrained.
- [ ] Hierarchy works without excessive color.

---

# 6. Color and Contrast as Hierarchy Mechanisms

## 6.1. Definition

Color and contrast reinforce the hierarchy established by information structure and typography.

They must not create an independent hierarchy that contradicts the content.

## 6.2. Rules

- Use neutral foregrounds for standard content.
- Use muted foregrounds for secondary information.
- Reserve accent colors for meaningful emphasis.
- Use semantic colors only when they communicate semantic meaning.
- Keep structural borders subtle.
- Ensure important information has sufficient contrast.
- Avoid emphasizing secondary elements more strongly than primary content.

## 6.3. Contrast hierarchy

The library should establish predictable relationships between:

- Primary foreground and background.
- Secondary foreground and background.
- Muted foreground and background.
- Selected content and surrounding surfaces.
- Interactive elements and their environment.

## 6.4. Audit checklist

- [ ] Color reinforces information hierarchy.
- [ ] Accent colors remain selective.
- [ ] Semantic colors retain their meaning.
- [ ] Secondary content remains readable.
- [ ] Borders do not create unnecessary emphasis.
- [ ] Contrast is consistent across themes.

---

# 7. Spatial Hierarchy and Grouping

## 7.1. Definition

Spacing and positioning establish relationships between interface elements.

Elements that belong together should appear visually related.

Elements that serve different purposes should have sufficient separation.

**Proximity is a primary mechanism for communicating relationships.**

## 7.2. Grouping rules

- Related elements should be visually close.
- Unrelated groups should have greater separation.
- Labels should be closer to their associated controls than to neighboring groups.
- Supporting descriptions should remain visually connected to their parent content.
- Actions should be grouped according to their functional relationship.
- Repeated elements should follow consistent spacing.
- Nested groups must remain visually understandable.

## 7.3. Spatial hierarchy model

```text
Page
 |
 +-- Page Header
 |    |
 |    +-- Title
 |    +-- Description
 |    +-- Primary Actions
 |
 +-- Main Content
 |    |
 |    +-- Section A
 |    |    |
 |    |    +-- Section Title
 |    |    +-- Content
 |    |
 |    +-- Section B
 |         |
 |         +-- Section Title
 |         +-- Content
 |
 +-- Supporting Information
```

The spatial organization must communicate this structure without requiring excessive borders or cards.

## 7.4. Rules

- Prefer spacing to unnecessary separators.
- Use consistent spacing between equivalent groups.
- Avoid excessive internal padding.
- Avoid insufficient separation between unrelated elements.
- Keep labels and values visually connected.
- Maintain clear parent-child relationships.
- Use nested surfaces only when they improve comprehension.

## 7.5. Audit checklist

- [ ] Related elements are grouped.
- [ ] Unrelated groups are separated.
- [ ] Labels remain connected to controls.
- [ ] Sections are clearly differentiated.
- [ ] Spacing communicates structure.
- [ ] Unnecessary borders and containers are avoided.
- [ ] Nested structures remain understandable.

---

# 8. Position and Reading Order

## 8.1. Definition

Position establishes the visual order in which users encounter information.

The layout should support predictable scanning patterns.

## 8.2. Rules

- Place primary content in positions consistent with the product's information architecture.
- Keep navigation visually distinct from working content.
- Maintain consistent page-header positioning.
- Place contextual actions near the content they affect.
- Keep related information in predictable locations.
- Avoid positioning secondary controls where they compete with primary content.
- Respect reading direction and localization.

## 8.3. Scanning patterns

For left-to-right interfaces:

- Support natural left-to-right and top-to-bottom scanning.
- Use alignment to reinforce relationships.
- Keep repeated information in consistent positions.
- Avoid unnecessary visual interruptions.
- Establish predictable locations for actions and status indicators.

Do not force a universal F-pattern or Z-pattern on every component.

Scanning behavior depends on the layout, content and task.

## 8.4. Audit checklist

- [ ] Reading order is predictable.
- [ ] Main content is appropriately positioned.
- [ ] Actions are located near relevant content.
- [ ] Navigation is distinguishable.
- [ ] Repeated structures preserve alignment.
- [ ] Reading direction is respected.

---

# 9. Visual Hierarchy and Functional Density

## 9.1. Definition

Visual hierarchy must remain effective in dense functional interfaces.

Density must not destroy the distinction between primary, secondary and tertiary information.

A dense interface should be able to display substantial information while maintaining visual calm.

## 9.2. Rules

- Use typography to establish hierarchy before adding containers.
- Use subtle separators only when they improve scanning.
- Keep repeated rows visually consistent.
- Use compact spacing without collapsing unrelated groups.
- Avoid unnecessary background variations.
- Keep primary actions discoverable.
- Maintain readable secondary information.
- Use alignment to improve comparison.

## 9.3. Density hierarchy

|Context|Primary|Secondary|Tertiary|
|---|---|---|---|
|Data table|Main values|Column labels|Metadata|
|Navigation|Active destination|Other destinations|Counts and shortcuts|
|Task list|Task title|Description|Assignee and timestamp|
|Form|Field label|Input value|Helper text|
|Dashboard|Key metric|Supporting metric|Contextual details|

## 9.4. Audit checklist

- [ ] Dense content remains scannable.
- [ ] Primary information remains visible.
- [ ] Repeated elements are consistent.
- [ ] Metadata does not overwhelm content.
- [ ] Alignment supports comparison.
- [ ] Compact spacing does not destroy grouping.
- [ ] The interface remains visually calm.

---

# 10. Hierarchy of Actions

## 10.1. Definition

Actions must be visually differentiated according to their functional importance and frequency.

The library must prevent every action from competing for the same level of attention.

## 10.2. Action priority model

|Priority|Action type|Expected treatment|
|---|---|---|
|A1|Primary|Strongest emphasis|
|A2|Secondary|Neutral but clearly interactive|
|A3|Tertiary|Minimal visual treatment|
|A4|Destructive|Semantic destructive treatment|
|A5|Contextual|Available when relevant|

## 10.3. Rules

- A component should generally have one primary action per decision context.
- Secondary actions must remain visually subordinate.
- Destructive actions must be distinguishable without automatically dominating every screen.
- Contextual actions should not permanently clutter the interface.
- Icon-only actions must have clear accessible names.
- Action groups must have consistent ordering.
- Do not use accent colors indiscriminately for every interactive element.

## 10.4. Example

```text
Dialog: Delete workspace

This action cannot be undone.

[Cancel]                         [Delete workspace]
 Secondary                           Destructive
```

The destructive action is clearly identifiable, but the entire dialog should not become visually aggressive.

## 10.5. Audit checklist

- [ ] Primary actions are identifiable.
- [ ] Secondary actions are subordinate.
- [ ] Destructive actions use semantic treatment.
- [ ] Contextual actions remain discoverable.
- [ ] Icon-only actions are understandable.
- [ ] Action groups follow consistent conventions.

---

# 11. Visual Hierarchy of Component States

## 11.1. Definition

Component states must be visually distinguishable without introducing contradictory hierarchy.

The user must understand the difference between default, hovered, focused, selected, disabled and invalid states.

## 11.2. State hierarchy

|State|Visual requirement|
|---|---|
|Default|Neutral baseline|
|Hover|Subtle interaction indication|
|Active|Immediate feedback|
|Focus-visible|Clearly identifiable keyboard focus|
|Selected|Persistent selection indication|
|Disabled|Reduced interaction prominence|
|Invalid|Clear semantic error indication|
|Loading|Recognizable temporary state|

## 11.3. Rules

- Selected states must remain recognizable after hover ends.
- Focus must not be confused with selection.
- Hover must not create stronger emphasis than a meaningful selected state without justification.
- Disabled elements must not compete with available actions.
- Invalid states must attract appropriate attention.
- Loading indicators must not destabilize the component hierarchy.
- State changes must preserve content readability.

## 11.4. Audit checklist

- [ ] All applicable states are distinguishable.
- [ ] Focus is distinct from hover.
- [ ] Selected states are persistent.
- [ ] Disabled states remain understandable.
- [ ] Invalid states receive appropriate emphasis.
- [ ] Loading does not disrupt hierarchy.

---

# 12. Hierarchy and Progressive Disclosure

## 12.1. Definition

Visual hierarchy must support progressive disclosure by presenting the most relevant information first and reducing the prominence of secondary details until they are needed.

The objective is to reduce cognitive load without hiding essential functionality.

## 12.2. Rules

- Display primary information by default.
- Keep secondary details accessible.
- Reveal contextual actions when appropriate.
- Avoid displaying every available control simultaneously.
- Use expansion mechanisms for genuinely secondary content.
- Preserve discoverability of important actions.
- Do not hide essential information behind unnecessary interactions.

## 12.3. Examples

Appropriate applications:

- Collapsible navigation groups.
- Expandable table rows.
- Contextual action menus.
- Secondary configuration panels.
- Additional metadata.
- Advanced settings.

## 12.4. Audit checklist

- [ ] Primary information is visible by default.
- [ ] Secondary information remains accessible.
- [ ] Contextual actions do not clutter the interface.
- [ ] Disclosure mechanisms are predictable.
- [ ] Essential functionality is not unnecessarily hidden.

---

# 13. Visual Hierarchy Across Component Composition

## 13.1. Definition

Individual components must preserve their own internal hierarchy while contributing to the hierarchy of the parent composition.

A component must not become visually dominant simply because it has strong styling in isolation.

## 13.2. Rules

- Component hierarchy must adapt to its context.
- Reusable components must preserve consistent semantic roles.
- Nested components must not compete for primary emphasis.
- Parent-level structure must remain visually identifiable.
- Repeated components must have consistent visual weight.
- Component variants must not create unnecessary hierarchy differences.

## 13.3. Example: Form composition

```text
Account settings                    Page title

Personal information                Section title

Full name                           Field label
[Jane Doe]                          Input

Email address                       Field label
[jane@example.com]                  Input

Used for account notifications     Helper text

[Cancel]                            Secondary action
[Save changes]                      Primary action
```

The hierarchy must be consistent across the entire composition, not merely within each input.

## 13.4. Audit checklist

- [ ] Components preserve internal hierarchy.
- [ ] Parent and child hierarchy is coherent.
- [ ] Nested components do not compete.
- [ ] Repeated components have consistent prominence.
- [ ] Composition remains understandable without decorative containers.

---

# 14. Hierarchy Across Light and Dark Themes

## 14.1. Definition

Visual hierarchy must remain equivalent across light and dark themes.

The exact colors and tonal values may differ, but the relative importance of information must not change.

## 14.2. Rules

- Primary content must remain dominant.
- Secondary content must remain subordinate.
- Selected states must remain recognizable.
- Surface differences must preserve grouping.
- Borders must not become excessively prominent.
- Accent colors must remain controlled.
- Contrast must be validated independently.
- Theme changes must not reverse the hierarchy.

## 14.3. Audit checklist

- [ ] Primary hierarchy is preserved.
- [ ] Secondary information remains subordinate.
- [ ] Surface grouping is equivalent.
- [ ] Interactive states remain identifiable.
- [ ] Accent usage remains balanced.
- [ ] Both themes are visually coherent.

---

# 15. Visual Hierarchy Anti-Patterns

|Anti-pattern|Problem|Expected correction|
|---|---|---|
|Everything is prominent|No clear focal point|Define explicit priorities|
|Too many bold elements|Weak hierarchy|Reduce typographic emphasis|
|Too many accent colors|Visual competition|Restrict accent usage|
|Excessive card usage|Fragmented structure|Use spacing and grouping|
|Borders everywhere|Structural noise|Prefer subtle separation|
|Metadata competes with content|Incorrect emphasis|Reduce its visual weight|
|Multiple primary actions|Decision ambiguity|Establish action priority|
|Inconsistent spacing|Unclear grouping|Standardize spatial relationships|
|Arbitrary heading sizes|Unpredictable structure|Use semantic typography roles|
|Color-only hierarchy|Accessibility and perception issues|Combine multiple mechanisms|
|Excessive whitespace|Reduced functional density|Rebalance spacing|
|Excessive density|Poor scanning|Restore hierarchy and grouping|
|Decorative icons everywhere|Visual noise|Use icons only when meaningful|
|Hidden essential actions|Poor discoverability|Apply progressive disclosure selectively|
|Inconsistent selected states|Fragmented interaction language|Standardize state treatments|

---

# 16. Visual Hierarchy Audit Methodology

Every component must be audited through the following dimensions.

## 16.1. Information architecture

- Are information priorities identifiable?
- Is the primary purpose immediately understandable?
- Are secondary details appropriately positioned?
- Is the information structure logical?

## 16.2. Visual emphasis

- Is there a clear focal point?
- Are emphasis levels consistent?
- Are multiple elements competing?
- Is decorative emphasis unnecessary?

## 16.3. Typographic hierarchy

- Does typography express importance?
- Are primary and secondary text distinguishable?
- Are metadata and helper texts subordinate?
- Are font weights used consistently?

## 16.4. Color and contrast

- Does color reinforce information hierarchy?
- Is accent usage restrained?
- Are important elements sufficiently contrasted?
- Do semantic colors retain their meanings?

## 16.5. Spatial organization

- Are related elements grouped?
- Are unrelated elements separated?
- Does spacing communicate structure?
- Are alignments consistent?

## 16.6. Interaction hierarchy

- Are primary actions recognizable?
- Are secondary actions subordinate?
- Are selected and focused states distinguishable?
- Are contextual actions appropriately disclosed?

## 16.7. Composition

- Does the component work in isolation?
- Does it work inside larger compositions?
- Does it preserve hierarchy when nested?
- Does it remain coherent across themes?

---

# 17. Visual Hierarchy Scoring

Each component must receive a score from 0 to 4 across seven dimensions.

|Dimension|Weight|
|---|---|
|Information priority|20%|
|Visual emphasis|20%|
|Typographic hierarchy|15%|
|Color and contrast|10%|
|Spatial organization|15%|
|Interaction hierarchy|10%|
|Composition consistency|10%|

### Scoring scale

|Score|Classification|Description|
|---|---|---|
|0|Missing|No identifiable hierarchy|
|1|Poor|Competing emphasis and unclear structure|
|2|Partial|Basic hierarchy with significant inconsistencies|
|3|Good|Clear and consistent hierarchy|
|4|Excellent|Highly refined, intuitive and contextually coherent|

Weighted score:

`(Priority × 0.20) + (Emphasis × 0.20) + (Typography × 0.15) + (Color × 0.10) + (Spatial × 0.15) + (Interaction × 0.10) + (Composition × 0.10)`

### Mandatory constraints

A component cannot be considered compliant if:

- Its primary purpose cannot be identified.
- Multiple elements compete without functional justification.
- Essential information is visually obscured.
- Interactive states create ambiguity.
- Its hierarchy breaks when used inside a parent composition.

Accessibility failures must be recorded independently.

---

# 18. Remediation Guidelines

When a component fails the visual hierarchy audit, apply corrections in the following order:

1. Identify the primary purpose of the component.
2. Classify information according to functional priority.
3. Identify competing visual focal points.
4. Correct the primary and secondary typographic hierarchy.
5. Adjust foreground hierarchy and contrast.
6. Correct spatial grouping.
7. Reduce unnecessary borders and surface variations.
8. Rebalance primary and secondary actions.
9. Correct interaction-state emphasis.
10. Validate nested component compositions.
11. Validate light and dark themes.
12. Reinspect the component in a realistic interface.

Do not begin by changing colors, font sizes or spacing independently.

First identify the hierarchy problem.

Then choose the smallest combination of visual changes necessary to solve it.

---

# 19. Final Acceptance Criteria

The visual hierarchy system is considered successfully implemented when:

- Every component has a clear primary purpose.
- Information priorities are identifiable.
- Visual emphasis reflects functional importance.
- Typography reinforces information structure.
- Color and contrast reinforce rather than replace hierarchy.
- Spatial grouping communicates relationships.
- Primary and secondary actions are distinguishable.
- Interactive states remain understandable.
- Dense interfaces remain scannable.
- Progressive disclosure reduces unnecessary visual complexity.
- Nested compositions preserve hierarchy.
- Light and dark themes maintain equivalent information priority.
- Decorative elements never compete with essential content.

---

# 20. Final Principle

Visual hierarchy is not about making some elements bigger, darker or bolder.

It is about establishing a predictable relationship between information importance and visual prominence.

A refined interface allows users to understand what matters without requiring them to inspect every element.

**The objective is to make the right information visible at the right level of emphasis, with the least possible visual noise.**