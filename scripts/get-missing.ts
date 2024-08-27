import path from 'path'
import fs from 'fs'
import { Categoria } from '@/types/agregado'
import { basePathToJson, fetchDataAndSaveAsJson } from '@/lib/fetch-data'
import pLimit from 'p-limit'
import chalk from 'chalk'

fetchAllMissingAgregadoMetadados()

async function fetchAllMissingAgregadoMetadados() {
  const limit = pLimit(1)

  const pathToAgregados = path.join(basePathToJson, 'agregados.json')
  const agregados = JSON.parse(
    fs.readFileSync(pathToAgregados, 'utf-8'),
  ) as Categoria[]

  const promises = agregados.flatMap((categoria) =>
    categoria.agregados
      .filter(
        (agregado) =>
          !fs.existsSync(
            path.join(basePathToJson, `metadados/agregado/${agregado.id}.json`),
          ),
      )
      .map((agregado) =>
        limit(() => {
          fetchDataAndSaveAsJson({
            urlName: `agregados/${agregado.id}/metadados`,
            pathname: `metadados/agregado/${agregado.id}`,
          })
        }),
      ),
  )

  console.log(chalk.blue(`Missing metadados: ${promises.length}`))

  await Promise.all(promises)
}
