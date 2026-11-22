# Nodus Adapter

> **Purpose:** Translate the framework-agnostic requirements of this reference into Nodus concepts.
> 
> **Scope:** Nodus 4.11.0 on Reef.js 13. Vocabulary, component model, state, events, lifecycle and existing guards.
> 
> **Rule:** Requirements live in `00` to `05`. Anything specific to Nodus lives here.

---

# 1. How to Use This Document

Documents `00` to `05` state what must be true. This document states where to look in Nodus to verify it.

Code examples in `00` to `05` are illustrative pseudo-code. Their syntax, including `tsx`, `jsx`, `signal`, `computed` and `effect`, is not a Nodus API. Audit the behavior they describe, not their syntax.

When a requirement conflicts with a recorded Nodus decision, do not silently pick a side. Add it to `06-audit-results/ecarts-a-arbitrer.md`.

---

# 2. Vocabulary

|Reference term|Nodus equivalent|Source|
|---|---|---|
|Stateless component|Pattern A: pure function returning an HTML string|`SPECS.md`, `ui-lib/components/*/*.js`|
|Stateful component|Pattern B: template plus a behavior class registered in the registry|`ui-lib/core/component-registry.js`|
|Variant, size|Modifier class `component--modifier`|`GUIDELINES.md` §4|
|Runtime state|`data-state`, plus `aria-*` when the state is semantic|`GUIDELINES.md` §4|
|Slot, children|String props such as `children`, `iconStart`, `iconEnd`|`GUIDELINES.md` §1|
|Prop forwarding|`attrs`, filtered and merged by `core/attrs.js`|`GUIDELINES.md` §1|
|Controlled state|Mode documented per family: ADR-004, ADR-005, ADR-006|`ADR/`|
|Change event|Bubbling `CustomEvent`, for example `select:change`, listened to on `document`|`GUIDELINES.md` §2, §6 ter|
|Derived state|Reef getters and `memo()`|`GUIDELINES.md` §3|
|DOM identity|`id` and `key`, read by the Reef diff|`GUIDELINES.md` §6|
|Frozen subtree|`reef-ignore`, re-rendered through `registry.remount()`|`GUIDELINES.md` §6|
|Form value sync|`sync` prop|`GUIDELINES.md` §6|
|Theme|`data-theme`: light, dark or system|`SPECS.md`|
|Theme skin|`data-style`, orthogonal to light and dark|`SPECS.md`|
|Density|`data-density="compact"`|`ui-lib/tokens/_components.css`|
|Interface text|`t()` from `core/i18n.js`|`GUIDELINES.md` §4|

---

# 3. Requirement Translations

## 3.1. State and API

- Audit control modes family by family. They differ on purpose: value components use `core/controlled-value.js`, floating panels use `core/controlled-panel.js`, and overlays use `OverlayBehavior`.
- `api-consistency.md` expects callbacks such as `onValueChange`. In Nodus, the main contract is the bubbling event. `onOpenChange` appears in 9 files and `onValueChange` in 2, so audit the callback and the event together.
- Unknown props are silently ignored. The audit must verify documented props, not guess them.

## 3.2. Security

TEST-09 cannot be applied literally. Pattern A interpolates `label`, `children` and `attrs` without escaping, which is a recorded contract: it allows icons and markup.

Audit that the contract is documented and that `attrs` values are escaped. Escaping consumer content remains the responsibility of the consumer.

## 3.3. Lifecycle

|Stage in `lifecycle.md`|Nodus mechanism|
|---|---|
|Attached|`registry.autoInit()`, then `initScope()` on each `reef:render`|
|Detached|`registry.destroyRemoved()`, which calls each instance's `destroy()`|
|Reattached or refreshed|`registry.remount()`|
|Duplicate initialization|`autoInit()` is idempotent|

## 3.4. Accessibility Helpers

|Need|Nodus module|
|---|---|
|Focus containment|`core/focus-trap.js`|
|Composite navigation|`core/roving-tabindex.js`|
|Overlay behavior|`core/overlay-behavior.js`|
|Scroll lock|`core/scroll-lock.js`|
|ARIA helpers|`core/aria.js`|

Test the modules once, then test how each component uses them.

---

# 4. Guards Already in Place

Reuse these before writing a new control. Coverage below is taken from the Nodus documentation and test names. It has not been independently verified.

|Control|Existing guard|Coverage|
|---|---|---|
|THEME-20, THEME-21|`scripts/check-tokens.js`, rule A|Partial: undefined references|
|THEME-01|CONTRAST-1, `tests/contrast.test.js`|Partial: WCAG 2 ratio only|
|THEME-09|CONTRAST-1 checks the elevation order|Partial|
|TEST-31|CONTRAST-1 runs in `npm run check`|Partial: no APCA floors|
|TEST-45|`tests/all-components.test.js`, `tests/fixtures.js`|Good|
|A11Y-12, A11Y-17|`tests/aria.test.js`, smoke test|Partial|
|TEST-07|`tests/rtl.test.js`|Partial|
|PERF-12|`npm run size`, `scripts/measure-size.js`|To confirm|
|TEST-44|`npm run build` runs `npm run check`|Good. CI still needs confirmation|

No guard exists yet for L*, ΔE2000 or APCA.

---

# 5. Foundations for the Theme Audit

- `core/contrast.js` already exports `contrastRatio`, `tokenDeclarations`, `resolveColor` and `checkContrast`. It works without a DOM. It is the natural base for the token audit.
- `ui-lib/tokens/contrast-contract.json` already declares allowed and forbidden pairs. Its format can carry APCA floors by use.
- `tools/measure_tokens.py` in this folder is a temporary measurement script for the audit. It is not intended for Nodus.
