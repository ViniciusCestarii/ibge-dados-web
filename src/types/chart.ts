import { FetchParams } from '@/lib/utils'

export type ChartData = {
  localidade: string
  name: string
  value: number
}[]

export type ChartProps = {
  fetchParams: FetchParams
}

export type ChartOptions = {
  title: string
  unidade: string
}

export type ChartCoreProps = {
  data: ChartData
  options: ChartOptions
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
