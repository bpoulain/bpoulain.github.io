# Design System Accessibility Testing

A reusable, manual accessibility testing repository for web design-system components using VoiceOver on macOS and iOS.

## Goals

- Evaluate accessible names, roles, values, states, focus, reading order, and operability.
- Run reproducible component-level checks with Safari and VoiceOver.
- Record failures separately from stable test specifications.
- Trace checks to WCAG 2.2 Level A/AA where applicable.

## Start here

1. Read [Scope](01-strategy/scope.md) and [Methodology](01-strategy/methodology.md).
2. Configure [macOS](02-voiceover/macos/setup.md) and [iOS](02-voiceover/ios/setup.md).
3. Select a component in [Component Index](04-components/README.md).
4. Execute each platform-specific test, recording observed behavior.
5. Report defects with the [Issue Template](06-templates/issue-template.md).
6. Summarize coverage in [Coverage Matrix](05-matrices/coverage-matrix.md).

## Important limitations

VoiceOver output varies by OS, Safari version, language, verbosity settings, and markup. Example speech is illustrative, not an exact-string assertion. A successful VoiceOver test does not establish full WCAG conformance; also test keyboard, visual, touch, and other assistive-technology requirements.

## Repository layout

- `01-strategy/`: scope, test method, acceptance criteria, defect handling.
- `02-voiceover/`: platform-specific setup and interaction references.
- `03-standards/`: standards mapping and test rules.
- `04-components/`: one specification per component.
- `05-matrices/`: coverage, WCAG traceability, prioritization.
- `06-templates/`: reusable test and reporting structures.
- `07-reports/`: campaign results and regression tracking.
- `assets/`: optional screenshots and diagrams.

## Test conventions

Component IDs: `CMP-<FAMILY>-<NNN>`; test IDs: `TEST-<SHORTNAME>-<NNN>`. Status values: `Not tested`, `Pass`, `Fail`, `Not applicable`, `Blocked`. Use a separate result for each platform, component variant, and campaign build.
