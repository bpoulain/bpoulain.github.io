# Performance

> **Purpose:** Define measurable performance requirements for a UI component library and the method used to verify them.
> 
> **Scope:** Delivery size, rendering cost, interaction latency, large collections, animation, memory and fonts.
> 
> **Related principles:** DP-06 Functional Density, DP-10 Immediate Feedback, DP-12 Purposeful Motion.
> 
> **Framework context:** Framework-agnostic. Adapters belong in a separate document.

---

# 1. Measurement Rules

A performance result is valid only when it states its conditions.

- Measure a production build.
- Record the browser, device, CPU throttling and library version.
- Run at least 10 times and report the median and the 95th percentile.
- Compare with a baseline from the same machine and conditions.
- Keep the benchmark in the repository so that it can be run again.

A claim without these conditions is recorded as unknown.

---

# 2. Budgets

Values marked Hypothesis are starting points. No standard defines them, and each library must replace them with a recorded decision after its first measurement. Interaction to Next Paint is a published web metric.

|ID|Measure|Budget|Basis|Severity|
|---|---|---|---|---|
|PERF-01|Interaction to Next Paint on a typical interaction|200 ms or less at the 75th percentile|Core Web Vitals|P1|
|PERF-02|Long task caused by one interaction, under 4× CPU throttling|Under 50 ms for simple controls|Hypothesis|P2|
|PERF-03|Render 1,000 simple instances|Under 100 ms|Hypothesis|P2|
|PERF-04|Update one row in a 1,000-row collection|Only that row changes|Behavioral|P1|
|PERF-05|Scroll a 10,000-row virtualized collection|No dropped frames for more than 5% of frames|Hypothesis|P2|
|PERF-06|Typing in a filtered list of 1,000 items|No perceptible lag, under 100 ms per keystroke|Hypothesis|P1|
|PERF-07|Cumulative layout shift caused by the library|0 in the component's own states|Behavioral|P1|

---

# 3. Delivery

|ID|Requirement|Method|Severity|
|---|---|---|---|
|PERF-10|Each component can be imported without pulling in unrelated components|Script|P1|
|PERF-11|Consumers who import one component receive only its required CSS, or the cost is documented|Script|P2|
|PERF-12|The size of each component is measured, minified and compressed, on every release|Script|P2|
|PERF-13|Size increases over the budget fail the release, unless explicitly approved|Script|P2|
|PERF-14|Modules have no import-time work that prevents unused code removal|Script|P2|
|PERF-15|Heavy dependencies load only when the feature is used|Script|P2|

---

# 4. Runtime

|ID|Requirement|Method|Severity|
|---|---|---|---|
|PERF-20|A state change touches only the DOM nodes that depend on it|Script|P1|
|PERF-21|Reading layout and writing styles are not interleaved in loops|Manual|P2|
|PERF-22|Scroll, resize and pointer handlers are passive or throttled when possible|DOM|P2|
|PERF-23|A list of N items does not add N global listeners when one can serve|Script|P2|
|PERF-24|Closed overlays perform no measurement or positioning work|Script|P2|
|PERF-25|Hidden or off-screen animations are paused|Manual|P3|

---

# 5. Animation

|ID|Requirement|Method|Severity|
|---|---|---|---|
|PERF-30|Animations use `transform` and `opacity` where possible|DOM|P2|
|PERF-31|An interaction animation does not delay input handling|Manual|P1|
|PERF-32|`will-change` is applied only during the animation|DOM|P3|
|PERF-33|Infinite animations stop when their element is hidden|Manual|P2|

---

# 6. Memory

|ID|Requirement|Method|Severity|
|---|---|---|---|
|PERF-40|Memory returns near its baseline after the stress scenarios in `lifecycle.md`|Script|P1|
|PERF-41|Caches have a size limit or an eviction rule|Manual|P2|

---

# 7. Fonts and Assets

|ID|Requirement|Method|Severity|
|---|---|---|---|
|PERF-50|Font loading does not hide text for a long period|DOM|P2|
|PERF-51|Fallback font metrics limit layout shift when the font loads|Script|P3|
|PERF-52|Icons are not delivered as a full set when only some are used|Script|P2|

---

# 8. Evidence

|Result|Accepted evidence|
|---|---|
|Budget|Benchmark script, conditions and values|
|Delivery|Build report with the size per component|
|Runtime|Profile, mutation count or test assertion|
|Memory|Heap snapshots before and after|

---

# 9. Scoring

|Score|Meaning|
|---|---|
|0|Not measured|
|1|Measured, at least one P1 budget failed|
|2|No P1 failure, several P2 failures|
|3|All budgets met|
|4|All budgets met, and checked automatically on release|

An unmeasured dimension scores 0, even when the component seems fast.
