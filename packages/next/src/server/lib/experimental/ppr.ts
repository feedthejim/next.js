/**
 * If set to `incremental`, only those leaf pages that export
 * `experimental_ppr = true` will have partial prerendering enabled. If any
 * page exports this value as `false` or does not export it at all will not
 * have partial prerendering enabled. If set to a boolean, the options for
 * `experimental_ppr` will be ignored.
 */

export type ExperimentalPPRConfig = boolean | 'incremental'

/**
 * Returns true if partial prerendering is supported for the current page with
 * the provided route configuration.
 */
export function checkIsRoutePPREnabled(
  config: ExperimentalPPRConfig | undefined
): boolean {
  // If the config is undefined, partial prerendering is disabled.
  if (typeof config === 'undefined') return false

  // If the config is a boolean, use it directly.
  if (typeof config === 'boolean') return config

  return false
}
