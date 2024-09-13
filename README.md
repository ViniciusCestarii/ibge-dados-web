# IBGE Dados Web

**IBGE Dados Web** é uma aplicação web que consome a [API de Agregados do IBGE](https://servicodados.ibge.gov.br/api/docs/agregados) para exibir dados estatísticos do Brasil em gráficos interativos e fáceis de visualizar. Com esta aplicação, você pode explorar diversas informações agregadas sobre temas econômicos, sociais, demográficos, entre outros.

## Exemplos de visualização

- [Produto interno bruto do Brasil por trimestre](https://ibge-dados-web.vercel.app/frame?pesquisa=ST&agregado=2072&variavel=933&periodos=202401,202304,202303,202302,202301,202204,202203,202202,202201,202104,202103,202102,202101,202004,202003,202002,202001,201904,201903,201902,201901,201804,201803,201802,201801,201704,201703,201702,201701,201604,201603,201602,201601,201504,201503,201502,201501,201404,201403,201402,201401,201304,201303,201302,201301,201204,201203,201202,201201,201104,201103,201102,201101,201004,201003,201002,201001,200904,200903,200902,200901,200804,200803,200802,200801,200704,200703,200702,200701,200604,200603,200602,200601,200504,200503,200502,200501,200404,200403,200402,200401,200304,200303,200302,200301,200204,200203,200202,200201,200104,200103,200102,200101,200004,200003,200002,200001&nivelGeografico=N1&locais=1)

- [Pessoas de 18 ou mais de idade com pressão alta por estado](https://ibge-dados-web.vercel.app/frame?pesquisa=XN&agregado=8499&variavel=12426&periodos=2013&nivelGeografico=N3&locais=25,26,24,23,41,51,52,53,50,43,42,35,33,32,31,29,28,27,22,21,17,16,15,14,13,12,11)

## Funcionalidades

- Visualização interativa de dados estatísticos do IBGE.
- Gráficos dinâmicos para facilitar a compreensão dos dados.
- Interface amigável e responsiva.
- Filtros para seleção de dados por período, região ou categoria.

## Tecnologias Utilizadas

- **Frontend**: React.js, Shadcn/ui
- **Biblioteca de gráficos**: Apache Echarts
- **Backend**: SSR Next.js
- **Estilização**: Tailwind CSS

## Como Rodar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/ViniciusCestarii/ibge-dados-web.git
   cd ibge-dados-web
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
    npm run dev
    ```

4. **Acesse a aplicação em seu navegador:**
    ```
    http://localhost:3000
    ```

## Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE](LICENSE) para obter detalhes.
