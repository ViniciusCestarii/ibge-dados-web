import chalk from 'chalk'
import fs from 'fs'

interface Feature {
  properties: {
    uf_municipio?: string
    name?: string
  }
}

interface GeoJSON {
  type: string
  features: Feature[]
}

const ufSiglaMap: { [key: string]: string } = {
  Acre: 'AC',
  Alagoas: 'AL',
  Amazonas: 'AM',
  Bahia: 'BA',
  Ceará: 'CE',
  'Distrito Federal': 'DF',
  'Espírito Santo': 'ES',
  Goiás: 'GO',
  Maranhão: 'MA',
  'Mato Grosso': 'MT',
  'Mato Grosso do Sul': 'MS',
  'Minas Gerais': 'MG',
  Pará: 'PA',
  Paraíba: 'PB',
  Paraná: 'PR',
  Pernambuco: 'PE',
  Piauí: 'PI',
  'Rio de Janeiro': 'RJ',
  'Rio Grande do Norte': 'RN',
  'Rio Grande do Sul': 'RS',
  Rondônia: 'RO',
  Roraima: 'RR',
  'Santa Catarina': 'SC',
  'São Paulo': 'SP',
  Sergipe: 'SE',
  Tocantins: 'TO',
}

// change the path to modify the file you want
checkPropertiesInGeoJSON(
  'C:/Users/YOUR_USER/Downloads/geojs-100-mun-v2.geojson',
)

function checkPropertiesInGeoJSON(path: string) {
  const geojson = JSON.parse(fs.readFileSync(path, 'utf8')) as GeoJSON

  geojson.features = geojson.features.map((feature: Feature) => {
    if (!feature.properties.uf_municipio) {
      return feature
    }
    const uf = feature.properties.uf_municipio?.split('-')[0].trim()
    const sigla = ufSiglaMap[uf]

    return {
      ...feature,
      properties: {
        ...feature.properties,
        uf_municipio: feature.properties.uf_municipio,
        name: `${feature.properties.name} (${sigla})`,
      },
    }
  })

  const newPath = path.replace('.', '-fixed.')

  fs.writeFileSync(newPath, JSON.stringify(geojson), 'utf8')
  console.log(chalk.green(`File saved at ${newPath}`))
}

interface Feature {
  properties: {
    uf_municipio?: string
    name?: string
  }
}
