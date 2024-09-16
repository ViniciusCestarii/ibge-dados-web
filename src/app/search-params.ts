import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsString,
  parseAsJson,
} from 'nuqs/server'

export const searchParamsParsers = {
  theme: parseAsString,
  pesquisa: parseAsString,
  agregado: parseAsString.withOptions({
    shallow: false,
  }),
  variavel: parseAsString.withOptions({
    shallow: false,
  }),
  periodos: parseAsArrayOf(parseAsString).withOptions({
    shallow: false,
  }),
  nivelGeografico: parseAsString.withOptions({
    shallow: false,
  }),
  locais: parseAsArrayOf(parseAsString).withOptions({
    shallow: false,
  }),
  classificacao: parseAsJson().withOptions({
    shallow: false,
  }),
}

export const searchParamsCache = createSearchParamsCache(searchParamsParsers)
