import { Metadado } from '@/types/agregado'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'
import React from 'react'
import env from '@/env'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNiveisArrayFromMetadados(metadados: Metadado) {
  const nivel = metadados.nivelTerritorial

  return [...nivel.Administrativo, ...nivel.Especial, ...nivel.IBGE]
}

export interface FetchParams {
  agregado: string
  periodos: string[]
  variavel: string
  nivelGeografico: string
  locais: string[]
}

export const validFetchParamsSchema = z.object({
  agregado: z.string(),
  periodos: z.array(z.string()),
  variavel: z.string(),
  nivelGeografico: z.string(),
  locais: z.array(z.string()).min(1),
})

export const makeIbgeAgregadoUrl = (fetchParams: FetchParams) => {
  const { agregado, periodos, variavel, nivelGeografico, locais } = fetchParams

  const periodosString = periodos.join(',')
  const nivelGeograficoString = `${nivelGeografico}[${locais.join(',')}]`

  const ibgeUrl = getIbgeUrl(
    `agregados/${agregado}/periodos/${periodosString}/variaveis/${variavel}?localidades=${nivelGeograficoString}`,
  )

  return ibgeUrl
}

export const getIbgeUrl = (pathname: string) => {
  return `${env.IBGE_BASE_URL}/${pathname}`
}
