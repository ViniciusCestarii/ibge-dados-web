import path from 'path'
import fs from 'fs'
import { basePathToJson, fetchDataAndSaveAsJson } from '@/lib/fetch-data'
import { Categoria } from '@/types/agregado'

const generateAgregados = async () => {
  await fetchAgregados()
  fetchAllAgregadoPeriodo()
  fetchAllAgregadoMetadados()
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

async function fetchAllAgregadoMetadados() {
  const pathToAgregados = path.join(basePathToJson, 'agregados.json')
  const agregados = JSON.parse(
    fs.readFileSync(pathToAgregados, 'utf-8'),
  ) as Categoria[]

  await Promise.all(
    agregados.flatMap((categoria) =>
      categoria.agregados.map((agregado) =>
        fetchDataAndSaveAsJson({
          urlName: `agregados/${agregado.id}/metadados`,
          pathname: `metadados/agregado/${agregado.id}`,
        }),
      ),
    ),
  )
}
