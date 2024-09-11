import { Suspense } from 'react'
import PageContent from './page-content'

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dados Agregados do IBGE</h1>
      <Suspense fallback="Carregando...">
        <PageContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
