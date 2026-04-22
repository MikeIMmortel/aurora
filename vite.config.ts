import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Base path voor GitHub Pages deployment.
// GH Actions zet VITE_BASE_PATH = /repo-naam/ ; lokaal is het '/'.
const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  server: {
    // Bind aan alle interfaces zodat Tailscale-peers en LAN erbij kunnen
    host: true,
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: true,
  },
})
