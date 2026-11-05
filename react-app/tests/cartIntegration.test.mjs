import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { readFile } from 'node:fs/promises'

let server
let base
before(async () => {
  server = await createServer({ server: { host: '127.0.0.1', port: 0, strictPort: false } })
  await server.listen()
  base = `http://127.0.0.1:${server.httpServer.address().port}`
})
after(async () => { await server?.close() })

test('rutas directas React y destinos originales responden por HTTP sin redirecciones al carrito antiguo', async () => {
  for (const path of ['/', '/index.html', '/productos.html', '/carrito.html', '/login.html', '/registro.html']) {
    const response = await fetch(base + path)
    assert.equal(response.status, 200, path)
    assert.equal(response.redirected, false, path)
    assert.match(await response.text(), /src="\/src\/main.tsx"/)
  }
  for (const path of ['nosotros.html', 'blog.html', 'contacto.html', 'login.html', 'registro.html',
    'mis-pedidos.html', 'pedido-detalle.html?id=demo', 'admin-ordenes.html', 'admin-orden-detalle.html?id=demo',
    'producto-detalle.html?id=chaqueta-cordillera']) {
    const response = await fetch(`${base}/Sitio%20Old/${path}`)
    assert.equal(response.status, 200, path)
    assert.match(response.headers.get('content-type'), /text\/html/)
  }
  const image = await fetch(`${base}/Sitio%20Old/img/chaqueta-cordillera.png`)
  assert.equal(image.status, 200)
  assert.match(image.headers.get('content-type'), /image\/png/)
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), await readFile(new URL('../../Sitio Old/img/chaqueta-cordillera.png', import.meta.url)))
})

test('store usado por React notifica contenido con igual contador y limpia suscriptores', async () => {
  const previousWindow = globalThis.window
  const data = new Map()
  const handlers = new Set()
  const storage = { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }
  globalThis.window = { localStorage: storage, addEventListener: (name, fn) => handlers.add(fn), removeEventListener: (name, fn) => handlers.delete(fn) }
  // cartState expone el mismo snapshot usado por useCart/useCartCount.
  try {
    const { cartState, cartRepository } = await server.ssrLoadModule('/src/services/cartStore.ts')
    const item = { id: 'prueba', nombre: 'Prueba', precio: 10, imagen: 'img/chaqueta-cordillera.png', color: 'Negro', cantidad: 2 }
    cartRepository.add(item)
    let updates = 0
    const unsubscribe = cartState.subscribe(() => updates++)
    data.set('carritoAlbedo', JSON.stringify([{ ...item, color: 'Naranja', precio: 20 }]))
    cartState.storageChanged('carritoAlbedo')
    assert.equal(cartState.getSnapshot().count, 2)
    assert.equal(cartState.getSnapshot().total, 40)
    assert.equal(updates, 1)
    unsubscribe()
    cartRepository.clear()
    assert.equal(updates, 1)
    assert.equal(handlers.size, 0)
  } finally {
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
  }
})

test('HTML inicial de Carrito y Header conserva rutas, estado vacío y contador de unidades', async () => {
  const { default: Carrito } = await server.ssrLoadModule('/src/pages/Carrito.tsx')
  const { default: Header } = await server.ssrLoadModule('/src/components/Header.tsx')
  const { default: ThemeProvider } = await server.ssrLoadModule('/src/theme/ThemeProvider.tsx')
  const html = renderToStaticMarkup(createElement(ThemeProvider, null, createElement(MemoryRouter, { initialEntries: ['/carrito.html'] },
    createElement(Header, { cartCount: 7 }), createElement(Carrito))))
  assert.match(html, /Tu carrito está vacío/)
  assert.match(html, /href="\/productos.html"/)
  assert.match(html, /<a\b(?=[^>]*href="\/carrito.html")(?=[^>]*aria-current="page")[^>]*>/)
  assert.match(html, /aria-label="7 unidades en el carrito"/)
  assert.doesNotMatch(html, /href="\/Sitio%20Old\/carrito.html"/)
})
