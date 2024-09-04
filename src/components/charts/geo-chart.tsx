import useIbgeData from '@/hooks/use-ibge-data'
import {
  FetchParams,
  makeChartOptions,
  mapIbgeDataToChartData,
} from '@/lib/utils'
import GeoChartCore from './geo-chart-core'

interface GeoChartProps {
  fetchParams: FetchParams
}

const GeoChart = async ({ fetchParams }: GeoChartProps) => {
  const { data } = await useIbgeData(fetchParams)

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
