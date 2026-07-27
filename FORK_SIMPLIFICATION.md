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
  Static-path generation and build manifests likewise derive App Page behavior
  from route identity rather than worker-provided PPR state. `BaseServer`
  recognizes App Page resume requests directly and no longer interprets
  manifest rendering modes as a runtime feature switch. Imperative
  `router.prefetch()` and declarative App Router links now expose only the
  fork's Partial Prefetching protocol. The public full-prefetch intent, its
  dynamic-on-hover upgrade, and its dedicated warning and overlay path are
  absent. The client cache and scheduler no longer contain a Full strategy,
  task-level strategy selection, BFCache-as-prefetch behavior, or the
  incremental dynamic-prefetch stream.
  The client route prefetch protocol now assumes every supported route emits
  the Cache Components tree format. The non-PPR response decoder,
  loading-boundary scheduler traversal, and LoadingBoundary fetch strategy are
  absent. The route cache, optimistic matcher, navigation response, and RSC
  wire payload no longer carry a per-segment prefetch capability bit. The
  client hydration, navigation response, segment cache, route-state Activity,
  instant-validation, and development diagnostics paths no longer branch on
  Cache Components, cached-navigation, or legacy PPR environment flags. The
  server runtime and build-time define map no longer expose those rendering
  mode switches either. Node-only image caching and instant-validation modules
  are selected through explicit runtime capabilities. The retained navigation
  journey covers both imperative prefetch and the default
  declarative Link path. Routes-manifest generation now emits one PPR and RSC
  contract across the build, analyze, and adapter-completion entry points. App
  static-path generation no longer receives a Cache Components mode from
  production or development workers, and always computes static-shell
  metadata. App Route build templates and export workers likewise carry no
  Cache Components mode, and Route Handler static generation has one staged
  prerender algorithm. Development HMR now classifies every request-ID socket
  as an App Router client and reserves legacy broadcasts for the remaining
  no-ID Pages Router clients. Cache status delivery and router-server
  registration no longer depend on a Cache Components configuration value.
  Render-server initialization and startup reporting no longer transport that
  value either: development and build startup report the product invariant
  directly. App render options and work stores likewise carry no Cache
  Components mode field. App development requests always compute the
  most-specific fallback-param set, and export always uses the staged
  static-shell partition. The development warmup suite now has one Partial
  Prefetching model across four fixture and load-mode entry points instead of
  an eight-file on/off matrix.
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
- **Next action:** Move mixed static and fallback param selection into a cheap
  request-layer contract, then delete its stale warmup browser routes and
  assertions.
- **Done Means:** Every `AGENTS.md` fork checklist item is completed or
  explicitly resolved out of scope; supported behaviors have proportionate
  tests; the core package builds; every slice records its simplification and
  performance metrics; each slice is committed; the worktree is clean; and no
  required follow-up is implicit.
- **Last verified:** 2026-07-27 on `feedthejim/simplify-next-rendering`.
  `pnpm --filter=next types`, the 19-test fast App Router allowlist, 108 focused
  dev-overlay assertions, `pnpm --filter=next build`, the 34-assertion
  production Turbopack runtime pack, the retained navigation journey, all 12
  PPR partial-hydration assertions, the transition-instrumentation journey, and
  two focused Turbopack Fast Refresh assertions passed. The focused Turbopack
  development startup fixture also passed all three cache, deduplication, and
  revalidation assertions.

## History

### 2026-07-27: One development warmup matrix

Deleted the four duplicate development warmup entry points for Partial
Prefetching off. The four retained files now represent only the meaningful
fixture and load-mode dimensions. Their shared utility no longer reads an
environment switch, branches static-param expectations by prefetch mode, or
keeps a no-runtime-prefetch sync-I/O expectation.

Across the four scorecard dimensions:

- **Maintainability:** One mode dimension, one environment switch, and two
  expectation branches are gone from the development warmup suite.
- **Leanness:** Total test files fell from 1,863 to 1,859, and development test
  files fell from 296 to 292. Framework source, dependencies, and the warm
  release distribution were unchanged.
- **Runtime performance:** The retained Turbopack navigation and initial-load
  fixtures reached ready state in 295 and 274 milliseconds. One fully covered
  dynamic-param browser assertion passed in each entry point. This test-only
  slice does not change framework runtime code.
- **Iteration efficiency:** Types passed in 13.95 seconds, the 19-test fast
  allowlist in 1.79 seconds, the two focused browser assertions in 20.86
  seconds with a 19.71-second Jest body, and the core build in 22.04 seconds.
  Total measured validation cost was 58.64 seconds.

### 2026-07-27: One render work-store mode

Removed the Cache Components boolean from App render options, every render
producer, App Route contexts, and the work-store shape. The corresponding
work-store status field had no consumer and is gone. `BaseServer` now always
computes per-URL fallback params for App routes, and export always partitions
static shells into the staged initial and final phases. Three retained
development fixtures also stopped declaring the removed public option.

Across the four scorecard dimensions:

- **Maintainability:** Cache Components references fell from 102 to 88.
  Fourteen framework modules no longer transport or interpret the render mode,
  and export has one path-partition algorithm instead of a true/false split.
- **Leanness:** Authored framework source fell by 27 lines and 941 bytes. The
  final warm release distribution fell by 12,061 bytes overall and 3,410
  JavaScript bytes. Test and dependency counts were unchanged.
- **Runtime performance:** The production Turbopack Route Handler fixture was
  ready in 75 milliseconds, served its first cached request in 87
  milliseconds, and completed revalidation in 229 milliseconds. These are
  directional warm-local observations.
- **Iteration efficiency:** Types passed in 13.72 seconds, the 19-test fast
  allowlist in 1.93 seconds, 16 direct tracer assertions in 1.15 seconds, the
  three-assertion production fixture in 20.62 seconds with a 19.45-second Jest
  body, and the final core build in 21.97 seconds. The initial and final core
  builds plus productive validation cost 80.43 seconds. Investigation of two
  stale development fallback suites added 75.62 measured seconds; two
  one-case diagnostics were not timed, so the 156.05-second measured total is
  a lower bound.

The fallback investigation showed that `BaseServer` selects the correct
most-specific route and fallback set, and temporarily restoring the deleted
work-store field did not change the result. The warmup suite still labels two
partially covered cases as `Server` instead of its old `Prerender` and
`Prefetch` expectations, while the fully covered case passes. The fallback
validation suite no longer opens its expected blocking redbox. These are
pre-existing always-on-model test drift, not effects of the removed field.
They remain the explicit next test-simplification slice rather than being
silently accepted.

### 2026-07-27: Cache Components is a startup invariant

Removed the Cache Components boolean from router-server options,
render-server initialization and results, start-server consumption, and the
shared build and development feature logger. The logger now reports Cache
Components directly as part of the framework identity instead of interpreting
a transported configuration value.

Across the four scorecard dimensions:

- **Maintainability:** Cache Components references fell from 114 to 102. Five
  startup modules no longer share a boolean whose only consumer was a
  conditional log line.
- **Leanness:** Authored framework source fell by 12 lines and 358 bytes. The
  warm built distribution fell by 1,842 bytes overall and 536 JavaScript
  bytes. Test and dependency counts were unchanged.
- **Runtime performance:** The focused Turbopack development fixture reached
  ready state in 338 milliseconds on its first isolated startup and 190
  milliseconds after its deliberate restart. These are directional warm-local
  observations.
- **Iteration efficiency:** Types passed in 14.28 seconds, the 19-test fast
  allowlist in 1.76 seconds, the core build in 21.25 seconds, and the compiled
  logger assertion in 60 milliseconds. The three-assertion development fixture
  passed in 15.62 seconds with a 14.53-second Jest body. Total measured
  validation cost was 52.97 seconds.

### 2026-07-27: One App Router HMR client classification

Removed Cache Components mode checks from Turbopack socket registration and
the shared development HMR broadcast boundary. Every client carrying an HTML
request ID now follows the App Router protocol, receives cached status, and is
never included in legacy broadcasts. Only no-ID Pages Router clients remain on
the legacy protocol. Router-server initialization also registers cache status
delivery unconditionally and passes the invariant into the remaining startup
plumbing.

Across the four scorecard dimensions:

- **Maintainability:** Cache Components references fell from 120 to 114. App
  Router sockets now have one classification and one cache-status path, while
  legacy HMR has one explicit client set instead of a configuration-dependent
  union.
- **Leanness:** Authored framework source fell by 30 lines and 1,409 bytes. The
  warm built distribution fell by 7,565 bytes overall and 3,412 JavaScript
  bytes. Test and dependency counts were unchanged.
- **Runtime performance:** Two focused Turbopack Fast Refresh browser
  assertions completed refresh in 40 and 37 milliseconds, for a measured
  maximum of 40 milliseconds. These are directional warm-local observations.
- **Iteration efficiency:** Types passed in 13.72 seconds, the 19-test fast
  allowlist in 1.90 seconds, the core build in 21.17 seconds, and the focused
  Turbopack HMR file in 18.71 seconds with a 17.64-second Jest body. The HMR
  name filter exercised both the normal render and `after()` behavior, for two
  browser assertions. Total measured validation cost was 55.50 seconds.

### 2026-07-27: One App Route prerender algorithm

Removed Cache Components mode plumbing from App Route build templates, export
workers, Node and Edge handler contexts, and request execution. App Route
execution now normalizes the invariant once when creating its work store and
uses only the staged prospective and final prerender algorithm. The legacy
prerender store branch and the pre-Cache-Components export bailout are gone.
The retained Route Handler fixture no longer declares the removed public
configuration option.

Across the four scorecard dimensions:

- **Maintainability:** Cache Components references fell from 128 to 120. App
  Route producers no longer transport a mode, and the execution consumer has
  one prerender algorithm instead of a staged-versus-legacy branch.
- **Leanness:** Authored framework source fell by 46 lines and 2,197 bytes. The
  warm built distribution fell by 24,855 bytes overall and 7,927 JavaScript
  bytes. Test and dependency counts were unchanged.
- **Runtime performance:** The clean HTTP fixture passed cache fill,
  concurrent deduplication, and revalidation without a browser. Its production
  server was ready in 76 milliseconds, the first cached Route Handler request
  took 85 milliseconds, and revalidation took 224 milliseconds. These are
  directional local observations.
- **Iteration efficiency:** Types passed in 13.85 seconds, the 19-test fast
  allowlist in 1.80 seconds, the core build in 21.87 seconds, and the final
  three-assertion HTTP fixture in 15.00 seconds with a 13.59-second test body.
  The first 21.00-second fixture run exposed the obsolete config warning and
  prompted its deletion. Final productive validation took 52.53 seconds;
  total measured iteration cost was 73.53 seconds.

### 2026-07-27: One App static-path mode

Removed the Cache Components boolean from production static analysis,
development static-path workers, and `buildAppStaticPaths`. App static-path
generation now creates one work-store shape and always assigns PPR shell
metadata. The obsolete false-mode fallback omission and Cache Components
feature-usage telemetry entry are gone.

Across the four scorecard dimensions:

- **Maintainability:** Cache Components references fell from 148 to 128. One
  mode value and its production and development transport paths were removed
  from the static-path producer-consumer seam.
- **Leanness:** Authored framework source fell by 42 lines and 1,763 bytes. The
  warm built distribution fell by 8,829 bytes overall and 3,556 JavaScript
  bytes. Test and dependency counts were unchanged.
- **Runtime performance:** All 12 retained PPR partial-hydration assertions
  passed. The production server was ready in 76 milliseconds and the first
  browser load took 131 milliseconds. The comparable prior run reported 73
  and 61 milliseconds respectively, so this single local observation is
  directional and not a performance claim.
- **Iteration efficiency:** Types passed in 13.94 seconds, 84 direct
  static-path assertions in 3.41 seconds, the 19-test fast allowlist in 1.79
  seconds, the core build in 22.03 seconds, and the PPR browser journey in
  26.00 seconds with an 18.41-second test body. Productive validation took
  67.17 seconds. A mistakenly broad `pnpm test-unit <path>` attempt was stopped
  after 61.86 seconds because that script ignores trailing path filters. Total
  measured iteration cost was therefore 129.03 seconds, and `AGENTS.md` now
  records the direct `pnpm jest <path>` command.

### 2026-07-27: One routes-manifest rendering contract

Removed the final `isAppPPREnabled` helper and its build, analysis, and adapter
call-site arguments. Routes-manifest generation now unconditionally emits the
fork's client parameter parsing, dynamic RSC prerender, and resume-chain
contract.

Across the four scorecard dimensions:

- **Maintainability:** Application-PPR helper references fell from seven to
  zero. Cache Components references fell from 151 to 148 because the manifest
  no longer derives fixed protocol fields from configuration.
- **Leanness:** Authored framework source fell by seven lines and 302 bytes.
  The warm built distribution fell by 1,653 bytes overall and 524 JavaScript
  bytes. Test and dependency counts were unchanged.
- **Runtime performance:** The retained navigation and PPR journeys passed all
  13 assertions. The navigation server was ready in 151 milliseconds and its
  first browser load took 88 milliseconds. These are directional local
  observations.
- **Iteration efficiency:** Types passed in 14.11 seconds, the 19-test fast
  allowlist in 2.46 seconds, the core build in 26.78 seconds, and the two
  browser journeys in 32.08 seconds. Total measured validation took 75.43
  seconds.

### 2026-07-27: No rendering-mode environment switches

Removed the final Cache Components, cached-navigation, and legacy PPR
environment checks and stopped emitting those obsolete constants into
application bundles. Server request validation, patched fetch behavior,
logging, edge route context, module instrumentation, instant validation, and
image rendering now follow the fork's one rendering model. The Node-only image
cache is loaded only during a prerender and remains inside a DCE-safe runtime
capability branch.

Across the four scorecard dimensions:

- **Maintainability:** Cache Components environment references fell from nine
  to zero, and the final PPR and cached-navigation environment references also
  fell to zero. The framework no longer defines or consumes rendering-mode
  environment switches.
- **Leanness:** Authored framework source fell by 24 lines and 1,151 bytes.
  The App Router renderer accounts for six lines and 99 bytes. The warm built
  distribution fell by 8,746 bytes overall and 2,576 JavaScript bytes. Test
  and dependency counts were unchanged.
- **Runtime performance:** The retained navigation and PPR journeys passed all
  13 assertions. The navigation server was ready in 144 milliseconds and its
  first browser load took 89 milliseconds. Startup was 68 milliseconds slower
  than the preceding single run, while first load was three milliseconds
  slower. An isolated production Edge middleware server was ready in 76
  milliseconds and generated a 4,712-byte image in 116 milliseconds. These are
  directional local observations.
- **Iteration efficiency:** Types passed in 14.31 seconds, the 19-test fast
  allowlist in 1.80 seconds, the final core build in 22.16 seconds, five focused
  fetch and image-response units in 1.33 seconds, and the two browser journeys
  in 33.57 seconds. The prescribed legacy webpack edge fixture exited after
  8.12 seconds because its application-selected Edge Runtime is intentionally
  incompatible with the fork's always-on Cache Components contract, before it
  could exercise DCE. A 3.45-second isolated webpack build then confirmed that
  the supported Edge middleware bundle excluded the Node-only cache module.
  Total measured iteration cost, including the out-of-contract attempt and
  runtime check, was 84.93 seconds.

### 2026-07-27: One always-on client runtime

Constant-folded Cache Components and cached navigation throughout client
hydration, response decoding, segment-cache extraction, route-state
preservation, navigation hooks, and development diagnostics. Flight responses
now always strip the partial marker and expose static and shell clones, initial
hydration always retains its cache stream, and inactive route trees always use
React Activity preservation.

Across the four scorecard dimensions:

- **Maintainability:** Client references to the Cache Components,
  cached-navigation, and legacy PPR environment switches fell from 21 to zero.
  Response cache data is no longer nullable and the client has one hydration
  and navigation protocol.
- **Leanness:** Authored framework source fell by 130 lines and 6,125 bytes.
  The client-router subset accounts for 94 lines and 5,099 bytes. The warm
  built distribution fell by 86,353 bytes overall and 17,952 JavaScript bytes.
  Test and dependency counts were unchanged.
- **Runtime performance:** All 34 retained production browser assertions and
  14 snapshots passed. The navigation fixture's server was ready in 76
  milliseconds and its first browser load took 86 milliseconds. Navigation
  latency, response bytes, and peak memory were not measured.
- **Iteration efficiency:** Types passed in 14.16 seconds, the 19-test fast
  allowlist in 1.80 seconds, the core build in 22.68 seconds, the complete
  browser allowlist in 86.94 seconds, and 176 focused development-overlay
  assertions in 2.13 seconds. Total measured validation took 127.71 seconds.

### 2026-07-27: No per-route prefetch capability bit

Removed `supportsPerSegmentPrefetching` from the RSC wire payload, navigation
response, route-cache entry shape, and optimistic-route trie. Every supported
route already uses the PPR segment protocol, so the bit could no longer change
client behavior.

Across the four scorecard dimensions:

- **Maintainability:** Capability references fell from 32 to zero. Ten files no
  longer thread a server-derived boolean through navigation and route
  discovery.
- **Leanness:** Authored framework source fell by 50 lines and 1,994 bytes.
  Client-router source accounts for 40 lines and 1,683 bytes of that reduction.
  The warm built distribution fell by 34,295 bytes overall and 8,388
  JavaScript bytes. Test and dependency counts were unchanged.
- **Runtime performance:** The retained navigation and PPR journeys passed all
  13 assertions. The navigation fixture's server was ready in 75 milliseconds
  and its first browser load took 180 milliseconds. These are directional
  single-run observations.
- **Iteration efficiency:** Types passed in 15.08 seconds, the 19-test fast
  allowlist in 1.75 seconds, the core build in 23.42 seconds, and the two
  focused browser journeys in 38.38 seconds. Total focused validation,
  including lint, took about 80.13 seconds.

### 2026-07-27: One PPR route prefetch protocol

Removed the PPR-disabled route response decoder, LoadingBoundary fetch
strategy, route capability selection, scheduler traversal, request encoding,
and cache population path. The client now decodes every supported route as a
Cache Components tree and schedules its static and runtime segments through
one PPR protocol. The retained production navigation journey now exercises
both imperative `router.prefetch()` and a default declarative Link, proving
that each receives cached shell content without eagerly fetching dynamic
content.

Across the four scorecard dimensions:

- **Maintainability:** `FetchStrategy.LoadingBoundary` references fell to zero.
  Route scheduling no longer branches between PPR and loading-boundary
  protocols.
- **Leanness:** Authored framework and client-router source fell by 526 lines
  and 21,141 bytes. Test-file and dependency counts were unchanged because the
  declarative guardrail reuses the existing navigation fixture. The current
  `dist` tree is 180,840,647 bytes, including 76,369,965 JavaScript bytes, but
  its lifecycle is not comparable with the preceding snapshot.
- **Runtime performance:** All 34 retained production browser assertions
  passed. In the scorecard's focused navigation run, the server was ready in
  78 milliseconds and its first browser load took 87 milliseconds. Navigation
  latency, response bytes, and peak memory were not measured.
- **Iteration efficiency:** Types passed in 13.89 seconds, the 19-test fast
  allowlist in 1.82 seconds, the core build in 22.18 seconds, and the focused
  navigation and PPR browser journeys in 37.22 seconds. Total validation,
  including focused lint, took 76.86 seconds. These single local measurements
  are directional, not regression claims.

### 2026-07-27: No internal Full prefetch protocol

Removed the final `FetchStrategy.Full` state and the task-level strategy field
that threaded a now-unselectable mode through Link, Form, `router.prefetch`,
the scheduler, cache keys, and testing locks. Runtime prefetching remains
derived from server hints inside a PPR task. Full-only BFCache reuse,
incremental dynamic-prefetch streaming, request headers, cache-key exceptions,
and revalidation branches were deleted. Loading-boundary head requests use the
cacheable runtime protocol until the next slice removes LoadingBoundary.

Across the four scorecard dimensions:

- **Maintainability:** `FetchStrategy.Full` references fell from 24 to zero.
  Prefetch tasks no longer carry a selectable strategy, and their callers no
  longer pass one.
- **Leanness:** Authored framework source fell by 428 lines and 17,251 bytes.
  Client-router source accounts for 384 lines and 15,899 bytes of that
  reduction. Test and dependency counts were unchanged. The current `dist`
  tree is 166,491,306 bytes, including 75,936,866 JavaScript bytes, but its
  lifecycle differs from the previous snapshot, so the artifact delta is
  non-comparable.
- **Runtime performance:** The retained navigation journey passed with a
  77-millisecond production startup, down 19 milliseconds from the preceding
  single run. Initial browser load rose from 93 to 189 milliseconds and the
  assertion body rose from 546 to 806 milliseconds. These are directional
  local observations, not regression claims. Navigation latency, response
  bytes, and peak memory were not measured.
- **Iteration efficiency:** Types passed in 14.18 seconds, the 19-test fast
  allowlist in 1.82 seconds, the core build in 21.98 seconds, the navigation
  journey in 16.13 seconds, and the 12-assertion PPR journey in 23.66 seconds.
  The 79.87-second validation total includes lint and both browser journeys, so
  its scope is broader than the preceding slice.

### 2026-07-27: One declarative Link prefetch protocol

Removed `prefetch={true}`, `unstable_dynamicOnHover`, the `'full'` transition
intent, and the dedicated full-prefetch warning from App Router links. The
warning's route-tree hint, parser, overlay guidance, icons, and 11-file
development fixture were also removed because they no longer had a producer.
The seven-file dynamic-on-hover fixture and its Rspack manifest entries were
removed with that API.
The top-level `next/jest` shim now accepts both intermediate and normalized
compiled export shapes, eliminating an isolated-package bootstrap race exposed
by the retained browser journey.

Across the four scorecard dimensions:

- **Maintainability:** App Router links now have one enabled prefetch intent and
  one public protocol. `FetchStrategy.Full` references fell from 29 to 24, and
  Cache Components environment checks fell from 29 to 26.
- **Leanness:** Authored framework source fell by 377 lines and 13,927 bytes;
  client-router source fell by 48 lines and 2,179 bytes; and the test inventory
  fell by one development and one end-to-end test file. The rebuilt `dist` tree
  is 181,462,033 bytes, including 76,500,372 JavaScript bytes, but the previous
  artifact was not built under comparable conditions.
- **Runtime performance:** The retained production navigation journey passed
  with a 96-millisecond server startup and 93-millisecond first browser load.
  Startup was 17 milliseconds slower than the preceding single run and first
  load was unchanged, both directional local measurements. Navigation latency,
  response bytes, and peak memory were not measured.
- **Iteration efficiency:** Types passed in 14.03 seconds, the 19-test fast
  allowlist in 1.92 seconds, the core build in 22.59 seconds, and the retained
  navigation journey in 14.95 seconds. The affected 108-unit assertion run and
  transition-instrumentation journey also passed. The 85.39-second complete
  validation total includes those extra checks and is not comparable to the
  preceding narrower validation.

### 2026-07-27: Four-dimensional slice scorecard

Strengthened the repository metrics gate so every committed slice reports
maintainability, leanness, runtime performance, and iteration efficiency.
Unchanged, unaffected, and unmeasured dimensions must now be explicit, which
prevents source deletion alone from standing in for a framework improvement.
This governance-only slice does not change framework source, built output, or
runtime behavior. Performance and validation timings were not rerun. The
existing, unreconstructed `dist` tree differed by six bytes, so that artifact
measurement is non-comparable.

### 2026-07-27: One imperative prefetch protocol

Removed the public `PrefetchKind` mode and made `router.prefetch()` always use
the Partial Prefetching strategy. The retained navigation journey now proves
that imperative prefetching includes cached shell content, defers dynamic
content, and completes the navigation. Authored framework source fell by 43
lines and 1,383 bytes; exact `PrefetchKind` references fell from nine to zero,
and `FetchStrategy.Full` references fell from 30 to 29. The client-router
scorecard now includes the actual `components/segment-cache` directory, so its
size increase is a baseline correction rather than source growth. Built output
is not comparable because transient compiled artifacts changed. Types passed
in 14.41 seconds, the 19-test fast contract passed in 1.64 seconds, the core
build passed in 22.66 seconds, and the navigation journey passed in 14.76
seconds. Its production server was ready in 79 milliseconds and first browser
load took 93 milliseconds.

### 2026-07-27: App Page resume routing without PPR mode checks

Removed the final route-PPR feature-mode references and the duplicate
application-PPR field from `BaseServer`. App Page identity now directly gates
postponed request metadata and resume POST handling, without consulting
prerender-manifest rendering modes or legacy debug/test exceptions. The
committed scorecard fell by 85 authored lines and 3,152 bytes; the bounded
`BaseServer` diff itself removed 49 net lines. Route-PPR references fell from
two to zero and application-PPR references fell from 15 to seven. The warm
built distribution fell by 20,667 bytes, including 6,909 JavaScript bytes.
Types passed in 16.99 seconds, the 19-test fast contract passed in 1.97
seconds, the combined PPR and navigation browser run passed all 13 assertions
in 34.99 seconds, and the core build passed in 22.82 seconds. The navigation
fixture's production server was ready in 88 milliseconds and its first browser
load took 136 milliseconds. A broader post-commit pack also passed all 34 PPR,
resume-cache, HTTP fallback-recovery, and navigation assertions in 74.90
seconds; the scorecard keeps the comparable two-journey timing. Type and build
time were 2.34 and 0.89 seconds slower than the prior observation; total
validation is not comparable because this slice restored two browser journeys
after an algorithm-only slice.

### 2026-07-27: Route-kind-derived static paths and build output

Removed route-PPR state from static-path inputs, worker results, export-map
configuration, page summaries, and build-manifest assembly. Static-path
generation now derives partial-param behavior from the route module, and the
build uses App Page identity as its canonical discriminator. Authored framework
source fell by 26 lines and 1,045 bytes, while route-PPR references fell from
57 to two. The warm built distribution fell by 2,790 bytes, including 1,014
JavaScript bytes. All 84 static-path algorithm assertions passed in 3.46
seconds, the 19-test fast contract passed in 1.91 seconds, types passed in
14.65 seconds, and the core build passed in 21.93 seconds. No browser or
runtime metric was collected because this slice changed the static-path
decision and build protocol, both covered directly below the browser boundary.
The 22.38-second reduction in recorded validation time is therefore a test
selection difference, not a framework performance claim.

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
