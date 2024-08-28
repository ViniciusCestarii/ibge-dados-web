import path from 'path'
import fs from 'fs'
import { Categoria, Tabela } from '@/types/agregado'
import { basePathToJson, fetchDataAndSaveAsJson } from '@/lib/fetch-data'
import pLimit from 'p-limit'
import chalk from 'chalk'

export async function fetchAllMissingAgregadoMetadados() {
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

export async function fetchAllMissingNivelGeografico() {
  const limit = pLimit(1)

  const pathToAgregados = path.join(basePathToJson, 'agregados.json')
  const agregados = JSON.parse(
    fs.readFileSync(pathToAgregados, 'utf-8'),
  ) as Categoria[]

  const niveisTerritoriais: Record<string, number> = {}

  agregados.forEach((categoria) => {
    categoria.agregados.forEach((agregado) => {
      const pathToMetadado = path.join(
        basePathToJson,
        `metadados/agregado/${agregado.id}.json`,
      )
      let tabela: Tabela
      try {
        tabela = JSON.parse(fs.readFileSync(pathToMetadado, 'utf-8')) as Tabela
      } catch (e) {
        console.log(chalk.red(`Error reading file ${pathToMetadado}`))
        return
      }

      tabela.nivelTerritorial.IBGE.forEach((nivel) => {
        niveisTerritoriais[nivel] = tabela.id
      })
      tabela.nivelTerritorial.Administrativo.forEach((nivel) => {
        niveisTerritoriais[nivel] = tabela.id
      })
      tabela.nivelTerritorial.Especial.forEach((nivel) => {
        niveisTerritoriais[nivel] = tabela.id
      })
    })
  })

  const promises: Promise<void>[] = []

  for (const [nivel, id] of Object.entries(niveisTerritoriais)) {
    if (
      !fs.existsSync(
        path.join(basePathToJson, `nivel-geografico/${nivel}.json`),
      )
    ) {
      promises.push(
        limit(() =>
          fetchDataAndSaveAsJson({
            urlName: `agregados/${id}/localidades/${nivel}`,
            pathname: `nivel-geografico/${nivel}`,
          }),
        ),
      )
    }
  }

  console.log(chalk.blue(`Missing Niveis: ${promises.length}`))

  await Promise.all(promises)
}
