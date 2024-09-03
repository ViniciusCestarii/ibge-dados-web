'use server'
import { LocalGeografico, NivelId } from '@/types/agregado'
import fs from 'fs'
import path from 'path'
import React from 'react'

const getGeoFilename = (nivelId: NivelId) => {
  switch (nivelId) {
    case 'N1':
      return 'pais'
    case 'N2':
      return 'grandes-regioes'
    case 'N3':
      return 'estados'
    case 'N4':
    case 'N5':
    case 'N6':
    case 'N7':
      return 'municipios'
  }
}

async function getGeoJsonMap(nivelId: NivelId): Promise<LocalGeografico[]> {
  const geoJsonFilename = getGeoFilename(nivelId)
  const filePath = path.resolve(
    'src/json/geo/brasil',
    `${geoJsonFilename}.json`,
  )
  const fileContent = await fs.promises.readFile(filePath, 'utf-8')
  return JSON.parse(fileContent)
}

const useGeoJsonMap = React.cache(getGeoJsonMap)

export default useGeoJsonMap
