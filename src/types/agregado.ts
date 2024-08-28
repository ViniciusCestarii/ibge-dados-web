export type Agregado = {
  id: string
  nome: string
}

export type Categoria = {
  id: string
  nome: string
  agregados: Agregado[]
}

export type NivelTerritorial = {
  Administrativo: string[]
  Especial: string[]
  IBGE: string[]
}

export type Periodicidade = {
  frequencia: string
  inicio: number
  fim: number
}

export type Variavel = {
  id: number
  nome: string
  unidade: string
  sumarizacao: string[]
}

export type Tabela = {
  id: number
  nome: string
  URL: string
  pesquisa: string
  assunto: string
  periodicidade: Periodicidade
  nivelTerritorial: NivelTerritorial
  variaveis: Variavel[]
}
