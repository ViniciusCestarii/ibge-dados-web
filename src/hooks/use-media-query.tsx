'use client'
import { useEffect, useState } from 'react'

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    const documentChangeHandler = () => setMatches(mediaQueryList.matches)

    setMatches(mediaQueryList.matches)

    mediaQueryList.addEventListener('change', documentChangeHandler)

    return () => {
      mediaQueryList.removeEventListener('change', documentChangeHandler)
    }
  }, [query])

  return matches
}

export default useMediaQuery
