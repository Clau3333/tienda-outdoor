import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import legacySite from './tools/legacySite.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), legacySite()],
})
