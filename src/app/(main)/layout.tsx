import { ToggleTheme } from '@/components/theme/toggle-theme'
import ShareDialog from '@/components/share/share-dialog'

interface MainPageProps {
  children: React.ReactNode
}

export default function MainPage({ children }: MainPageProps) {
  return (
    <>
      <header className="flex justify-center z-10 border-b sticky top-0 backdrop-blur-sm bg-background/45">
        <div className="flex max-w-screen-xl flex-1 items-center justify-between px-2 py-1 ">
          <ToggleTheme />
          <h1
            className="
            text-2xl tracking-tight text font-bold text-center"
          >
            Dados Agregados do IBGE
          </h1>
          <ShareDialog />
        </div>
      </header>
      {children}
    </>
  )
}
