# Accessibility

> **Purpose:** Define verifiable accessibility requirements for any UI component library.
> 
> **Scope:** Standards, contrast, semantics, keyboard, focus, screen readers, user preferences, zoom, text spacing, targets and testing protocol.
> 
> **Related principles:** DP-03 Subtle Contrast Hierarchy, DP-10 Immediate Feedback, DP-11 Predictable Behavior, DP-13 Keyboard-First Interaction.
> 
> **Framework context:** Framework-agnostic. Adapters belong in a separate document.

---

# 1. Standards

|Topic|Primary reference|Status|
|---|---|---|
|Color contrast|APCA, defined in `02-visual-quality/contrast-balance.md`|Chosen by this library. Not part of WCAG 3|
|Contrast reporting|WCAG 2.2 ratios|Calculated and reported|
|Everything else|WCAG 2.2 AA success criteria|Current testable reference|
|Direction of travel|WCAG 3 Working Draft|Consulted for orientation, not used to pass or fail|
|Widget behavior|WAI-ARIA Authoring Practices|Reference patterns, adapted when testing shows a better result|

WCAG 3 is a draft, and its requirements can change. Never describe a component as WCAG 3 compliant.

An automated scan is not an accessibility result. It finds only part of the defects, so a component passes only after the manual checks in section 9.

---

# 2. How to Read the Requirements

Each requirement has a stable ID, a method and a default severity.

|Method|Meaning|
|---|---|
|Script|Measured automatically|
|DOM|Read from the rendered accessibility tree or markup|
|Manual|Performed by a person with the keyboard or a real assistive technology|

An auditor may raise a severity when the impact is greater in context. Lowering it requires a written reason.

---

# 3. Contrast and Color

|ID|Requirement|Method|Severity|
|---|---|---|---|
|A11Y-01|Body and content text meet their APCA floor in every theme and state|Script|P0|
|A11Y-02|Placeholder and disabled text meet their APCA floor|Script|P1|
|A11Y-03|Icons that carry meaning meet their APCA floor|Script|P1|
|A11Y-04|Essential component boundaries meet their floor|Script|P1|
|A11Y-05|Text over translucent or image surfaces is measured on its composited result|Script|P1|
|A11Y-06|Every pair reports its WCAG 2.2 ratio, and disagreements are recorded|Script|P2|
|A11Y-07|No state or meaning depends on hue alone|Manual|P0|
|A11Y-08|Error, success and warning stay distinguishable under simulated protanopia, deuteranopia and tritanopia|Manual|P1|

---

# 4. Semantics and Names

|ID|Requirement|Method|Severity|
|---|---|---|---|
|A11Y-10|Every interactive element has an accessible name|DOM|P0|
|A11Y-11|A native element is used when one exists for the role|DOM|P1|
|A11Y-12|ARIA roles are valid, and required owned elements are present|DOM|P0|
|A11Y-13|ARIA states follow the visible state at all times|DOM|P0|
|A11Y-14|Every field has a programmatic label, and its error and description are associated with it|DOM|P0|
|A11Y-15|Heading levels are not imposed by the component unless they are configurable|DOM|P2|
|A11Y-16|Visible label text is included in the accessible name|DOM|P1|
|A11Y-17|Interactive elements are not nested inside each other|DOM|P0|

---

# 5. Keyboard and Focus

Key bindings are defined in `04-interaction-quality/keyboard-interactions.md`.

|ID|Requirement|Method|Severity|
|---|---|---|---|
|A11Y-20|Every pointer action has a keyboard equivalent|Manual|P0|
|A11Y-21|There is no keyboard trap, except a modal that can be closed|Manual|P0|
|A11Y-22|Focus order follows reading order|Manual|P1|
|A11Y-23|Focus is visible, and its indicator meets its floor against every adjacent color|Script|P0|
|A11Y-24|A focused element is not fully hidden by sticky or overlay content|Manual|P1|
|A11Y-25|A modal contains focus, and focus returns to its trigger when it closes|Manual|P0|
|A11Y-26|Focus survives a re-render of the focused element|Manual|P0|
|A11Y-27|Focus moves to a sensible element when the focused item is removed|Manual|P1|
|A11Y-28|Single-character shortcuts can be turned off or remapped|Manual|P2|

---

# 6. Screen Readers

|ID|Requirement|Method|Severity|
|---|---|---|---|
|A11Y-30|Role, name, value and state are announced correctly|Manual|P0|
|A11Y-31|Asynchronous changes are announced through a live region, without moving focus|Manual|P1|
|A11Y-32|Live regions do not announce repeated or high-frequency updates|Manual|P2|
|A11Y-33|Content hidden from sight is also hidden from assistive technology, and the reverse|DOM|P0|
|A11Y-34|Decorative icons are hidden from assistive technology|DOM|P2|
|A11Y-35|Content moved to a portal keeps a logical reading and focus relationship with its trigger|Manual|P1|

Minimum test matrix:

|Screen reader|Browser|Platform|
|---|---|---|
|VoiceOver|Safari|macOS|
|VoiceOver|Safari|iOS|
|NVDA|Firefox or Chrome|Windows|
|TalkBack|Chrome|Android, when mobile is supported|

Record any combination that cannot be tested. An untested combination is reported as unknown, not as passed.

---

# 7. User Preferences

|ID|Requirement|Method|Severity|
|---|---|---|---|
|A11Y-40|`prefers-reduced-motion` removes movement while keeping the information it carried|Manual|P1|
|A11Y-41|`forced-colors: active` keeps boundaries, focus, selection and icons perceivable|Manual|P1|
|A11Y-42|`prefers-contrast: more` increases contrast where the theme supports it|Manual|P2|
|A11Y-43|`prefers-color-scheme` selects the default theme when no user choice exists|Script|P2|

---

# 8. Zoom, Text and Targets

|ID|Requirement|Method|Severity|
|---|---|---|---|
|A11Y-50|Content stays usable at 200% browser zoom|Manual|P0|
|A11Y-51|Content reflows at a 320 CSS pixel width without two-dimensional scrolling, except tables and similar content|Manual|P1|
|A11Y-52|Text spacing overrides do not clip content: line height 1.5, paragraph spacing 2, letter spacing 0.12, word spacing 0.16, all relative to font size|Script|P1|
|A11Y-53|Text is sized in relative units and follows the browser font size|Script|P1|
|A11Y-54|Pointer targets are at least 24 × 24 CSS pixels, or meet the WCAG 2.5.8 exceptions|Script|P1|
|A11Y-55|Touch targets on touch-first products are at least 44 × 44 CSS pixels, which may exceed the visual size|Script|P2|
|A11Y-56|Content shown on hover or focus can be dismissed, can be hovered, and stays visible|Manual|P1|
|A11Y-57|Dragging actions have a single-pointer alternative|Manual|P1|

---

# 9. Test Protocol

Apply these steps in order to each audited component.

1. Run the automated scan in every theme and every state in the visual state matrix.
2. Run the contrast report.
3. Complete a full task with the keyboard only.
4. Complete the same task with each screen reader in the matrix.
5. Repeat with forced colors, reduced motion, 200% zoom and text spacing overrides.
6. Record the tools, versions and any combination that was not tested.

---

# 10. Evidence

Every result must include one of the following:

- Script output with the tool version.
- An accessibility tree extract.
- A screen recording or a transcript of what the screen reader announced.
- A screenshot with the theme, state and preference shown.

A result without evidence is recorded as unknown.

---

# 11. Scoring

Accessibility works as a gate. It is not averaged away by other dimensions.

|Result|Condition|
|---|---|
|Blocked|At least one open P0|
|Conditional|No P0, at least one open P1|
|Passed|No open P0 or P1, all checks run|
|Unknown|Required manual checks not performed|

The 0–4 score used in the component scorecard is derived from this result:

|Result|Score|
|---|---|
|Blocked|At most 1|
|Unknown|At most 2|
|Conditional|At most 3|
|Passed|4 only if no open P2|

---

# 12. References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WCAG 3.0 Working Draft](https://www.w3.org/TR/wcag-3.0/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
