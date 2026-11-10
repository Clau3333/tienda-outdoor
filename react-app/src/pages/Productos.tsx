import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { categoryDefinitions } from '../data/products'
import { useProducts } from '../services/productStore'
import { cartRepository } from '../services/cartStore'
import './Productos.css'

export default function Productos() {
  const { products, error } = useProducts()
  const { hash, key } = useLocation()
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [offersOnly, setOffersOnly] = useState(false)
  const [sort, setSort] = useState('original')
  const filtered = products.filter((product) => (!selectedCategory || product.categoria === selectedCategory)
    && (!offersOnly || product.oferta === true)
    && `${product.nombre} ${product.descripcion} ${product.codigo ?? ''}`.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es')))
    .sort((a, b) => sort === 'asc' ? a.precio - b.precio : sort === 'desc' ? b.precio - a.precio : sort === 'nombre' ? a.nombre.localeCompare(b.nombre, 'es') : 0)
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
        <div className="row g-3 mt-3 commerce-form">
          <div className="col-12 col-md-6"><label className="form-label" htmlFor="buscar-productos">Buscar productos</label><input id="buscar-productos" className="form-control" type="search" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
          <div className="col-12 col-md-6"><label className="form-label" htmlFor="filtrar-categoria">Categoría</label><select className="form-select" id="filtrar-categoria" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}><option value="">Todas</option>{categoryDefinitions.map((c) => <option key={c.anchor}>{c.nombre}</option>)}</select></div>
          <div className="col-12 col-md-6"><label htmlFor="ordenar-productos" className="form-label">Ordenar</label><select className="form-select" id="ordenar-productos" value={sort} onChange={(e) => setSort(e.target.value)}><option value="original">Orden original</option><option value="asc">Menor precio</option><option value="desc">Mayor precio</option><option value="nombre">Nombre</option></select></div>
          <div className="col-12 col-md-6 align-self-end"><label><input type="checkbox" checked={offersOnly} onChange={(e) => setOffersOnly(e.target.checked)} /> Solo ofertas marcadas por administración</label></div>
        </div>
        <p role="status" className="mt-3">{filtered.length} productos encontrados.</p>
        <button type="button" className="btn btn-outline-secondary" onClick={() => { setQuery(''); setSelectedCategory(''); setOffersOnly(false); setSort('original') }}>Limpiar filtros</button>
      </section>
      {categoryDefinitions.map((category) => (
        <section key={category.anchor} className="categoria-productos" aria-labelledby={category.anchor}>
          <div className="categoria-encabezado">
            <div><p className="categoria-numero">{category.numero}</p><h2 id={category.anchor}>{category.nombre}</h2></div>
            <p>{category.descripcion}</p>
          </div>
          <div className="catalogo-grid" data-categoria={category.nombre}>
            {filtered.filter((product) => product.categoria === category.nombre).map((product) => (
              <ProductCard key={product.id} product={product} onAdd={cartRepository.add} />
            ))}
          </div>
          {!filtered.some((product) => product.categoria === category.nombre) && <p>No hay productos que coincidan en esta categoría.</p>}
        </section>
      ))}
    </main>
  )
}
