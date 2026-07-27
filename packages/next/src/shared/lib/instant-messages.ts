export function createUnrenderedSegmentError(
  route: string,
  missingFiles: readonly string[]
): Error {
  let message = `Route "${route}": Could not validate that a segment in your UI has instant navigation.`
  if (missingFiles.length > 0) {
    const label =
      missingFiles.length === 1 ? 'Dropped segment' : 'Dropped segments'
    message +=
      `\n\nThis segment was dropped from rendering. Issues that would prevent instant navigation will go undetected.` +
      `\n\n${label}:\n${missingFiles.map((p) => `  ${p}`).join('\n')}` +
      `\n\nWays to fix this:` +
      `\n  - [render] Render the dropped segment` +
      `\n  - [ignore] Set \`export const instant = false\` to opt the dropped segment out of instant-navigation validation` +
      `\n\nLearn more: https://nextjs.org/docs/messages/instant-unrendered-segment`
  }
  return new Error(message)
}
