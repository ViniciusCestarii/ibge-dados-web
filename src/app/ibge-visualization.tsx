import { FetchParams } from '@/lib/utils'
import ChartVisualization from './chart-visualization'
import IbgeLogs from './ibge-logs'

interface IbgeVisualizationProps {
  validFetchParams: FetchParams
}

const IbgeVisualization = async ({
  validFetchParams,
}: IbgeVisualizationProps) => {
  return (
    <div>
      <ChartVisualization fetchParams={validFetchParams} />
      <IbgeLogs validFetchParams={validFetchParams} />
    </div>
  )
}

export default IbgeVisualization
