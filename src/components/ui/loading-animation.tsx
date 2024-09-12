'use client'
import { cn } from '@/lib/utils'
import { Player } from '@lottiefiles/react-lottie-player'
import { useTheme } from 'next-themes'
import { useState } from 'react'

const lightAnimation =
  'https://lottie.host/4b5d1abc-8830-4731-a428-492a30d31340/xvqhSDXKPT.json'
const darkAnimation =
  'https://lottie.host/322faed9-3c2f-4b6d-a559-01db4673a426/2nYNSPPfxp.json'

const LoadingAnimation = () => {
  const { resolvedTheme } = useTheme()
  const [fadeIn, setFadeIn] = useState(false)

  const isDark = resolvedTheme === 'dark'
  const animation = isDark ? darkAnimation : lightAnimation

  const handlePlayerEvent = (event: string) => {
    if (event === 'frame') {
      setFadeIn(true)
    }
  }

  return (
    <Player
      onEvent={handlePlayerEvent}
      autoplay
      loop
      src={animation}
      className={cn(
        'opacity-0 max-w-screen-sm w-full aspect-square p-12',
        fadeIn && 'opacity-100 transition-opacity duration-500',
      )}
    />
  )
}

export default LoadingAnimation
