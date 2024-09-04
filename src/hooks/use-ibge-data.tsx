import {
  ONE_DAY_IN_SECONDS,
  FetchParams,
  makeIbgeAgregadoUrl,
} from '@/lib/utils'
import { AgregadoDataResponse } from '@/types/agregado'
import React from 'react'

const fetchIbgeData = async (
  agregado: FetchParams['agregado'],
  variavel: FetchParams['variavel'],
  periodos: FetchParams['periodos'],
  nivelGeografico: FetchParams['nivelGeografico'],
  locais: FetchParams['locais'],
) => {
  const url = makeIbgeAgregadoUrl({
    agregado,
    variavel,
    periodos,
    nivelGeografico,
    locais,
  })

  const response = await fetch(url, {
    next: {
      revalidate: ONE_DAY_IN_SECONDS,
    },
  })
  if (!response.ok) {
    throw new Error(
      `failed with status ${response.status}: ${response.statusText}`,
    )
  }
  const data: AgregadoDataResponse = await response.json()

  if (periodos.length === 1) {
    data.map((ibgeData) =>
      ibgeData.resultados.map((result) =>
        result.series.sort(
          (a, b) => Number(a.serie[periodos[0]]) - Number(b.serie[periodos[0]]),
        ),
      ),
    )
  }

  return { data, response }
}

const useMultiParamIbgeData = React.cache(fetchIbgeData)

const useIbgeData = async (validFetchParams: FetchParams) => {
  const { agregado, variavel, periodos, nivelGeografico, locais } =
    validFetchParams
  return useMultiParamIbgeData(
    agregado,
    variavel,
    periodos,
    nivelGeografico,
    locais,
  )
}

export default useIbgeData
