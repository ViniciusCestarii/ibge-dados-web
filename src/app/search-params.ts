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
    history: 'push',
  }),
  variavel: parseAsString.withOptions({
    shallow: false,
    history: 'push',
  }),
  periodos: parseAsArrayOf(parseAsString).withOptions({
    shallow: false,
    history: 'push',
  }),
  nivelGeografico: parseAsString.withOptions({
    shallow: false,
    history: 'push',
  }),
  locais: parseAsArrayOf(parseAsString).withOptions({
    shallow: false,
    history: 'push',
  }),
  classificacao: parseAsJson().withOptions({
    shallow: false,
    history: 'push',
  }),
}

export const searchParamsCache = createSearchParamsCache(searchParamsParsers)
