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
              <span className="text-sm font-medium leading-none">Períodos</span>
              <ScrollArea
                type="auto"
                className="h-32 w-full border rounded-md relative"
              >
                {periods.length > 0 ? (
                  periods.toReversed().map((period) => {
                    const nonNullSelectedPeriods = selectedPeriods ?? []

                    const periodId = `periodo-${period.id}`
                    const name = period.literals[0]
                    return (
                      <div
                        key={period.id}
                        className="flex items-center space-x-2 p-2 text-sm"
                      >
                        <Checkbox
                          id={periodId}
                          aria-label={'perido ' + name}
                          checked={nonNullSelectedPeriods.includes(period.id)}
                          onCheckedChange={(checked) => {
                            setSelectedPeriods(
                              checked
                                ? [...nonNullSelectedPeriods, period.id]
                                : nonNullSelectedPeriods.filter(
                                    (p) => p !== period.id,
                                  ),
                            )
                          }}
                        />
                        <label className="font-medium" htmlFor={periodId}>
                          {name}
                        </label>
                      </div>
                    )
                  })
                ) : (
                  <span className="italic flex justify-center text-sm pt-3">
                    Selecione um agregado
                  </span>
                )}
              </ScrollArea>
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
              <span className="text-sm font-medium leading-none">Locais</span>
              <ScrollArea
                type="auto"
                className="h-32 w-full border rounded-md relative"
              >
                {/* TODO: virtualizar locais */}
                {locaisGeograficos.length > 0 ? (
                  locaisGeograficos.slice(0, 50).map((local) => {
                    const nonNullSelectedLocalGeografico =
                      selectedLocaisGeograficos ?? []

                    const localId = `local-${local.id}`

                    return (
                      <div
                        key={local.id}
                        className="flex items-center space-x-2 p-2 text-sm"
                      >
                        <Checkbox
                          id={localId}
                          aria-label={'local ' + local.nome}
                          checked={nonNullSelectedLocalGeografico.includes(
                            local.id,
                          )}
                          onCheckedChange={(checked) => {
                            setSelectedLocaisGeograficos(
                              checked
                                ? [...nonNullSelectedLocalGeografico, local.id]
                                : nonNullSelectedLocalGeografico.filter(
                                    (p) => p !== local.id,
                                  ),
                            )
                          }}
                        />
                        <label className="font-medium" htmlFor={localId}>
                          {local.nome}
                        </label>
                      </div>
                    )
                  })
                ) : (
                  <span className="italic flex justify-center text-sm pt-3">
                    Selecione um nivel geográfico
                  </span>
                )}
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
