# Fork Simplification

## CURRENT

- **Objective:** Turn this fork into a substantially smaller, adapter-native
  framework centered on the latest App Router, Cache Components, Partial
  Prerendering, Partial Prefetching, and Turbopack.
- **Desired outcome:** One coherent product with fewer runtime modes, compiler
  paths, public options, dependencies, and expensive test combinations.
- **Current shape:** Branch `feedthejim/simplify-next-rendering` from
  `1f65c7646e`. `AGENTS.md` contains the product contract, architecture
  principles, supported-behavior map, and phased checklist. Configuration,
  Flight router-state construction, resume-cache serialization, runtime
  prefetch setup, render-option types, and the normal static-generation
  pipeline now use one Cache Components, Partial Prefetching, and cached
  navigation model. Dynamic RSC requests now use only the staged development
  and production renderers, validation has one Partial Prefetching mode, and
  application-level PPR is unconditional. App Page route kind now directly
  selects PPR without application or per-route configuration helpers. App Page
  component-tree generation and Flight tree walking have one Cache Components
  and PPR path. The App Page runtime also treats PPR, Cache Components, and
  resume-data capture as unconditional. The response-cache boundary derives
  PPR behavior from the canonical route kind instead of a second boolean, and
  the renderer and incremental cache no longer accept a route-PPR toggle.
  Runtime-prefetch resume-cache installation is a directly testable renderer
  seam. `pnpm fork-test` and `pnpm fork-test-browser` define the early App
  Router contract allowlist. `fork-metrics.json` is the current scorecard,
  including static complexity, validation cost, and relevant runtime
  performance guardrails.
- **Constraints:** Backward compatibility is out of scope. Do not add migration
  layers or special removed-feature errors. Preserve only behavior in the fork
  contract. Keep each independently verified slice committed before starting
  the next one. Declare the primary improvement metric and behavior/performance
  guardrails before each slice, then regenerate `fork-metrics.json` and review
  its delta. Never reuse a stale measurement.
- **Product invariants:** App Router only, Cache Components always on, PPR as
  the rendering model, Partial Prefetching as the navigation model, Turbopack
  as the application compiler, and explicit platform adapter boundaries.
- **Next action:** Remove remaining App Page `isRoutePPREnabled` booleans from
  build and static-path protocols, then collapse the client to one segment-cache
  prefetch protocol.
- **Done Means:** Every `AGENTS.md` fork checklist item is completed or
  explicitly resolved out of scope; supported behaviors have proportionate
  tests; the core package builds; every slice records its simplification and
  performance metrics; each slice is committed; the worktree is clean; and no
  required follow-up is implicit.
- **Last verified:** 2026-07-27 on `feedthejim/simplify-next-rendering`.
  `pnpm --filter=next types`, the 19-test fast App Router allowlist,
  `pnpm --filter=next build`, 12 production Turbopack PPR partial-hydration
  assertions, and the Partial Prefetching navigation journey passed.

## History

### 2026-07-27: Canonical App Page render and cache semantics

Removed route-PPR toggles from renderer options, export rendering, and
incremental-cache read and write contexts. App Page export now always follows
PPR output rules, while the file cache derives page-data behavior from typed
cache kinds and values. Authored framework source fell by 54 lines and 1,801
bytes, App Router renderer source fell by five lines and 139 bytes,
route-PPR references fell by 22, and Cache Components references fell by one.
The warm built distribution fell by 38,149 bytes, including 8,729 JavaScript
bytes. Types passed in 14.97 seconds, the 19-test fast contract passed in 1.81
seconds, the core build passed in 22.57 seconds, and the targeted PPR journey
passed all 12 assertions in 24.98 seconds. The production server was ready in
73 milliseconds and the first browser load took 61 milliseconds. The Partial
Prefetching navigation journey also passed as a separate behavior guardrail.
Total validation fell by 17.51 seconds because this export-focused slice
recorded one browser journey instead of two, not because of a demonstrated
framework speed improvement. Comparable type, fast-test, and build timings
changed by no more than 0.26 seconds.

### 2026-07-27: Route-kind-derived response caching

Removed the independently configurable route-PPR boolean from the
route-module and response-cache protocols. Cache reads, writes, and
revalidation now derive PPR semantics from the canonical `RouteKind`, which
prevents adapters and callers from supplying contradictory route state. A
direct response-cache test was added to the fast contract and proves both App
Page and App Route mappings. Production source fell by 14 lines, but the
authored-framework score increased by 22 lines and 596 bytes because the
behavioral test added 36 net lines. Route-PPR references fell by 15. Built
JavaScript fell by 1,496 bytes; total distribution bytes increased by
1,481,912 because non-JavaScript build output churned. Types passed in 14.71
seconds, the expanded 19-test fast contract passed in 1.75 seconds, the core
build passed in 22.55 seconds, the PPR journey passed all 12 assertions in
27.13 seconds, and the converted navigation journey passed in 15.70 seconds.
The navigation fixture's production server was ready in 81 milliseconds and
its first browser load took 127 milliseconds. Total validation time increased
by 0.83 seconds, driven by 0.89 seconds of browser-run variation.

### 2026-07-27: Unconditional App Page runtime PPR

Deleted the App Page runtime's manifest-selected PPR mode, non-Cache
Components branches, legacy static-to-dynamic error, and conditional
resume-data capture. App Pages now pass PPR explicitly at the shared cache
boundary while Route Handlers retain their separate non-PPR contract. Authored
framework source fell by 93 lines and 4,538 bytes. Route-PPR references fell by
17 and Cache Components references fell by 11. The built JavaScript
observation was 9,849 bytes smaller; the total distribution observation was
not comparable because the previous snapshot included transient build output.
Types passed in 14.80 seconds, the 16-test fast contract passed in 1.85
seconds, the core build passed in 22.42 seconds, the 12-assertion PPR journey
passed in 26.30 seconds, and the converted one-assertion navigation journey
passed in 15.64 seconds. The navigation fixture's production server was ready
in 78 milliseconds and its first browser load took 250 milliseconds. All
single-run validation timings were slower than the prior slice by between 0.24
and 2.71 seconds, so they remain directional rather than evidence of a
regression.

### 2026-07-27: One Flight tree-walking model

Deleted legacy loading-boundary prefetch truncation and its shared-layout state
from the Flight tree walker. Added the existing Partial Prefetching cached
navigation journey to the selectable fork browser allowlist and removed its
obsolete feature flags. Authored framework and App Router renderer source each
fell by 83 lines and 3,496 bytes, and route-PPR references fell by one. Under
warm build conditions, the distribution observation was 60,672 bytes smaller,
including 12,722 JavaScript bytes, but the prior total snapshot was not
comparable. Types passed in 14.17 seconds, the 16-test fast contract passed in
1.61 seconds, the core build passed in 21.67 seconds,
the 12-assertion PPR journey passed in 24.92 seconds, and the one-assertion
navigation journey passed in 14.31 seconds. The production server was ready in
84 milliseconds and the first browser load took 105 milliseconds. A
navigation-only duration was not isolated. The fixture's TypeScript 6 package
currently misresolves generated `next/*.js` declarations, so the behavior
fixture skips application type errors while core framework types remain a
separate required gate.

### 2026-07-27: One App Page component-tree path

Deleted non-PPR static-generation bailouts, legacy loading-boundary prefetch
traversal, and non-Cache client prop construction from the App Page
component-tree producer. Authored framework and App Router renderer source each
fell by 129 lines and 5,605 bytes. Cache Components references fell by four and
route-PPR references fell by five. The prior artifact snapshot was not
comparable, so the 26,346 JavaScript-byte reduction is directional only. The
16-test fast allowlist passed in 1.76 seconds, types passed in 14.30 seconds,
the successful core build passed in 23.06 seconds, and all 12 production PPR
partial-hydration assertions passed in 24.06 seconds on the latest run. Earlier
browser observations were 30.98 and 27.19 seconds, so the timing remains
directional. The production server reported ready in 80 milliseconds and the
first browser load took 108 milliseconds. An initial core build hit the known
stopped-watcher output race before the clean retry.

### 2026-07-27: App Page route kind selects PPR

Deleted the final PPR configuration checker and its build and development
worker plumbing. App Pages now directly support PPR, while Route Handlers
remain outside that rendering path. Authored framework source fell by one file,
58 lines, and 2,231 bytes; the route-PPR reference proxy fell by one. The
distribution observation is non-comparable because watch-output churn removed
stale non-JavaScript artifacts; JavaScript was directionally 3,949 bytes
smaller. Types passed in 21.09 seconds, two focused static-parameter fallback
assertions plus the 16-test fast contract passed in 7.10 seconds, the core build
passed in 26.52 seconds, and all 12 production PPR partial-hydration assertions
passed in 24.44 seconds. The production server reported ready in 77
milliseconds and the first browser load took 58 milliseconds. Single-run
timing differences remain directional.

### 2026-07-27: Application PPR is unconditional

Removed the application-level PPR configuration checker and made its build,
runtime-template, environment, route-analysis, and server consumers explicit.
Also removed renderer gates that only existed for a non-PPR application.
Authored framework source fell by 78 lines and 3,051 bytes, App Router renderer
source fell by 36 lines and 1,226 bytes, route-PPR references fell by seven,
and the application-PPR proxy fell by one. Under matching warm core-build
conditions, the distribution fell by 36,742 bytes, including 10,091 JavaScript
bytes. The 16-test fast allowlist passed in 1.74 seconds, four focused static
path assertions passed, types passed in 14.42 seconds, the core build passed in
23.07 seconds, and all 12 production PPR partial-hydration assertions passed in
27.68 seconds including package preparation. The fixture's production server
reported ready in 79 milliseconds and the first browser load took 199
milliseconds. Other runtime metrics were not measured for this slice.

### 2026-07-27: Per-slice metrics discipline

Made the scorecard an explicit before-and-after gate for every simplification
slice. Each slice now declares a primary improvement metric plus behavior and
performance guardrails, records `null` instead of carrying stale observations,
and distinguishes comparable measurements from directional data. The collector
now has fields for CI-cost decomposition, runtime startup, PPR streaming,
Partial Prefetching navigation, response weight, and peak memory. This tooling
slice does not change framework source or runtime behavior.

### 2026-07-27: One Partial Prefetching renderer mode

Removed per-page prefetch-mode detection, the legacy speculative validation
pipeline, and false-mode Cache Components gates from RSC payload and prefetch
hint generation. Development validation and production rendering now share one
Partial Prefetching model. Authored framework and App Router renderer source
each fell by 155 lines and 5,773 bytes, and Cache Components references fell by 10. Under matching warm core-build conditions, the distribution fell by
111,994 bytes, including 30,514 JavaScript bytes. The 16-test fast allowlist
passed in 2.31 seconds, types passed in 18.45 seconds, the core build passed in
26.24 seconds, and all 12 production PPR partial-hydration assertions passed in
31.74 seconds including package preparation. These single-run timings were
1.44 to 2.97 seconds slower than the prior slice, so they remain directional
and should be repeated if the increase persists.

### 2026-07-27: One staged dynamic RSC path

Deleted the unreachable non-Cache-Components dynamic RSC renderer. Development
keeps its validation-aware staged renderer, while production uses the staged
renderer required by Partial Prefetching. Authored framework and App Router
renderer source each fell by 156 lines and 5,365 bytes, and Cache Components
references fell by 13. The built distribution was directionally 88,837 bytes
smaller, including 19,167 fewer JavaScript bytes, but the previous snapshot's
watch-build conditions make that comparison non-equivalent. The 16-test fast
allowlist passed in 2.30 seconds, types passed in 17.01 seconds, the core build
passed in 23.27 seconds, and all 12 production PPR partial-hydration assertions
passed in 29.72 seconds including package preparation.

### 2026-07-27: One prerender error-recovery path and test allowlist

Deleted the unreachable `prerender-legacy` App Router error-recovery pipeline
and made Cache Components recovery unconditional. Added explicit fast and
browser App Router allowlist commands covering rendering-state algorithms,
PPR hydration, resume caches, and HTTP fallback recovery. Authored framework
and App Router renderer source each fell by 131 lines and 4,574 bytes, while
Cache Components references fell by three. The fast allowlist passed 16 tests
in 1.48 seconds wall time. The targeted production Turbopack recovery journey
passed 16 tests and 14 snapshots in 39.65 seconds, while the resume-cache
journey passed five tests in 18.30 seconds. Together they took 57.95 seconds.
Type checking and the core package build passed.

### 2026-07-27: Direct runtime-prefetch cache seam

Extracted resume-cache installation from two renderer call sites and added a
0.17-second unit test proving that runtime prefetching preserves entries
restored from the static prerender. This intentionally adds one authored file,
24 framework lines, 730 bytes, and one unit-test file in exchange for testing
the producer-consumer cache contract without an isolated application build,
server, or browser. Type checking and the core package build pass.

### 2026-07-27: Cached navigation prerender defaults

Made cached navigation explicit in the base server, export worker, and bundled
environment, then removed false-mode handling from prerender stale-time and
Flight-data construction. Authored framework source fell by 18 lines and 692
bytes, App Router renderer source fell by 15 lines and 465 bytes, and Cache
Components references fell by one. Type checking, 26 focused unit tests, the
core package build, and all 12 production Turbopack PPR partial hydration
assertions pass. Build timing remained near 22 seconds. Dist size is marked
non-comparable because the required watcher left development artifacts before
the release build.

### 2026-07-27: One normal prerender path

Deleted the unreachable non-Cache-Components PPR and legacy static-generation
implementations from the normal App Router prerender pipeline. Render options
now state the always-on model directly, and runtime prefetch cache setup no
longer branches on removed configuration. Authored framework and App Router
source each fell by 367 lines and 16.5 KB. The clean built package fell by
311,771 bytes overall and 85,634 JavaScript bytes. Cache Components references
fell by three and route-PPR references fell by one. Type checking, the core
package build, 26 focused unit tests, and all 12 production Turbopack PPR
partial hydration assertions pass. The PPR fixture no longer opts into Cache
Components because it exercises the fork's default model.

### 2026-07-27: Single resume-cache wire format

Removed the Cache Components format parameter from postponed-state and resume
cache serialization. Non-prerenderable cache entries are now always omitted,
and the dual-mode test branches are gone. Authored framework source fell by 53
lines, App Router renderer source fell by 19 lines, and Cache Components
references fell by seven. All 12 focused serialization tests pass. Warm package
build observations settled near 22 seconds. Dist size is marked non-comparable
because a stopped watcher raced with clean output generation during this slice.

### 2026-07-27: Always-partial Flight router state

Removed Cache Components and Partial Prefetching mode parameters from Flight
router-state construction. The default segment strategy is now directly
`partial`, and missing runtime inlining hints always disable prefetching.
Authored framework and App Router renderer source each fell by 40 lines,
Cache Components references fell by 18, built JavaScript fell by 7,072 bytes,
and one fast unit test file replaced the need for browser coverage of this
decision. The first warm core-build observation was a 26.34-second outlier; an
immediate repeat took 20.23 seconds versus the 20.75-second baseline.

### 2026-07-27: Simplification scorecard

Added a reproducible metric snapshot covering source size, public configuration,
legacy mode references, dependencies, tests, built artifact size, and validation
timings. Every future slice updates the snapshot and reviews its delta.

### 2026-07-27: Rendering model configuration

Established the fork contract and made Cache Components, PPR, Partial
Prefetching, `use cache`, and cached navigation unconditional. Removed their
public configuration, environment opt-ins, migration errors, and the orphaned
hard-deprecation error type.
