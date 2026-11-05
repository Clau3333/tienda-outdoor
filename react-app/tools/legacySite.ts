import { createReadStream } from 'node:fs'
import { cp, stat } from 'node:fs/promises'
import { extname, isAbsolute, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

const source = fileURLToPath(new URL('../../Sitio Old/', import.meta.url))
const prefix = '/Sitio Old/'
const contentTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.mp4': 'video/mp4',
}

// Sirve y copia los originales sin editarlos ni convertirlos en rutas React.
export default function legacySite(): Plugin {
  let output = ''
  let building = false
  return {
    name: 'albedo-legacy-site',
    configResolved(config) {
      output = resolve(config.root, config.build.outDir, 'Sitio Old')
      building = config.command === 'build'
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        let pathname: string
        try { pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname) }
        catch { next(); return }
        if (!pathname.startsWith(prefix)) { next(); return }
        const target = resolve(source, pathname.slice(prefix.length))
        const local = relative(source, target)
        if (local.startsWith('..') || isAbsolute(local) || !contentTypes[extname(target)]) {
          response.statusCode = 404
          response.end('Archivo no encontrado')
          return
        }
        try {
          const file = await stat(target)
          if (!file.isFile()) { next(); return }
          response.setHeader('Content-Type', contentTypes[extname(target)])
          response.setHeader('Content-Length', file.size)
          if (request.method === 'HEAD') { response.end(); return }
          const stream = createReadStream(target)
          stream.on('error', () => response.destroy())
          stream.pipe(response)
        } catch {
          response.statusCode = 404
          response.end('Archivo no encontrado')
        }
      })
    },
    async closeBundle() {
      if (!building) return
      await cp(source, output, {
        recursive: true,
        filter: (path) => !extname(path) || extname(path) in contentTypes,
      })
    },
  }
}
