import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { getIbgeUrl, ONE_DAY_IN_SECONDS } from './utils'
import { LocalGeografico, NivelId } from '@/types/agregado'

export const basePathToJson = path.join(__dirname, '../json')

interface FetchDataAndSaveAsJson {
  pathname: string
  urlName: string
}

export const fetchDataAndSaveAsJson = async ({
  pathname,
  urlName,
}: FetchDataAndSaveAsJson) => {
  try {
    const { data } = await fetchIbgeData(urlName)
    const jsonFileName = pathname.endsWith('.json')
      ? pathname
      : `${pathname}.json`
    const filePath = path.resolve(basePathToJson, jsonFileName)

    await createJsonFile(filePath, data)
    console.log(
      chalk.green(
        `✅ Created JSON file: ${filePath} from url ${getIbgeUrl(urlName)}`,
      ),
    )
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        chalk.red(
          `❌ Error for JSON file ${pathname}.json of url ${getIbgeUrl(urlName)}: ${error.message}`,
        ),
      )
    }
  }
}

const fetchIbgeData = async (pathname: string) => {
  const url = getIbgeUrl(pathname)

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `failed with status ${response.status}: ${response.statusText}`,
    )
  }
  const data = await response.json()

  return { data, response }
}

const createJsonFile = async (pathname: string, data: unknown) => {
  const dir = path.dirname(pathname)
  try {
    await fs.promises.access(dir)
  } catch {
    await fs.promises.mkdir(dir, { recursive: true })
    console.log(chalk.green(`✅ Created directory: ${dir}`))
  }

  await fs.promises.writeFile(pathname, JSON.stringify(data, null, 2), 'utf-8')
}

async function getGeoJsonMap(nivelId: NivelId): Promise<LocalGeografico[]> {
  const response = await fetch(
    `http://localhost:3000/api/geo-json/${nivelId}`,
    {
      next: {
        revalidate: ONE_DAY_IN_SECONDS,
      },
    },
  )
  const data = await response.json()
  return data
}
