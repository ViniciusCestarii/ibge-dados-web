'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { VirtualizedSelect } from '@/components/ui/select'
import pesquisas from '@/json/agregados.json'
import { getNiveisArrayFromMetadados } from '@/lib/utils'
import { LocalGeografico, Metadado, Periodo } from '@/types/agregado'
import { useQueryState } from 'nuqs'
import AgregadoSelector from './agregado-selector'
import PesquisaSelector from './pesquisa-selector'
import VariavelSelector from './variavel-selector'
import nivelGeograficoMap from '@/json/nivel-geografico-map.json'
import { VirtualizedMultiCombobox } from '@/components/ui/virtualized-multi-combobox'
import { searchParamsParsers } from '@/app/search-params'

interface IbgeFilterProps {
  agregadoMetadados: Metadado | undefined
  agregadoPeriodos: Periodo[] | undefined
  nivelLocaisGeograficos: LocalGeografico[] | undefined
}
// TODO: Move to drawer to have a better layout
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

  const [selectedClassificoes, setSelectedClassificoes] = useQueryState(
    'classificacao',
    searchParamsParsers.classificacao,
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
              <Label htmlFor="nivel-geográfico">Nível geográfico</Label>
              <VirtualizedSelect
                id="nivel-geográfico"
                disabled={!selectedAgregado}
                selectedOption={selectedNivelGeografico}
                onSelectOption={(option) => {
                  setSelectedNivelGeografico(option)
                  setSelectedLocaisGeograficos(null)
                }}
                noItemSelectedText="Selecione um nível geográfico"
                options={niveisGeograficos.map((nivel) => ({
                  label:
                    nivelGeograficoMap[
                      nivel as keyof typeof nivelGeograficoMap
                    ],
                  value: nivel,
                }))}
              />
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

      {agregadoMetadados?.classificacoes &&
        agregadoMetadados?.classificacoes.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Filtros opcionais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="gap-4 md:grid-cols-2 grid">
                {agregadoMetadados?.classificacoes.map((classificacao) => (
                  <div key={classificacao.id}>
                    <Label htmlFor={classificacao.nome}>
                      {classificacao.nome}
                    </Label>
                    <VirtualizedMultiCombobox
                      id={classificacao.nome}
                      noItemSelectedText={`Selecionar ${classificacao.nome}`}
                      searchPlaceholder={`Pesquisar ${classificacao.nome}`}
                      selectedOptions={
                        selectedClassificoes?.[
                          classificacao.id as keyof typeof selectedClassificoes
                        ] ?? []
                      }
                      onSelectOptions={(options) =>
                        setSelectedClassificoes((prev) => {
                          const value = {
                            ...prev,
                            [classificacao.id]:
                              options.length > 0 ? options : undefined,
                          }

                          if (Object.values(value).every((v) => !v)) {
                            return null
                          }

                          console.log(value)

                          return value
                        })
                      }
                      options={classificacao.categorias.map((categoria) => ({
                        label: categoria.nome,
                        value: String(categoria.id),
                      }))}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  )
}
