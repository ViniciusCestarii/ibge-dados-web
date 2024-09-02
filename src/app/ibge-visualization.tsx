import React from 'react'

interface IbgeVisualizationProps {
  validFetchParams: {
    agregado: string
    periodos: string[]
    variavel: string
    nivelGeografico: string
    locais: string[]
  }
}

const IbgeVisualization = ({ validFetchParams }: IbgeVisualizationProps) => {
  return (
    <pre>
      <code className="text-green-500">
        {JSON.stringify(validFetchParams, null, 2)}
      </code>
    </pre>
  )
}

export default IbgeVisualization
