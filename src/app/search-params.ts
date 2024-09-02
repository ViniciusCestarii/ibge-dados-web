import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsString,
} from 'nuqs/server'

export const searchParamsParsers = {
  pesquisa: parseAsString,
  agregado: parseAsString.withOptions({
    shallow: false,
  }),
  variavel: parseAsString.withOptions({
    shallow: false,
  }),
  periodos: parseAsArrayOf(parseAsString),
  nivelGeografico: parseAsString.withOptions({
    shallow: false,
  }),
  locais: parseAsArrayOf(parseAsString).withOptions({
    shallow: false,
  }),
}

export const searchParamsCache = createSearchParamsCache(searchParamsParsers)
