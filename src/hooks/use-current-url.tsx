import { usePathname, useSearchParams } from 'next/navigation'

export const useCurrentUrl = () => {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (pathname === '/' && searchParams.size === 0) {
    return origin
  }

  if (searchParams.size === 0) {
    return `${origin}${pathname}`
  }

  return `${origin}${pathname}?${searchParams.toString()}`
}
