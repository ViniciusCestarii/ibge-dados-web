import { getLocaisGeograficos, getMetadados, getPeriodos } from '@/lib/get-json'
import { validFetchParamsSchema } from '@/lib/utils'
import { LocalGeografico, Metadado, Periodo } from '@/types/agregado'
import { Suspense } from 'react'
import IbgeFilter from './ibge-filter'
import { searchParamsCache } from '../../search-params'
import { ErrorBoundary } from '@sentry/nextjs'
import LoadingAnimation from '@/components/ui/loading-animation'
import { isProduction } from '@/lib/env-utils'
import IbgeVisualization from '@/components/ibge/ibge-visualization'

export default async function PageContent({
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

  const _validFetchParams = validFetchParamsSchema.safeParse(parsedSearchParams)

  return (
    <>
      <IbgeFilter
        agregadoPeriodos={agregadoPeriodos}
        agregadoMetadados={agregadoMetadados}
        nivelLocaisGeograficos={nivelLocaisGeograficos}
      />
      {_validFetchParams.success ? (
        <ErrorBoundary
          fallback={
            <p>
              Aconteceu um erro ao tentar carregar os dados. Por favor, tente
              novamente mais tarde.
            </p>
          }
        >
          <Suspense fallback={<LoadingAnimation />}>
            <IbgeVisualization fetchParams={_validFetchParams.data} />
          </Suspense>
        </ErrorBoundary>
      ) : (
        !isProduction() && (
          <pre className="overflow-x-auto">
            <code className={'text-destructive'}>
              {_validFetchParams.error?.message}
            </code>
          </pre>
        )
      )}
    </>
  )
}
