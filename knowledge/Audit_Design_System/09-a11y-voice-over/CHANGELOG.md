# Changelog

## Unreleased

- Initial English accessibility test repository and component specifications.
- 2026-11-02 — Button (`CMP-ACT-001`) and Dialog (`CMP-OVR-002`) rewritten as reference specifications: tester action, expected behavior and validation criterion for each step; separate macOS and iOS procedures; illustrative speech; conformance criteria split into normative, best practice and AT behavior; checklist with observations. Expected behavior changed.
  - Button: `TEST-BTN-001` to `003` replaced by `TEST-BTN-001` to `009` (macOS) and `TEST-BTN-101` to `108` (iOS).
  - Dialog: `TEST-DLG-001` to `003` replaced by `TEST-DLG-001` to `010` (macOS) and `TEST-DLG-101` to `107` (iOS). Dialog now covers modal, alert and non-modal dialogs; Modal Dialog (`CMP-OVR-001`) overlaps and is to be merged.
- 2026-11-02 — The other 31 specifications rewritten on the reference structure, priority 1 first. Expected behavior changed everywhere: the former `TEST-<NAME>-001` to `003` are replaced. macOS tests are numbered from `001`, iOS tests from `101`. 34 active specifications, 298 tests.
  - Modal Dialog (`CMP-OVR-001`) merged into Dialog; `CMP-OVR-001` and `TEST-MOD-*` retired.
  - Non-interactive components (List, Image, Icon, Data Table) no longer carry activation steps.
  - Every specification starts with a keyboard test without VoiceOver when the component is operable, and links to the matching section of `04-interaction-quality/keyboard-interactions.md`.
  - `03-standards/wcag-2.2.md` lists every criterion cited by the specifications, with its level and whether VoiceOver can check it; AAA criteria are marked as best practice.

|Specification|macOS tests|iOS tests|
|---|---|---|
|Button|`TEST-BTN-001`–`009`|`TEST-BTN-101`–`108`|
|Link|`TEST-LNK-001`–`008`|`TEST-LNK-101`–`105`|
|Icon Button|`TEST-ICB-001`–`006`|`TEST-ICB-101`–`103`|
|Action Menu|`TEST-AMN-001`–`007`|`TEST-AMN-101`–`102`|
|Text Input|`TEST-TXT-001`–`009`|`TEST-TXT-101`–`105`|
|Checkbox|`TEST-CHK-001`–`007`|`TEST-CHK-101`–`105`|
|Radio Group|`TEST-RAD-001`–`006`|`TEST-RAD-101`–`104`|
|Select|`TEST-SEL-001`–`007`|`TEST-SEL-101`–`103`|
|Switch|`TEST-SWT-001`–`006`|`TEST-SWT-101`–`103`|
|Search Field|`TEST-SRC-001`–`006`|`TEST-SRC-101`–`103`|
|Date Picker|`TEST-DTP-001`–`007`|`TEST-DTP-101`–`103`|
|Tabs|`TEST-TAB-001`–`006`|`TEST-TAB-101`–`103`|
|Navigation Menu|`TEST-MNU-001`–`006`|`TEST-MNU-101`–`104`|
|Breadcrumb|`TEST-BRC-001`–`003`|`TEST-BRC-101`|
|Pagination|`TEST-PAG-001`–`004`|`TEST-PAG-101`–`102`|
|Accordion|`TEST-ACC-001`–`006`|`TEST-ACC-101`–`102`|
|Alert|`TEST-ALT-001`–`005`|`TEST-ALT-101`–`103`|
|Notification|`TEST-NTF-001`–`007`|`TEST-NTF-101`–`103`|
|Error Message|`TEST-ERR-001`–`006`|`TEST-ERR-101`–`103`|
|Progress Indicator|`TEST-PRG-001`–`005`|`TEST-PRG-101`–`102`|
|Loading State|`TEST-LOD-001`–`005`|`TEST-LOD-101`–`103`|
|Dialog|`TEST-DLG-001`–`010`|`TEST-DLG-101`–`107`|
|Popover|`TEST-POP-001`–`005`|`TEST-POP-101`–`102`|
|Tooltip|`TEST-TTP-001`–`003`|`TEST-TTP-101`–`102`|
|Data Table|`TEST-TBL-001`–`006`|`TEST-TBL-101`|
|List|`TEST-LST-001`–`004`|`TEST-LST-101`|
|Card|`TEST-CRD-001`–`005`|`TEST-CRD-101`–`102`|
|Image|`TEST-IMG-001`–`006`|`TEST-IMG-101`|
|Icon|`TEST-ICN-001`–`003`|`TEST-ICN-101`|
|Autocomplete|`TEST-AUT-001`–`006`|`TEST-AUT-101`–`102`|
|Combobox|`TEST-CBX-001`–`008`|`TEST-CBX-101`–`103`|
|Carousel|`TEST-CAR-001`–`005`|`TEST-CAR-101`–`102`|
|Tree View|`TEST-TRV-001`–`005`|`TEST-TRV-101`|
|Interactive Table|`TEST-ITB-001`–`005`|`TEST-ITB-101`|

Record future changes by date, affected test IDs, and whether the expected behavior changed.
