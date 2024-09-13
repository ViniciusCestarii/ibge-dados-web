import { Suspense } from 'react'
import PageContent from './page-content'

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  return (
    <main className="container mx-auto p-4">
      <Suspense fallback="Carregando...">
        <PageContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
