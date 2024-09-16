'use client'
import { cn } from '@/lib/utils'
import { Player } from '@lottiefiles/react-lottie-player'
import { useState } from 'react'

const animation =
  'https://lottie.host/e6d6a8ba-c207-4127-966f-344b175c27fc/D6BoEDbY2Y.json'

interface AstrounautAnimationProps {
  className?: string
}

const AstrounautAnimation = ({ className }: AstrounautAnimationProps) => {
  const [fadeIn, setFadeIn] = useState(false)

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
        'opacity-0 max-w-screen-sm w-full aspect-square',
        fadeIn && 'opacity-100 transition-opacity',
        className,
      )}
    />
  )
}

export default AstrounautAnimation
