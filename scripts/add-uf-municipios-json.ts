import { fetchIbgeData } from '@/lib/create-json'
import { Localidade } from '@/types/agregado'
import chalk from 'chalk'
import fs from 'fs'

interface Regiao {
  id: number
  sigla: string
  nome: string
}

interface UF {
  id: number
  sigla: string
  nome: string
  regiao: Regiao
}

interface Mesorregiao {
  id: number
  nome: string
  UF: UF
}

interface Microrregiao {
  id: number
  nome: string
  mesorregiao: Mesorregiao
}

interface RegiaoIntermediaria {
  id: number
  nome: string
  UF: UF
}

interface RegiaoImediata {
  id: number
  nome: string
  'regiao-intermediaria': RegiaoIntermediaria
}

interface Municipio {
  id: number
  nome: string
  microrregiao: Microrregiao
  'regiao-imediata': RegiaoImediata
}

async function addUfMunicipiosJson() {
  const path = 'src/json/nivel-geografico/N6.json'
  const municipiosJson = JSON.parse(
    fs.readFileSync(path, 'utf8'),
  ) as Localidade[]

  const municipiosWithUf: Localidade[] = []

  municipiosJson.forEach(async (municipio, index) => {
    if (!(municipio.nome.includes('(') && municipio.nome.includes(')'))) {
      try {
        const response = await fetchIbgeData(
          `v1/localidades/municipios/${municipio.id}`,
        )
        const { data } = response as { data: Municipio }
        const uf = data['regiao-imediata']['regiao-intermediaria'].UF.sigla
        const newName = `${municipio.nome} (${uf})`
        municipiosWithUf.push({ ...municipio, nome: newName })
        console.log(
          chalk.green(
            `Fetched data for ${municipio.nome} ${municipiosJson.length - index} remaining`,
          ),
        )
      } catch (error) {
        console.error(
          chalk.red(`Error fetching data for ${municipio.nome}: ${error}`),
        )
      }
    }
  })

  try {
    const municipiosWithUfJson = JSON.stringify(municipiosWithUf, null, 2)
    fs.writeFileSync(path, municipiosWithUfJson, 'utf8')
    console.log(chalk.green(`File saved at ${path}`))
  } catch (error) {
    console.error(chalk.red('Error writing file:', error))
  }
}

addUfMunicipiosJson()
