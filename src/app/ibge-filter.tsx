'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import pesquisas from '@/json/agregados.json'
// use nuqs server to import correct Ometadados useing selectedAgregado
import { getNiveisArrayFromMetadados } from '@/lib/utils'
import { LocalGeografico, Metadado, Periodo } from '@/types/agregado'
import { useQueryState } from 'nuqs'
import AgregadoSelector from './agregado-selector'
import PesquisaSelector from './pesquisa-selector'
import { searchParamsParsers } from './search-params'
import VariavelSelector from './variavel-selector'
import nivelGeograficoMap from '@/json/nivel-geografico-map.json'
import { VirtualizedMultiCombobox } from '@/components/ui/virtualized-multi-combobox'

interface IbgeFilterProps {
  agregadoMetadados: Metadado | undefined
  agregadoPeriodos: Periodo[] | undefined
  nivelLocaisGeograficos: LocalGeografico[] | undefined
}

export default function IbgeFilter({
  agregadoMetadados,
  agregadoPeriodos,
  nivelLocaisGeograficos,
}: IbgeFilterProps) {
  const [selectedNivelGeografico, setSelectedNivelGeografico] = useQueryState(
    'nivelGeografico',
    searchParamsParsers.nivelGeografico,
  )
  const [selectedLocaisGeograficos, setSelectedLocaisGeograficos] =
    useQueryState('locais', searchParamsParsers.locais)
  const [selectedPesquisa, setSelectedPesquisa] = useQueryState(
    'pesquisa',
    searchParamsParsers.pesquisa,
  )
  const [selectedAgregado, setSelectedAgregado] = useQueryState(
    'agregado',
    searchParamsParsers.agregado,
  )
  const [selectedVariavel, setSelectedVariavel] = useQueryState(
    'variavel',
    searchParamsParsers.variavel,
  )
  const [selectedPeriods, setSelectedPeriods] = useQueryState(
    'periodos',
    searchParamsParsers.periodos,
  )

  const agregados =
    pesquisas.find((pesquisa) => pesquisa.id === selectedPesquisa)?.agregados ??
    []

  const variaveis = agregadoMetadados?.variaveis ?? []

  const periods = agregadoPeriodos ?? []

  const niveisGeograficos = agregadoMetadados
    ? getNiveisArrayFromMetadados(agregadoMetadados)
    : []

  const locaisGeograficos = nivelLocaisGeograficos ?? []

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Agregados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <PesquisaSelector
              pesquisas={pesquisas}
              onSelectOption={(pesquisa) => {
                setSelectedPesquisa(pesquisa)
                setSelectedAgregado(null)
                setSelectedVariavel(null)
                setSelectedPeriods(null)
                setSelectedNivelGeografico(null)
                setSelectedLocaisGeograficos(null)
              }}
              selectedOption={selectedPesquisa}
            />

            <AgregadoSelector
              disabled={!selectedPesquisa}
              noItemSelectedText={
                selectedPesquisa
                  ? 'Selecione um agregado'
                  : 'Selecione uma pesquisa'
              }
              agregados={agregados}
              selectedOption={selectedAgregado}
              onSelectOption={(agregado) => {
                setSelectedAgregado(agregado)
                setSelectedVariavel(null)
                setSelectedPeriods(null)
                setSelectedNivelGeografico(null)
                setSelectedLocaisGeograficos(null)
              }}
            />

            <VariavelSelector
              disabled={!selectedAgregado}
              noItemSelectedText={
                selectedAgregado
                  ? 'Selecione uma variável'
                  : 'Selecione um agregado'
              }
              variaveis={variaveis}
              selectedOption={selectedVariavel}
              onSelectOption={setSelectedVariavel}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Adicionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="periodos">Períodos</Label>
              <VirtualizedMultiCombobox
                id="periodos"
                selectedOptions={selectedPeriods ?? []}
                onSelectOptions={(options) =>
                  setSelectedPeriods(options.length > 0 ? options : null)
                }
                searchPlaceholder="Selecione períodos"
                noItemSelectedText="Selecione um ou mais períodos"
                noResultsText="Nenhum período encontrado"
                disabled={!selectedAgregado}
                options={periods
                  .map((period) => ({
                    label: period.literals[0],
                    value: period.id,
                  }))
                  .toReversed()}
              />
            </div>

            <div>
              <Label htmlFor="nivel-geografico">Nível geográfico</Label>
              <Select
                disabled={!selectedAgregado}
                value={selectedNivelGeografico ?? ''}
                onValueChange={(nivelGeografico) => {
                  setSelectedNivelGeografico(nivelGeografico)
                  setSelectedLocaisGeograficos(null)
                }}
              >
                <SelectTrigger
                  id="nivel-geografico"
                  aria-label="Nível geográfico"
                  disabled={!selectedAgregado}
                >
                  <SelectValue placeholder="Selecione o nível geográfico" />
                </SelectTrigger>
                <SelectContent>
                  {niveisGeograficos.map((nivel) => (
                    <SelectItem key={nivel} value={nivel}>
                      {
                        nivelGeograficoMap[
                          nivel as keyof typeof nivelGeograficoMap
                        ]
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="locais">Locais</Label>
              <VirtualizedMultiCombobox
                id="locais"
                selectedOptions={selectedLocaisGeograficos ?? []}
                onSelectOptions={(options) =>
                  setSelectedLocaisGeograficos(
                    options.length > 0 ? options : null,
                  )
                }
                searchPlaceholder="Selecione locais"
                noItemSelectedText="Selecione um ou mais locais"
                noResultsText="Nenhum local encontrado"
                disabled={!selectedNivelGeografico}
                options={locaisGeograficos.map((local) => ({
                  label: local.nome,
                  value: local.id,
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
