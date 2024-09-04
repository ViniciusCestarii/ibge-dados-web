import { LocalGeografico, NivelId } from '@/types/agregado'
import { ONE_DAY_IN_SECONDS } from './utils'

export async function fetchGeoJsonMap(
  nivelId: NivelId,
): Promise<LocalGeografico[]> {
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
