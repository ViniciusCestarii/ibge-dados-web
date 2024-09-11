import { AgregadoDataResponse, Metadado, NivelId } from '@/types/agregado'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'
import env from '@/env'
import { ChartData, ChartOptions } from '@/types/map'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNiveisArrayFromMetadados(metadados: Metadado) {
  const nivel = metadados.nivelTerritorial

  return [...nivel.Administrativo, ...nivel.Especial, ...nivel.IBGE]
}

export interface FetchParams {
  agregado: string
  periodos: string[]
  variavel: string
  nivelGeografico: string
  locais: string[]
}

export const validFetchParamsSchema = z.object({
  agregado: z.string(),
  periodos: z.array(z.string()),
  variavel: z.string(),
  nivelGeografico: z.string(),
  locais: z.array(z.string()).min(1),
})

export const makeIbgeAgregadoUrl = (fetchParams: FetchParams) => {
  const { agregado, periodos, variavel, nivelGeografico, locais } = fetchParams

  const periodosString = periodos.join(',')
  const nivelGeograficoString = `${nivelGeografico}[${locais.join(',')}]`

  const ibgeUrl = getIbgeUrl(
    `agregados/${agregado}/periodos/${periodosString}/variaveis/${variavel}?localidades=${nivelGeograficoString}`,
  )

  return ibgeUrl
}

export const getIbgeUrl = (pathname: string) => {
  return `${env.IBGE_BASE_URL}/${pathname}`
}

const numberToMonth = (number: number) => {
  const date = new Date(0, number)
  return date.toLocaleString('default', { month: 'long' })
}

const periodToText = (period: string) => {
  const year = period.substring(0, 4)
  if (period.length === 4) {
    return year
  }

  if (period.length === 6) {
    const month = numberToMonth(Number(period.substring(4, 6)) - 1)
    return `${year} ${month}`
  }

  if (period.length === 7) {
    const quarter = period.substring(5, 6)
    return `${year} ${quarter}° trimestre`
  }

  return period
}

export const mapIbgeDataToChartData = (
  data: AgregadoDataResponse,
): ChartData => {
  const hasMoreThanOnePeriod = data.some((ibgeData) =>
    ibgeData.resultados.some(
      (result) => Object.keys(result.series[0]).length > 1,
    ),
  )

  if (hasMoreThanOnePeriod) {
    return data.flatMap((ibgeData) =>
      ibgeData.resultados.flatMap((result) =>
        result.series.flatMap((serie) =>
          Object.entries(serie.serie).map(([period, value]) => ({
            name: `${periodToText(period)} ${serie.localidade.nome}`,
            value: Number(value),
          })),
        ),
      ),
    )
  }

  return data.flatMap((ibgeData) =>
    ibgeData.resultados.flatMap((result) =>
      result.series.flatMap((serie) =>
        Object.entries(serie.serie).map(([_, value]) => ({
          name: serie.localidade.nome,
          value: Number(value),
        })),
      ),
    ),
  )
}

export const makeChartOptions = (data: AgregadoDataResponse): ChartOptions => ({
  title: data[0].variavel,
  unidade: data[0].unidade,
})

export const getGeoFilename = (nivelId: NivelId) => {
  switch (nivelId) {
    case 'N1':
      return 'pais'
    case 'N2':
      return 'grandes-regioes'
    case 'N3':
      return 'estados'
    default:
      return 'municipios'
  }
}

export const ONE_DAY_IN_SECONDS = 86400
