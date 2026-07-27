import { LinkAccordion } from '../../components/link-accordion'

// This param is generated on demand rather than at build time.

export default function LazilyGeneratedParamsStartPage() {
  return (
    <>
      <p>
        Demonstrates that we can prefetch param that is not generated at build
        time but is lazily generated on demand
      </p>
      <ul>
        <li>
          <LinkAccordion href="/lazily-generated-params/some-param-value">
            Target
          </LinkAccordion>
        </li>
      </ul>
    </>
  )
}
