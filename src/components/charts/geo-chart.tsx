import useIbgeData from '@/hooks/use-ibge-data'
import GeoChartCore from './geo-chart-core'
import useGeoJsonMap from '@/hooks/use-map-geo-json'
import {
  FetchParams,
  makeChartOptions,
  mapIbgeDataToChartData,
} from '@/lib/utils'

interface GeoChartProps {
  fetchParams: FetchParams
}

const GeoChart = async ({ fetchParams }: GeoChartProps) => {
  const { data } = await useIbgeData(fetchParams)
  const geoJson = await useGeoJsonMap(fetchParams.nivelGeografico)

  const geoData = mapIbgeDataToChartData(data)
  const mapOptions = makeChartOptions(data)

  return <GeoChartCore data={geoData} geoJson={geoJson} options={mapOptions} />
}

export default GeoChart
