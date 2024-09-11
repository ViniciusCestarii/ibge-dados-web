import BarChart from '@/components/charts/bar-chart'
import GeoChart from '@/components/charts/geo-chart'
import MultiPeriodLineChart from '@/components/charts/multi-period-line-chart'
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
        <>
          <MultiPeriodLineChart {...props} />
        </>
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
