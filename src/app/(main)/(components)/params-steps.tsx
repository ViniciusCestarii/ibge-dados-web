import { FetchParams } from '@/lib/utils'
import { Square, SquareCheck } from 'lucide-react'
import { ZodError } from 'zod'
import AstrounautAnimation from './astronaut-animation'

interface ParamsStepsProps {
  errors: ZodError<FetchParams>
}

const nameToDisplayMap: Record<keyof FetchParams, string> = {
  agregado: 'Agregado',
  variavel: 'Variável',
  periodos: 'Períodos',
  nivelGeografico: 'Nível Geográfico',
  locais: 'Locais',
}

const ParamsSteps = ({ errors }: ParamsStepsProps) => {
  const params = Object.entries(nameToDisplayMap).map(([key, value]) => ({
    error: !!errors.errors.find((error) => error.path[0] === key),
    name: value,
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <h2 className="text-xl font-bold">Selecione os seguintes parâmetros</h2>
        <ul className="list-disc pl-3 space-y-3">
          {params.map((param) => (
            <li key={param.name} className="flex items-center gap-2">
              <CheckboxIcon checked={!param.error} />
              {param.name}
            </li>
          ))}
        </ul>
      </div>
      <AstrounautAnimation />
    </div>
  )
}

interface CheckboxIconProps {
  checked: boolean
}

const CheckboxIcon = ({ checked }: CheckboxIconProps) => {
  if (checked) {
    return <SquareCheck />
  }

  return <Square />
}

export default ParamsSteps
