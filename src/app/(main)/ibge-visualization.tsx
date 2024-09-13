import { FetchParams } from '@/lib/utils'
import ChartVisualization from './chart-visualization'
import IbgeLogs from './ibge-logs'
import { isProduction } from '@/lib/env-utils'

interface IbgeVisualizationProps {
  validFetchParams: FetchParams
}

const IbgeVisualization = async ({
  validFetchParams,
}: IbgeVisualizationProps) => {
  return (
    <div>
      <ChartVisualization fetchParams={validFetchParams} />
      {!isProduction() && <IbgeLogs validFetchParams={validFetchParams} />}
    </div>
  )
}

export default IbgeVisualization
