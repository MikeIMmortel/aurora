import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { homedir } from 'node:os'

// Base path voor GitHub Pages deployment.
// GH Actions zet VITE_BASE_PATH = /repo-naam/ ; lokaal is het '/'.
const base = process.env.VITE_BASE_PATH || '/'

/**
 * Server-side data storage plugin.
 * Exposeert GET/POST /api/data zodat alle devices (via Tailscale) dezelfde
 * gebruikersdata delen. Schrijft naar ~/Library/Application Support/Aurora/data.json
 * — buiten de repo, persistent tussen restarts.
 */
function auroraStoragePlugin(): Plugin {
  const DATA_FILE = join(homedir(), 'Library', 'Application Support', 'Aurora', 'data.json')

  async function readData(): Promise<string> {
    try {
      return await readFile(DATA_FILE, 'utf-8')
    } catch {
      return '{}'
    }
  }

  async function writeData(body: string): Promise<void> {
    await mkdir(dirname(DATA_FILE), { recursive: true })
    await writeFile(DATA_FILE, body, 'utf-8')
  }

  return {
    name: 'aurora-storage',
    configureServer(server) {
      server.middlewares.use('/api/data', async (req, res, next) => {
        try {
          if (req.method === 'GET' || req.method === 'HEAD') {
            const data = await readData()
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Cache-Control', 'no-store')
            if (req.method === 'HEAD') {
              res.end()
            } else {
              res.end(data)
            }
            return
          }

          if (req.method === 'POST' || req.method === 'PUT') {
            let body = ''
            for await (const chunk of req) body += chunk
            // Valideer dat het geldige JSON is vóór we schrijven
            JSON.parse(body)
            await writeData(body)
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end('{"ok":true}')
            return
          }

          next()
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: String(err) }))
        }
      })

      // Log waar de data staat bij startup
      if (!existsSync(DATA_FILE)) {
        server.config.logger.info(
          `\n  💾 Aurora-data wordt opgeslagen in: ${DATA_FILE}`,
        )
      }
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), auroraStoragePlugin()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
})
