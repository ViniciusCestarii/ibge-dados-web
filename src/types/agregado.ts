/* eslint-disable no-use-before-define */
export type Agregado = {
  id: string
  nome: string
}

export type Pesquisa = {
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

interface MetadadoClassificacao {
  id: number
  nome: string
  sumarizacao: Sumarizacao
  categorias: Categoria[]
}

interface Sumarizacao {
  status: boolean
  excecao: any[]
}

interface Categoria {
  id: number
  nome: string
  unidade: string | null
  nivel: number
}

export type Metadado = {
  id: number
  nome: string
  URL: string
  pesquisa: string
  assunto: string
  periodicidade: Periodicidade
  nivelTerritorial: NivelTerritorial
  variaveis: Variavel[]
  classificacoes: MetadadoClassificacao[]
}

export type Periodo = {
  id: string
  literals: string[]
  modificacao: string
}

export type NivelId =
  | 'N1'
  | 'N2'
  | 'N3'
  | 'N4'
  | 'N5'
  | 'N6'
  | 'N7'
  | (string & Record<never, never>)

export type Nivel = {
  id: NivelId
  nome: string
}

export type LocalGeografico = {
  id: string
  nome: string
  nivel: Nivel
}

export type AgregadoDataResponse = {
  id: string
  variavel: string
  unidade: string
  resultados: Resultado[]
}[]

export type Resultado = {
  classificacoes: Classificacao[]
  series: Serie[]
}

type Classificacao = {
  id: string
  nome: string
  categoria: {
    [key: string]: string
  }
}

type Serie = {
  localidade: Localidade
  serie: {
    [year: string]: string
  }
}

export type Localidade = {
  id: string
  nivel: Nivel
  nome: string
}
