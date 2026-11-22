audit_Design_System/
│
├── 00-design-philosophy/
│   ├── design-direction.md
│   ├── design-principles.md
│   └── visual-language.md
│
├── 01-design-principles/
│   ├── minimalism.md
│   ├── color-philosophy.md
│   ├── typography.md
│   ├── visual-hierarchy.md
│   ├── functional-density.md
│   ├── geometric-consistency.md
│   ├── progressive-disclosure.md
│   ├── interaction-feedback.md
│   ├── motion.md
│   └── composability.md
│
├── 02-visual-quality/
│   ├── visual-refinement.md
│   ├── spacing-and-alignment.md
│   ├── surface-treatment.md
│   ├── contrast-balance.md
│   ├── dark-light-consistency.md
│   └── theme-invariants.md
│
├── 03-component-quality/
│   ├── component-inventory.md
│   ├── api-consistency.md
│   ├── component-completeness.md
│   └── component-audit-template.md
│
├── 04-interaction-quality/
│   ├── interaction-patterns.md
│   ├── state-transitions.md
│   ├── keyboard-interactions.md
│   └── motion-guidelines.md
│
├── 05-technical-quality/
│   ├── reef-reactivity.md
│   ├── lifecycle.md
│   ├── accessibility.md
│   ├── performance.md
│   └── testing.md
│
└── 06-audit-results/
    ├── global-audit.md
    ├── component-scorecards.md
    ├── issues.md
    ├── remediation-roadmap.md
    └── ecarts-a-arbitrer.md

07-nodus-adapter/
├── adapter.md
├── token-roles.md
└── tools/measure_tokens.py

_archive/ contains the raw AI conversation that produced these documents. It is not part of the reference.

## Layers

Documents `00` to `05` are framework-agnostic requirements. Their code examples are illustrative pseudo-code. `07-nodus-adapter/` translates them into Nodus. `06-audit-results/` holds results.

## Reference document by subject

Each subject has one reference document. Other documents may mention the subject but must point here for thresholds and rules.

|Subject|Reference document|Related documents|
|---|---|---|
|Contrast thresholds|`02-visual-quality/contrast-balance.md`|`color-philosophy.md`, `accessibility.md`|
|Color roles|`01-design-principles/color-philosophy.md`|`visual-language.md`|
|Theme rules|`02-visual-quality/theme-invariants.md`|`dark-light-consistency.md`|
|Surfaces|`02-visual-quality/surface-treatment.md`|`visual-language.md`|
|Typography|`01-design-principles/typography.md`|`visual-hierarchy.md`|
|Information priority|`01-design-principles/visual-hierarchy.md`|`progressive-disclosure.md`|
|Sizes and proportions|`01-design-principles/geometric-consistency.md`|`functional-density.md`|
|Spacing and alignment|`02-visual-quality/spacing-and-alignment.md`|`geometric-consistency.md`|
|Density|`01-design-principles/functional-density.md`|`spacing-and-alignment.md`|
|Motion principles|`01-design-principles/motion.md`|—|
|Motion tokens and implementation|`04-interaction-quality/motion-guidelines.md`|`motion.md`|
|State feedback|`01-design-principles/interaction-feedback.md`|`state-transitions.md`|
|State model|`04-interaction-quality/state-transitions.md`|`interaction-patterns.md`|
|Keyboard|`04-interaction-quality/keyboard-interactions.md`|`accessibility.md`|
|Component coverage|`03-component-quality/component-inventory.md`|—|
|Component completeness|`03-component-quality/component-completeness.md`|`component-inventory.md`|
|API conventions|`03-component-quality/api-consistency.md`|`composability.md`|
|Reactivity|`05-technical-quality/reef-reactivity.md`|`state-transitions.md`|
|Lifecycle|`05-technical-quality/lifecycle.md`|`reef-reactivity.md`|
|Accessibility|`05-technical-quality/accessibility.md`|All|
|Performance|`05-technical-quality/performance.md`|`lifecycle.md`|
|Testing|`05-technical-quality/testing.md`|All|
