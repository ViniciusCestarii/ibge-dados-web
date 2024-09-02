import useIbgeData from '@/hooks/use-ibge-data'
import { FetchParams } from '@/lib/utils'
import React from 'react'

interface IbgeVisualizationProps {
  validFetchParams: FetchParams
}

const IbgeVisualization = async ({
  validFetchParams,
}: IbgeVisualizationProps) => {
  const { data } = await useIbgeData(validFetchParams)

  return (
    <div>
      {data.flatMap((ibgeData) =>
        ibgeData.resultados.flatMap((result) =>
          result.series.flatMap((serie) => (
            <div key={serie.localidade.id}>
              {serie.localidade.nome}
              {Object.entries(serie.serie).map(([periodo, value]) => (
                <div key={`${periodo}-${serie.localidade.id}`}>
                  {`${ibgeData.variavel}: ${value} ${ibgeData.unidade}`}
                </div>
              ))}
            </div>
          )),
        ),
      )}
      <pre>
        <code className="text-green-500">
          {JSON.stringify(validFetchParams, null, 2)}
        </code>
        <code className="text-blue-500">{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  )
}

export default IbgeVisualization
