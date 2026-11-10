import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProducts } from '../services/productStore'
import { cartRepository } from '../services/cartStore'
import ProductCard from '../components/ProductCard'

export default function ProductoDetalle() {
  const [params] = useSearchParams()
  const { products, error } = useProducts()
  const product = products.find((row) => row.id === params.get('id'))
  const [quantity, setQuantity] = useState(1)
  return <main className="container py-5 catalogo-page">
    <Link to="/productos.html">Volver a productos</Link>
    {error && <p role="alert">{error}</p>}
    {!product ? <><h1>Producto no encontrado</h1><p>El identificador no existe o el producto ya no está disponible.</p></> : <>
      <h1 id="detalleNombre">{product.nombre}</h1><p id="detalleCategoria">{product.categoria}</p>
      <div className="catalogo-grid"><ProductCard key={product.id} imageId="detalleImagen" product={product} onAdd={(item) => {
        if (!Number.isSafeInteger(quantity) || quantity < 1) throw new Error('Cantidad inválida')
        cartRepository.add({ ...item, cantidad: quantity })
      }} /></div>
      <label htmlFor="detalle-cantidad" className="form-label mt-3">Cantidad</label>
      <input id="detalle-cantidad" className="form-control commerce-number" type="number" min={1} step={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
      <details className="mt-3"><summary>Información del producto</summary><p>{product.descripcion}</p><p>Precio por unidad. Entrega y pago simulados disponibles en el carrito.</p></details>
    </>}
  </main>
}
