import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: './', // 👈 OBLIGATORIO: Fuerza a Vite a usar rutas relativas para GitHub Pages
  root: __dirname,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, '../shared/src')
    }
  },
  server: {
    port: 5173,
    // Electron (packages/main/src/index.js) carga http://localhost:5173 fijo.
    // strictPort evita que Vite caiga en otro puerto y Electron termine
    // cargando un servidor distinto/zombie.
    strictPort: true
  }
})