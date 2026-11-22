# Acceptance Criteria

A component passes its VoiceOver test set when all applicable checks pass for every supported variant and target environment, and no blocking accessibility defect remains.

## Per-test decisions

- **Pass:** observable behavior meets the requirement.
- **Fail:** reproducible divergence affects access or comprehension.
- **Not applicable:** requirement does not apply; explain why.
- **Blocked:** cannot execute; record dependency.
- **Not tested:** no evidence yet.

## Release gate

Do not equate a VoiceOver pass with WCAG conformance. Review critical/major issues, verify keyboard and visual accessibility in parallel, and document exceptions with owner and remediation date.
