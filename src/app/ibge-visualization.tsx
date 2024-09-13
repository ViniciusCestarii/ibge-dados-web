import { FetchParams } from '@/lib/utils'
import ChartVisualization from './chart-visualization'
import IbgeLogs from './ibge-logs'
import env from '@/env'

interface IbgeVisualizationProps {
  validFetchParams: FetchParams
}

const IbgeVisualization = async ({
  validFetchParams,
}: IbgeVisualizationProps) => {
  return (
    <div>
      <ChartVisualization fetchParams={validFetchParams} />
      {env.NODE_ENV !== 'production' && (
        <IbgeLogs validFetchParams={validFetchParams} />
      )}
    </div>
  )
}

export default IbgeVisualization
