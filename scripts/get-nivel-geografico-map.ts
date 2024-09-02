import { LocalGeografico } from '@/types/agregado'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

const mapJsonFilesInDirectory = (): LocalGeografico[] => {
  const directoryPath = path.resolve('src/json/nivel-geografico')
  const files = fs.readdirSync(directoryPath)

  const jsonObjects = files
    .filter((fileName) => path.extname(fileName) === '.json')
    .flatMap((fileName) => {
      const filePath = path.join(directoryPath, fileName)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(fileContent)
    })

  return jsonObjects
}

export const createNivelGeograficoMap = async () => {
  const nivelGeograficoMap: Map<string, string> = new Map()

  mapJsonFilesInDirectory().forEach((local) => {
    if (nivelGeograficoMap.has(local.nivel.id)) return

    nivelGeograficoMap.set(local.nivel.id, local.nivel.nome)
  })

  const nivelGeograficoObject = Object.fromEntries(nivelGeograficoMap) // Convert Map to Object

  fs.writeFileSync(
    path.resolve('src/json/nivel-geografico-map.json'),
    JSON.stringify(nivelGeograficoObject, null, 2),
    'utf-8',
  )

  console.log(chalk.green(`✅ Created nivel agregado map`))
}
