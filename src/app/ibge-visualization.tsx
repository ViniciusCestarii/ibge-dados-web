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
// use nuqs server to import correct metadados useing selectedAgregado
import metadados from '@/json/metadados/agregado/20.json'
import { Metadado } from '@/types/agregado'
import { useQueryState } from 'nuqs'
import { useState } from 'react'
import AgregadoSelector from './agregado-selector'
import PesquisaSelector from './pesquisa-selector'
import { searchParamsParsers } from './search-params'
import VariavelSelector from './variavel-selector'

interface IbgeVisualizationProps {
  agregadoMetadados: Metadado | undefined
}

export default function IbgeVisualization({
  agregadoMetadados,
}: IbgeVisualizationProps) {
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  const [selectedGeography, setSelectedGeography] = useState<string>('')
  // use nuqs server instead
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

  const agregados =
    pesquisas.find((pesquisa) => pesquisa.id === selectedPesquisa)?.agregados ??
    []

  const variaveis = agregadoMetadados?.variaveis ?? []

  const periods = [
    '2013 - 2013',
    '2014 - 2014',
    '2015 - 2015',
    '2016 - 2016',
    '2017 - 2017',
  ]
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
              <Label htmlFor="periods">Períodos</Label>
              <ScrollArea className="h-32 w-full border rounded-md relative">
                {periods.map((period) => (
                  <div key={period} className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id={period}
                      checked={selectedPeriods.includes(period)}
                      onCheckedChange={(checked) => {
                        setSelectedPeriods(
                          checked
                            ? [...selectedPeriods, period]
                            : selectedPeriods.filter((p) => p !== period),
                        )
                      }}
                    />
                    <label htmlFor={period}>{period}</label>
                  </div>
                ))}
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
