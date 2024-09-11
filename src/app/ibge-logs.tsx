import useIbgeData from '@/hooks/use-ibge-data'
import { FetchParams, makeIbgeAgregadoUrl } from '@/lib/utils'

interface IbgeLogsProps {
  validFetchParams: FetchParams
}

const IbgeLogs = async ({ validFetchParams }: IbgeLogsProps) => {
  const result = await useIbgeData(validFetchParams)

  const agregadoUrl = makeIbgeAgregadoUrl(validFetchParams)

  return (
    <div>
      {
        <a target="_blank" href={agregadoUrl} rel="noreferrer">
          {agregadoUrl}
        </a>
      }
      {result.isOk() ? (
        <pre>
          <code className={'text-green-500'}>
            {JSON.stringify(validFetchParams, null, 2)}
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
