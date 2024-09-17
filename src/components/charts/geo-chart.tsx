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

  const mappedData = await mapIbgeDataToChartData({
    data,
    agregadoId: fetchParams.agregado,
  })
  const mapOptions = makeChartOptions(data)

  return (
    <GeoChartCore
      data={mappedData}
      nivelGeografico={fetchParams.nivelGeografico}
      options={mapOptions}
    />
  )
}

export default GeoChart
