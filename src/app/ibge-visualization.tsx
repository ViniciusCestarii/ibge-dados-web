import useIbgeData from '@/hooks/use-ibge-data'
import { FetchParams, makeIbgeAgregadoUrl } from '@/lib/utils'
import ChartVisualization from './chart-visualization'

interface IbgeVisualizationProps {
  validFetchParams: FetchParams
}

const IbgeVisualization = async ({
  validFetchParams,
}: IbgeVisualizationProps) => {
  const { data } = await useIbgeData(validFetchParams)

  const agregadoUrl = makeIbgeAgregadoUrl(validFetchParams)

  return (
    <div>
      <ChartVisualization fetchParams={validFetchParams} />
      {
        <a target="_blank" href={agregadoUrl} rel="noreferrer">
          {agregadoUrl}
        </a>
      }
      {data.flatMap((ibgeData) =>
        ibgeData.resultados.flatMap((result) =>
          result.series.flatMap((serie) => (
            <div key={serie.localidade.id}>
              {serie.localidade.nome}
              {Object.entries(serie.serie).map(([periodo, value]) => (
                <p key={`${periodo}-${serie.localidade.id}`}>
                  {`${periodo} ${ibgeData.variavel}: ${value} ${ibgeData.unidade}`}
                </p>
              ))}
            </div>
          )),
        ),
      )}
      <pre>
        <code className={'text-green-500'}>
          {JSON.stringify(validFetchParams, null, 2)}
        </code>
        <code className="text-blue-500">{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  )
}

export default IbgeVisualization
