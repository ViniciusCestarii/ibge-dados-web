import fs from 'fs'
import path from 'path'
import env from '@/env'
import chalk from 'chalk'

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
    const filePath = path.resolve(__dirname, '../json/', jsonFileName)

    createJsonFile(filePath, data)
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

const createJsonFile = (pathname: string, data: unknown) => {
  const dir = path.dirname(pathname)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(chalk.green(`✅ Created directory: ${dir}`))
  }

  fs.writeFileSync(pathname, JSON.stringify(data, null, 2), 'utf-8')
}

const getIbgeUrl = (pathname: string) => {
  return `${env.IBGE_BASE_URL}/${pathname}`
}