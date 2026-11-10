export type ProductColor = { nombre: string; color: string; imagen: string }

export type Product = {
  id: string
  nombre: string
  descripcion: string
  precio: number
  categoria: string
  imagen: string
  colores: ProductColor[]
  codigo?: string
  stock?: number
  stockCritico?: number | ''
  oferta?: boolean
}

export type StoragePort = Pick<Storage, 'getItem' | 'setItem'>
