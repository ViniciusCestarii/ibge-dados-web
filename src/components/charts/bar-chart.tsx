import useIbgeData from '@/hooks/use-ibge-data'
import {
  FetchParams,
  makeChartOptions,
  mapIbgeDataToChartData,
} from '@/lib/utils'
import BarChartCore from './bar-chart-core'

interface BarChartProps {
  fetchParams: FetchParams
}

const BarChart = async ({ fetchParams }: BarChartProps) => {
  const response = await useIbgeData(fetchParams)

  if (response.isErr()) {
    return <div>Erro ao carregar dados</div>
  }

  const { data } = response.value

  const geoData = mapIbgeDataToChartData(data)
  const mapOptions = makeChartOptions(data)
  return <BarChartCore data={geoData} options={mapOptions} />
}

export default BarChart
