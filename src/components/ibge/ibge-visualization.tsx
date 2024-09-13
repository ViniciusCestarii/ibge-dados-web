import { isProduction } from '@/lib/env-utils'
import ChartVisualization from '@/app/(main)/(components)/chart-visualization'
import IbgeLogs from './ibge-logs'
import { ChartProps } from '@/types/chart'

const IbgeVisualization = async (props: ChartProps) => {
  return (
    <div>
      <ChartVisualization {...props} />
      {!isProduction() && <IbgeLogs {...props} />}
    </div>
  )
}

export default IbgeVisualization
