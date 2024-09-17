import {
  ONE_DAY_IN_SECONDS,
  FetchParams,
  makeIbgeAgregadoUrl,
} from '@/lib/utils'
import { AgregadoDataResponse } from '@/types/agregado'
import React from 'react'
import { Result, ok, err } from 'neverthrow'
import * as Sentry from '@sentry/nextjs'

type FetchIbgeDataError = Error

const fetchIbgeData = async (
  agregado: FetchParams['agregado'],
  variavel: FetchParams['variavel'],
  periodos: FetchParams['periodos'],
  nivelGeografico: FetchParams['nivelGeografico'],
  locais: FetchParams['locais'],
  classificacao: FetchParams['classificacao'],
): Promise<
  Result<{ data: AgregadoDataResponse; response: Response }, FetchIbgeDataError>
> => {
  const url = makeIbgeAgregadoUrl({
    agregado,
    variavel,
    periodos,
    nivelGeografico,
    locais,
    classificacao,
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
  const {
    agregado,
    variavel,
    periodos,
    nivelGeografico,
    locais,
    classificacao,
  } = validFetchParams
  const response = await useMultiParamIbgeData(
    agregado,
    variavel,
    periodos,
    nivelGeografico,
    locais,
    classificacao,
  )

  if (response.isErr()) {
    Sentry.withScope((scope) => {
      scope.setTag('agregado', agregado)
      scope.setExtras({
        agregado,
        variavel,
        periodos,
        nivelGeografico,
        locais,
      })
      Sentry.captureException(response.error)
    })
  } else {
    // remove NaN values from series
    response.value.data.forEach((ibgeData) =>
      ibgeData.resultados.forEach((result) =>
        result.series.forEach((serie) => {
          Object.keys(serie.serie).forEach((key) => {
            const value = Number(serie.serie[key])
            if (isNaN(value)) {
              serie.serie[key] = '0'
            } else {
              serie.serie[key] = value.toString()
            }
          })
        }),
      ),
    )
  }

  return response
}

export default useIbgeData
