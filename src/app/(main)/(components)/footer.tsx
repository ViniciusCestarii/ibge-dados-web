const Footer = () => {
  return (
    <footer className="flex justify-center z-10 border-t sticky top-0 backdrop-blur-sm bg-background/45">
      <div className="flex max-w-screen-xl flex-1 items-center text-center flex-col text-sm gap-2 p-2 ">
        <span>© 2024 Vinicius Cestari. Todos os direitos reservados</span>
        <span>
          Lançado sob a{' '}
          <a
            className="underline"
            target="_blank"
            href="https://github.com/ViniciusCestarii/ibge-dados-web/blob/main/LICENSE"
            rel="noopener noreferrer"
          >
            Licença MIT
          </a>
        </span>
        <div className="w-full flex justify-end gap-1">
          Desenvolvido por
          <address className="not-italic">
            <a
              className="underline"
              target="_blank"
              href="https://github.com/ViniciusCestarii"
              rel="noopener noreferrer"
            >
              Vinicius Cestari
            </a>
          </address>
        </div>
      </div>
    </footer>
  )
}

export default Footer
