export interface Agregado {
  id: string
  nome: string
}

export interface Categoria {
  id: string
  nome: string
  agregados: Agregado[]
}
