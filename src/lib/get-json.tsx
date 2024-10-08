'use server'

import { LocalGeografico, Metadado, NivelId, Periodo } from '@/types/agregado'
import fs from 'fs'
import path from 'path'
import { getGeoFilename } from './utils'
import React from 'react'

export const getMetadados = React.cache(
  async (agregadoId: string): Promise<Metadado> => {
    const filePath = path.resolve(
      'src/json/metadados/agregado',
      `${agregadoId}.json`,
    )
    const fileContent = await fs.promises.readFile(filePath, 'utf-8')
    return JSON.parse(fileContent)
  },
)

export async function getPeriodos(agregadoId: string): Promise<Periodo[]> {
  const filePath = path.resolve(
    'src/json/periodos/agregado',
    `${agregadoId}.json`,
  )
  const fileContent = await fs.promises.readFile(filePath, 'utf-8')
  return JSON.parse(fileContent)
}

export async function getLocaisGeograficos(
  nivelId: NivelId,
): Promise<LocalGeografico[]> {
  const filePath = path.resolve('src/json/nivel-geografico', `${nivelId}.json`)
  const fileContent = await fs.promises.readFile(filePath, 'utf-8')
  return JSON.parse(fileContent)
}

export async function getGeoJsonMap(
  nivelId: NivelId,
): Promise<LocalGeografico[]> {
  const geoJsonFilename = getGeoFilename(nivelId)
  const filePath = path.resolve(
    'src/json/geo/brasil',
    `${geoJsonFilename}.geojson`,
  )
  const fileContent = await fs.promises.readFile(filePath, 'utf-8')
  return JSON.parse(fileContent)
}
