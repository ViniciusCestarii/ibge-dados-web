import {
  AgregadoDataResponse,
  Metadado,
  NivelId,
  Resultado,
} from '@/types/agregado'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'
import env from '@/env'
import { ChartData, ChartOptions } from '@/types/chart'
import { EChartsOption } from 'echarts'
import { getMetadados } from './get-json'

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
  classificacao: Record<string, string[]> | null
}

export const validFetchParamsSchema = z.object({
  agregado: z.string(),
  periodos: z.array(z.string()),
  variavel: z.string(),
  nivelGeografico: z.string(),
  locais: z.array(z.string()).min(1),
  classificacao: z.record(z.array(z.string())).nullable(),
})

export const makeIbgeAgregadoUrl = (fetchParams: FetchParams) => {
  const { agregado, periodos, variavel, nivelGeografico, locais } = fetchParams

  const periodosString = periodos.join(',')
  const nivelGeograficoString = `${nivelGeografico}[${locais.join(',')}]`

  const classificaoString = makeClassificaoSearchParam(
    fetchParams.classificacao,
  )

  const ibgeUrl = getIbgeUrl(
    `agregados/${agregado}/periodos/${periodosString}/variaveis/${variavel}?localidades=${nivelGeograficoString}${classificaoString}`,
  )

  return ibgeUrl
}

export const getIbgeUrl = (pathname: string) => {
  if (pathname.startsWith('v1')) {
    return `${env.IBGE_BASE_URL.substring(0, env.IBGE_BASE_URL.length - 3)}/${pathname}`
  }

  return `${env.IBGE_BASE_URL}/${pathname}`
}

const makeClassificaoSearchParam = (
  classificacao?: FetchParams['classificacao'],
) => {
  if (!classificacao) {
    return ''
  }

  const content = Object.entries(classificacao).reduce(
    (acc, [key, value], index) => {
      if (index === 0) {
        return `${key}[${value.join(',')}]`
      }

      return `${acc}|${key}[${value.join(',')}]`
    },
    '',
  )

  return `&classificacao=${content}`
}

const numberToMonth = (number: number) => {
  const date = new Date(0, number)
  return date.toLocaleString('default', { month: 'long' })
}

interface GetPeriodTextProps {
  period: string
  periodicidade: string
}

const periodToText = ({ period, periodicidade }: GetPeriodTextProps) => {
  const year = period.substring(0, 4)
  if (period.length === 4) {
    return year
  }

  const isVariavelTrimestral = periodicidade === 'trimestral'

  if (period.length === 6 && isVariavelTrimestral) {
    const quarter = period.substring(5, 6)
    return `${year} ${quarter}° trimestre`
  }

  if (period.length === 6) {
    const month = numberToMonth(Number(period.substring(4, 6)) - 1)
    return `${year} ${month}`
  }

  return period
}

interface MapIbgeDataToChartData {
  data: AgregadoDataResponse
  agregadoId: string
}

export const mapIbgeDataToChartData = async ({
  agregadoId,
  data,
}: MapIbgeDataToChartData): Promise<ChartData> => {
  const hasMoreThanOnePeriod = data.some((ibgeData) =>
    ibgeData.resultados.some(
      (result) => Object.keys(result.series[0].serie).length > 1,
    ),
  )

  if (hasMoreThanOnePeriod) {
    const metadados = await getMetadados(agregadoId)

    return data.flatMap((ibgeData) =>
      ibgeData.resultados.flatMap((result) => {
        const postFix = getPostfixName(result)

        return result.series.flatMap((serie) =>
          Object.entries(serie.serie).map(([period, value]) => ({
            name: `${periodToText({ period, periodicidade: metadados.periodicidade.frequencia })} ${serie.localidade.nome} ${postFix}`,
            value: Number(value),
          })),
        )
      }),
    )
  }

  return data.flatMap((ibgeData) =>
    ibgeData.resultados.flatMap((result) => {
      const postFix = getPostfixName(result)

      return result.series.flatMap((serie) =>
        Object.entries(serie.serie).map(([_, value]) => ({
          name: `${serie.localidade.nome} ${postFix}`,
          value: Number(value),
        })),
      )
    }),
  )
}

const getPostfixName = (result: Resultado) => {
  const allClassificao = result.classificacoes.flatMap((classificacao) =>
    Object.entries(classificacao.categoria).flatMap(([_, value]) => {
      if (value === 'Total') {
        return []
      }
      return value
    }),
  )

  return allClassificao.join(' ')
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

interface GenerateChartOptionsProps {
  options: ChartOptions
  data: ChartData
}

export const generateChartOptions = ({
  options,
  data,
}: GenerateChartOptionsProps): EChartsOption => {
  const sortedData = data.toSorted((a, b) => b.value - a.value)
  return {
    tooltip: {
      formatter: `{b}: {c} ${options.unidade}`,
    },
    title: {
      text: options.title,
      subtext: `Unidade: ${options.unidade}, Fonte: IBGE`,
      left: '1%',
    },
    visualMap: {
      right: '2%',
      bottom: '20%',
      calculable: true,
      min:
        sortedData.length === 1
          ? sortedData[0].value > 0
            ? 0
            : sortedData[0].value - 1
          : sortedData[sortedData.length - 1].value,
      max: sortedData[0].value,
      orient: 'vertical',
      inRange: {
        color: ['#CACACA', '#A9A9A9', '#808080', '#696969', '#2F2F2F'],
      },
    },
    backgroundColor: 'transparent',
    toolbox: {
      show: true,
      left: 'right',
      top: 'top',
      feature: {
        dataView: { readOnly: true },
        restore: {},
        saveAsImage: {},
      },
    },
    media: [
      {
        query: {
          maxWidth: 800,
        },
        option: {
          toolbox: {
            top: '20px',
          },
        },
      },
    ],
  }
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  alert('Copiado para a área de transferência')
}

export const embedCode = (url: string) => {
  return `<iframe src="${url}" width="100%" height="800" frameborder="0"></iframe>`
}
