import { Button } from '@/components/ui/button'
import { getLocaisGeograficos, getMetadados, getPeriodos } from '@/lib/get-json'
import { LocalGeografico, Metadado, Periodo } from '@/types/agregado'
import { Suspense } from 'react'
import IbgeFilter from './ibge-filter'
import { searchParamsCache } from './search-params'

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const parsedSearchParams = searchParamsCache.parse(searchParams)

  let agregadoMetadados: Metadado | undefined
  let agregadoPeriodos: Periodo[] | undefined
  let nivelLocaisGeograficos: LocalGeografico[] | undefined

  if (parsedSearchParams.agregado) {
    const [metadados, periodos, locaisGeograficos] = await Promise.all([
      getMetadados(parsedSearchParams.agregado),
      getPeriodos(parsedSearchParams.agregado),
      parsedSearchParams.nivelGeografico
        ? getLocaisGeograficos(parsedSearchParams.nivelGeografico)
        : undefined,
    ])
    agregadoMetadados = metadados
    agregadoPeriodos = periodos
    nivelLocaisGeograficos = locaisGeograficos
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dados Agregados do IBGE</h1>
      <Suspense fallback="Dados Agregados do IBGE">
        <IbgeFilter
          agregadoPeriodos={agregadoPeriodos}
          agregadoMetadados={agregadoMetadados}
          nivelLocaisGeograficos={nivelLocaisGeograficos}
        />
      </Suspense>
      <div className="mt-4">
        <Button>Buscar</Button>
      </div>
    </main>
  )
}
