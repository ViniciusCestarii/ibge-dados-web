import { Label } from '@/components/ui/label'
import {
  VirtualizedCombobox,
  VirtualizedComboboxProps,
} from '@/components/ui/virtualized-combobox'
import { Agregado } from '@/types/agregado'

interface AgregadoSelectorProps
  extends Omit<VirtualizedComboboxProps, 'options' | 'id'> {
  agregados: Agregado[]
}

const AgregadoSelector = ({ agregados, ...props }: AgregadoSelectorProps) => {
  return (
    <div>
      <Label htmlFor="agregado">Agregado</Label>
      <VirtualizedCombobox
        options={agregados.map((agregado) => ({
          value: agregado.id,
          label: agregado.nome,
        }))}
        searchPlaceholder="Pesquisar um agregado..."
        noItemSelectedText="Selecione um agregado"
        noResultsText="Nenhum agregado encontrado"
        {...props}
        id="agregado"
      />
    </div>
  )
}

export default AgregadoSelector
