import path from 'path'
import fs from 'fs'
import { Pesquisa, Metadado } from '@/types/agregado'
import { basePathToJson, fetchDataAndSaveAsJson } from '@/lib/create-json'
import pLimit from 'p-limit'
import chalk from 'chalk'

export async function fetchAllMissingAgregadoMetadados() {
  const limit = pLimit(1)

  const pathToAgregados = path.join(basePathToJson, 'agregados.json')
  const agregados = JSON.parse(
    fs.readFileSync(pathToAgregados, 'utf-8'),
  ) as Pesquisa[]

  const promises = agregados.flatMap((pesquisa) =>
    pesquisa.agregados
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

export async function fetchAllMissingAgregadoPeriodos() {
  const limit = pLimit(6)

  const pathToAgregados = path.join(basePathToJson, 'agregados.json')
  const agregados = JSON.parse(
    fs.readFileSync(pathToAgregados, 'utf-8'),
  ) as Pesquisa[]

  const promises = agregados.flatMap((pesquisa) =>
    pesquisa.agregados
      .filter(
        (agregado) =>
          !fs.existsSync(
            path.join(basePathToJson, `periodos/agregado/${agregado.id}.json`),
          ),
      )
      .map((agregado) =>
        limit(() => {
          fetchDataAndSaveAsJson({
            urlName: `agregados/${agregado.id}/periodos`,
            pathname: `periodos/agregado/${agregado.id}`,
          })
        }),
      ),
  )

  console.log(chalk.blue(`Missing agregado periodo: ${promises.length}`))

  await Promise.all(promises)
}

export async function fetchAllMissingNivelGeografico() {
  const limit = pLimit(1)

  const pathToAgregados = path.join(basePathToJson, 'agregados.json')
  const agregados = JSON.parse(
    fs.readFileSync(pathToAgregados, 'utf-8'),
  ) as Pesquisa[]

  const niveisTerritoriais: Record<string, number> = {}

  agregados.forEach((pesquisa) => {
    pesquisa.agregados.forEach((agregado) => {
      const pathToMetadado = path.join(
        basePathToJson,
        `metadados/agregado/${agregado.id}.json`,
      )
      let metadado: Metadado
      try {
        metadado = JSON.parse(
          fs.readFileSync(pathToMetadado, 'utf-8'),
        ) as Metadado
      } catch (e) {
        console.log(chalk.red(`Error reading file ${pathToMetadado}`))
        return
      }

      metadado.nivelTerritorial.IBGE.forEach((nivel) => {
        niveisTerritoriais[nivel] = metadado.id
      })
      metadado.nivelTerritorial.Administrativo.forEach((nivel) => {
        niveisTerritoriais[nivel] = metadado.id
      })
      metadado.nivelTerritorial.Especial.forEach((nivel) => {
        niveisTerritoriais[nivel] = metadado.id
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
