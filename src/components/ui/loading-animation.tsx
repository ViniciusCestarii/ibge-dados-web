'use client'
import { Player } from '@lottiefiles/react-lottie-player'
import { useTheme } from 'next-themes'

const lightAnimation =
  'https://lottie.host/4b5d1abc-8830-4731-a428-492a30d31340/xvqhSDXKPT.json'
const darkAnimation =
  'https://lottie.host/322faed9-3c2f-4b6d-a559-01db4673a426/2nYNSPPfxp.json'

const LoadingAnimation = () => {
  const theme = useTheme()

  const isDark = theme.resolvedTheme === 'dark'

  const animation = isDark ? darkAnimation : lightAnimation

  return (
    <Player
      autoplay
      loop
      src={animation}
      className="max-w-screen-sm w-full aspect-square p-12 animate-fade-in"
    />
  )
}

export default LoadingAnimation
