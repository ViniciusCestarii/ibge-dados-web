'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import agregados from '@/json/agregados.json'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs'

export default function Component() {
  const [selectedVariables, setSelectedVariables] = useQueryState(
    'variaveis',
    parseAsArrayOf(parseAsString),
  )
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  const [selectedGeography, setSelectedGeography] = useState<string>('')
  const [selectedPesquisa, setSelectedPesquisa] = useQueryState('agregado')
  const [open, setOpen] = useState(false)

  // fix: variables are receiveing the agregado value

  const notNullselectedVariables = selectedVariables ?? []

  const variables =
    agregados.find((agregado) => agregado.id === selectedPesquisa)?.agregados ??
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
      <h1 className="text-2xl font-bold mb-4">
        Pesquisa: Contas Econômicas Ambientais da Água
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Agregados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pesquisa">Selecione uma pesquisa</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {selectedPesquisa
                        ? agregados.find(
                            (agregado) =>
                              agregado.id.toString() === selectedPesquisa,
                          )?.nome
                        : 'Escolha um agregado'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[calc(100vw_-3rem)] md:w-full md:min-w-[45rem] p-0">
                    <Command>
                      <CommandInput placeholder="Procurar agregado..." />
                      <CommandEmpty>Nenhum agregado encontrado.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {agregados.map((agregado) => (
                            <CommandItem
                              key={agregado.id}
                              onSelect={(currentValue) => {
                                setSelectedPesquisa(
                                  currentValue === selectedPesquisa
                                    ? ''
                                    : agregado.id.toString(),
                                )
                                setOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  selectedPesquisa === agregado.id.toString()
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {agregado.nome}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

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
                <ScrollArea className="h-32 w-full border rounded-md">
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
