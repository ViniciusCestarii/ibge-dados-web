import { validFetchParamsSchema } from '@/lib/utils'
import { searchParamsCache } from '../search-params'
import PageContent from '../(main)/(components)/page-content'
import IbgeVisualization from '@/components/ibge/ibge-visualization'
import { ThemeProvider } from '@/components/theme/theme-provider'

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const parsedSearchParams = searchParamsCache.parse(searchParams)

  const _validFetchParams = validFetchParamsSchema.safeParse(parsedSearchParams)

  const theme = parsedSearchParams.theme ?? 'light'

  if (_validFetchParams.error || _validFetchParams.data === undefined) {
    return (
      <ThemeProvider
        forcedTheme={theme}
        attribute="class"
        disableTransitionOnChange
      >
        <PageContent searchParams={searchParams} />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider
      forcedTheme={theme}
      attribute="class"
      disableTransitionOnChange
    >
      <main className="container mx-auto p-4">
        <IbgeVisualization fetchParams={_validFetchParams.data} />
      </main>
    </ThemeProvider>
  )
}
