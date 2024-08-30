import { createSearchParamsCache, parseAsString } from 'nuqs/server'

export const searchParamsParsers = {
  pesquisa: parseAsString,
  agregado: parseAsString.withOptions({
    shallow: false,
  }),
  variavel: parseAsString,
}

export const searchParamsCache = createSearchParamsCache(searchParamsParsers)
