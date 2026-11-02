# Testing Methodology

## Workflow

1. Identify component variant and initial state.
2. Inspect visible label, instructions, and intended interaction without VoiceOver.
3. Navigate to the component using the platform's primary sequential navigation method.
4. Capture the accessible name, role, value/state, and reading order.
5. Operate the component; verify visible result, spoken feedback, and focus.
6. Exercise disabled, error, loading, and dynamic states where relevant.
7. Repeat on the second platform; record differences rather than forcing identical speech.
8. Map each failure to an applicable requirement and create a reproducible issue.

## Evidence

Record test ID, environment, steps, expected/actual behavior, severity, screen recording or screenshot (when appropriate), and reproduction frequency. Avoid including personal data in recordings.

## Principle

Assess semantics and user outcome, not a fixed literal VoiceOver utterance. Check standard keyboard operation separately from VoiceOver modifier commands.
