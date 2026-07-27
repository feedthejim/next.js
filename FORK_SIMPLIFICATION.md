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
  pipeline now use one Cache Components and Partial Prefetching model.
  `fork-metrics.json` is the current scorecard.
- **Constraints:** Backward compatibility is out of scope. Do not add migration
  layers or special removed-feature errors. Preserve only behavior in the fork
  contract. Keep each independently verified slice committed before starting
  the next one. Regenerate `fork-metrics.json` and review its delta for every
  slice.
- **Product invariants:** App Router only, Cache Components always on, PPR as
  the rendering model, Partial Prefetching as the navigation model, Turbopack
  as the application compiler, and explicit platform adapter boundaries.
- **Next action:** Establish the first small App Router validation allowlist,
  convert a representative prerender assertion below the browser boundary, and
  then delete the renderer's legacy error-recovery prerender branch.
- **Done Means:** Every `AGENTS.md` fork checklist item is completed or
  explicitly resolved out of scope; supported behaviors have proportionate
  tests; the core package builds; every slice records its simplification and
  performance metrics; each slice is committed; the worktree is clean; and no
  required follow-up is implicit.
- **Last verified:** 2026-07-27 on `feedthejim/simplify-next-rendering`.
  `pnpm --filter=next types`, 12 focused postponed-state and resume-cache unit
  tests, and `pnpm --filter=next build` passed. The existing resume-data-cache
  E2E reached application type checking in 16.13 seconds but was blocked by
  missing `ResolvingMetadata` and `ResolvingViewport` exports in its isolated
  package, before the test body ran.

## History

### 2026-07-27: One normal prerender path

Deleted the unreachable non-Cache-Components PPR and legacy static-generation
implementations from the normal App Router prerender pipeline. Render options
now state the always-on model directly, and runtime prefetch cache setup no
longer branches on removed configuration. Authored framework and App Router
source each fell by 367 lines and 16.5 KB. The clean built package fell by
311,771 bytes overall and 85,634 JavaScript bytes. Cache Components references
fell by three and route-PPR references fell by one. Type checking, the core
package build, and all 12 focused serialization tests pass. The legacy E2E
attempt exposed an isolated-package type-export failure, which is now evidence
for the cheaper allowlist and test-conversion slice rather than a false product
pass.

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
