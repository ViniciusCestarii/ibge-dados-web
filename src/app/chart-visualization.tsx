import BarChart from '@/components/charts/bar-chart'
import GeoChart from '@/components/charts/geo-chart'
import { FetchParams } from '@/lib/utils'

interface ChartVisualizationProps {
  fetchParams: FetchParams
}

const ChartVisualization = (props: ChartVisualizationProps) => {
  const { fetchParams } = props

  const allMoreThanOnePeriod = fetchParams.periodos.length > 1
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {allMoreThanOnePeriod ? (
        'Ops, mais de um perído ainda não é suportado'
      ) : (
        <>
          <BarChart {...props} />
          <GeoChart {...props} />{' '}
        </>
      )}
    </div>
  )
}

export default ChartVisualization
