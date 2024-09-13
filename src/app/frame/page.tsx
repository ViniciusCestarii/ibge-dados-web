import { validFetchParamsSchema } from '@/lib/utils'
import IbgeVisualization from '../(main)/ibge-visualization'
import { searchParamsCache } from '../(main)/search-params'
import PageContent from '../(main)/page-content'

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const parsedSearchParams = searchParamsCache.parse(searchParams)

  const _validFetchParams = validFetchParamsSchema.safeParse(parsedSearchParams)

  if (_validFetchParams.error || _validFetchParams.data === undefined) {
    return <PageContent searchParams={searchParams} />
  }

  return (
    <main className="container mx-auto p-4">
      <IbgeVisualization validFetchParams={_validFetchParams.data} />
    </main>
  )
}
