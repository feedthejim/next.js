export default function Page({ foo }: { foo: string }) {}

export async function generateStaticParams(s: string) {
  return 1
}

async function generateMetadata({ s }: { s: number }) {}
export { generateMetadata }

export const foo = 'bar'
