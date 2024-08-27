import path from 'path'
import fs from 'fs'
import { fetchDataAndSaveAsJson } from '@/lib/fetch-data'
import { Categoria } from '@/types/agregado'

const generateAgregados = async () => {
  await fetchAgregados()
  await fetchAllAgregadoPeriodo()
}

generateAgregados()

async function fetchAgregados() {
  await fetchDataAndSaveAsJson({
    pathname: 'agregados',
    urlName: 'agregados',
  })
}

const basePathToJson = path.join(__dirname, '../src/json')

async function fetchAllAgregadoPeriodo() {
  const pathToAgregados = path.join(basePathToJson, 'agregados.json')
  const agregados = JSON.parse(
    fs.readFileSync(pathToAgregados, 'utf-8'),
  ) as Categoria[]

  await Promise.all(
    agregados.map((categoria) =>
      fetchDataAndSaveAsJson({
        urlName: `agregados?acervo=/S/${categoria.id}/P/Q`,
        pathname: `periodos/${categoria.id}`,
      }),
    ),
  )
}
