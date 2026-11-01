# Nodus Token Roles

> **Purpose:** Classify Nodus 4.11.0 tokens against `02-visual-quality/theme-invariants.md`.
> 
> **Scope:** Which values a future theme tool can set, calculate or must leave alone.

---

# 1. Summary

|File|Tokens|Role|
|---|---|---|
|`_primitives.css`|133|Raw palettes and scales|
|`_semantic.css`|119, including 40 color roles|Theme-aware roles|
|`_components.css`|224|Component levers|

Nodus already separates these layers well. Components never read a color primitive, and `check-tokens.js` enforces it.

---

# 2. Free Values

A theme can set these directly.

|Value|Tokens|
|---|---|
|Primary color|`--color-primary`|
|Surfaces|`--color-bg-canvas`, `--color-bg`, `--color-bg-elevated`, `--color-bg-muted`, `--color-bg-state`|
|Text|`--color-fg`, `--color-fg-muted`, `--color-fg-subtle`, `--color-fg-disabled`|
|Borders|`--color-border`, `--color-border-control`|
|Semantic colors|`--color-destructive`, `--color-success`, `--color-warning`, `--color-info`|
|Focus color|`--color-ring`|
|Shape|`--radius`|
|Fonts|`--font-sans`, `--font-mono`, `--font-display`|
|Density|`data-density`|

---

# 3. Derived Values

## 3.1. Already Calculated

|Tokens|Mechanism|
|---|---|
|`--color-*-muted`|`color-mix` with `--color-bg-elevated`|
|`--focus-ring`, `--focus-ring-field`|`color-mix` with `--color-ring`|
|`--radius-xs` to `--radius-2xl`|Proportional to `--radius`|
|`--color-primary-solid`|Alias of `--color-primary` in the default skin|
|Most `_components.css` tokens|Reference semantic roles or scales|

## 3.2. Set by Hand Today

A theme must provide each of these for each mode. A theme tool should calculate them, then check them.

|Tokens|Risk if a theme forgets them|
|---|---|
|`--color-primary-hover`|Hover keeps the previous hue|
|`--color-primary-fg`, `--color-destructive-fg`|Text on the primary color can fall below its floor|
|`--color-*-on-muted`|Alert text can fall below its floor|
|`--color-secondary`, `--color-secondary-hover`, `--color-secondary-fg`|Secondary controls keep the default neutrals|
|`--color-switch-track`|Keeps the default neutral|
|`--color-bg-overlay`|Usually safe|

`SPECS.md` describes the tokens to redefine together. That list is the starting point for the tool.

---

# 4. Fixed Values

A theme does not change these today.

|Category|Tokens|Reason|
|---|---|---|
|Role names|All `--color-*` and `--type-*` names|Public contract|
|Color primitives|`--zinc-*`, `--blue-*` and others|Recorded rule: applications redefine roles, not primitives|
|Layout scale|`--space-*`|Keeps the 4px grid|
|Layering|`--z-*`|Behavioral|
|Motion|`--duration-*`, `--ease-*`|To confirm: see THEME-25|
|Type scale|`--text-*`, `--leading-*`, `--tracking-*`|To confirm|

---

# 5. Constraints for the Theme Tool

- **Three selectors:** each mode must be written for `:root` or `[data-theme="light"]`, for the dark `@media` block, and for `[data-theme="dark"]`. CONTRAST-1 checks that both dark blocks match, so the tool must generate them together.
- **Root only:** composed tokens are calculated at `:root`. A skin on a container does not recalculate them.
- **Units:** `--radius` needs a unit. `0px` works, `0` does not.
- **Neutral tint:** tinting backgrounds means redefining each surface, text and border role, because primitives are not themed. The tool should generate a tinted neutral scale and map it onto those roles.
- **Component overrides:** `--badge-radius`, `--chip-radius` and `--progress-radius` do not follow `--radius`.
