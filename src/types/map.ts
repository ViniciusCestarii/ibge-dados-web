export type ChartData = {
  name: string
  value: number
}[]

export type ChartOptions = {
  title: string
  unidade: string
}

export interface GeoJsonFeature {
  type: string
  geometry: {
    type: string
    coordinates: number[][][]
  }
  properties: {
    name?: string
    [key: string]: any
  }
}

export interface GeoJson {
  type: string
  features: GeoJsonFeature[]
}
