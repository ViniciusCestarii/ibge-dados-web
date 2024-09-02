'use server'

import path from 'path'
import fs from 'fs'
import { Metadado, Periodo } from '@/types/agregado'

export async function getMetadados(agregadoId: string): Promise<Metadado> {
  const filePath = path.resolve(
    'src/json/metadados/agregado',
    `${agregadoId}.json`,
  )
  const fileContent = await fs.promises.readFile(filePath, 'utf-8')
  return JSON.parse(fileContent)
}

export async function getPeriodo(agregadoId: string): Promise<Periodo[]> {
  const filePath = path.resolve(
    'src/json/periodos/agregado',
    `${agregadoId}.json`,
  )
  const fileContent = await fs.promises.readFile(filePath, 'utf-8')
  return JSON.parse(fileContent)
}
