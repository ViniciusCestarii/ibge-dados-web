import path from 'path'
import fs from 'fs'
import { basePathToJson, fetchDataAndSaveAsJson } from '@/lib/fetch-data'
import { Categoria } from '@/types/agregado'
import {
  fetchAllMissingAgregadoMetadados,
  fetchAllMissingNivelGeografico,
} from './get-missing'

const generateAgregados = async () => {
  await fetchAgregados()
  await fetchAllAgregadoPeriodo()
  await fetchAllMissingAgregadoMetadados()
  await fetchAllMissingNivelGeografico()
}

generateAgregados()

async function fetchAgregados() {
  await fetchDataAndSaveAsJson({
    pathname: 'agregados',
    urlName: 'agregados',
  })
}

async function fetchAllAgregadoPeriodo() {
  const pathToAgregados = path.join(basePathToJson, 'agregados.json')
  const agregados = JSON.parse(
    fs.readFileSync(pathToAgregados, 'utf-8'),
  ) as Categoria[]

  await Promise.all(
    agregados.map((categoria) =>
      fetchDataAndSaveAsJson({
        urlName: `agregados?acervo=/S/${categoria.id}/P/Q`,
        pathname: `periodos/categoria/${categoria.id}`,
      }),
    ),
  )
}
