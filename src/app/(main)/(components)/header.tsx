import ShareDialog from '@/components/share/share-dialog'
import { ToggleTheme } from '@/components/theme/toggle-theme'

const Header = () => {
  return (
    <header className="flex justify-center z-10 border-b sticky top-0 backdrop-blur-sm bg-background/45">
      <div className="flex max-w-screen-xl flex-1 items-center justify-between gap-1 px-2 py-1 ">
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
  )
}

export default Header
