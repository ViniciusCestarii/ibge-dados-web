import useIbgeData from '@/hooks/use-ibge-data'
import { makeChartOptions, mapIbgeDataToChartData } from '@/lib/utils'
import GeoChartCore from './geo-chart-core'
import { ChartProps } from '@/types/chart'

const GeoChart = async ({ fetchParams }: ChartProps) => {
  const response = await useIbgeData(fetchParams)

  if (response.isErr()) {
    return <div>Erro ao carregar dados</div>
  }

  const { data } = response.value

  const geoData = mapIbgeDataToChartData(data)
  const mapOptions = makeChartOptions(data)

  return (
    <GeoChartCore
      data={geoData}
      nivelGeografico={fetchParams.nivelGeografico}
      options={mapOptions}
    />
  )
}

export default GeoChart
