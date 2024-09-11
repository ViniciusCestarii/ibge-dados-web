import {
  ONE_DAY_IN_SECONDS,
  FetchParams,
  makeIbgeAgregadoUrl,
} from '@/lib/utils'
import { AgregadoDataResponse } from '@/types/agregado'
import React from 'react'
import { Result, ok, err } from 'neverthrow'

type FetchIbgeDataError = Error

const fetchIbgeData = async (
  agregado: FetchParams['agregado'],
  variavel: FetchParams['variavel'],
  periodos: FetchParams['periodos'],
  nivelGeografico: FetchParams['nivelGeografico'],
  locais: FetchParams['locais'],
): Promise<
  Result<{ data: AgregadoDataResponse; response: Response }, FetchIbgeDataError>
> => {
  const url = makeIbgeAgregadoUrl({
    agregado,
    variavel,
    periodos,
    nivelGeografico,
    locais,
  })

  try {
    const response = await fetch(url, {
      next: {
        revalidate: ONE_DAY_IN_SECONDS,
      },
    })

    if (!response.ok) {
      return err(
        new Error(
          `failed with status ${response.status}: ${response.statusText}`,
        ),
      )
    }

    const data: AgregadoDataResponse = await response.json()

    if (periodos.length === 1) {
      data.map((ibgeData) =>
        ibgeData.resultados.map((result) =>
          result.series.sort(
            (a, b) =>
              Number(a.serie[periodos[0]]) - Number(b.serie[periodos[0]]),
          ),
        ),
      )
    }

    return ok({ data, response })
  } catch (error) {
    console.error(error)
    return err(error as FetchIbgeDataError)
  }
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
