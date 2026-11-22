# Motion Guidelines

> **Purpose:** Define a coherent motion language for all Reef.js components.
> 
> **Scope:** Transitions, animations, timing, easing, transforms, overlays, state changes, loading feedback, gestures, reduced motion and lifecycle synchronization.
> 
> **Design direction:** Subtle, purposeful, fast, precise and functionally meaningful.
> 
> **Framework:** Reef.js — state-based reactive framework.

---

# 1. Motion Philosophy

## 1.1. Definition

Motion describes how interface elements change their visual state over time.

It includes:

- Opening and closing.
- Entering and exiting.
- Expanding and collapsing.
- Selection feedback.
- Hover and focus feedback.
- Loading and progress.
- Reordering and repositioning.
- State transitions.
- Micro-interactions.
- Gesture-based interactions.

Motion is part of the interface's visual language.

It must communicate changes, preserve spatial continuity and improve the perception of responsiveness.

It must never slow down interaction or introduce unnecessary visual noise.

## 1.2. Core Principles

### Principle 1 — Motion Must Have a Purpose

Every animation must communicate something.

Valid purposes:

- Showing that an element appeared.
- Communicating a state change.
- Establishing a relationship between elements.
- Providing feedback after an action.
- Preserving spatial continuity.
- Communicating progress or waiting.

Invalid purposes:

- Making an interface look more animated.
- Adding decoration without functional meaning.
- Delaying interaction to create an effect.
- Drawing attention to elements unnecessarily.

### Principle 2 — Motion Must Be Subtle

Motion should support the interface rather than dominate it.

Preferred characteristics:

- Small distances.
- Short durations.
- Controlled easing.
- Minimal overshoot.
- No unnecessary bounce.
- No exaggerated scaling.
- No excessive opacity changes.

The interface should feel responsive, not animated.

### Principle 3 — Motion Must Be Fast

Interactions should feel immediate.

Animation must never make a component feel slower than its actual response.

The visual response should begin as soon as the relevant state change is committed.

### Principle 4 — Motion Must Be Consistent

Equivalent interactions must use equivalent motion patterns.

Examples:

- All dropdown menus should have similar opening behavior.
- All dialogs should share a consistent entrance and exit language.
- All expandable regions should use related timing and easing.
- All hover transitions should follow the same duration family.

### Principle 5 — Motion Must Preserve Spatial Continuity

Elements should appear to move or transform from a logical origin.

Examples:

- A dropdown opens from its trigger.
- A popover emerges from its anchor.
- A dialog appears as a new interaction layer.
- An accordion expands within its existing layout position.

### Principle 6 — Motion Must Respect User Preferences

Users who request reduced motion must receive a meaningful alternative.

Motion must not be essential for understanding interface state.

### Principle 7 — Motion Must Never Block Interaction

An animation must not prevent users from interacting with a component unless the component's actual interaction state requires it.

### Principle 8 — Motion Must Be State-Driven

Animations should represent actual state transitions.

Do not animate arbitrary implementation events that have no meaningful relationship with the user-facing component state.

## 1.3. Global Audit Checklist

- [ ] Every animation has a functional purpose.
- [ ] Motion is subtle.
- [ ] Motion is fast.
- [ ] Equivalent components share motion patterns.
- [ ] Spatial relationships are preserved.
- [ ] Reduced motion is supported.
- [ ] Animations do not unnecessarily block interaction.
- [ ] Motion reflects actual component states.
- [ ] No decorative animation creates visual noise.

---

# 2. Motion Vocabulary

Reef.js should use a shared motion vocabulary.

Every animation should belong to a recognizable category.

## 2.1. Motion Categories

|Category|Purpose|Examples|
|---|---|---|
|Feedback|Confirm an interaction|Button press, checkbox|
|Transition|Communicate a state change|Active tab, selected item|
|Entrance|Introduce an element|Dialog, Popover|
|Exit|Remove an element|Toast, Dropdown|
|Expansion|Reveal content|Accordion, Collapsible|
|Spatial|Communicate repositioning|Reordering, drag and drop|
|Continuous|Communicate ongoing activity|Spinner, Progress|
|Attention|Draw attention to important changes|Validation error|

## 2.2. Motion Priority

Not all motion categories have the same importance.

Recommended priority:

1. Functional feedback.
2. State transitions.
3. Spatial continuity.
4. Entrance and exit.
5. Continuous activity.
6. Decorative motion.

Decorative motion should be exceptional and should never compete with functional feedback.

---

# 3. Motion Design Tokens

Motion values must be centralized in the design system.

Avoid defining arbitrary durations and easing curves inside individual components.

## 3.1. Duration Scale

Recommended initial duration tokens:

|Token|Value|Usage|
|---|---|---|
|`duration-instant`|0ms|Immediate state changes|
|`duration-fast`|100ms|Hover, pressed, small feedback|
|`duration-normal`|150ms|Common state transitions|
|`duration-moderate`|200ms|Menus, small overlays|
|`duration-slow`|250ms|Dialogs, larger transitions|
|`duration-slower`|300ms|Complex layout transitions|

These are starting values, not mandatory values for every component.

The design system should favor the shortest duration that communicates the intended change clearly.

## 3.2. Easing Tokens

Recommended easing functions:

|Token|Value|Usage|
|---|---|---|
|`ease-linear`|`linear`|Continuous progress|
|`ease-standard`|`cubic-bezier(0.2, 0, 0, 1)`|Standard state transitions|
|`ease-enter`|`cubic-bezier(0, 0, 0.2, 1)`|Entrance|
|`ease-exit`|`cubic-bezier(0.4, 0, 1, 1)`|Exit|
|`ease-emphasized`|`cubic-bezier(0.2, 0, 0, 1.2)`|Rare emphasis|

Avoid excessive overshoot and elastic curves.

The emphasized curve should be used sparingly and only when the interaction benefits from it.

## 3.3. Distance Tokens

Recommended transform distances:

|Token|Value|Usage|
|---|---|---|
|`motion-distance-xs`|2px|Micro feedback|
|`motion-distance-sm`|4px|Small entrance|
|`motion-distance-md`|8px|Popover or menu|
|`motion-distance-lg`|12px|Larger contextual transition|

Avoid large translations for ordinary component interactions.

## 3.4. Scale Tokens

Recommended scale values:

|Token|Value|Usage|
|---|---|---|
|`scale-none`|1|No scaling|
|`scale-enter`|0.98|Subtle entrance|
|`scale-press`|0.98|Press feedback|
|`scale-exit`|0.98|Subtle exit|

Scaling must not alter the perceived geometry excessively.

## 3.5. Token Implementation

Illustrative CSS:

```css
:root {
  --duration-instant: 0ms;
  --duration-fast: 100ms;
  --duration-normal: 150ms;
  --duration-moderate: 200ms;
  --duration-slow: 250ms;
  --duration-slower: 300ms;

  --ease-linear: linear;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0, 0, 0.2, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);

  --motion-distance-xs: 2px;
  --motion-distance-sm: 4px;
  --motion-distance-md: 8px;
  --motion-distance-lg: 12px;
}
```

The values should be exposed through Reef.js semantic motion tokens rather than duplicated across component stylesheets.

## 3.6. Audit Checklist

- [ ] Motion tokens exist.
- [ ] Durations are centralized.
- [ ] Easing curves are centralized.
- [ ] Transform distances are standardized.
- [ ] Component-specific arbitrary values are minimized.
- [ ] Token names express semantic intent.
- [ ] Reduced-motion tokens or policies exist.

---

# 4. Motion Timing Rules

## 4.1. Interaction Response

A component must acknowledge user interaction immediately.

For example:

- Button press feedback should start immediately.
- Checkbox state should update immediately.
- Selection should not wait for an animation to finish.
- A dialog should begin opening as soon as its open state changes.

Visual transitions may continue after the state has already changed.

## 4.2. Entrance and Exit Timing

Entrance and exit durations do not necessarily need to be identical.

Recommended behavior:

- Entrance can be slightly slower to communicate appearance.
- Exit should generally be shorter to avoid delaying dismissal.
- Critical actions must not wait for exit animation completion.

## 4.3. Sequential Animation

Avoid excessive staggered animations.

For collections, stagger can be useful when it helps communicate a meaningful sequence.

However:

- Do not delay access to list items unnecessarily.
- Do not animate large collections one element at a time.
- Avoid long cascading animations.
- Avoid entrance animations that repeatedly replay during reactive updates.

## 4.4. Timing Audit

- [ ] Interaction feedback starts immediately.
- [ ] State changes are not delayed by animation.
- [ ] Exit animations are not unnecessarily long.
- [ ] Sequential animations are limited.
- [ ] Large collections avoid expensive stagger effects.

---

# 5. Easing and Motion Curves

Easing determines how an animation accelerates and decelerates.

It has a significant impact on perceived interface quality.

## 5.1. Standard Easing

Use standard easing for most UI transitions.

Examples:

- Hover states.
- Focus states.
- Selection.
- Small color transitions.
- Component state changes.

## 5.2. Entrance Easing

Entrance animations should feel controlled and natural.

Examples:

- Dropdown.
- Popover.
- Dialog.
- Tooltip.

They should not feel like elements are flying into the interface.

## 5.3. Exit Easing

Exit animations should feel decisive.

Elements should disappear without creating a prolonged sense of movement.

## 5.4. Easing Anti-Patterns

Avoid:

- Excessive bounce.
- Elastic overshoot.
- Dramatic spring effects.
- Random easing curves.
- Different easing for visually equivalent interactions.
- Linear easing for ordinary UI transitions.

Linear easing is appropriate for continuous processes such as progress indicators, not most state transitions.

## 5.5. Audit Checklist

- [ ] Standard easing is consistently applied.
- [ ] Entrance and exit have appropriate curves.
- [ ] Bounce is avoided unless justified.
- [ ] Equivalent interactions use equivalent curves.
- [ ] Linear easing is reserved for appropriate contexts.

---

# 6. Micro-Interactions

Micro-interactions provide immediate visual feedback for small user actions.

They are particularly important for creating a polished interface.

## 6.1. Button

Expected behavior:

- Hover: subtle color or surface transition.
- Press: immediate visual feedback.
- Focus: visible focus indicator.
- Disabled: no misleading interactive animation.
- Loading: clear loading state.

Avoid exaggerated button scaling.

## 6.2. Checkbox

Expected behavior:

- Checked state appears immediately.
- Checkmark can transition subtly.
- Indeterminate state is visually distinct.
- No unnecessary bouncing.

## 6.3. Switch

Expected behavior:

- Thumb moves smoothly.
- Track color transitions.
- State changes are immediate.
- Motion remains functional under reduced-motion preferences.

## 6.4. Radio

Expected behavior:

- Selected indicator appears clearly.
- Transition is subtle.
- Selection is not delayed.

## 6.5. Input

Expected behavior:

- Focus border or ring transitions smoothly.
- Validation feedback appears promptly.
- Error state does not use excessive shaking.
- Focus feedback remains visible.

## 6.6. Icon Button

Expected behavior:

- Subtle surface transition.
- Consistent hover feedback.
- No unnecessary icon rotation.
- Focus indication remains independent of hover.

## 6.7. Audit Checklist

- [ ] Micro-interactions communicate state.
- [ ] Feedback is immediate.
- [ ] Animations are subtle.
- [ ] No decorative movement is added without purpose.
- [ ] Focus and hover remain distinguishable.

---

# 7. Overlay Motion Patterns

Overlays require particularly consistent motion because they define interaction layers.

## 7.1. Dropdown Menu

Recommended pattern:

- Short fade-in.
- Very small vertical translation.
- Optional subtle scale.
- Shorter exit.

Example:

```css
.dropdown-content[data-state="open"] {
  animation: dropdown-enter 150ms var(--ease-enter);
}

.dropdown-content[data-state="closed"] {
  animation: dropdown-exit 100ms var(--ease-exit);
}

@keyframes dropdown-enter {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

## 7.2. Popover

Recommended pattern:

- Originates from the trigger.
- Small translation based on placement.
- Subtle opacity transition.
- No exaggerated movement.

Popover placement must remain correct if the positioning engine flips or shifts the element.

## 7.3. Dialog

Recommended pattern:

- Backdrop fades in.
- Dialog appears with a subtle opacity and scale transition.
- Exit is slightly faster.
- Background content remains visually subordinate.

Avoid large scale changes.

## 7.4. Drawer

Recommended pattern:

- Translate from the relevant screen edge.
- Backdrop fades simultaneously.
- Duration reflects the larger spatial movement.
- Reduced motion replaces translation with a simpler state transition.

## 7.5. Tooltip

Recommended pattern:

- Very short fade-in.
- Optional minimal translation.
- No noticeable entrance delay once the tooltip should appear.
- Avoid movement that makes the tooltip difficult to read.

## 7.6. Toast

Recommended pattern:

- Subtle entrance from the edge or a small vertical offset.
- Short fade.
- Exit without delaying dismissal.
- Stacked toasts should not create excessive cascading motion.

## 7.7. Audit Checklist

- [ ] All overlays use consistent entrance and exit patterns.
- [ ] Motion origin is spatially logical.
- [ ] Placement changes do not create visual glitches.
- [ ] Backdrop and content transitions are coordinated.
- [ ] Exit animations do not delay functionality.
- [ ] Reduced motion is supported.

---

# 8. Expansion and Collapse Motion

Expansion patterns must communicate the relationship between a trigger and its content.

Components:

- Accordion.
- Collapsible.
- Expandable table rows.
- Tree nodes.
- Disclosure panels.

## 8.1. Recommended Behavior

- Content expands within its layout context.
- Height changes are smooth.
- Content is not clipped unexpectedly.
- Expansion begins immediately after activation.
- Collapse does not leave hidden content focusable.

## 8.2. Height Animation

Avoid assuming that `height: auto` can be animated directly.

Possible strategies:

- CSS grid-based expansion.
- Measured height transitions.
- Carefully controlled Web Animations API.
- Native discrete transitions where supported and appropriate.

The implementation should avoid repeated layout measurements during every animation frame.

## 8.3. Content Synchronization

If a panel contains interactive content:

- Accessibility state must reflect the actual expanded state.
- Hidden content must not remain keyboard-accessible.
- Focus must not be lost if content changes dynamically.
- Animation state must not conflict with visibility state.

## 8.4. Audit Checklist

- [ ] Expansion is smooth.
- [ ] Collapse is smooth.
- [ ] Content remains readable.
- [ ] Hidden content is not interactive.
- [ ] Dynamic content does not break transitions.
- [ ] Focus remains valid.

---

# 9. Loading and Progress Motion

Continuous motion is appropriate when it communicates ongoing work.

## 9.1. Spinner

Requirements:

- Small and visually restrained.
- Consistent rotation.
- Clear relationship with the loading action.
- No unnecessary multiple animations.
- Appropriate accessible status.

## 9.2. Progress Bar

Requirements:

- Progress updates reflect actual values.
- Motion does not imply false precision.
- Continuous movement is smooth.
- Indeterminate progress is visually distinct from determinate progress.

## 9.3. Skeleton

Skeleton loading should:

- Approximate the structure of expected content.
- Avoid excessive shimmer.
- Remain visually subordinate.
- Stop when real content becomes available.

A static skeleton is often preferable to a continuously animated shimmer.

## 9.4. Audit Checklist

- [ ] Loading motion represents actual waiting.
- [ ] Progress is accurate.
- [ ] Indeterminate and determinate states differ.
- [ ] Skeletons do not create excessive visual noise.
- [ ] Animation stops when loading ends.

---

# 10. State Transition Motion

Motion must follow component state.

## 10.1. State-Based Animation

A component's motion should be derived from meaningful states.

Example:

```text
closed → opening → open → closing → closed
```

This is especially relevant for:

- Dialog.
- Popover.
- Menu.
- Tooltip.
- Accordion.
- Drawer.
- Toast.

## 10.2. State and Visual Synchronization

Distinguish:

- Logical state.
- Visual animation state.
- DOM presence.
- Accessibility exposure.

These do not always change at exactly the same moment.

For example, during a dialog exit:

- Logical state may become closed.
- Visual exit animation may still be running.
- DOM may remain mounted temporarily.
- The dialog must no longer behave as an active interaction layer once dismissal is committed.

The exact synchronization policy must be defined per component.

## 10.3. Rapid State Changes

The system must handle:

- Open followed immediately by close.
- Close followed immediately by open.
- Repeated toggling.
- External state changes.
- Component unmount during animation.

Animations must not become stuck or leave inconsistent visual states.

## 10.4. Audit Checklist

- [ ] Motion is state-driven.
- [ ] Logical and visual states are separated where necessary.
- [ ] Rapid transitions are handled.
- [ ] Reversals are deterministic.
- [ ] Unmount during animation is safe.
- [ ] No stale animation callbacks remain.

---

# 11. Motion and Reef.js Reactivity

This section defines implementation constraints specific to Reef.js.

Motion must work naturally with Reef.js state changes without introducing reactivity loops, stale state or unnecessary DOM updates.

## 11.1. Reactive State and Animation

Animations should respond to meaningful state transitions.

Do not trigger animations simply because a component rerenders.

A reactive update does not necessarily represent a new visual interaction.

## 11.2. Avoid Animation Side Effects in Render

Do not start animations directly from render evaluation.

Prefer:

- State transition detection.
- Lifecycle-aware effects.
- CSS state selectors.
- Dedicated motion utilities.
- Explicit animation controllers.

## 11.3. DOM Lifecycle

Components that animate their exit need an explicit presence strategy.

The component may need to remain mounted while its visual exit completes.

Requirements:

- Cleanup after exit.
- Cancellation of obsolete animations.
- No duplicate event listeners.
- No stale reactive subscriptions.
- No animation callbacks after destruction.

## 11.4. Animation Ownership

Each animation should have a clear owner.

Possible ownership:

- CSS owns simple transitions.
- A motion utility owns coordinated transitions.
- The component owns component-specific sequencing.
- The application owns global page transitions.

Avoid having multiple systems animate the same property simultaneously.

## 11.5. Recommended Architecture

```text
Reef Motion System
│
├── Motion Tokens
│   ├── Durations
│   ├── Easings
│   ├── Distances
│   └── Scales
│
├── Motion Primitives
│   ├── Transition
│   ├── Presence
│   ├── Animate
│   └── ReducedMotion
│
├── Interaction Patterns
│   ├── Overlay Motion
│   ├── Disclosure Motion
│   ├── Feedback Motion
│   └── Loading Motion
│
└── Component Integration
    ├── Dialog
    ├── Popover
    ├── Menu
    ├── Tooltip
    └── Accordion
```

This is a conceptual architecture, not a mandate to build a large animation framework.

## 11.6. Audit Checklist

- [ ] Animations are not started from render evaluation.
- [ ] Reactive updates do not replay animations unnecessarily.
- [ ] Presence and exit lifecycle are explicit.
- [ ] Animation ownership is clear.
- [ ] Cleanup is reliable.
- [ ] Rapid state changes are safe.

---

# 12. CSS Animation and Transition Standards

## 12.1. Prefer CSS for Simple Motion

Use CSS transitions for:

- Color.
- Background.
- Border.
- Opacity.
- Transform.
- Small visual state changes.

Use CSS keyframes for:

- Spinner.
- Repeated loading indicators.
- More complex predefined transitions.

Use JavaScript animation APIs when:

- The animation requires dynamic measurements.
- Multiple elements must be coordinated.
- Reversal or interruption needs explicit control.
- CSS cannot reliably express the desired behavior.

## 12.2. Prefer Compositor-Friendly Properties

Prefer animating:

- `transform`
- `opacity`

Use caution with:

- `width`
- `height`
- `top`
- `left`
- `margin`
- `padding`
- Properties that trigger expensive layout recalculation.

This is a performance guideline, not an absolute prohibition.

## 12.3. Avoid Permanent will-change

Do not apply `will-change` to every animated element.

Use it only when profiling demonstrates a real benefit and manage its lifetime carefully.

## 12.4. Avoid Competing Animations

Never allow unrelated animation systems to compete for the same CSS property.

For example, avoid simultaneously controlling `transform` through:

- A CSS transition.
- A keyframe animation.
- A JavaScript animation.

## 12.5. Audit Checklist

- [ ] CSS is preferred for simple transitions.
- [ ] Transform and opacity are preferred when appropriate.
- [ ] Layout-heavy animations are justified.
- [ ] will-change is used selectively.
- [ ] Animation property ownership is explicit.
- [ ] No competing animations exist.

---

# 13. Reduced Motion and Accessibility

Reduced motion is a fundamental requirement.

It is not an optional visual preference.

## 13.1. System Preference

Reef.js components must respect:

```css
@media (prefers-reduced-motion: reduce) {
  /* Reduced motion behavior */
}
```

## 13.2. Reduced Motion Policy

When reduced motion is enabled:

- Remove unnecessary translations.
- Remove scaling effects.
- Disable decorative animations.
- Replace large spatial transitions with immediate or subtle opacity changes.
- Keep state feedback.
- Preserve progress information.
- Do not remove meaningful visual state indicators.

## 13.3. Important Distinction

Reduced motion does not mean removing all feedback.

A checkbox must still visibly communicate selection.

A dialog must still clearly appear.

A loading state must still communicate that work is ongoing.

The implementation should reduce movement, not remove information.

## 13.4. Recommended CSS

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
  }

  .motion-transition {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

This is a possible fallback, not a substitute for component-level motion design.

Avoid globally disabling every transition without considering functional feedback and application behavior.

## 13.5. Audit Checklist

- [ ] System reduced-motion preference is respected.
- [ ] Spatial motion is reduced.
- [ ] Decorative animations are removed.
- [ ] Functional feedback remains.
- [ ] Loading remains understandable.
- [ ] Motion behavior is tested with reduced motion enabled.

---

# 14. Scroll and Layout Motion

Scroll behavior is part of the motion language.

## 14.1. Smooth Scrolling

Smooth scrolling should only be used when it improves orientation.

Avoid forcing smooth scrolling globally.

## 14.2. Auto-Scroll

Components may need to scroll content into view.

Examples:

- Active menu item.
- Selected tree node.
- Current command result.
- Newly focused grid cell.

Requirements:

- Do not create unexpected jumps.
- Avoid unnecessary scrolling when the element is already visible.
- Respect reduced-motion preferences.
- Preserve keyboard focus.

## 14.3. Layout Changes

Avoid animating every layout change.

Motion is appropriate when it helps users understand a meaningful spatial change.

Examples:

- Reordered list items.
- Expandable rows.
- Sidebar collapse.
- Moving notification stacks.

## 14.4. Audit Checklist

- [ ] Smooth scrolling is intentional.
- [ ] Auto-scroll preserves orientation.
- [ ] Focus and scroll are coordinated.
- [ ] Layout animation is limited to meaningful changes.
- [ ] Reduced motion is respected.

---

# 15. Motion Anti-Patterns

|Anti-pattern|Problem|Correction|
|---|---|---|
|Animation without purpose|Visual noise|Require functional justification|
|Excessive duration|Interface feels slow|Use shorter timing|
|Large translations|Disrupts spatial continuity|Reduce distances|
|Exaggerated bounce|Distracts from content|Use controlled easing|
|Animation delays interaction|Reduces responsiveness|Commit state immediately|
|Animating every state|Overwhelms users|Animate meaningful changes|
|Inconsistent timing|Interface feels fragmented|Use shared tokens|
|Excessive stagger|Delays access to content|Limit sequential effects|
|Animating layout unnecessarily|Performance cost|Prefer transform and opacity|
|Missing reduced motion|Accessibility issue|Respect system preference|
|Replaying on every render|Unstable interface|Animate actual state transitions|
|Unmanaged exit animations|Lifecycle bugs|Use explicit presence management|
|Competing animations|Visual glitches|Define animation ownership|
|Permanent will-change|Memory and rendering cost|Apply selectively|

---

# 16. Motion Audit Template

Use this template for every component with animated behavior.

```md
# Motion Audit: [ComponentName]

## 1. Motion Purpose

- What does motion communicate?
- Is it functionally necessary?
- What would happen without it?

## 2. Motion Category

- [ ] Feedback
- [ ] Transition
- [ ] Entrance
- [ ] Exit
- [ ] Expansion
- [ ] Spatial
- [ ] Continuous
- [ ] Attention

## 3. Animated Properties

| Property | Initial | Final | Purpose |
|---|---|---|---|
| | | | |

## 4. Timing

- Duration:
- Easing:
- Delay:
- Reversal behavior:

## 5. State Synchronization

- Logical state:
- Visual state:
- DOM presence:
- Accessibility state:

## 6. Lifecycle

- Enter behavior:
- Exit behavior:
- Cancellation:
- Unmount during animation:
- Cleanup:

## 7. Performance

- Animated properties:
- Layout impact:
- Paint impact:
- Compositor usage:
- Large collection behavior:

## 8. Accessibility

- Reduced motion:
- State communication:
- Focus behavior:
- Screen reader behavior:

## 9. Edge Cases

- Rapid state changes:
- Dynamic content:
- External state updates:
- Nested animations:
- Repeated activation:

## 10. Issues

| ID | Issue | Severity | Correction |
|---|---|---|---|

## 11. Acceptance Criteria

- [ ] Motion has a clear purpose.
- [ ] Motion follows shared tokens.
- [ ] Timing is appropriate.
- [ ] State synchronization is correct.
- [ ] Lifecycle is safe.
- [ ] Performance is acceptable.
- [ ] Reduced motion is supported.
- [ ] No unresolved P0 issues remain.
```

---

# 17. Motion Testing Matrix

Every animated component must be tested under different conditions.

|Test|Expected result|
|---|---|
|Initial appearance|Correct entrance|
|Normal interaction|Immediate feedback|
|State reversal|Smooth and deterministic|
|Rapid toggling|No stuck animation|
|Repeated activation|No duplicate effects|
|Component unmount|Safe cleanup|
|Dynamic content|No layout glitches|
|Reduced motion|Appropriate alternative|
|Keyboard activation|Same meaningful feedback|
|Pointer activation|Same meaningful feedback|
|Nested overlays|Correct animation ownership|
|Large collections|No excessive rendering cost|
|Background tab|No inconsistent final state|

Recommended testing layers:

- Unit tests for state transitions.
- Component tests for animation state.
- Browser tests for actual CSS and DOM behavior.
- Performance profiling for expensive transitions.
- Manual testing with reduced motion enabled.

---

# 18. Motion Quality Scoring

|Dimension|Weight|
|---|---|
|Functional purpose|10%|
|Timing consistency|10%|
|Easing consistency|10%|
|Visual subtlety|10%|
|State synchronization|15%|
|Lifecycle management|15%|
|Performance|10%|
|Reduced motion|10%|
|Spatial continuity|5%|
|Cross-component consistency|5%|
|**Total**|**100%**|

Each dimension is scored from 0 to 4.

## 18.1. Scoring Scale

|Score|Meaning|
|---|---|
|0|Missing|
|1|Broken|
|2|Partially implemented|
|3|Correct and consistent|
|4|Refined and production-grade|

## 18.2. Critical Conditions

A component cannot be considered production-ready if:

- Its animation blocks essential interaction.
- Its visual state becomes inconsistent with its logical state.
- It cannot recover from rapid state changes.
- It leaves stale DOM or lifecycle resources.
- It ignores reduced-motion preferences.
- It produces significant performance degradation.

---

# 19. Remediation Priorities

## P0 — Critical

- Animation blocks interaction.
- Logical and visual states become inconsistent.
- Exit animation creates inaccessible hidden content.
- Component remains stuck in an intermediate state.
- Lifecycle cleanup is broken.
- Reduced-motion preference is completely ignored.

## P1 — High

- Inconsistent animation tokens.
- Incorrect entrance and exit behavior.
- Excessive durations.
- Focus and overlay motion conflicts.
- Unnecessary layout recalculation.
- Rapid state changes produce visual glitches.

## P2 — Medium

- Missing shared motion patterns.
- Inconsistent easing.
- Excessive transform distances.
- Unnecessary stagger.
- Inconsistent loading animations.

## P3 — Low

- Minor timing refinements.
- Small easing adjustments.
- Optional micro-interaction improvements.
- Documentation refinements.

---

# 20. Final Acceptance Criteria

The Reef.js motion system is considered mature when:

- Every animation has a documented purpose.
- Motion tokens are centralized.
- Durations and easing curves are consistent.
- Interactions feel immediate.
- State changes are not delayed by animations.
- Overlay motion is standardized.
- Expansion and collapse behavior is predictable.
- Motion is synchronized with component state.
- Animation lifecycle is managed correctly.
- Rapid state changes are safe.
- Performance is acceptable.
- Reduced-motion preferences are respected.
- Motion never replaces essential state feedback.
- No unresolved P0 issues remain.

---

# 21. Final Motion Principle

**Motion should make the interface feel more responsive, not more animated.**

Perceived quality comes from restraint, speed and precision.

Reliability comes from behavioral correctness and reliable interaction state.

Maintainability comes from simple, reusable implementation patterns that remain easy to customize.

For Reef.js, motion must be a shared language between design tokens, component states and lifecycle management.

The goal is not to animate everything.

The goal is to make important changes feel immediate, coherent and understandable.

**Animate with purpose. Keep it subtle. Respect state. Never sacrifice responsiveness.**