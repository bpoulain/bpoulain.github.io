# Lifecycle

> **Purpose:** Define how a UI component is created, attached, updated and destroyed without leaking resources or losing user state.
> 
> **Scope:** Initialization, attachment, re-rendering, teardown, resources, asynchronous work, portals and duplicate initialization.
> 
> **Related principles:** DP-11 Predictable Behavior, DP-14 Composability Over Complexity.
> 
> **Framework context:** Framework-agnostic. Adapters belong in a separate document.

---

# 1. Why Lifecycle Is Audited Separately

Most lifecycle defects stay invisible in a demo. They appear after repeated mounting, fast navigation or a long session.

Each requirement below therefore needs a test that repeats the action. Reading the code is not enough.

---

# 2. Lifecycle Stages

|Stage|Starts when|Must guarantee|
|---|---|---|
|Created|The component's inputs are read|No DOM access or global side effects unless the component is rendering in a browser|
|Attached|The element enters the document|Listeners, observers and timers are registered exactly once|
|Updated|Inputs or state change|The DOM reflects the new state. User state is preserved|
|Hidden|The element stays attached but is not displayed|Non-essential work pauses|
|Detached|The element leaves the document|Everything registered is released|
|Reattached|The same element enters the document again|The component works without duplicated resources|

Not every framework exposes these stages by name. Audit the guarantee, not the name.

---

# 3. Requirements

Methods: Script, DOM and Manual have the same meaning as in `accessibility.md`.

## 3.1. Initialization

|ID|Requirement|Method|Severity|
|---|---|---|---|
|LIFE-01|Rendering twice with the same inputs produces the same output|Script|P1|
|LIFE-02|Initializing an already initialized element has no effect|Script|P0|
|LIFE-03|A component can be rendered without a browser environment, or documents that it cannot|Script|P2|
|LIFE-04|Importing a module has no visible side effect, other than documented registration|Script|P2|
|LIFE-05|Missing optional inputs produce a working default, without error|Script|P1|

## 3.2. Updates

|ID|Requirement|Method|Severity|
|---|---|---|---|
|LIFE-10|An update does not reset the caret, selection or IME composition of a focused input|Manual|P0|
|LIFE-11|An update does not close an open overlay unless the state says so|Manual|P0|
|LIFE-12|An update does not restart a running transition or scroll position|Manual|P1|
|LIFE-13|DOM enhanced by a behavior survives a parent re-render, or is restored from state|Script|P0|
|LIFE-14|List items keep their identity when reordered|Script|P1|
|LIFE-15|An update received during an exit animation has a defined result|Manual|P2|

## 3.3. Teardown

|ID|Requirement|Method|Severity|
|---|---|---|---|
|LIFE-20|Every event listener added outside the element is removed|Script|P0|
|LIFE-21|Every observer is disconnected|Script|P0|
|LIFE-22|Every timer and animation frame is cancelled|Script|P1|
|LIFE-23|Every global change is restored: scroll lock, inert state, body attributes|Script|P0|
|LIFE-24|Portal content is removed with its owner|Script|P0|
|LIFE-25|No detached element stays reachable after teardown|Script|P1|
|LIFE-26|Destroying one of several open overlays restores the correct remaining state|Manual|P1|

## 3.4. Asynchronous Work

|ID|Requirement|Method|Severity|
|---|---|---|---|
|LIFE-30|An asynchronous result arriving after teardown causes no update or error|Script|P0|
|LIFE-31|An older request cannot overwrite a newer result|Script|P0|
|LIFE-32|Pending work is cancelled when it is no longer needed|Script|P1|
|LIFE-33|Failure leaves the component in a recoverable, visible state|Manual|P1|
|LIFE-34|Rapid open, close and reopen sequences end in the correct state|Script|P1|

---

# 4. Stress Scenarios

Run each scenario on every component that has behavior.

|Scenario|Repetitions|Pass condition|
|---|---|---|
|Attach and detach|1,000|Listener, observer and node counts return to their starting value|
|Open and close|200|No duplicated portal, overlay or listener|
|Re-render parent during interaction|100|Focus, value and open state are preserved|
|Move element to another parent|50|Component still works, resources not duplicated|
|Destroy during an open state|50|Global state is fully restored|
|Destroy during a pending request|50|No error and no late update|

---

# 5. Evidence

|Requirement type|Accepted evidence|
|---|---|
|Leak|Before and after counts from a test, or a heap comparison|
|Preservation|An interaction test that asserts focus, caret or value|
|Race condition|A test that resolves requests out of order|

---

# 6. Scoring

|Score|Meaning|
|---|---|
|0|No teardown exists|
|1|Teardown exists, but a P0 stress scenario fails|
|2|No P0 failure. At least one P1 failure|
|3|All scenarios pass|
|4|All scenarios pass and are automated in the test suite|

A component with an open P0 from this document cannot be marked stable.
