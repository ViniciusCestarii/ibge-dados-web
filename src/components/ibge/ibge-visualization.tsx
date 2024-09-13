import { FetchParams } from '@/lib/utils'
import { isProduction } from '@/lib/env-utils'
import ChartVisualization from '@/app/(main)/(components)/chart-visualization'
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
      {!isProduction() && <IbgeLogs validFetchParams={validFetchParams} />}
    </div>
  )
}

export default IbgeVisualization
