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
  variavel: parseAsString,
  periodo: parseAsArrayOf(parseAsString),
}

export const searchParamsCache = createSearchParamsCache(searchParamsParsers)
