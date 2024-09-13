import useIbgeData from '@/hooks/use-ibge-data'
import { makeChartOptions, mapIbgeDataToChartData } from '@/lib/utils'
import BarChartCore from './bar-chart-core'
import { ChartProps } from '@/types/chart'

const BarChart = async ({ fetchParams }: ChartProps) => {
  const response = await useIbgeData(fetchParams)

  if (response.isErr()) {
    return <div>Erro ao carregar dados</div>
  }

  const { data } = response.value
  // todo: add period on title
  const geoData = mapIbgeDataToChartData(data)
  const mapOptions = makeChartOptions(data)
  return <BarChartCore data={geoData} options={mapOptions} />
}

export default BarChart
