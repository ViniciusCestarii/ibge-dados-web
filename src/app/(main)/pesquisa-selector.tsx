import { Label } from '@/components/ui/label'
import {
  VirtualizedCombobox,
  VirtualizedComboboxProps,
} from '@/components/ui/virtualized-combobox'
import { Pesquisa } from '@/types/agregado'

interface PesquisaSelectorProps
  extends Omit<VirtualizedComboboxProps, 'options' | 'id'> {
  pesquisas: Pesquisa[]
}

const PesquisaSelector = ({ pesquisas, ...props }: PesquisaSelectorProps) => {
  return (
    <div>
      <Label htmlFor="pesquisa">Pesquisa</Label>
      <VirtualizedCombobox
        options={pesquisas.map((pesquisa) => ({
          value: pesquisa.id,
          label: pesquisa.nome,
        }))}
        searchPlaceholder="Pesquisar uma pesquisa..."
        noItemSelectedText="Selecione uma pesquisa"
        noResultsText="Nenhuma pesquisa encontrada"
        {...props}
        id="pesquisa"
      />
    </div>
  )
}

export default PesquisaSelector
