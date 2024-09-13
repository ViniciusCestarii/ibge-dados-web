import useIbgeData from '@/hooks/use-ibge-data'
import { FetchParams, makeIbgeAgregadoUrl } from '@/lib/utils'

interface IbgeLogsProps {
  fetchParams: FetchParams
}

const IbgeLogs = async ({ fetchParams }: IbgeLogsProps) => {
  const result = await useIbgeData(fetchParams)

  const agregadoUrl = makeIbgeAgregadoUrl(fetchParams)

  return (
    <div className="overflow-x-auto">
      {
        <a target="_blank" href={agregadoUrl} rel="noreferrer">
          {agregadoUrl}
        </a>
      }
      {result.isOk() ? (
        <pre>
          <code className={'text-green-500'}>
            {JSON.stringify(fetchParams, null, 2)}
          </code>
          <code className="text-blue-500">
            {JSON.stringify(result.value.data, null, 2)}
          </code>
        </pre>
      ) : (
        <pre>
          <code className={'text-destructive'}>{result.error.message}</code>
        </pre>
      )}
    </div>
  )
}

export default IbgeLogs
