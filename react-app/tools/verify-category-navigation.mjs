// Navegación real mediante Chrome instalado y CDP; no instala navegadores ni paquetes.
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { createServer } from 'vite'
import { categories } from '../src/components/navigation.ts'

const root = fileURLToPath(new URL('../', import.meta.url))
const output = join(root, 'test-results')
const chromeBin = process.env.CHROME_BIN || [
  ...[process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA]
    .filter(Boolean).map((directory) => join(directory, 'Google', 'Chrome', 'Application', 'chrome.exe')),
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(existsSync)
if (!chromeBin) throw new Error('Chrome no encontrado. Indica CHROME_BIN; no se instalará ningún navegador.')

const routes = ['/', '/index.html', '/productos.html', '/carrito.html', '/login.html', '/registro.html',
  '/Sitio%20Old/index.html', '/Sitio%20Old/productos.html']
const widths = [360, 480, 700, 701, 768, 900, 901, 1024, 1440]
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const results = []
const errors = []
const report = { date: new Date().toISOString(), browser: '', origin: '', height: 900, widths, routes, results, errors }
let server, chrome, socket
let requestId = 0
const pending = new Map()
function send(method, params = {}) {
  if (socket?.readyState !== WebSocket.OPEN) return Promise.reject(new Error('Chrome desconectado: ' + method))
  return new Promise((resolve, reject) => {
    const id = ++requestId
    const timer = setTimeout(() => { pending.delete(id); reject(new Error('CDP timeout: ' + method)) }, 15000)
    pending.set(id, (message) => {
      clearTimeout(timer)
      if (message.error) reject(new Error(JSON.stringify(message.error)))
      else resolve(message.result)
    })
    socket.send(JSON.stringify({ id, method, params }))
  })
}
async function evaluate(expression) {
  const reply = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (reply.exceptionDetails) throw new Error(reply.exceptionDetails.text + ' ' + reply.exceptionDetails.exception?.description)
  return reply.result.value
}
async function until(expression) {
  for (let n = 0; n < 150; n++) {
    if (await evaluate(expression)) return
    await sleep(40)
  }
  throw new Error('No se cumplió: ' + expression)
}
async function navigate(path, ready = 'document.querySelectorAll(".categoria-acciones").length === 3 && !!document.querySelector(".theme-toggle, .tema-albedo-boton")') {
  await send('Page.navigate', { url: new URL(path, report.origin).href })
  await until(`location.pathname === ${JSON.stringify(new URL(path, report.origin).pathname)} && (${ready})`)
}
async function key(key, code, virtualKey, text, modifiers = 0) {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: virtualKey, text, modifiers })
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: virtualKey, modifiers })
  await sleep(20)
}
const selector = (index) => `.menu-categorias .mega-item:nth-child(${index + 1}) .categoria-acciones`
async function point(selector) {
  return evaluate(`(() => { const e = document.querySelector(${JSON.stringify(selector)}); e.scrollIntoView({block:'nearest',behavior:'instant'}); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2} })()`)
}
async function move(selector) {
  const p = await point(selector)
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...p })
  await sleep(30)
}
async function activate(selector, touch = false) {
  const p = await point(selector)
  if (touch) {
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...p, radiusX: 1, radiusY: 1 }] })
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  } else {
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...p })
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...p })
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...p })
  }
  await sleep(30)
}
async function countOpen() {
  return evaluate('[...document.querySelectorAll(".mega-panel")].filter(p=>!p.hidden).length')
}
async function close() {
  await key('Escape', 'Escape', 27)
  assert.equal(await countOpen(), 0)
}
async function viewport(width, touch) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: touch })
  await send('Emulation.setTouchEmulationEnabled', { enabled: touch, maxTouchPoints: 1 })
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 1 })
}
async function theme(name) {
  const dark = await evaluate('document.documentElement.dataset.bsTheme === "dark"')
  if (dark !== (name === 'dark')) {
    await activate('.theme-toggle, .tema-albedo-boton')
    await until(`document.documentElement.dataset.bsTheme === ${JSON.stringify(name)}`)
  }
}
async function record(context, test) {
  try { await test(); results.push({ ...context, passed: true }) }
  catch (error) { results.push({ ...context, passed: false, error: error.message }); console.error('FAIL', JSON.stringify(results.at(-1))) }
}

try {
  await mkdir(output, { recursive: true })
  server = await createServer({ root, cacheDir: await mkdtemp(join(tmpdir(), 'albedo-navigation-cache-')),
    server: { host: '127.0.0.1', port: 0 } })
  await server.listen()
  report.origin = 'http://127.0.0.1:' + server.httpServer.address().port
  const profile = await mkdtemp(join(tmpdir(), 'albedo-navigation-chrome-'))
  chrome = spawn(chromeBin, ['--headless', '--disable-gpu', '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding', '--no-first-run', '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'],
  { windowsHide: true, stdio: 'ignore' })
  const portFile = join(profile, 'DevToolsActivePort')
  for (let n = 0; n < 100 && !existsSync(portFile); n++) await sleep(100)
  const port = (await readFile(portFile, 'utf8')).split('\n')[0]
  report.browser = (await fetch(`http://127.0.0.1:${port}/json/version`).then((r) => r.json())).Browser
  const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json())
  socket = new WebSocket(targets.find((target) => target.type === 'page').webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (pending.has(message.id)) { pending.get(message.id)(message); pending.delete(message.id) }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text)
  })
  await send('Runtime.enable')
  await send('Page.enable')
  console.log(report.browser, report.origin)

  for (const route of routes) {
    for (const width of widths) {
      const touch = width <= 768
      await viewport(width, touch)
      await navigate(route)
      for (const mode of ['light', 'dark']) {
        await theme(mode)
        for (const [index, category] of categories.entries()) {
          await record({ test: 'layout-input-keyboard', route, width, theme: mode, category: category.anchor }, async () => {
            if (await countOpen()) await close()
            if (touch) await activate(selector(index), true)
            else {
              await move(selector(index))
              assert.equal(await countOpen(), 1, 'hover')
              await activate(selector(index))
            }
            assert.equal(await countOpen(), 1, 'clic/touch conserva exactamente un panel')
            const details = await evaluate(`(() => {
              const item=document.querySelectorAll('.mega-item')[${index}], button=item.querySelector('button'), panel=item.querySelector('.mega-panel');
              const r=panel.getBoundingClientRect(), cs=getComputedStyle(panel);
              const links=[...panel.querySelectorAll('a')].map(a=>({name:a.textContent.trim(),href:a.getAttribute('href')}));
              const nodes=[...panel.querySelectorAll('a,h2,h3,strong,span,p,img')].filter(e=>e.getClientRects().length);
              return {hidden:panel.hidden, expanded:button.getAttribute('aria-expanded'), inside:r.left>=-1&&r.right<=document.documentElement.clientWidth+1,
                width:r.width, overflow:nodes.filter(e=>{const b=e.getBoundingClientRect();return b.left<r.left-1||b.right>r.right+1}).map(e=>e.textContent.trim()),
                textOverflow:nodes.filter(e=>e.tagName!=='IMG'&&e.scrollWidth>e.clientWidth+1).map(e=>e.textContent.trim()),
                links, background:cs.backgroundColor, arrows:item.querySelectorAll('.categoria-toggle').length,
                images:nodes.filter(e=>e.tagName==='IMG').map(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,fit:getComputedStyle(e).objectFit}))};})()`)
            assert.equal(details.hidden, false, 'panel visible')
            assert.equal(details.expanded, 'true', 'ARIA expandido')
            assert.equal(details.inside, true, 'panel dentro del viewport')
            assert.deepEqual(details.overflow, [])
            assert.deepEqual(details.textOverflow, [])
            assert.equal(details.arrows, 0)
            assert.ok(details.width <= (route.includes('Sitio') && route.includes('productos') && width > 900 ? 680 : 320))
            assert.equal(details.background, mode === 'dark' ? 'rgb(44, 49, 54)' : 'rgb(238, 238, 236)', 'fondo del tema seleccionado')
            assert.deepEqual(details.links.map((link) => link.name), [...category.products.map((p) => p.name), category.allLabel])
            category.products.forEach((product, n) => assert.equal(new URL(details.links[n].href, report.origin + route).searchParams.get('id'), product.id))
            assert.equal(details.links.at(-1).href, '/productos.html#' + category.anchor)
            for (const image of details.images) assert.deepEqual(image, { width: 125, height: 145, fit: 'contain' })
            if (touch) {
              await activate(selector(index), true)
              assert.equal(await countOpen(), 0, 'segundo touch cierra')
              await activate(selector(index), true)
            } else {
              await move(`.mega-item:nth-child(${index + 1}) .mega-panel a`)
              assert.equal(await countOpen(), 1, 'cruzar al panel conserva apertura')
              await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 850 })
              await until('[...document.querySelectorAll(".mega-panel")].every(p=>p.hidden)')
              await move(selector(index))
            }
            await close()
            assert.equal(await evaluate(`document.activeElement === document.querySelector(${JSON.stringify(selector(index))})`), true)
            await key('Enter', 'Enter', 13, '\r')
            assert.equal(await countOpen(), 1, 'Enter abre')
            await key('Tab', 'Tab', 9)
            assert.equal(await evaluate(`document.activeElement === document.querySelectorAll('.mega-panel')[${index}].querySelector('a')`), true, 'Tab alcanza primer producto')
            assert.equal(await evaluate('getComputedStyle(document.activeElement).outlineStyle !== "none"'), true, 'foco visible')
            await close()
            await key(' ', 'Space', 32, ' ')
            assert.equal(await countOpen(), 1, 'Espacio abre')
            await close()
          })
        }
      }
    }
    console.log('Recorrido de medidas y entradas ejecutado:', route)
  }

  // Navega mediante eventos de entrada reales; no sustituye enlaces por URLs directas.
  const original = vm.runInNewContext(await readFile(new URL('../../Sitio Old/productos.js', import.meta.url), 'utf8') + '\nproductosBase',
    { localStorage: { getItem: () => null } })
  for (const route of routes) {
    for (const width of [1440, 360]) {
      const touch = width === 360
      await viewport(width, touch)
      for (const [index, category] of categories.entries()) {
        for (let n = 0; n <= category.products.length; n++) {
          const product = category.products[n]
          await record({ test: product ? 'product-navigation' : 'category-navigation', route, width, target: product?.id || category.anchor }, async () => {
            await navigate(route)
            if (touch) await activate(selector(index), true)
            else await move(selector(index))
            await activate(`.mega-item:nth-child(${index + 1}) .mega-panel a:nth-of-type(${n + 1})`, touch)
            if (product) {
              await until(`location.search === '?id=${product.id}' && document.getElementById('detalleNombre')?.textContent === ${JSON.stringify(product.name)}`)
              const base = original.find((p) => p.id === product.id)
              assert.equal(await evaluate('document.getElementById("detalleCategoria").textContent'), base.categoria)
              assert.equal(await evaluate('document.getElementById("detalleImagen").getAttribute("src")'), base.imagen)
            } else {
              await until(`location.pathname === '/productos.html' && location.hash === '#${category.anchor}' && !!document.getElementById('${category.anchor}')`)
              await until(`Math.abs(document.getElementById('${category.anchor}').getBoundingClientRect().top) < 400`)
              assert.equal(await countOpen(), 0)
            }
          })
        }
      }
    }
    console.log('Recorrido de destinos por clic y touch ejecutado:', route)
  }
  // Recarga y navegación de historial de la ficha y del catálogo React.
  await record({ test: 'reload-back-forward' }, async () => {
    await viewport(1440, false)
    await navigate('/productos.html')
    await move(selector(0))
    await activate('.mega-item:first-child .mega-panel a')
    await until('document.getElementById("detalleNombre")?.textContent === "Chaqueta Cordillera"')
    await send('Page.reload')
    await until('document.getElementById("detalleNombre")?.textContent === "Chaqueta Cordillera"')
    await evaluate('history.back()')
    await until('location.pathname === "/productos.html" && !!document.querySelector(".categoria-acciones")')
    assert.equal(await countOpen(), 0)
    await evaluate('history.forward()')
    await until('document.getElementById("detalleNombre")?.textContent === "Chaqueta Cordillera"')
  })
  for (const [route, name, mode, width] of [
    ['/', 'menu-react-desktop', 'light', 1440], ['/Sitio%20Old/index.html', 'menu-legacy-inicio', 'light', 1440],
    ['/Sitio%20Old/productos.html', 'menu-legacy-catalogo', 'dark', 1024], ['/', 'menu-react-mobile', 'dark', 360],
    ['/Sitio%20Old/productos.html', 'menu-legacy-mobile', 'dark', 360],
  ]) {
    await viewport(width, width <= 768); await navigate(route); await theme(mode)
    if (width <= 768) await activate(selector(1), true); else await move(selector(1))
    const screenshot = await send('Page.captureScreenshot', { format: 'png' })
    await writeFile(join(output, name + '.png'), Buffer.from(screenshot.data, 'base64'))
  }
} catch (error) {
  errors.push(error.stack)
} finally {
  report.passed = results.filter((r) => r.passed).length
  report.failed = results.filter((r) => !r.passed).length
  await mkdir(output, { recursive: true })
  await writeFile(join(output, 'category-navigation.json'), JSON.stringify(report, null, 2) + '\n')
  socket?.close(); chrome?.kill(); await server?.close()
}
console.log(JSON.stringify({ passed: report.passed, failed: report.failed, errors, report: join(output, 'category-navigation.json') }, null, 2))
if (report.failed || errors.length || !results.length) process.exitCode = 1
