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
import { Metadado, Periodo } from '@/types/agregado'
import { useQueryState } from 'nuqs'
import { useState } from 'react'
import AgregadoSelector from './agregado-selector'
import PesquisaSelector from './pesquisa-selector'
import { searchParamsParsers } from './search-params'
import VariavelSelector from './variavel-selector'

interface IbgeVisualizationProps {
  agregadoMetadados: Metadado | undefined
  agregadoPeriodo: Periodo[] | undefined
}

export default function IbgeVisualization({
  agregadoMetadados,
  agregadoPeriodo,
}: IbgeVisualizationProps) {
  const [selectedGeography, setSelectedGeography] = useState<string>('')
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
    'periodo',
    searchParamsParsers.periodo,
  )

  const agregados =
    pesquisas.find((pesquisa) => pesquisa.id === selectedPesquisa)?.agregados ??
    []

  const variaveis = agregadoMetadados?.variaveis ?? []

  const periods = agregadoPeriodo ?? []

  const geographicLevels = [
    'N1 - Brasil',
    'N2 - Grande região (N, NE, SE, S, CO)',
  ]

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
                  periods.map((period) => {
                    const nonNullSelectedPeriods = selectedPeriods ?? []

                    return (
                      <div
                        key={period.id}
                        className="flex items-center space-x-2 p-2 text-sm"
                      >
                        <Checkbox
                          id={period.id}
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
                        <label className="font-medium" htmlFor={period.id}>
                          {period.literals[0]}
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
              <Label htmlFor="geography">Nível geográfico</Label>
              <Select
                value={selectedGeography}
                onValueChange={setSelectedGeography}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível geográfico" />
                </SelectTrigger>
                <SelectContent>
                  {geographicLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
