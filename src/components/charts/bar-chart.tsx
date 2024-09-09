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
  const { data } = await useIbgeData(fetchParams)
  const geoData = mapIbgeDataToChartData(data)
  const mapOptions = makeChartOptions(data)

  return <BarChartCore data={geoData} options={mapOptions} />
}

export default BarChart