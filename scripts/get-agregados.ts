import { basePathToJson, fetchDataAndSaveAsJson } from '@/lib/fetch-data'
import { Pesquisa } from '@/types/agregado'
import fs from 'fs'
import path from 'path'
import {
  fetchAllMissingAgregadoMetadados,
  fetchAllMissingAgregadoPeriodos,
} from './get-missing'
import { createNivelGeograficoMap } from './get-nivel-geografico-map'

const generateAgregados = async () => {
  await fetchAgregados()
  await fetchAllMissingAgregadoMetadados()
  await fetchAllMissingAgregadoPeriodos()
  await createNivelGeograficoMap()

  // await fetchAllAgregadoPeriodo()
  // await fetchAllMissingNivelGeografico()
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
  ) as Pesquisa[]

  await Promise.all(
    agregados.map((categoria) =>
      fetchDataAndSaveAsJson({
        urlName: `agregados?acervo=/S/${categoria.id}/P/Q`,
        pathname: `periodos/categoria/${categoria.id}`,
      }),
    ),
  )
}
