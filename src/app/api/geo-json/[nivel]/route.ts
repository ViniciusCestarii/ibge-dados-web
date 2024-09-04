import { getGeoJsonMap } from '@/lib/get-json'

export const dynamic = 'force-static'

export async function GET(
  _: Request,
  { params }: { params: { nivel: string } },
) {
  const geoJson = await getGeoJsonMap(params.nivel)
  return Response.json(geoJson)
}
