import './globals.css'
import { Inter as FontSans } from 'next/font/google'

import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { ToggleTheme } from '@/components/theme/toggle-theme'
import { Metadata } from 'next'
import ShareDialog from '@/components/share/share-dialog'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'IBGE Agregados',
  description: 'Visualize dados agregados do IBGE',
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="flex justify-center z-10 border-b sticky top-0 backdrop-blur-sm bg-background/45">
            <div className="flex max-w-screen-xl flex-1 items-center justify-between px-2 py-1 ">
              <ToggleTheme />
              <h1
                className="
            text-2xl tracking-tight text font-bold"
              >
                Dados Agregados do IBGE
              </h1>
              <ShareDialog />
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
