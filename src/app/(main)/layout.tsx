import { ThemeProvider } from '@/components/theme/theme-provider'
import Footer from './(components)/footer'
import Header from './(components)/header'

interface MainPageProps {
  children: React.ReactNode
}

export default function MainPage({ children }: MainPageProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Header />
      <main className="container mx-auto p-4 min-h-screen">{children}</main>
      <Footer />
    </ThemeProvider>
  )
}
