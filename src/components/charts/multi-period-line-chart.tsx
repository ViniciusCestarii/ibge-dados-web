import useIbgeData from '@/hooks/use-ibge-data'
import {
  FetchParams,
  makeChartOptions,
  mapIbgeDataToChartData,
} from '@/lib/utils'
import MultiPeriodLineChartCore from './multi-period-line-chart-core'

interface MultiPeriodLineChartProps {
  fetchParams: FetchParams
}

const MultiPeriodLineChart = async ({
  fetchParams,
}: MultiPeriodLineChartProps) => {
  const response = await useIbgeData(fetchParams)

  if (response.isErr()) {
    return <div>Erro ao carregar dados</div>
  }

  const { data } = response.value

  const geoData = mapIbgeDataToChartData(data)
  const mapOptions = makeChartOptions(data)

  return <MultiPeriodLineChartCore data={geoData} options={mapOptions} />
}

export default MultiPeriodLineChart
