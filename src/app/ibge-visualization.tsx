import useIbgeData from '@/hooks/use-ibge-data'
import { FetchParams } from '@/lib/utils'
import React from 'react'
import MapVisualization from './map-visualization'

interface IbgeVisualizationProps {
  validFetchParams: FetchParams
}

const IbgeVisualization = async ({
  validFetchParams,
}: IbgeVisualizationProps) => {
  const { data } = await useIbgeData(validFetchParams)

  return (
    <div>
      <MapVisualization
        data={[
          {
            name: 'Santa Catarina',
            value: 2,
          },
        ]}
      />
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
        <code className="text-green-500">
          {JSON.stringify(validFetchParams, null, 2)}
        </code>
        <code className="text-blue-500">{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  )
}

export default IbgeVisualization
