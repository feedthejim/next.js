import type { AppRouteModule } from '../module.compiled'

// Route handlers are only statically optimized when they define a revalidation
// policy or generate static parameters.
export function isStaticGenEnabled(
  mod: AppRouteModule['routeModule']['userland']
) {
  return (
    mod.revalidate === false ||
    (mod.revalidate !== undefined && mod.revalidate > 0) ||
    typeof mod.generateStaticParams == 'function'
  )
}
