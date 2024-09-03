import BarChart from '@/components/charts/bar-chart'
import GeoChart from '@/components/charts/geo-chart'
import { FetchParams } from '@/lib/utils'

interface MapVisualizationProps {
  fetchParams: FetchParams
}

const MapVisualization = (props: MapVisualizationProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      <BarChart {...props} />
      <GeoChart {...props} />
    </div>
  )
}

export default MapVisualization
