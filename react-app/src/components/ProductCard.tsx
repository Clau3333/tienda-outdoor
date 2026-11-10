import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Product } from '../data/productTypes'
import type { CartItem } from '../services/cartRepository'
import { formatPrice, productCartItem, productImageUrl, selectedColor } from '../services/productSelection'
import { useCart } from '../services/cartStore'

type ProductCardProps = { product: Product; onAdd: (item: CartItem) => void; imageId?: string }

export default function ProductCard({ product, onAdd, imageId }: ProductCardProps) {
  const [colorName, setColorName] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  const selected = selectedColor(product, colorName)
  const { items } = useCart()
  const units = items.filter((item) => item.id === product.id && item.color === (selected?.nombre ?? ''))
    .reduce((sum, item) => sum + item.cantidad, 0)
  const previewColor = product.colores.find((color) => color.nombre === preview)
  const image = previewColor?.imagen ?? selected?.imagen ?? product.imagen
  const detailUrl = `/producto-detalle.html?id=${encodeURIComponent(product.id)}`
  const noImage = product.id.startsWith('admin-') && product.imagen === 'img/logo-albedo.png'

  function add() {
    if (added) return
    try {
      onAdd(productCartItem(product, colorName))
      setError('')
      setAdded(true)
      timer.current = setTimeout(() => setAdded(false), 1200)
    } catch {
      setError('No se pudo guardar el producto en el carrito. Revisa el almacenamiento del navegador e inténtalo de nuevo.')
    }
  }

  return (
    <article className="producto-catalogo" data-producto-id={product.id}>
      <a className="catalogo-imagen" href={detailUrl} aria-label={`Ver detalle de ${product.nombre}`}>
        {noImage ? <span className="catalogo-sin-imagen">Sin imagen disponible</span>
          : <img id={imageId} src={productImageUrl(image)} alt={product.nombre} />}
      </a>
      <a className="catalogo-titulo-enlace" href={detailUrl}><h3>{product.nombre}</h3></a>
      <p className="catalogo-descripcion-producto">{product.descripcion}</p>
      <p className="catalogo-precio">{formatPrice(product.precio)}</p>
      {product.oferta && <p className="badge text-bg-warning">Oferta · precio publicado</p>}
      {product.colores.length > 0 && (
        <div className="colores-producto" onMouseLeave={() => setPreview(null)}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPreview(null) }}>
          {product.colores.map((color) => (
            <button key={color.nombre} type="button"
              className={`color-swatch${selected?.nombre === color.nombre ? ' activo' : ''}`}
              aria-label={`${product.nombre} color ${color.nombre}`} title={color.nombre}
              aria-pressed={selected?.nombre === color.nombre}
              style={{ '--color-producto': color.color } as CSSProperties}
              onMouseEnter={() => setPreview(color.nombre)} onFocus={() => setPreview(color.nombre)}
              onClick={() => { setColorName(color.nombre); setPreview(null) }} />
          ))}
        </div>
      )}
      <button className="boton-albedo catalogo-agregar-carrito" type="button" disabled={added} onClick={add}
        title={units > 0 ? `${units} unidades en carrito${selected ? ` · ${selected.nombre}` : ''}` : undefined}>
        {added ? 'Añadido ✓' : 'Añadir al carrito'}
        {units > 0 && <span aria-label={`${units} unidades${selected ? `, color ${selected.nombre}` : ''}`}>&nbsp;({units})</span>}
      </button>
      <span className="visually-hidden" role="status">{added ? `${product.nombre} añadido al carrito` : ''}</span>
      {error && <p className="text-danger small mt-2" role="alert">{error}</p>}
      <a className="catalogo-ver-detalle" href={detailUrl}>Ver detalle →</a>
    </article>
  )
}
