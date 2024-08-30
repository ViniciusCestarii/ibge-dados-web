'use server'

import path from 'path'
import fs from 'fs'

export async function getMetadados(agregadoId: string) {
  const filePath = path.resolve(
    'src/json/metadados/agregado',
    `${agregadoId}.json`,
  )
  const fileContent = await fs.promises.readFile(filePath, 'utf-8')
  return JSON.parse(fileContent)
}
