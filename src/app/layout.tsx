import './globals.css'
import { Inter as FontSans } from 'next/font/google'

import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { ToggleTheme } from '@/components/theme/toggle-theme'
import { Metadata } from 'next'

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
          <header>
            <ToggleTheme />
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
