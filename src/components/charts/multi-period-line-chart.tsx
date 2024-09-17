import useIbgeData from '@/hooks/use-ibge-data'
import { makeChartOptions, mapIbgeDataToChartData } from '@/lib/utils'
import MultiPeriodLineChartCore from './multi-period-line-chart-core'
import { ChartProps } from '@/types/chart'

const MultiPeriodLineChart = async ({ fetchParams }: ChartProps) => {
  const response = await useIbgeData(fetchParams)

  if (response.isErr()) {
    return <div>Erro ao carregar dados</div>
  }

  const { data } = response.value

  const mappedData = mapIbgeDataToChartData(data)
  const mapOptions = makeChartOptions(data)

  return <MultiPeriodLineChartCore data={mappedData} options={mapOptions} />
}

export default MultiPeriodLineChart
