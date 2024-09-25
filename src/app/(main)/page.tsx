import { Suspense } from 'react'
import PageContent from './(components)/page-content'
import LoadingAnimation from '@/components/ui/loading-animation'

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <PageContent searchParams={searchParams} />
    </Suspense>
  )
}
