import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { categoryDefinitions } from '../data/products'
import { useProducts } from '../services/productStore'
import { cartRepository } from '../services/cartStore'
import './Productos.css'

export default function Productos() {
  const { products, error } = useProducts()
  const { hash, key } = useLocation()
  useEffect(() => {
    const previous = document.title
    document.title = 'ALBEDO Outdoor | Productos'
    return () => { document.title = previous }
  }, [])
  useEffect(() => {
    if (!hash) return
    try { document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start' }) }
    catch { /* Un hash inválido no debe impedir abrir el catálogo. */ }
  }, [hash, key, products])

  return (
    <main className="catalogo-page">
      <section className="catalogo-cabecera">
        <p className="etiqueta">ALBEDO OUTDOOR</p>
        <h1>Productos</h1>
        <p className="catalogo-descripcion">Encuentra tu próxima prenda por categoría.</p>
        {error && <p className="alert alert-warning mt-3" role="alert">{error}</p>}
      </section>
      {categoryDefinitions.map((category) => (
        <section key={category.anchor} className="categoria-productos" aria-labelledby={category.anchor}>
          <div className="categoria-encabezado">
            <div><p className="categoria-numero">{category.numero}</p><h2 id={category.anchor}>{category.nombre}</h2></div>
            <p>{category.descripcion}</p>
          </div>
          <div className="catalogo-grid" data-categoria={category.nombre}>
            {products.filter((product) => product.categoria === category.nombre).map((product) => (
              <ProductCard key={product.id} product={product} onAdd={cartRepository.add} />
            ))}
          </div>
          {!products.some((product) => product.categoria === category.nombre) && <p>No hay productos en esta categoría.</p>}
        </section>
      ))}
    </main>
  )
}
