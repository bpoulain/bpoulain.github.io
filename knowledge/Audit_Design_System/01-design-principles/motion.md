# Motion Design

> **Purpose:** Define the motion philosophy, animation principles, transition behaviors, timing, easing, choreography and motion architecture governing the entire UI library.
> 
> **Scope:** Micro-interactions, state transitions, component animations, overlays, menus, dialogs, tooltips, feedback animations, layout transitions, loading animations, gestures, reduced motion, animation performance and reactive state synchronization.
> 
> **Related principles:** Minimalism, Visual Hierarchy, Functional Density, Progressive Disclosure, Interaction Feedback, Geometric Consistency and Composability.
> 
> **Quality bar:** See `00-design-philosophy/design-direction.md`, section 1.

---

# 1. Motion Philosophy

## 1.1. Definition

Motion describes how interface elements change their visual state over time.

It includes:

- Appearance and disappearance.
- Position changes.
- Size changes.
- Opacity transitions.
- Transformations.
- State transitions.
- Layout changes.
- Loading animations.
- Interactive feedback.
- Spatial relationships between components.

Motion must reinforce the interface's functionality rather than compete with it.

### Core principle

**Motion must communicate change, preserve continuity and reinforce interaction without introducing unnecessary visual complexity.**

## 1.2. Expected characteristics

The motion language must favor:

- Subtlety.
- Purposefulness.
- Consistency.
- Responsiveness.
- Predictability.
- Spatial continuity.
- Natural movement.
- Performance.
- Accessibility.
- Functional clarity.

Avoid:

- Excessive animation.
- Decorative motion without purpose.
- Long transitions.
- Inconsistent easing.
- Arbitrary scaling.
- Unnecessary bouncing.
- Competing animations.
- Motion that delays interaction.
- Layout instability.
- Animation that hides important information.

## 1.3. Motion versus decoration

|Functional motion|Decorative motion|
|---|---|
|Menu appears from its trigger|Random floating elements|
|Dialog fades and scales into view|Unnecessary entrance choreography|
|Switch moves between states|Continuous decorative movement|
|Accordion expands its content|Unrelated bouncing effect|
|Toast enters the viewport|Excessive notification animation|
|Button responds to pressing|Repeated attention-seeking animation|

## 1.4. Rules

- Every animation must have an identifiable purpose.
- Motion must correspond to an actual state transition.
- Motion must not obstruct interaction.
- Motion must not delay access to important content.
- Motion must remain consistent across components.
- Motion must respect reduced-motion preferences.
- Static presentation must remain understandable without animation.

## 1.5. Audit checklist

- [ ] Every animation has a functional purpose.
- [ ] Motion reinforces state changes.
- [ ] Animations are subtle and controlled.
- [ ] Motion does not compete with content.
- [ ] Motion does not delay interactions.
- [ ] Reduced-motion behavior is defined.
- [ ] Components remain understandable without motion.

---

# 2. Motion Design Principles

## 2.1. Purposeful motion

Every movement must communicate something.

Examples:

- A dialog appearing communicates the introduction of a new interaction context.
- A menu opening communicates the expansion of available actions.
- A checkbox changing communicates a modification of value.
- A toast disappearing communicates the end of a temporary notification.
- An accordion expanding communicates the disclosure of additional content.

Motion without a communication purpose should generally be removed.

## 2.2. Restraint

The interface must use the minimum amount of movement necessary to communicate a change.

Prefer:

- Small translations.
- Subtle opacity transitions.
- Controlled scale adjustments.
- Short durations.
- Simple easing curves.

Avoid:

- Large translations.
- Oversized scaling.
- Excessive rotation.
- Elastic bouncing.
- Continuous movement without purpose.

## 2.3. Continuity

Motion must help users understand how an element moves between states.

For example, an element appearing below a trigger should visually originate near that trigger rather than appearing from an unrelated direction.

This reinforces spatial relationships.

## 2.4. Responsiveness

Animations must never make an interface feel slower.

The interface should acknowledge interactions immediately, even when a transition is still running.

## 2.5. Consistency

Equivalent interactions must use equivalent motion characteristics.

For example:

- Menus should share opening and closing behavior.
- Dialogs should share presentation logic.
- Tooltips should share appearance timing.
- Buttons should share pressed-state behavior.
- Expandable sections should use consistent transitions.

## 2.6. Rules

- Use motion to explain relationships.
- Prefer short and controlled transitions.
- Preserve visual continuity.
- Avoid unnecessary movement.
- Standardize animation characteristics.
- Never sacrifice responsiveness for visual effects.

## 2.7. Audit checklist

- [ ] Motion communicates meaningful changes.
- [ ] Movement is restrained.
- [ ] Spatial continuity is preserved.
- [ ] Animations do not delay interactions.
- [ ] Equivalent components use consistent motion.
- [ ] No unnecessary movement exists.

---

# 3. Motion Categories

The library must distinguish different categories of motion.

|Category|Purpose|Examples|
|---|---|---|
|Micro-interaction|Provide immediate feedback|Button, checkbox, switch|
|State transition|Communicate a state change|Selected, expanded|
|Entrance|Introduce an element|Dialog, menu, popover|
|Exit|Remove an element|Toast, tooltip, dialog|
|Layout transition|Communicate structural changes|Accordion, expanding panel|
|Feedback animation|Communicate an outcome|Success, error|
|Loading animation|Communicate ongoing work|Spinner, skeleton|
|Gesture animation|Respond to direct manipulation|Drag, swipe|
|Ambient animation|Provide contextual continuous movement|Progress indicator|

### Rules

- Define a consistent motion pattern for each category.
- Avoid applying entrance animations to every component.
- Prefer state transitions over unnecessary re-creation.
- Keep ambient motion limited to situations where it communicates ongoing activity.
- Document exceptional animation patterns.

---

# 4. Motion Tokens

## 4.1. Definition

Motion tokens centralize the timing, easing and movement values used throughout the library.

They prevent each component from independently defining animation behavior.

Motion tokens should follow the same architectural philosophy as color, spacing and typography tokens.

## 4.2. Duration tokens

Recommended initial scale:

|Token|Duration|Purpose|
|---|---|---|
|`duration-instant`|0ms|No animation|
|`duration-fast`|100ms|Micro-interactions|
|`duration-normal`|150ms|Standard transitions|
|`duration-moderate`|200ms|Menus and small overlays|
|`duration-slow`|250ms|Dialogs and larger surfaces|
|`duration-slower`|300ms|Complex layout transitions|

These are starting values, not universal requirements.

Longer animations should be exceptional and justified by their purpose.

## 4.3. Easing tokens

|Token|Suggested curve|Purpose|
|---|---|---|
|`ease-linear`|`linear`|Constant-speed progress|
|`ease-standard`|`cubic-bezier(0.2, 0, 0, 1)`|General transitions|
|`ease-in`|`cubic-bezier(0.4, 0, 1, 1)`|Elements leaving|
|`ease-out`|`cubic-bezier(0, 0, 0.2, 1)`|Elements entering|
|`ease-emphasized`|`cubic-bezier(0.2, 0, 0, 1)`|Important state changes|

The system should avoid creating numerous nearly identical easing tokens.

## 4.4. Distance tokens

Use restrained translation distances.

|Token|Suggested value|Purpose|
|---|---|---|
|`motion-distance-xs`|2px|Micro-movement|
|`motion-distance-sm`|4px|Subtle entrance|
|`motion-distance-md`|8px|Menu and popover|
|`motion-distance-lg`|12px|Larger contextual movement|

## 4.5. Scale tokens

|Token|Suggested value|Purpose|
|---|---|---|
|`scale-subtle`|0.98|Pressed state|
|`scale-enter`|0.98|Subtle entrance|
|`scale-normal`|1|Default|

Avoid excessive scaling.

## 4.6. Example token implementation

```css
:root {
  /* Duration */
  --motion-duration-instant: 0ms;
  --motion-duration-fast: 100ms;
  --motion-duration-normal: 150ms;
  --motion-duration-moderate: 200ms;
  --motion-duration-slow: 250ms;
  --motion-duration-slower: 300ms;

  /* Easing */
  --motion-ease-linear: linear;
  --motion-ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --motion-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --motion-ease-out: cubic-bezier(0, 0, 0.2, 1);

  /* Distance */
  --motion-distance-xs: 2px;
  --motion-distance-sm: 4px;
  --motion-distance-md: 8px;
  --motion-distance-lg: 12px;

  /* Scale */
  --motion-scale-subtle: 0.98;
  --motion-scale-enter: 0.98;
}
```

## 4.7. Rules

- Centralize shared motion values.
- Prefer semantic tokens over arbitrary values.
- Avoid duplicating duration definitions.
- Keep the token scale intentionally small.
- Document intended usage.
- Ensure tokens work across light and dark themes.
- Keep motion tokens independent from color themes.

## 4.8. Audit checklist

- [ ] Duration tokens exist.
- [ ] Easing tokens exist.
- [ ] Distance tokens exist.
- [ ] Scale tokens are defined where necessary.
- [ ] Components use centralized tokens.
- [ ] Arbitrary animation values are minimized.
- [ ] Token usage is documented.

---

# 5. Duration and Timing

## 5.1. Definition

Duration determines how long an animation takes to complete.

The appropriate duration depends on:

- Element size.
- Visual complexity.
- Interaction importance.
- Distance traveled.
- Animation purpose.
- Frequency of interaction.

## 5.2. Timing principles

Small changes should generally be faster than large structural transitions.

|Interaction|Recommended range|
|---|---|
|Button hover|100–150ms|
|Button pressed|80–120ms|
|Checkbox|100–150ms|
|Switch|150–200ms|
|Tooltip appearance|100–150ms|
|Menu appearance|120–200ms|
|Popover appearance|150–200ms|
|Accordion|150–250ms|
|Dialog appearance|150–250ms|
|Toast appearance|150–200ms|

These are initial design guidelines. They must be tested against actual components.

## 5.3. Rules

- Frequent interactions should be fast.
- Small controls should not use long transitions.
- Large structural changes may use slightly longer transitions.
- Closing animations should not unnecessarily delay interaction.
- Avoid animations that feel sluggish.
- Avoid abrupt transitions for meaningful state changes.
- Respect the frequency of repeated actions.

## 5.4. Audit checklist

- [ ] Durations match interaction complexity.
- [ ] Frequent interactions are fast.
- [ ] No unnecessarily long transitions exist.
- [ ] Closing behavior remains responsive.
- [ ] Timing is consistent across similar components.

---

# 6. Easing and Movement Curves

## 6.1. Definition

Easing determines how animation velocity changes over time.

Two animations with identical durations can feel completely different depending on their easing functions.

## 6.2. Standard easing behavior

### Ease-out

Elements entering the interface should generally decelerate into their final position.

Typical usage:

- Dialog entrance.
- Menu appearance.
- Tooltip appearance.
- Toast entrance.
- Popover appearance.

### Ease-in

Elements leaving the interface can accelerate toward disappearance.

Typical usage:

- Dialog exit.
- Menu dismissal.
- Tooltip dismissal.
- Toast exit.

### Standard easing

General-purpose transitions.

Typical usage:

- Hover.
- Background changes.
- Border changes.
- Selection transitions.
- Small component state changes.

### Linear

Used when constant velocity is important.

Typical usage:

- Progress indicators.
- Continuous loading rotation.
- Determinate progress.

## 6.3. Rules

- Use a limited number of easing curves.
- Prefer ease-out for entrances.
- Prefer ease-in for exits.
- Use standard easing for everyday state transitions.
- Reserve linear motion for continuous processes.
- Avoid arbitrary easing per component.

## 6.4. Audit checklist

- [ ] Easing functions are centralized.
- [ ] Entrance and exit behavior are coherent.
- [ ] State transitions use consistent curves.
- [ ] Linear motion is used appropriately.
- [ ] No unnecessary bounce or elastic effects exist.

---

# 7. Micro-interactions

## 7.1. Definition

Micro-interactions are small animations associated with immediate user actions.

They provide subtle confirmation that the interface has responded.

They are especially important for the perceived refinement of buttons, controls and interactive surfaces.

## 7.2. Component guidelines

|Component|Expected motion|
|---|---|
|Button|Subtle hover and pressed transition|
|IconButton|Background transition|
|Checkbox|Check indicator appearance|
|Radio|Selection indicator transition|
|Switch|Thumb movement|
|Toggle|State transition|
|Input|Usually static geometry; subtle focus transition|
|Slider|Thumb movement|
|Badge|Only when interactive|
|Tab|Active indicator transition|

## 7.3. Button example

```css
.button {
  transition:
    background-color var(--motion-duration-fast) var(--motion-ease-standard),
    border-color var(--motion-duration-fast) var(--motion-ease-standard),
    color var(--motion-duration-fast) var(--motion-ease-standard);
}

.button:active:not(:disabled) {
  transform: scale(var(--motion-scale-subtle));
}
```

The scale effect is optional. A simple surface change may be preferable, particularly for frequently activated controls.

## 7.4. Rules

- Micro-interactions must remain subtle.
- Do not animate every CSS property.
- Prefer color and opacity transitions where appropriate.
- Avoid unnecessary transforms.
- Keep repeated interactions lightweight.
- Never make a control feel slower because of its animation.

## 7.5. Audit checklist

- [ ] Interactive controls have coherent motion.
- [ ] Micro-interactions are subtle.
- [ ] No excessive scaling occurs.
- [ ] Repeated interactions remain responsive.
- [ ] Equivalent controls share motion patterns.

---

# 8. Entrance and Exit Animations

## 8.1. Definition

Entrance and exit animations communicate when elements enter or leave the interface.

They are particularly important for transient UI components.

Examples:

- Dialog.
- Popover.
- Dropdown.
- Menu.
- Tooltip.
- Toast.
- Command palette.
- Context menu.

## 8.2. Entrance patterns

Recommended properties:

- Opacity from 0 to 1.
- Small translation toward the final position.
- Optional subtle scale from 0.98 to 1.
- Ease-out timing.

## 8.3. Exit patterns

Recommended properties:

- Opacity from 1 to 0.
- Small translation away from the current position where appropriate.
- Optional subtle scale.
- Ease-in timing.

## 8.4. Spatial origin

The entrance direction should reinforce the component's relationship with its trigger.

Examples:

|Component|Preferred origin|
|---|---|
|Dropdown|Trigger position|
|Popover|Anchor element|
|Tooltip|Trigger position|
|Context menu|Pointer position|
|Dialog|Center of viewport|
|Toast|Notification container edge|
|Command palette|Center of viewport|

## 8.5. Rules

- Entrance and exit animations must be coherent.
- Motion must respect spatial relationships.
- Avoid large translation distances.
- Avoid excessive scale.
- Do not animate elements that must appear instantly for functional reasons.
- Ensure exit animations do not prevent timely dismissal.
- Handle interruption and reopening correctly.

## 8.6. Audit checklist

- [ ] Entrance animations are consistent.
- [ ] Exit animations are consistent.
- [ ] Motion origin is meaningful.
- [ ] Animation distances are restrained.
- [ ] Components remain responsive.
- [ ] Reopening during exit is handled correctly.

---

# 9. Layout and Structural Transitions

## 9.1. Definition

Layout transitions communicate structural changes within the interface.

Examples:

- Accordion expansion.
- Collapsible sidebar.
- Resizable panel.
- Expanding search.
- Dynamic list insertion.
- Removing an item.
- Reordering elements.
- Switching between layout modes.

## 9.2. Guidelines

- Animate only properties where the movement adds clarity.
- Preserve spatial continuity.
- Avoid animating complex layouts unnecessarily.
- Avoid expensive layout recalculations.
- Prevent visual jumps.
- Keep surrounding content readable during transitions.

## 9.3. Height transitions

Height animation requires particular attention.

Possible strategies:

- Animate a known height.
- Animate a measured height.
- Use grid-based expansion.
- Use clipping with controlled opacity.
- Avoid relying on unsupported or unpredictable `auto` interpolation.

## 9.4. Rules

- Layout movement must communicate structural change.
- Do not animate every reflow.
- Avoid large or complex simultaneous movements.
- Preserve the position of important content where possible.
- Keep layout transitions interruptible.
- Ensure content remains accessible throughout expansion and collapse.

## 9.5. Audit checklist

- [ ] Structural transitions are purposeful.
- [ ] Layout does not jump unexpectedly.
- [ ] Expanding content remains accessible.
- [ ] Complex animations are avoided where unnecessary.
- [ ] Repeated state changes remain stable.

---

# 10. Motion for Overlays and Layered Interfaces

## 10.1. Definition

Overlays introduce temporary interaction layers above the current interface.

They require a consistent motion language because they frequently appear and disappear during workflows.

## 10.2. Component guidelines

|Component|Entrance|Exit|
|---|---|---|
|Tooltip|Fade in|Fade out|
|Dropdown|Fade + small translation|Fade out|
|Popover|Fade + subtle scale|Fade + subtle scale|
|Dialog|Fade + subtle scale|Fade out|
|Drawer|Directional translation|Reverse translation|
|Command palette|Fade + subtle scale|Fade out|
|Toast|Directional translation + fade|Fade out|
|Context menu|Small fade|Fade out|

## 10.3. Backdrop motion

Backdrop transitions should be subtle.

Recommended:

- Opacity transition.
- No unnecessary scaling.
- No excessive blur.
- No strong color flashing.

## 10.4. Rules

- Overlay motion must be consistent.
- Backdrops must not distract.
- Nested overlays must have predictable motion.
- Dismissal must remain responsive.
- Focus management must work independently of animation.
- Overlay animations must not interfere with stacking and positioning.

## 10.5. Audit checklist

- [ ] Overlay entrance and exit patterns are standardized.
- [ ] Backdrop transitions are restrained.
- [ ] Nested overlays behave predictably.
- [ ] Focus behavior is correct.
- [ ] Motion does not interfere with positioning.
- [ ] Dismissal remains responsive.

---

# 11. Motion for Loading and Progress

## 11.1. Definition

Loading motion communicates that the system is processing an operation.

It must distinguish between ongoing activity and completed work.

## 11.2. Loading patterns

|Pattern|Motion behavior|
|---|---|
|Spinner|Continuous rotation|
|Skeleton|Optional subtle shimmer|
|Progress bar|Continuous or determinate progression|
|Button loader|Localized spinner|
|Pending indicator|Subtle activity signal|
|Sync indicator|Brief state transition|

## 11.3. Rules

- Loading motion must communicate actual activity.
- Avoid decorative perpetual animation.
- Prefer simple rotation over complex movement.
- Avoid excessive shimmer.
- Keep loaders lightweight.
- Stop animation when loading ends.
- Provide a static alternative when reduced motion is enabled.

## 11.4. Audit checklist

- [ ] Loading animation represents actual activity.
- [ ] Animations stop when appropriate.
- [ ] Skeletons are visually restrained.
- [ ] Loading motion is performant.
- [ ] Reduced-motion alternatives exist.

---

# 12. Motion for Feedback and Notifications

## 12.1. Definition

Feedback animations communicate meaningful events such as success, failure or warnings.

They should reinforce the semantic message rather than replace it.

## 12.2. Examples

|Feedback|Recommended motion|
|---|---|
|Success|Subtle icon appearance|
|Error|Minimal emphasis, no aggressive shaking|
|Warning|Static emphasis or subtle entrance|
|Toast|Short entrance and exit|
|Validation error|Small opacity or border transition|
|Copy confirmation|Icon replacement|

## 12.3. Rules

- Do not use aggressive shaking for errors.
- Avoid celebratory animation for routine operations.
- Keep notifications readable during entrance.
- Do not make animation the only confirmation.
- Avoid repeated attention-seeking animations.
- Respect notification priority.

## 12.4. Audit checklist

- [ ] Feedback animation reinforces meaning.
- [ ] Error animations are restrained.
- [ ] Success animations are proportionate.
- [ ] Notifications remain readable.
- [ ] No excessive repeated motion exists.

---

# 13. Motion Interruption and Reversibility

## 13.1. Definition

Animations must behave predictably when interactions occur before an existing animation finishes.

This is particularly important in reactive applications.

Examples:

- Opening and closing a menu rapidly.
- Reversing an accordion transition.
- Switching a toggle repeatedly.
- Dismissing a toast while it enters.
- Reopening a dialog during its exit animation.

## 13.2. Rules

- Animations must be interruptible where appropriate.
- New state must take precedence over obsolete visual transitions.
- Avoid queuing unnecessary animations.
- Avoid stale completion callbacks.
- Preserve the latest reactive state.
- Do not allow animation completion to overwrite newer state.
- Ensure interrupted animations settle into the correct final state.

## 13.3. Audit checklist

- [ ] Rapid interactions are handled correctly.
- [ ] Transitions can be reversed where appropriate.
- [ ] Obsolete callbacks cannot overwrite state.
- [ ] Final presentation always matches actual state.
- [ ] No animation queue creates unnecessary latency.

---

# 14. Reduced Motion and Accessibility

## 14.1. Definition

Users must be able to reduce or disable non-essential motion.

Motion accessibility is a fundamental requirement, not an optional enhancement.

## 14.2. Implementation

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This is a broad fallback example. The actual implementation should distinguish essential from non-essential motion and avoid indiscriminately overriding every animation.

## 14.3. Expected behavior

When reduced motion is enabled:

- Remove unnecessary translations.
- Remove large scaling effects.
- Disable parallax.
- Avoid continuous decorative animations.
- Reduce or eliminate non-essential transitions.
- Preserve state communication.
- Preserve loading status communication.
- Preserve interaction acknowledgment.
- Keep all controls functional.

## 14.4. Rules

- Respect `prefers-reduced-motion`.
- Provide alternatives for essential animated information.
- Never use motion as the only state indicator.
- Avoid flashing and rapid repeated movement.
- Ensure reduced-motion mode does not break component functionality.
- Test the complete component library under reduced motion.

## 14.5. Audit checklist

- [ ] Reduced-motion preference is respected.
- [ ] Non-essential motion is removed or reduced.
- [ ] Functional feedback remains available.
- [ ] Loading states remain understandable.
- [ ] Components remain fully usable.
- [ ] No excessive flashing exists.

---

# 15. Motion Performance

## 15.1. Definition

Motion must remain smooth and must not negatively affect interface responsiveness.

A visually refined animation that causes dropped frames or delayed interactions is not acceptable.

## 15.2. Preferred properties

Generally prefer animating:

- `transform`.
- `opacity`.

Use caution with:

- `width`.
- `height`.
- `top`.
- `left`.
- `margin`.
- `padding`.
- `box-shadow`.
- `filter`.
- `backdrop-filter`.

These properties may trigger layout or painting work depending on the browser and rendering context.

## 15.3. Rules

- Prefer compositor-friendly properties.
- Avoid unnecessary layout-triggering animations.
- Avoid excessive simultaneous animations.
- Do not apply `will-change` indiscriminately.
- Clean up animation resources.
- Avoid continuous animations on large areas.
- Test on lower-powered devices.
- Avoid unnecessary DOM measurements during animation.

## 15.4. Audit checklist

- [ ] Animations are performant.
- [ ] Expensive layout transitions are minimized.
- [ ] Large surfaces are not unnecessarily animated.
- [ ] Simultaneous animations are controlled.
- [ ] Resource cleanup is correct.
- [ ] Lower-powered devices remain responsive.

---

# 16. Motion and Visual Hierarchy

## 16.1. Definition

Motion attracts attention.

Its intensity must correspond to the importance of the event being communicated.

A subtle hover should not compete with a critical notification.

## 16.2. Motion intensity hierarchy

|Level|Purpose|Example|
|---|---|---|
|0 — Static|No motion|Default presentation|
|1 — Subtle|Minor interaction feedback|Hover|
|2 — Noticeable|Meaningful state transition|Switch|
|3 — Emphasized|Contextual presentation|Dialog|
|4 — Continuous|Ongoing activity|Loading indicator|

## 16.3. Rules

- Reserve stronger motion for meaningful events.
- Keep routine interactions subtle.
- Avoid multiple competing animations.
- Maintain visual focus on primary content.
- Avoid repeated animation that attracts unnecessary attention.
- Keep motion proportional to importance.

## 16.4. Audit checklist

- [ ] Motion intensity matches event importance.
- [ ] Routine interactions remain subtle.
- [ ] Important events are distinguishable.
- [ ] Competing animations are avoided.
- [ ] Motion does not disrupt content hierarchy.

---

# 17. Motion Architecture for Reef.js

## 17.1. Definition

The motion system must integrate with Reef.js reactive state without introducing synchronization problems between the framework and the DOM.

Animation must be a presentation mechanism driven by state changes, not an independent source of truth.

## 17.2. Separation of concerns

The architecture should distinguish:

|Layer|Responsibility|
|---|---|
|Reactive state|Determines the actual component state|
|Interaction logic|Handles user events|
|Motion controller|Coordinates animation lifecycle|
|Presentation|Defines visual appearance|
|DOM lifecycle|Handles insertion and removal|
|Accessibility|Exposes meaningful state|

## 17.3. Recommended conceptual lifecycle

```text
REACTIVE STATE CHANGE
        |
        v
MOTION STATE DETECTION
        |
        v
ENTER / EXIT / UPDATE
        |
        v
ANIMATION EXECUTION
        |
        v
ANIMATION COMPLETION
        |
        v
DOM CLEANUP IF REQUIRED
```

## 17.4. Important architectural requirements

- Do not use animation state as a replacement for application state.
- Keep visual transitions synchronized with reactive state.
- Handle rapid state changes.
- Avoid stale animation callbacks.
- Clean up event listeners and animation resources.
- Prevent removed components from retaining active animations.
- Support animation interruption.
- Preserve accessibility during transitions.
- Avoid direct DOM mutations that conflict with Reef.js rendering.

## 17.5. DOM presence versus visual state

A particularly important consideration is the distinction between a component being logically closed and its DOM element being physically removed.

For example, a dialog cannot complete its exit animation if Reef.js immediately removes its DOM node.

The motion architecture must support an intermediate exit lifecycle:

```text
OPEN
  |
  v
CLOSE REQUESTED
  |
  v
EXITING
  |
  v
EXIT ANIMATION COMPLETE
  |
  v
DOM REMOVAL
```

The visual exit lifecycle must never change the semantic truth of the component's actual open state.

## 17.6. Recommended conceptual API

```ts
type MotionPhase =
  | "idle"
  | "entering"
  | "entered"
  | "exiting"
  | "exited"

type MotionConfig = {
  duration?: number
  easing?: string
  delay?: number
  enter?: MotionDefinition
  exit?: MotionDefinition
  reducedMotion?: boolean
}

type MotionDefinition = {
  opacity?: [number, number]
  transform?: [string, string]
}
```

This is an architectural illustration, not a prescribed Reef.js API.

## 17.7. Audit checklist

- [ ] Motion is driven by reactive state.
- [ ] Motion does not become a second source of truth.
- [ ] Enter and exit lifecycle are supported.
- [ ] DOM removal respects exit animations.
- [ ] Interrupted animations are handled.
- [ ] Stale callbacks are prevented.
- [ ] Resources are cleaned up.
- [ ] Reduced-motion behavior is integrated.
- [ ] Accessibility is preserved throughout transitions.

---

# 18. Motion Composition

## 18.1. Definition

Motion composition defines how multiple animations interact within a larger interface.

A dialog may contain:

- Backdrop animation.
- Container animation.
- Content appearance.
- Nested dropdown animation.
- Loading feedback.

These animations must work together without creating unnecessary complexity.

## 18.2. Guidelines

- Use limited sequencing.
- Prefer simultaneous transitions when appropriate.
- Avoid cascading animations across every child.
- Keep stagger effects exceptional.
- Maintain clear visual focus.
- Avoid nested animations that compete.

## 18.3. Rules

- Parent and child animations must be coordinated.
- Avoid unnecessary stagger effects.
- Preserve content readability.
- Do not introduce delays before essential interaction.
- Keep nested overlays independently manageable.

## 18.4. Audit checklist

- [ ] Parent and child motion is coordinated.
- [ ] Stagger effects are justified.
- [ ] No unnecessary animation sequencing exists.
- [ ] Focus remains on primary content.
- [ ] Nested transitions remain predictable.

---

# 19. Motion Anti-Patterns

|Anti-pattern|Problem|Expected correction|
|---|---|---|
|Animating everything|Visual noise|Animate meaningful changes only|
|Excessive duration|Interface feels slow|Reduce duration|
|Inconsistent easing|Fragmented motion language|Centralize easing|
|Large translations|Unnecessary movement|Use restrained distances|
|Excessive scaling|Unnatural interaction|Use subtle or no scaling|
|Bounce effects everywhere|Distracting interface|Reserve elastic motion for justified cases|
|Animation delaying clicks|Poor responsiveness|Separate animation from action handling|
|Layout-heavy animations|Performance problems|Prefer transform and opacity|
|Permanent decorative movement|Attention fatigue|Remove unnecessary motion|
|Unhandled interruption|Incorrect final state|Support reversible transitions|
|Immediate DOM removal|Broken exit animation|Implement exit lifecycle|
|Motion-only feedback|Accessibility failure|Provide persistent semantic feedback|
|No reduced-motion support|Accessibility failure|Respect user preferences|
|Excessive stagger|Sluggish content presentation|Simplify orchestration|
|Unnecessary blur animation|Rendering cost|Prefer simpler surface transitions|

---

# 20. Motion Audit Methodology

Every animated component must be audited against the following dimensions.

## 20.1. Purpose

- Does motion communicate meaningful information?
- Is animation necessary?
- Does it reinforce an interaction?

## 20.2. Timing

- Is duration appropriate?
- Is easing consistent?
- Is the animation responsive?

## 20.3. Spatial continuity

- Is the movement direction meaningful?
- Is the origin appropriate?
- Are distances restrained?

## 20.4. State synchronization

- Does animation reflect actual reactive state?
- Can transitions be interrupted?
- Can obsolete callbacks corrupt the presentation?

## 20.5. Performance

- Are animated properties appropriate?
- Is layout recalculation minimized?
- Are resources cleaned up?

## 20.6. Accessibility

- Is reduced motion supported?
- Is feedback understandable without animation?
- Are important state changes communicated semantically?

## 20.7. Composition

- Are nested animations coordinated?
- Is sequencing necessary?
- Is visual hierarchy preserved?

---

# 21. Motion Scoring

Each component must receive a score from 0 to 4 across eight dimensions.

|Dimension|Weight|
|---|---|
|Purposefulness|15%|
|Timing and duration|15%|
|Easing consistency|10%|
|Spatial continuity|10%|
|State synchronization|15%|
|Performance|15%|
|Accessibility|15%|
|Composition|5%|

### Scoring scale

|Score|Classification|Description|
|---|---|---|
|0|Missing|No appropriate motion or fundamentally broken behavior|
|1|Poor|Inconsistent, distracting or technically unreliable|
|2|Partial|Basic animation with significant refinement gaps|
|3|Good|Consistent, restrained and performant|
|4|Excellent|Precise, coherent, accessible and fully integrated|

Weighted score:

`(Purpose × 0.15) + (Timing × 0.15) + (Easing × 0.10) + (Spatial × 0.10) + (Synchronization × 0.15) + (Performance × 0.15) + (Accessibility × 0.15) + (Composition × 0.05)`

### Mandatory constraints

A component cannot be considered compliant if:

- Motion prevents essential interaction.
- Reduced-motion preferences are ignored.
- Animation produces incorrect final state.
- DOM removal breaks exit lifecycle.
- Motion causes unacceptable performance degradation.
- Important state communication depends exclusively on animation.

---

# 22. Remediation Guidelines

When a component fails the motion audit, apply corrections in this order:

1. Identify the functional purpose of each animation.
2. Remove unnecessary animations.
3. Define the expected state transitions.
4. Standardize duration.
5. Standardize easing.
6. Correct movement direction and distance.
7. Align animation with interaction feedback.
8. Handle interrupted transitions.
9. Correct DOM entry and exit lifecycle.
10. Optimize animated properties.
11. Implement reduced-motion behavior.
12. Test animations in composed interfaces.
13. Validate performance on lower-powered devices.
14. Verify Reef.js reactive synchronization.

Do not start by adding more animations.

First eliminate unnecessary motion and establish a consistent motion language.

---

# 23. Final Acceptance Criteria

The motion system is considered successfully implemented when:

- Every animation has a functional purpose.
- Motion patterns are consistent across components.
- Duration and easing tokens are centralized.
- Micro-interactions are subtle and responsive.
- Entrance and exit animations preserve spatial continuity.
- Layout transitions do not create visual instability.
- Overlay animations follow consistent patterns.
- Loading animations communicate actual activity.
- Feedback animations are proportionate.
- Animations can be interrupted safely.
- Reduced-motion preferences are respected.
- Performance remains stable.
- Motion is synchronized with Reef.js reactive state.
- DOM lifecycle supports exit animations.
- Composed interfaces do not contain competing animations.

---

# 24. Final Principle

Motion is not decoration.

It is a functional extension of the interface's visual and interaction language.

It helps users understand where elements come from, where they go, what changes and how the system responds.

A refined interface uses movement sparingly, consistently and intentionally.

**The objective is not to make the interface move. It is to make every meaningful change feel natural, immediate and understandable.**