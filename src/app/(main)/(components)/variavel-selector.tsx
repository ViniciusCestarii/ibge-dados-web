import { Label } from '@/components/ui/label'
import {
  VirtualizedCombobox,
  VirtualizedComboboxProps,
} from '@/components/ui/virtualized-combobox'
import { Variavel } from '@/types/agregado'

interface VariavelSelectorProps
  extends Omit<VirtualizedComboboxProps, 'options' | 'id'> {
  variaveis: Variavel[]
}

const VariavelSelector = ({ variaveis, ...props }: VariavelSelectorProps) => {
  return (
    <div>
      <Label htmlFor="variavel">Variável</Label>
      <VirtualizedCombobox
        options={variaveis.map((variavel) => ({
          value: variavel.id.toString(),
          label: variavel.nome,
        }))}
        searchPlaceholder="Pesquisar uma variável..."
        noItemSelectedText="Selecione uma variável"
        noResultsText="Nenhuma variável encontrada"
        {...props}
        id="variavel"
      />
    </div>
  )
}

export default VariavelSelector
