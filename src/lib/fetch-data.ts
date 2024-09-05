import { NivelId } from '@/types/agregado'
import { GeoJson } from '@/types/map'
import { ONE_DAY_IN_SECONDS } from './utils'

export async function fetchGeoJsonMap(nivelId: NivelId): Promise<GeoJson> {
  const response = await fetch(`/api/geo-json/${nivelId}`, {
    next: {
      revalidate: ONE_DAY_IN_SECONDS,
    },
  })
  const data = await response.json()
  return data
}
