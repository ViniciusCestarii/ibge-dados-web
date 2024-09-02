import { FetchParams, useIbgeData } from '@/lib/utils'
import React from 'react'

interface IbgeVisualizationProps {
  validFetchParams: FetchParams
}

const IbgeVisualization = async ({
  validFetchParams,
}: IbgeVisualizationProps) => {
  const { data } = await useIbgeData(validFetchParams)

  return (
    <pre>
      <code className="text-green-500">
        {JSON.stringify(validFetchParams, null, 2)}
      </code>
      <code className="text-blue-500">{JSON.stringify(data, null, 2)}</code>
    </pre>
  )
}

export default IbgeVisualization
