import { FetchParams, makeIbgeAgregadoUrl } from '@/lib/utils'
import { AgregadoDataResponse } from '@/types/agregado'
import React from 'react'

const fetchIbgeData = async (fetchParams: FetchParams) => {
  const url = makeIbgeAgregadoUrl(fetchParams)

  const response = await fetch(url, {
    next: {
      revalidate: 3600,
    },
  })
  if (!response.ok) {
    throw new Error(
      `failed with status ${response.status}: ${response.statusText}`,
    )
  }
  const data: AgregadoDataResponse = await response.json()

  return { data, response }
}

const useIbgeData = React.cache(fetchIbgeData)

export default useIbgeData
