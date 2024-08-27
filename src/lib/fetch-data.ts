import fs from 'fs'
import path from 'path'
import env from '@/env'
import chalk from 'chalk'

interface FetchDataAndSaveAsJson {
  pathname: string
  urlName: string
}

export const fetchDataAndSaveAsJson = async ({
  pathname,
  urlName,
}: FetchDataAndSaveAsJson) => {
  try {
    const data = await fetchIbgeData(urlName)
    createJsonFile(pathname, data)
    console.log(chalk.green(`✅ Created JSON file: ${pathname}.json`))
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        chalk.red(
          `❌ Error for JSON file ${pathname}.json of url ${urlName}: ${error.message}`,
        ),
      )
    }
  }
}

const fetchIbgeData = async (name: string) => {
  const url = `${env.IBGE_BASE_URL}/${name}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `failed with status ${response.status}: ${response.statusText}`,
    )
  }
  const data = await response.json()

  return data
}

const createJsonFile = (filename: string, data: unknown) => {
  const jsonFileName = filename.endsWith('.json')
    ? filename
    : `${filename}.json`
  const filePath = path.resolve(__dirname, '../json/', jsonFileName)

  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(chalk.green(`✅ Created directory: ${dir}`))
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  console.log(chalk.green(`✅ Created JSON file: ${filePath}`))
}
