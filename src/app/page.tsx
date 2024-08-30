'use client'

import { Button } from '@/components/ui/button'
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
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs'
import { Suspense, useState } from 'react'
import AgregadoSelector from './agregado-selector'
import PesquisaSelector from './pesquisa-selector'

function IbgeVisualization() {
  const [selectedVariables, setSelectedVariables] = useQueryState(
    'variaveis',
    parseAsArrayOf(parseAsString),
  )
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  const [selectedGeography, setSelectedGeography] = useState<string>('')
  // use nuqs server instead
  const [selectedPesquisa, setSelectedPesquisa] = useQueryState('pesquisa')
  const [selectedAgregado, setSelectedAgregado] = useQueryState('agregado')

  const notNullselectedVariables = selectedVariables ?? []

  const agregados =
    pesquisas.find((pesquisa) => pesquisa.id === selectedPesquisa)?.agregados ??
    []

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
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dados Agregados do IBGE</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Agregados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <PesquisaSelector
                pesquisas={pesquisas}
                onSelectOption={setSelectedPesquisa}
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
                onSelectOption={setSelectedAgregado}
              />

              {/*
              <div>
                <Label htmlFor="variables">Variáveis</Label>
                <ScrollArea className="h-32 w-full border rounded-md">
                  {variables.map((variable) => (
                    <div
                      key={variable.id}
                      className="flex items-center space-x-2 p-2"
                    >
                      <Checkbox
                        id={variable.id}
                        checked={notNullselectedVariables.includes(variable.id)}
                        onCheckedChange={(checked) => {
                          setSelectedVariables(
                            checked
                              ? [...notNullselectedVariables, variable.id]
                              : notNullselectedVariables.filter(
                                  (v) => v !== variable.id,
                                ),
                          )
                        }}
                      />
                      <label htmlFor={variable.id}>{variable.nome}</label>
                    </div>
                  ))}
                </ScrollArea>
              </div>
              */}
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
                    <div
                      key={period}
                      className="flex items-center space-x-2 p-2"
                    >
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

      <div className="mt-4">
        <Button>Buscar</Button>
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback="Dados Agregados do IBGE">
      <IbgeVisualization />
    </Suspense>
  )
}
