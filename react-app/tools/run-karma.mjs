import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { build } from 'vite'
import react from '@vitejs/plugin-react'

const require = createRequire(import.meta.url)
const { Server, config } = require('karma')
const root = fileURLToPath(new URL('../', import.meta.url))

// Se usa el Chrome instalado; Karma crea un perfil temporal separado.
if (!process.env.CHROME_BIN && process.platform === 'win32') {
  const candidates = [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA]
    .filter(Boolean).map((directory) => join(directory, 'Google', 'Chrome', 'Application', 'chrome.exe'))
  process.env.CHROME_BIN = candidates.find(existsSync) ?? ''
}

try {
  await build({
    root, configFile: false, publicDir: false, plugins: [react()],
    define: { 'process.env.NODE_ENV': JSON.stringify('test') },
    build: {
      outDir: '.karma-tmp', emptyOutDir: true, minify: false, sourcemap: true, target: 'es2023',
      lib: { entry: join(root, 'tests/jasmine/index.ts'), name: 'AlbedoUnitSpecs', formats: ['iife'], fileName: () => 'specs.js' },
    },
  })
  const settings = await config.parseConfig(join(root, 'karma.conf.cjs'), {}, { promiseConfig: true, throwErrors: true })
  process.exitCode = await new Promise((resolve, reject) => { new Server(settings, resolve).start().catch(reject) })
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
