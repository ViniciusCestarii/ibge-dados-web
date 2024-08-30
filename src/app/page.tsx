import { Button } from '@/components/ui/button'
import { Metadado } from '@/types/agregado'
import { Suspense } from 'react'
import { searchParamsCache } from './search-params'
import IbgeVisualization from './ibge-visualization'
import { getMetadados } from '@/lib/get-json'

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const parsedSearchParams = searchParamsCache.parse(searchParams)

  let agregadoMetadados: Metadado | undefined

  if (parsedSearchParams.agregado) {
    agregadoMetadados = await getMetadados(parsedSearchParams.agregado)
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dados Agregados do IBGE</h1>
      <Suspense fallback="Dados Agregados do IBGE">
        <IbgeVisualization agregadoMetadados={agregadoMetadados} />
      </Suspense>
      <div className="mt-4">
        <Button>Buscar</Button>
      </div>
    </main>
  )
}
