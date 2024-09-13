import { useTheme } from 'next-themes'

const useAppliedTheme = () => {
  const { resolvedTheme, forcedTheme } = useTheme()

  const appliedTheme = forcedTheme ?? resolvedTheme

  return appliedTheme
}

export default useAppliedTheme
