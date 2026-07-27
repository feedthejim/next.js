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
  application-level PPR is unconditional. Runtime-prefetch resume-cache
  installation is a directly testable renderer seam. `pnpm fork-test` and
  `pnpm fork-test-browser` define the early App Router contract allowlist.
  `fork-metrics.json` is the current scorecard, including static complexity,
  validation cost, and relevant runtime performance guardrails.
- **Constraints:** Backward compatibility is out of scope. Do not add migration
  layers or special removed-feature errors. Preserve only behavior in the fork
  contract. Keep each independently verified slice committed before starting
  the next one. Declare the primary improvement metric and behavior/performance
  guardrails before each slice, then regenerate `fork-metrics.json` and review
  its delta. Never reuse a stale measurement.
- **Product invariants:** App Router only, Cache Components always on, PPR as
  the rendering model, Partial Prefetching as the navigation model, Turbopack
  as the application compiler, and explicit platform adapter boundaries.
- **Next action:** Delete route-level incremental and disabled PPR
  configuration, then collapse the client to one segment-cache prefetch
  protocol.
- **Done Means:** Every `AGENTS.md` fork checklist item is completed or
  explicitly resolved out of scope; supported behaviors have proportionate
  tests; the core package builds; every slice records its simplification and
  performance metrics; each slice is committed; the worktree is clean; and no
  required follow-up is implicit.
- **Last verified:** 2026-07-27 on `feedthejim/simplify-next-rendering`.
  `pnpm --filter=next types`, the 16-test fast App Router allowlist,
  `pnpm --filter=next build`, and 12 production Turbopack PPR partial-hydration
  assertions passed.

## History

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
