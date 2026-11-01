# Typography

> **Purpose:** Define the typographic system, visual hierarchy, usage rules and evaluation criteria governing typography throughout the UI library.
> 
> **Scope:** Font families, font sizes, font weights, line heights, letter spacing, semantic typography roles, text hierarchy, density, truncation, alignment and responsive behavior.
> 
> **Related principles:** DP-01 Functional Minimalism, DP-04 Typographic Precision, DP-06 Functional Density, DP-07 Clear Information Hierarchy, DP-15 Semantic Consistency.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.

---

# 1. Typography Philosophy

## 1.1. Definition

Typography is a structural component of the interface.

Its purpose is to organize information, establish hierarchy, communicate importance and improve readability.

The typographic system must remain restrained, consistent and functional.

It must provide sufficient variation to distinguish different information roles without introducing unnecessary visual complexity.

### Core principle

**Typography must organize information before decorating it.**

Every typographic decision must have a functional justification:

- Establish information hierarchy.
- Distinguish content roles.
- Improve readability.
- Communicate importance.
- Support information density.
- Clarify component structure.
- Improve content scanning.

## 1.2. Expected visual characteristics

The library must favor:

- A controlled typographic scale.
- Restrained font weights.
- Clear text hierarchy.
- Compact but readable line heights.
- Consistent text alignment.
- Subtle secondary text.
- Predictable text behavior.
- Limited typographic variation.

Avoid:

- Excessive font sizes.
- Unnecessary bold text.
- Arbitrary line heights.
- Decorative letter spacing.
- Inconsistent heading styles.
- Excessive uppercase labels.
- Arbitrary component-specific typography.

---

# 2. Font Family Philosophy

## 2.1. Definition

The font family establishes the typographic identity of the library.

The system should use a limited number of font families.

Each family must have a clearly defined purpose.

## 2.2. Recommended font categories

|Category|Purpose|
|---|---|
|Sans-serif|Primary interface typography|
|Monospace|Code, technical values and identifiers|
|Serif|Optional editorial or exceptional contexts|

A functional UI library should generally use one primary sans-serif family and one monospace family.

An additional font family should only be introduced when it provides a clear product-level benefit.

## 2.3. Font selection criteria

The primary font must provide:

- Excellent screen readability.
- Clear distinction between similar characters.
- Consistent rendering at small sizes.
- A complete range of useful weights.
- Good numerical readability.
- Balanced proportions.
- Reliable browser rendering.

## 2.4. Rules

- Use a consistent primary font throughout the library.
- Avoid introducing component-specific font families.
- Use monospace exclusively for contexts that benefit from it.
- Prefer system font fallbacks.
- Avoid unnecessary font loading.
- Ensure fallback fonts preserve reasonable geometry.
- Test typography across supported browsers and operating systems.

## 2.5. Example architecture

```css
--font-sans: Inter, ui-sans-serif, system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, monospace;
```

These are illustrative choices, not mandatory font selections.

## 2.6. Audit checklist

- [ ] A primary font family is defined.
- [ ] A monospace family is defined when required.
- [ ] Font families have documented purposes.
- [ ] Components do not introduce arbitrary font families.
- [ ] Fallback fonts are defined.
- [ ] Small text remains readable.
- [ ] Numerical characters are distinguishable.
- [ ] Font loading does not create significant layout shifts.

---

# 3. Typography Token Architecture

The typography system must separate physical typographic properties from semantic usage.

## 3.1. Primitive typography tokens

Primitive tokens define raw typographic values.

Examples:

```css
/* Font families */
--font-sans: ...;
--font-mono: ...;

/* Font sizes */
--font-size-xs: 0.75rem;
--font-size-sm: 0.8125rem;
--font-size-base: 0.875rem;
--font-size-md: 0.9375rem;
--font-size-lg: 1rem;
--font-size-xl: 1.125rem;
--font-size-2xl: 1.25rem;
--font-size-3xl: 1.5rem;
--font-size-4xl: 1.875rem;
--font-size-5xl: 2.25rem;

/* Font weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Line heights */
--line-height-tight: 1.2;
--line-height-snug: 1.35;
--line-height-normal: 1.5;
--line-height-relaxed: 1.65;
```

These values are illustrative.

The actual scale must be calibrated against the primary font and the intended interface density.

## 3.2. Semantic typography tokens

Semantic tokens describe the intended typographic role.

Examples:

```css
--typography-page-title-size: var(--font-size-2xl);
--typography-page-title-weight: var(--font-weight-semibold);
--typography-page-title-line-height: var(--line-height-tight);

--typography-body-size: var(--font-size-base);
--typography-body-weight: var(--font-weight-normal);
--typography-body-line-height: var(--line-height-normal);

--typography-label-size: var(--font-size-sm);
--typography-label-weight: var(--font-weight-medium);
--typography-label-line-height: var(--line-height-snug);

--typography-caption-size: var(--font-size-xs);
--typography-caption-weight: var(--font-weight-normal);
--typography-caption-line-height: var(--line-height-normal);
```

Rules:

- Semantic roles must express purpose.
- Semantic roles must not be tied to a specific component implementation.
- Multiple roles may intentionally share identical primitive values.
- Components should use semantic typography roles whenever possible.
- Changes to the typographic scale should not require arbitrary component-level corrections.

## 3.3. Component typography tokens

Component-specific typography tokens may exist when a component has a genuine visual requirement.

Examples:

```css
--button-font-size: var(--typography-label-size);
--button-font-weight: var(--typography-label-weight);

--input-font-size: var(--typography-body-size);
--input-font-weight: var(--typography-body-weight);

--badge-font-size: var(--typography-caption-size);
--badge-font-weight: var(--font-weight-medium);
```

Avoid creating component tokens that merely duplicate existing semantic roles.

## 3.4. Dependency hierarchy

```text
Primitive Typography Tokens
          |
          v
Semantic Typography Tokens
          |
          v
Component Typography Tokens
          |
          v
Rendered UI Components
```

## 3.5. Architecture audit

- [ ] Primitive typography values are centralized.
- [ ] Semantic roles are documented.
- [ ] Components use semantic roles by default.
- [ ] Component-specific tokens are justified.
- [ ] No unnecessary token duplication exists.
- [ ] Typography is not hardcoded arbitrarily in components.
- [ ] Typography remains consistent across themes.

---

# 4. Typographic Scale

## 4.1. Definition

The typographic scale defines the available font sizes and their relationships.

A controlled scale prevents arbitrary typography decisions across components.

The scale must support both compact functional interfaces and larger content hierarchies.

## 4.2. Recommended scale

|Token|Example size|Typical usage|
|---|---|---|
|2XS|10px|Exceptional micro-labels|
|XS|12px|Captions and compact metadata|
|SM|13px|Labels and secondary UI text|
|Base|14px|Standard interface text|
|MD|15px|Supporting content|
|LG|16px|Standard body content|
|XL|18px|Subheadings|
|2XL|20px|Section headings|
|3XL|24px|Page headings|
|4XL|30px|Large headings|
|5XL|36px|Display headings|

These values are a starting point, not mandatory assignments.

The scale should be evaluated with the chosen font family.

## 4.3. Rules

- Prefer the smallest scale that supports the required hierarchy.
- Use 14px as a reasonable reference for standard dense UI text.
- Avoid introducing arbitrary intermediate sizes.
- Do not use very small text for essential information.
- Use larger sizes primarily for meaningful content hierarchy.
- Keep component typography predictable.
- Avoid size variation between equivalent controls.

## 4.4. Density considerations

Functional interfaces often require more compact typography than editorial websites.

However, compactness must not compromise readability.

The system should distinguish:

- Compact interface typography.
- Standard interface typography.
- Comfortable reading typography.
- Display typography.

These should be intentional density modes or semantic contexts, not arbitrary font-size overrides.

## 4.5. Audit checklist

- [ ] A controlled font-size scale exists.
- [ ] Each size has a documented purpose.
- [ ] Standard UI text is appropriately sized.
- [ ] Compact typography remains readable.
- [ ] Equivalent components use equivalent sizes.
- [ ] No unnecessary intermediate values exist.
- [ ] The scale works with the selected font family.

---

# 5. Font Weight Philosophy

## 5.1. Definition

Font weight establishes emphasis and hierarchy.

It must be used selectively.

The library should avoid relying on bold text as its primary hierarchy mechanism.

## 5.2. Recommended weight scale

|Weight|Value|Purpose|
|---|---|---|
|Normal|400|Standard content|
|Medium|500|Labels and moderate emphasis|
|Semibold|600|Headings and important content|
|Bold|700|Exceptional emphasis|

Not every family needs to expose every weight.

## 5.3. Rules

- Use normal for standard content.
- Use medium for interface labels where appropriate.
- Use semibold for meaningful hierarchy.
- Reserve bold for exceptional cases.
- Avoid unnecessary weight changes within a single component.
- Avoid using bold to compensate for insufficient color contrast.
- Maintain consistent weights for equivalent roles.

## 5.4. Common anti-patterns

- Every label uses semibold.
- All buttons use bold.
- Metadata is unnecessarily emphasized.
- Multiple weights compete in the same content group.
- Headings are bold without a hierarchy justification.

## 5.5. Audit checklist

- [ ] Font weights follow a controlled scale.
- [ ] Every weight has a documented purpose.
- [ ] Labels use consistent weights.
- [ ] Headings have coherent emphasis.
- [ ] Metadata remains subordinate.
- [ ] Bold is used selectively.
- [ ] No unnecessary weight variation exists.

---

# 6. Line Height Philosophy

## 6.1. Definition

Line height determines the vertical rhythm of textual content.

It influences readability, information density and component proportions.

The library must use different line-height strategies depending on the content role.

## 6.2. Recommended line-height roles

|Role|Example ratio|Purpose|
|---|---|---|
|Tight|1.2|Large headings|
|Snug|1.35|Labels and compact headings|
|Normal|1.5|Standard body text|
|Relaxed|1.65|Long-form reading|

These are reference values.

## 6.3. Rules

- Use tighter line heights for large headings.
- Use comfortable line heights for paragraphs.
- Avoid excessive vertical space in compact controls.
- Maintain consistent text alignment inside controls.
- Ensure multiline labels remain readable.
- Avoid clipping descenders and ascenders.
- Validate line height with actual font rendering.

## 6.4. Component-specific considerations

|Component|Expected behavior|
|---|---|
|Button|Compact single-line alignment|
|Input|Vertically centered text|
|Textarea|Comfortable multiline rhythm|
|Select|Consistent with input typography|
|Badge|Compact line height|
|Dialog title|Clear but restrained|
|Table cell|Efficient and readable|
|Tooltip|Compact but readable|
|Menu item|Balanced text and icon alignment|

## 6.5. Audit checklist

- [ ] Line-height tokens are defined.
- [ ] Headings use appropriate line heights.
- [ ] Body text remains readable.
- [ ] Compact controls do not clip text.
- [ ] Multiline content remains comfortable.
- [ ] Equivalent controls share line-height conventions.
- [ ] Browser rendering has been validated.

---

# 7. Letter Spacing Philosophy

## 7.1. Definition

Letter spacing controls the horizontal rhythm of text.

It should remain subtle and purposeful.

Most interface text should use normal letter spacing.

## 7.2. Recommended roles

|Role|Treatment|
|---|---|
|Standard text|Normal|
|Large headings|Normal or slightly tight|
|Uppercase micro-labels|Slightly expanded when justified|
|Monospace|Font-dependent|
|Numeric content|Consistent alignment and spacing|

## 7.3. Rules

- Avoid arbitrary letter spacing.
- Prefer normal tracking for standard UI text.
- Use tighter tracking sparingly for large headings.
- Use expanded tracking only for justified uppercase labels.
- Never use letter spacing to compensate for a poor font choice.
- Validate tracking at different sizes.

## 7.4. Audit checklist

- [ ] Letter-spacing tokens are controlled.
- [ ] Standard text uses appropriate tracking.
- [ ] Headings do not look artificially compressed.
- [ ] Uppercase labels remain readable.
- [ ] No arbitrary component-specific tracking exists.

---

# 8. Semantic Typography Hierarchy

## 8.1. Definition

The library must define typographic roles based on information purpose rather than component type.

This ensures that the same information role has a consistent visual appearance across the system.

## 8.2. Recommended semantic roles

|Role|Purpose|Typical characteristics|
|---|---|---|
|Display|Exceptional large titles|Large, semibold|
|Page title|Main page heading|Medium-large, semibold|
|Section title|Section hierarchy|Medium, semibold|
|Subsection title|Secondary hierarchy|Standard, medium|
|Body|Primary content|Standard, normal|
|Body-secondary|Supporting content|Standard, normal, muted|
|Label|Control labels|Small, medium|
|Metadata|Contextual information|Small, normal, muted|
|Caption|Supporting explanations|Extra small or small|
|Overline|Category identifiers|Small, medium, optional uppercase|
|Code|Technical values|Monospace|

These roles should map to the existing typography token architecture.

## 8.3. Rules

- Every semantic role must have a documented purpose.
- Roles must be independent of individual components.
- Equivalent content roles must look consistent.
- Do not create new semantic roles for trivial visual differences.
- Avoid using display styles inside standard functional components.
- Do not use headings purely to achieve a visual size.

## 8.4. Audit checklist

- [ ] Semantic roles are documented.
- [ ] Each role has a clear purpose.
- [ ] Roles are reused across component categories.
- [ ] No unnecessary semantic variants exist.
- [ ] Visual hierarchy is consistent.
- [ ] Semantic roles are not confused with HTML heading levels.

---

# 9. Typographic Hierarchy

## 9.1. Definition

Typography must establish a clear hierarchy between information levels.

The user should be able to understand the structure of a component without reading every word.

## 9.2. Hierarchy rules

- Primary information must be immediately identifiable.
- Secondary information must be visually subordinate.
- Metadata must not compete with primary content.
- Headings must clearly identify structural sections.
- Actions must remain distinguishable from content.
- Avoid assigning equal emphasis to unrelated information.
- Use spacing and positioning alongside typography.

## 9.3. Preferred hierarchy mechanisms

Use the following mechanisms in order of preference:

1. Position and grouping.
2. Font size.
3. Font weight.
4. Foreground color.
5. Letter spacing, when appropriate.

Do not use every mechanism simultaneously.

## 9.4. Audit checklist

- [ ] Primary information is immediately identifiable.
- [ ] Secondary information is subordinate.
- [ ] Metadata does not compete with content.
- [ ] Heading hierarchy is understandable.
- [ ] Typography reinforces layout structure.
- [ ] Visual emphasis is restrained.

---

# 10. Functional Typography and Information Density

## 10.1. Definition

Typography must support efficient information scanning.

The library should be capable of rendering dense functional interfaces without feeling visually crowded.

## 10.2. Rules

- Use compact typography where information density requires it.
- Maintain sufficient contrast.
- Preserve clear hierarchy between columns and rows.
- Use tabular numerals for comparable numerical data when appropriate.
- Avoid excessive font-size variation.
- Avoid unnecessarily large headings in functional interfaces.
- Ensure metadata remains legible.
- Preserve sufficient line spacing for multiline content.

## 10.3. Tabular numerals

Numerical information often requires stable character widths.

Use tabular numerals for:

- Prices.
- Dates and times.
- Counters.
- Statistics.
- Quantities.
- Financial values.
- Numeric table columns.

Example:

```css
.numeric {
  font-variant-numeric: tabular-nums;
}
```

Do not force tabular numerals on every textual context.

## 10.4. Audit checklist

- [ ] Dense interfaces remain readable.
- [ ] Numerical data is aligned appropriately.
- [ ] Tabular numerals are used where beneficial.
- [ ] Tables have consistent typography.
- [ ] Metadata remains legible.
- [ ] Compact layouts do not feel crowded.
- [ ] Typography supports efficient scanning.

---

# 11. Text Alignment Philosophy

## 11.1. Definition

Text alignment must support reading patterns and information relationships.

## 11.2. Rules

- Prefer left alignment for standard interface content in left-to-right contexts.
- Use centered text only when the component structure justifies it.
- Right-align numerical values when comparison benefits from it.
- Maintain consistent alignment within equivalent components.
- Avoid inconsistent text alignment inside the same information group.
- Support right-to-left layouts where required.

## 11.3. Audit checklist

- [ ] Text alignment is intentional.
- [ ] Equivalent components share alignment conventions.
- [ ] Numeric values align consistently.
- [ ] Center alignment is used selectively.
- [ ] Layout direction is respected.

---

# 12. Text Behavior and Overflow

## 12.1. Definition

Typography must remain robust when content length varies.

The library must define predictable rules for wrapping, truncation and overflow.

## 12.2. Text wrapping

- Allow body content to wrap naturally.
- Avoid forced single-line content unless required.
- Prevent text from overflowing component boundaries.
- Preserve readable line lengths.
- Handle long unbreakable strings.
- Support localization and variable-length content.

## 12.3. Truncation

Truncation must only be used when preserving the available layout is more important than displaying the entire content.

Rules:

- Use ellipsis consistently.
- Preserve the original content through an accessible alternative when necessary.
- Avoid truncating essential labels.
- Provide access to full values when important.
- Do not use truncation as a substitute for proper responsive layout.

## 12.4. Line clamping

Use line clamping for content previews and summaries where appropriate.

Do not use it for essential instructions, form labels or critical information.

## 12.5. Audit checklist

- [ ] Long text wraps correctly.
- [ ] Overflow is controlled.
- [ ] Truncation is intentional.
- [ ] Essential content is not hidden.
- [ ] Full values remain accessible when necessary.
- [ ] Localization does not break layouts.
- [ ] Responsive layouts preserve text readability.

---

# 13. Component Typography Standards

Each component category must follow common typographic conventions.

## 13.1. Buttons

Expected characteristics:

- Consistent font size.
- Medium font weight.
- Compact line height.
- Consistent text alignment.
- Balanced icon-to-text proportions.

Avoid:

- Bold typography without justification.
- Different text sizes between equivalent button variants.
- Unnecessary uppercase labels.

## 13.2. Form controls

Expected characteristics:

- Consistent input text size.
- Readable placeholders.
- Clear label hierarchy.
- Supporting descriptions with appropriate secondary typography.
- Consistent validation messages.

Avoid:

- Placeholder text replacing labels.
- Inconsistent font sizes between inputs and selects.
- Excessively small error messages.

## 13.3. Badges

Expected characteristics:

- Compact text.
- Controlled font weight.
- Balanced vertical alignment.
- Consistent typography across semantic variants.

Avoid:

- Excessive uppercase.
- Oversized typography.
- Inconsistent weights.

## 13.4. Navigation

Expected characteristics:

- Consistent label typography.
- Restrained selected-state emphasis.
- Readable compact labels.
- Clear hierarchy between primary and secondary navigation.

Avoid:

- Excessive boldness.
- Inconsistent sizes between navigation items.
- Unnecessary uppercase treatments.

## 13.5. Dialogs

Expected characteristics:

- Clear title hierarchy.
- Readable descriptions.
- Consistent action labels.
- Appropriate content line height.

Avoid:

- Excessively large titles.
- Competing title and body weights.
- Dense paragraphs without spacing.

## 13.6. Tables

Expected characteristics:

- Compact but readable cells.
- Clear column labels.
- Consistent numerical formatting.
- Appropriate metadata hierarchy.
- Predictable alignment.

Avoid:

- Oversized headers.
- Inconsistent row typography.
- Excessively small values.
- Unnecessary boldness.

## 13.7. Tooltips and popovers

Expected characteristics:

- Compact readable text.
- Clear title/content distinction when necessary.
- Controlled line height.
- Appropriate wrapping.

Avoid:

- Extremely small text.
- Excessive text density.
- Unnecessary typographic hierarchy.

---

# 14. Responsive Typography

## 14.1. Definition

Typography must adapt to different viewport sizes without compromising the visual hierarchy.

## 14.2. Rules

- Preserve semantic typography roles.
- Scale large headings when appropriate.
- Avoid arbitrary per-breakpoint font overrides.
- Keep functional controls readable.
- Prevent text clipping.
- Support increased browser font scaling.
- Preserve comfortable reading behavior.
- Validate long localized strings.

## 14.3. Audit checklist

- [ ] Typography adapts appropriately.
- [ ] Large headings remain balanced.
- [ ] Body text remains readable.
- [ ] Controls preserve usable typography.
- [ ] Text does not overflow.
- [ ] Browser zoom does not break layouts.
- [ ] Localization is supported.

---

# 15. Typography Anti-Patterns

|Anti-pattern|Problem|Correction|
|---|---|---|
|Too many font sizes|Inconsistent hierarchy|Consolidate the scale|
|Too many font weights|Excessive emphasis|Reduce available weights|
|Arbitrary line heights|Inconsistent rhythm|Use semantic tokens|
|Excessive uppercase|Visual noise|Use sentence case|
|Tiny metadata|Poor readability|Increase size or contrast|
|Bold everywhere|Weak hierarchy|Reserve stronger weights|
|Inconsistent button typography|Fragmented controls|Standardize button roles|
|Placeholder as label|Poor usability|Use persistent labels|
|Excessive truncation|Information loss|Improve layout and wrapping|
|Arbitrary tracking|Inconsistent appearance|Use controlled letter spacing|
|Unaligned numbers|Difficult comparison|Use tabular numerals|
|Component-specific font families|Fragmented identity|Centralize font definitions|

---

# 16. Typography Audit Methodology

Each component must be audited across the following dimensions.

## 16.1. Token compliance

- Are font properties sourced from tokens?
- Are semantic typography roles used?
- Are component-specific values justified?
- Are duplicated values present?

## 16.2. Hierarchy

- Is primary information immediately recognizable?
- Is secondary content subordinate?
- Are headings meaningful?
- Is emphasis consistent?

## 16.3. Readability

- Are font sizes appropriate?
- Are line heights comfortable?
- Is contrast sufficient?
- Are long texts handled correctly?

## 16.4. Density

- Does typography support the intended information density?
- Are compact controls readable?
- Are tables easy to scan?
- Is metadata appropriately sized?

## 16.5. Consistency

- Are equivalent components typographically equivalent?
- Are button labels consistent?
- Are form controls consistent?
- Are typography roles shared across the system?

## 16.6. Responsiveness

- Does typography adapt correctly?
- Does browser zoom preserve usability?
- Do localized strings remain readable?
- Does text overflow remain controlled?

---

# 17. Typography Scoring

Each component must receive a score from 0 to 4 across six dimensions.

|Dimension|Weight|
|---|---|
|Token architecture compliance|15%|
|Semantic hierarchy|25%|
|Readability|20%|
|Information density|15%|
|Component consistency|15%|
|Responsive behavior|10%|

### Scoring scale

|Score|Classification|Description|
|---|---|---|
|0|Missing|No coherent typographic system|
|1|Poor|Arbitrary typography and inconsistent hierarchy|
|2|Partial|Basic structure with significant inconsistencies|
|3|Good|Consistent and readable|
|4|Excellent|Refined, coherent and optimized for the interface|

Weighted score:

`(Tokens × 0.15) + (Hierarchy × 0.25) + (Readability × 0.20) + (Density × 0.15) + (Consistency × 0.15) + (Responsive × 0.10)`

### Mandatory constraints

A component cannot be considered compliant if:

- Essential text is unreadable.
- Important information is hidden through truncation.
- Typographic hierarchy creates ambiguity.
- Browser zoom causes significant usability regressions.
- Essential form labels are missing.

Accessibility failures must be reported independently of the average score.

---

# 18. Remediation Guidelines

When a component fails the typography audit, apply corrections in the following order:

1. Identify hardcoded font properties.
2. Map values to primitive typography tokens.
3. Assign appropriate semantic roles.
4. Consolidate unnecessary font sizes.
5. Normalize font weights.
6. Correct line heights.
7. Correct letter spacing.
8. Establish a clearer information hierarchy.
9. Improve numerical alignment where necessary.
10. Correct wrapping and truncation.
11. Validate responsive behavior.
12. Reinspect the rendered component in context.

Avoid introducing new typography tokens for every visual discrepancy.

First determine whether the existing semantic roles can solve the problem.

---

# 19. Final Acceptance Criteria

The typography system is considered successfully implemented when:

- Font families are centralized.
- Primitive typography values are controlled.
- Semantic roles are documented.
- Components use consistent typography.
- Font sizes establish a clear hierarchy.
- Font weights are restrained.
- Line heights support readability.
- Letter spacing is intentional.
- Dense interfaces remain readable.
- Numerical content is aligned appropriately.
- Text wrapping and truncation are predictable.
- Responsive typography preserves usability.
- Typography reinforces the visual identity of the library.

---

# 20. Final Principle

Typography is not merely a way to display text.

It is one of the primary tools used to create structure, hierarchy, rhythm and visual identity.

A refined UI does not require dozens of typographic styles.

It requires a small number of carefully calibrated roles that work consistently across every component.

**The objective is to make information immediately understandable through typography, without requiring unnecessary visual decoration.**