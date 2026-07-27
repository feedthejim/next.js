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
  Components mode field. App development requests select the most-specific
  fallback-param set through a directly tested request-layer contract, and
  export always uses the staged static-shell partition. The development warmup
  suite now has one Partial Prefetching model across four fixture and load-mode
  entry points instead of an eight-file on/off matrix, and no longer provisions
  mixed-param routes to retest the request-layer selection algorithm in a
  browser. The separate 19-file fallback-validation browser application is
  gone; fallback specificity lives in the fast request contract, while the
  retained generic development error suite owns the user-visible Blocking
  Route diagnostic. Normalized and serialized runtime config no longer carries
  an always-true Cache Components field. Compiler export conditions and the
  remaining webpack HMR client classification consume the invariant directly.
  `"use cache"`, `cacheLife()`, and `cacheTag()` likewise have no enable flag:
  JavaScript and Turbopack compiler options, resolver conditions, and runtime
  APIs all consume the product invariant directly. The JavaScript-to-Rust
  compiler contract no longer carries Cache Components or use-cache booleans.
  The RSC transform has one route-config policy, Server Actions always compile
  `"use cache"`, and the remaining supported `instant` export is accepted
  without a feature gate. App Router entries now have one Node.js module
  context: `export const runtime` is absent from the App segment schema,
  static-info contract, inherited layout configuration, TypeScript language
  service, and generated entry validation. Turbopack no longer constructs the
  App Page, Route Handler, or metadata Edge entry wrappers. Three browser E2E
  suites and their applications that only exercised removed route-config and
  Edge-error modes are gone; direct compiler fixtures now cover unsupported
  exports in both page and Route Handler entry files. App endpoint output now
  has one Node.js chunking, manifest, tracing, and output-path implementation:
  the Edge output variant and its middleware-manifest packaging are gone. The
  separate Edge SSR transition remains only as a shared compiler capability
  for Edge middleware and instrumentation while those products remain.
  Runtime-prefetch resume-cache installation is a directly testable renderer
  seam. `pnpm fork-test` and `pnpm fork-test-browser` define the early App
  Router contract allowlist. App routes have one dynamic-parameter model:
  `generateStaticParams` seeds known paths, while other values use the
  canonical App Page partial fallback or App Route blocking fallback. The
  inherited `dynamicParams` mode and its special build errors are absent.
  App rendering also has no `dynamic` route-config mode. Request data now
  follows the canonical Cache Components tracking path without force-dynamic,
  force-static, dynamic-error work-store state, request-data shims, or
  configuration-driven postponement. Mode-only suites and the fully skipped
  legacy `ppr-full` application are absent, while remaining semantic test debt
  is measured explicitly. Fetch caching also has no route-level mode:
  `fetch()` cache options, `next.revalidate`, and Cache Components APIs are the
  supported controls. The App segment schema, compiler contract, work store,
  static-path generator, Route Handler runtime, language service, and
  generated types no longer transport `fetchCache`. The internal incremental
  cache entry discriminator remains a separate implementation concept.
  Route-level `revalidate` is absent from the same segment, compiler, build,
  renderer, Route Handler, type-generation, and language-service surfaces.
  Explicit per-fetch `next.revalidate`, Cache Components lifetimes, tags, and
  Server Action invalidation remain the caching model. The App renderer,
  Server Actions, resume-data cache, incremental-cache integration, and App
  Route compiled-module dispatcher now have one Node.js implementation. Their
  Edge request, stream, compression, manifest, module-map, and runtime-selection
  branches are absent.
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
- **Next action:** Delete the unreachable App Edge webpack entry chain. Keep
  the shared Edge compiler transition until Proxy/middleware and
  instrumentation have an explicit platform policy. Then remove
  `experimental_ppr`.
- **Done Means:** Every `AGENTS.md` fork checklist item is completed or
  explicitly resolved out of scope; supported behaviors have proportionate
  tests; the core package builds; every slice records its simplification and
  performance metrics; each slice is committed; the worktree is clean; and no
  required follow-up is implicit.
- **Last verified:** 2026-07-27 on `feedthejim/simplify-next-rendering`.
  The Node-only App renderer has no scoped Edge runtime or module-map
  references. Core types, 37 direct cache and action assertions, the 56-test
  fast contract, the core release build, and 19 production browser assertions
  passed. The browser contract covers PPR shell hydration, resume-cache
  restoration, Server Action rerenders and invalidation, and Partial
  Prefetching navigation.

## History

### 2026-07-27: One Node-only App renderer

Removed the Edge request, Web Stream, compression, manifest, module-map, and
runtime-selection branches from the App renderer, Server Action handler,
resume-data cache, incremental-cache integration, use-cache wrapper, and App
Route compiled-module dispatcher. These paths now directly use the Node.js
request, stream, zlib, filesystem, and RSC implementations required by the
fork's only App runtime.

This does not remove the shared Edge compiler transition. Middleware and
instrumentation still consume that transition and require an explicit platform
policy before it can be deleted. Pages Router Edge machinery is also deferred
to the Pages Router removal.

Across the four scorecard dimensions:

- **Maintainability:** Scoped App-renderer Edge runtime, request, and module-map
  references fell from 65 to zero. The renderer and its adjacent cache and
  action subsystems no longer maintain parallel Node and Edge algorithms.
- **Leanness:** Authored framework source fell by 359 lines and 15,386 bytes,
  including 318 lines and 13,865 bytes under `server/app-render`. The comparable
  core distribution fell by 239,195 bytes overall and 43,886 JavaScript bytes.
  Rust, test-suite, and dependency counts were unchanged.
- **Runtime performance:** The three retained production fixtures were ready in
  at most 94 milliseconds. Partial Prefetching runtime caching completed in
  611 milliseconds. PPR hydration, resume-cache restoration, and Server Action
  invalidation also passed. These are warm-local guardrails, not improvement
  claims.
- **Iteration efficiency:** Three faster agents removed disjoint renderer,
  action, and cache surfaces concurrently; validation remained centralized.
  Types took 13.73 seconds, 37 direct assertions took 1.51 seconds, and the
  56-test fast contract took 1.77 seconds. The core release took 31.65 seconds,
  and the 19-assertion browser selection took 62.58 seconds with a 55.44-second
  Jest body. The successful validation path totaled 111.24 seconds.

### 2026-07-27: Cache lifetimes without route-level revalidate

Removed App Router route-level `revalidate` from the JavaScript and Rust
segment schemas, compiler endpoint contract, build reduction, static route
classification, component-tree prerender state, Route Handler userland and
static-generation defaults, generated entry types, and TypeScript language
service. App Route static generation now starts from the canonical infinite
cache default and can only be narrowed by explicit fetch or Cache Components
behavior. Removed the special configuration errors and the helper whose only
purpose was treating route config as a static-generation switch.

Removed 104 numeric or false App fixture exports while retaining the two
Pages API exports outside this slice. Deleted mode-only rendering, invalid
config, Cache Components error, and type-generation assertions. Existing
fixtures that still mention revalidation now exercise supported explicit
fetch, `unstable_cache`, cache lifetime, tag, Route Handler, or Server Action
behavior.

Across the four scorecard dimensions:

- **Maintainability:** Exact implementation references fell from 17 to zero
  and App fixture exports from 104 to zero. Residual semantic test names fell
  from 515 to 387; these are a visible naming and matrix-pruning queue, not a
  supported route configuration.
- **Leanness:** Authored framework source fell by one file, 136 lines, and
  5,228 bytes. Tracked Rust compiler source fell by 51 lines and 1,802 bytes.
  The comparable core distribution fell by 476,275 bytes overall and 25,464
  JavaScript bytes. Test-suite and dependency counts were unchanged.
- **Runtime performance:** The retained production fixtures were ready in 96
  to 101 milliseconds. Explicit fetch-cache consistency completed in 598
  milliseconds, fetch-cache Server Action invalidation in 649 milliseconds,
  and Partial Prefetching runtime caching in 920 milliseconds. These are
  warm-local guardrails, not improvement claims.
- **Iteration efficiency:** Three faster agents removed disjoint JavaScript,
  Rust, and test surfaces concurrently; validation remained centralized.
  Types took 17.35 seconds, five JavaScript plus 30 Rust diagnostic assertions
  took 6.10 seconds, and the 56-test fast contract took 1.79 seconds. The full
  bootstrap took 70.59 seconds including a 53.94-second native build, the core
  release took 26.48 seconds, and the seven-assertion browser selection took
  42.50 seconds with a 34.68-second Jest body. The successful validation path
  totaled 164.81 seconds.

### 2026-07-27: Explicit fetch caching without route modes

Removed the App Router `fetchCache` route configuration from the JavaScript and
Rust segment schemas, generated types, TypeScript language service, static-path
planner, work store, component tree, Route Handler runtime, Server Action
setup, and fetch patch. Fetch caching now follows one rule: an individual
`fetch()` or Cache Components boundary declares its cache behavior. Removed
the route-level force, only, and default branches and their bespoke conflicts,
without changing the internal incremental-cache entry discriminator.

Pruned all fixture exports, deleted the compiler fixture that existed only to
produce a special `fetchCache` removal error, deleted the route-config-only
browser fixtures, and rewrote retained assertions around explicit fetch
options. The scorecard now tracks both exact implementation references and
residual test names inherited from the removed mode.

Across the four scorecard dimensions:

- **Maintainability:** Exact implementation references fell from 70 to zero,
  fixture exports from 17 to zero, and residual route-mode test references
  from 68 to 37. The remaining 37 are a visible fixture-naming cleanup queue,
  not supported configuration.
- **Leanness:** Authored framework source fell by 252 lines and 9,842 bytes.
  Tracked Rust compiler source fell by two files, 84 lines, and 2,401 bytes.
  The comparable core distribution fell by 115,787 bytes overall and 25,489
  JavaScript bytes. Test-suite and dependency counts were unchanged.
- **Runtime performance:** The retained production fixtures were ready in 78
  to 87 milliseconds. The explicit fetch-cache resume assertion completed in
  598 milliseconds, its Server Action invalidation assertion in 630
  milliseconds, and the Partial Prefetching runtime-cache assertion in 561
  milliseconds. These are warm-local guardrails, not improvement claims.
- **Iteration efficiency:** Types took 14.78 seconds, 84 JavaScript and 30 Rust
  diagnostic assertions took 5.91 seconds, and the 56-test fast contract took
  4.30 seconds. `next-core` checked in 13.54 seconds. The full bootstrap took
  49.33 seconds including a 38.91-second native build, the core release took
  22.38 seconds, and the seven-assertion production browser selection took
  37.43 seconds with a 29.94-second Jest body. The successful validation path
  totaled 147.67 seconds.

### 2026-07-27: One request-derived rendering model

Removed the App Router `dynamic` route configuration from the JavaScript and
Rust segment schemas, generated types, language service, build analysis,
metadata generation, output export, App Page rendering, Route Handlers,
request APIs, fetch patching, and work-store state. Request data now uses the
same Cache Components tracking path in every supported route. The
force-static request and URL shims, dynamic-error proxies, force-dynamic
postponement, and special removed-feature diagnostics are gone.

Pruned mode-only export, dynamic-error, and request-API cases, plus the fully
skipped legacy `ppr-full` application and their test-manifest entries. The
remaining semantic test debt is intentionally visible in the scorecard rather
than hidden behind inert fixture exports. The browser allowlist now prefers a
rebuilt fork-native SWC binding automatically.

Across the four scorecard dimensions:

- **Maintainability:** Exact implementation references fell from 66 to zero.
  Fixture exports fell from 198 to zero. Semantic test-mode references fell
  from 436 to 143 and remain the explicit cleanup queue.
- **Leanness:** Authored framework source fell by 667 lines and 26,704 bytes,
  while App rendering fell by 99 lines and tracked Rust compiler source fell
  by 73 lines. Four test suites are gone. The comparable core distribution
  fell by 387,989 bytes overall and 107,791 JavaScript bytes.
- **Runtime performance:** The converted Turbopack development fixture was
  ready in 197 milliseconds and served its first compiled request in 808
  milliseconds. The production browser contract started in at most 84
  milliseconds, and its Partial Prefetching navigation assertion completed in
  501 milliseconds. These are warm-local guardrails, not benchmark claims.
- **Iteration efficiency:** Types took 15.05 seconds, direct Rust and compiler
  checks took 17.68 seconds, the fast contract plus converted development E2E
  took 5.09 seconds, and the core release took 22.49 seconds. The full
  35-assertion production browser pack took 105.28 seconds, for 185.59 seconds
  of successful validation. This is broader coverage than the previous slice,
  so the total is not a comparable speed regression.

### 2026-07-27: One dynamic parameter model

Removed `dynamicParams` from the App segment schema, JavaScript-to-Rust
contract, inherited Rust configuration, generated entry validation, TypeScript
language service, metadata loader, App Route userland type, and static-path
planner. The canonical behavior now always permits parameters outside
`generateStaticParams` to be generated on demand. Removed mode-only fixture
declarations and assertions, then added that supported behavior to the retained
Partial Prefetching production E2E without adding another application or
browser process.

Across the four scorecard dimensions:

- **Maintainability:** Exact App route-config `dynamicParams` and
  `dynamic_params` references fell from 38 to zero. Fallback planning has one
  four-case state machine instead of combining the base fallback with a
  per-segment boolean, and removed exports now receive ordinary language and
  module behavior rather than a bespoke framework diagnostic.
- **Leanness:** The implementation, fixture, manifest, test, and scorecard
  tooling diff is 350 net lines smaller: 90 additions and 440 deletions,
  excluding this history entry and the generated snapshot. Authored framework
  source fell by 120 lines and 3,782 bytes, and tracked Rust compiler source
  fell by 41 lines and 1,358 bytes. The comparable warm distribution fell by
  14,057 bytes overall and 5,736 JavaScript bytes. Test-file and dependency
  counts were unchanged because coverage moved into an existing E2E.
- **Runtime performance:** The retained production Turbopack fixture started
  in 74 milliseconds, served the ungenerated parameter assertion in 126
  milliseconds, and passed its Partial Prefetching browser assertion in 927
  milliseconds. These are single warm-local guardrails, not speed claims.
- **Iteration efficiency:** Direct Rust, static-path, compiler-diagnostic, and
  TypeScript-plugin checks took 43.72 seconds, types took 14.46 seconds, and
  the 56-test fast contract took 4.26 seconds. The full bootstrap took 37.28
  seconds, including a 9.13-second native binding build and 23.11-second core
  release. The retained production journey took 22.02 seconds with a
  14.74-second Jest body. Productive validation cost 121.74 seconds.

### 2026-07-27: One App endpoint packaging path

Collapsed App endpoint production and development output to the Node.js path.
Removed the App Edge RSC and Route module contexts, Edge chunk graph, Edge
client-reference handling, middleware-manifest synthesis, Edge output variant,
and the Node/Edge branches in endpoint path reporting and Server Action graph
construction. `AppEndpointOutput` is now a single struct around the canonical
entry chunk and its server and client assets.

Kept the independent Edge SSR client-reference transition used by Edge
middleware and instrumentation. The scorecard now distinguishes that one real
shared compiler capability from App endpoint runtime selection.

Across the four scorecard dimensions:

- **Maintainability:** App endpoint runtime-selection branches fell from the
  previous broad count of 13 to zero after the metric was narrowed to the
  endpoint implementation. One Edge runtime constant remains in the shared
  Edge SSR transition and is tracked separately. A two-variant output enum and
  six App-specific Edge context constructors are gone.
- **Leanness:** `crates/next-api/src/app.rs` fell from 2,320 to 1,936 lines and
  from 92,045 to 74,098 bytes: 384 net lines and 17,947 bytes removed. Tests,
  dependencies, TypeScript framework source, and compiler source counts were
  unchanged. The comparable built distribution increased by six bytes overall
  and six JavaScript bytes, which is effectively unchanged and not evidence of
  a runtime cost.
- **Runtime performance:** The retained PPR production fixture was ready in 96
  milliseconds and passed all 12 shell, hydration, metadata, and
  no-JavaScript assertions. The resume-cache fixture was ready in 129
  milliseconds and passed all five cache, Route Handler, Server Action, and
  revalidation assertions. These single warm-local observations are
  guardrails, not speed claims.
- **Iteration efficiency:** `next-api` checked in 4.14 seconds, types passed in
  14.28 seconds, and the 56-test fast contract passed in 1.80 seconds. The full
  bootstrap build took 11.68 seconds, the two browser journeys 54.82 seconds
  with a combined 37.01-second Jest body, and the final core release build
  23.25 seconds. Productive validation cost 109.97 seconds. An initial
  four-second Cargo failure exposed that Edge middleware still consumes the
  shared Edge SSR transition; correcting that metric and boundary was
  investigation overhead.

### 2026-07-27: One App Router runtime

Removed `runtime` from the App segment schema, static-info result, inherited
layout reduction, TypeScript language-service metadata, generated entry
validation, and both JavaScript and Rust App entry selection. App Pages, Route
Handlers, and metadata routes now enter Turbopack through the Node.js module
context without constructing an Edge wrapper. Pages Router and Proxy runtime
selection remain temporarily isolated in their own contracts.

Moved unsupported route-config verification below the browser boundary.
Deleted three E2E suites, their two fixture applications, and their Rspack
matrix entries. The direct RSC transform contract covers the remaining
unsupported exports without preserving diagnostics for APIs that are simply
absent.

Across the four scorecard dimensions:

- **Maintainability:** The App segment schema has zero `runtime` properties.
  Static-info consumers now discriminate App and Pages results explicitly,
  and the App entry constructors no longer accept competing Node and Edge
  contexts. The scorecard now enforces zero App runtime schema fields and zero
  App edge-wrapper references, while exposing 13 residual packaging branches
  as the next deletion target.
- **Leanness:** The implementation, fixture, manifest, and scorecard-tooling
  diff is 853 net lines smaller: 54 additions and 907 deletions, excluding this
  history entry and the generated snapshot. Authored framework source fell by
  46 lines and 1,216 bytes. The tracked Rust compiler pipeline fell by 255
  lines and 9,726 bytes. Three E2E files and 32 fixture or matrix files are
  gone. The full-bootstrap distribution was 6,858 bytes smaller overall and
  3,179 JavaScript bytes smaller, but that build condition is not directly
  comparable to the previous core-only snapshot. Dependencies were unchanged.
- **Runtime performance:** The retained production Turbopack navigation
  fixture was ready in 71 milliseconds and passed its Partial Prefetching
  assertion. The PPR fixture was ready in 98 milliseconds and passed all 12
  shell, hydration, metadata, and no-JavaScript assertions. These single warm
  observations are guardrails, not performance claims.
- **Iteration efficiency:** The 31-case direct compiler contract passed in
  0.46 seconds. The committed scorecard records 36.13 seconds for direct
  compiler checks, 18.06 seconds for types, 2.03 seconds for the 56-test fast
  contract, 49.21 seconds for the full bootstrap, and 27.55 seconds for the
  five-assertion resume-cache browser journey. Its 132.98-second total is
  77.02 seconds above the previous slice because it replaces a core-only build
  and no browser run with a full bootstrap and browser validation, so the
  totals are not comparable. Additional PPR and Partial Prefetching browser
  verification took 54.35 seconds. Rebuilding the native compiler took 7.42
  seconds, and one 4.66-second isolated-package integrity retry was
  test-selection overhead.

### 2026-07-27: One compiler feature model

Removed Cache Components and use-cache booleans from the JavaScript SWC
options, Rust transform options, Turbopack transform rules, and Server Action
configuration. The RSC transform now directly rejects route-segment modes that
are outside the fork contract, accepts `instant` without an enable flag, and
always runs the App Router empty-`generateStaticParams` transform. Deleted the
mode-specific compiler fixtures and replaced them with one unsupported-route
contract plus one positive `instant` fixture.

The scorecard now tracks the Rust compiler pipeline and obsolete mode fields so
future compiler simplification is visible alongside TypeScript source.

Across the four scorecard dimensions:

- **Maintainability:** The compiler seam has zero
  `cache_components_enabled` or `use_cache_enabled` fields. Two feature
  switches and their four transform owners are gone, and route-config policy
  has one diagnostic instead of branching between two removed configuration
  properties.
- **Leanness:** The implementation, fixture, and scorecard-tooling diff is 288
  net lines smaller: 35 additions and 323 deletions, excluding this history
  entry and the generated snapshot.
  Authored framework source fell by 9 lines and 275 bytes. The comparable warm
  distribution fell by 1,556 bytes overall and 440 JavaScript bytes. Test-file
  and package dependency counts were unchanged.
- **Runtime performance:** No framework runtime path changed, so no runtime
  benchmark was relevant. The production compiler emits the same supported
  `"use cache"` and App Router transforms without serializing or testing
  enable bits.
- **Iteration efficiency:** The cleaned 30-case RSC diagnostic fixture passed
  in 6.09 seconds, the six-case transform fixture in 2.25 seconds, and
  `next-core` checked in 7.91 seconds. Types passed in 14.07 seconds, the
  56-test fast contract in 1.78 seconds, and the final core build in 23.86
  seconds, for 55.96 seconds of productive validation. No browser run was
  added because the direct transform fixtures observe the compiler-only
  change; the retained browser pack continues to own navigation, PPR, and
  visible Server Action behavior. A cold Rust dependency compile and one stale
  fixture-cache failure were investigation overhead, not productive timing.

### 2026-07-27: No use-cache configuration mode

Removed `experimental.useCache` from the public type, schema, defaults, and
normalization, along with the compatibility-only fatal guidance for
`experimental.dynamicIO`. Removed `__NEXT_USE_CACHE` from application defines
and the corresponding runtime guards from `cacheLife()` and `cacheTag()`.
Webpack and SWC options now supply the always-on compiler capability directly.

The same mode also existed independently in Turbopack's Rust config model.
Removed its top-level and experimental booleans and both selector functions.
Client, server, RSC, Server Action, dynamic-import, and `next-js` resolver
configuration now receive the invariant directly. The fork browser harness now
honors an explicit `NEXT_TEST_NATIVE_DIR`, allowing Rust slices to validate the
freshly rebuilt binding instead of silently testing the published package.

Across the four scorecard dimensions:

- **Maintainability:** `ExperimentalConfig` fell from 149 to 148 members.
  Exact `experimental.useCache`, `dynamicIO`, `__NEXT_USE_CACHE`, and Rust
  Cache Components and use-cache selector references fell to zero. Cache
  Components references in authored framework source fell from 75 to 70.
- **Leanness:** The source and harness diff is 55 net lines smaller. Authored
  framework source fell by 36 lines and 1,156 bytes. The comparable warm
  distribution fell by 7,098 bytes overall and 2,773 JavaScript bytes. Test
  counts and dependencies were unchanged.
- **Runtime performance:** The production Turbopack resume-cache fixture was
  ready in 76 milliseconds. All five cache, Server Action, and tag-revalidation
  assertions passed, proving `"use cache"` compilation and runtime restoration
  without an enable bit. This single warm-local observation is a guardrail, not
  a performance claim.
- **Iteration efficiency:** All 20 config assertions passed in 1.47 seconds,
  types in 13.64 seconds, and the 56-test fast contract in 1.82 seconds.
  Initial dependency-backed `next-core` checking took 103.61 seconds, the
  required native bootstrap took 241.26 seconds, the final resume-cache journey
  took 24.89 seconds with a 15.24-second Jest body, and the final core build
  took 22.02 seconds. Productive validation cost 408.71 seconds. Sandbox
  retries, an initial pre-Rust build, and two runs against the published native
  binding added 138.40 seconds, for 547.11 seconds of measured iteration.

### 2026-07-27: No internal Cache Components config field

Removed the always-true Cache Components property from complete config,
defaults, runtime config serialization, and final normalization. The compiler
now always enables the `next-js` export condition. The remaining webpack HMR
path classifies request-ID clients as App Router clients and delivers their
cache status without consulting a mode that could no longer be false. The
isolated config contract now asserts that normalized config has no selectable
Cache Components property.

Across the four scorecard dimensions:

- **Maintainability:** Cache Components references fell from 88 to 75. Four
  config, compiler, and development modules no longer produce, transport, or
  branch on a redundant field. The public config member count is unchanged
  because the user-facing property was already absent.
- **Leanness:** Authored framework source fell by 25 lines and 841 bytes. The
  comparable warm distribution fell by 4,259 bytes overall and 1,401
  JavaScript bytes. Test counts and dependencies were unchanged.
- **Runtime performance:** No supported runtime benchmark was relevant. The
  supported Turbopack path was already unconditional; the only runtime branch
  removed was in webpack HMR, which is outside the fork contract.
- **Iteration efficiency:** All 20 isolated config assertions passed in 1.54
  seconds, types in 14.21 seconds, the 56-test fast contract in 1.83 seconds,
  and the core build in 21.52 seconds. Total measured validation cost was 39.10
  seconds.

### 2026-07-27: No fallback-validation browser matrix

Deleted the stale 19-file development application that combined complete,
partial, and absent static params with wrapped and unwrapped layouts. Its old
partial-param case was reproduced against the current fork: the request
completed successfully and the expected fallback-specific Blocking Route
redbox did not open. The matrix's unique route-precedence responsibility now
lives in the fast fallback-param contract, while the existing generic
development error suite retains the actual Blocking Route user experience.
That retained fixture also stopped declaring the removed Cache Components
option.

Across the four scorecard dimensions:

- **Maintainability:** One duplicate ownership boundary is gone. Fallback-param
  selection belongs to the request unit, and generic development diagnostics
  belong to the development error suite instead of being multiplied across
  static-param combinations.
- **Leanness:** Deleted 532 lines of test and fixture source, one 15,086-byte
  binary asset, and one development test file. Total tests fell from 1,859 to
  1,858 and development tests from 292 to 291. Authored framework source,
  dependencies, and the comparable built distribution were unchanged.
- **Runtime performance:** No framework runtime code changed. The retained
  generic Turbopack Blocking Route fixture reached ready state in 285
  milliseconds and passed its redbox assertion.
- **Iteration efficiency:** The 56-test fast contract passed in 1.81 seconds,
  the retained browser assertion in 7.63 seconds with a 6.63-second Jest body,
  and the core build in 22.11 seconds. Final productive validation cost 31.55
  seconds. Reproducing the stale case, two sandboxed isolated-install network
  failures, and a pre-cleanup retained run added 199.16 seconds, for 230.71
  seconds of measured iteration. A separate type command was not run because
  framework source was unchanged; the build's type-generation phase passed in
  14.04 seconds.

### 2026-07-27: Direct fallback-route selection contract

Moved development fallback-route precedence into the request module and
covered the base dynamic route, a more-specific partially covered route, a
fully concrete route, and a non-match directly. `BaseServer` now delegates to
that function. Deleted the three shared mixed-param browser cases, which
expanded to 12 tests across the four retained warmup entry points, along with
their four duplicated route fixture files. The fallback-param test file is now
part of the fast fork contract.

Across the four scorecard dimensions:

- **Maintainability:** Route matching and fallback-set precedence now have one
  named owner and four direct cases. The development warmup suite no longer
  couples this request algorithm to two fixture copies, server restarts,
  browser navigation, and render-phase log labels.
- **Leanness:** The repository source and fixture diff is 171 net lines
  smaller. Authored framework source increased by 48 lines and 952 bytes
  because the extracted seam and its direct test are tracked there. Total test
  file counts are unchanged because coverage moved into an existing unit file.
  The comparable warm distribution increased by 7,418 bytes overall and 108
  JavaScript bytes. These small framework and artifact increases buy a stable
  contract while removing much larger browser-fixture machinery.
- **Runtime performance:** The retained Turbopack navigation and initial-load
  fixtures reached ready state in 280 and 275 milliseconds, with both focused
  cache assertions passing. The production algorithm is unchanged apart from
  delegating the same selection loop, so this directional startup observation
  is a guardrail rather than a performance claim.
- **Iteration efficiency:** All 37 fallback-param assertions passed directly in
  1.41 seconds. Types passed in 14.41 seconds, the expanded 56-test fast
  allowlist in 1.82 seconds, the two retained browser assertions in 22.18
  seconds with a 21.07-second Jest body, and the core build in 21.82 seconds.
  Total measured validation cost was 61.64 seconds, 3.00 seconds above the
  preceding slice because this run includes the new direct contract and
  browser-run variation.

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
