// ── VitalOS — Production server ───────────────────────────────────────────────
// Serves the Vite build output (dist/) and injects runtime env vars into HTML.
// Runs on PORT (default 7860 — Hugging Face Docker Space default).

import { serve } from 'bun'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const PORT   = parseInt(process.env.PORT ?? '7860', 10)
const DIST   = join(import.meta.dir, '..', 'dist')

// Env vars to inject into the HTML at runtime
// These are read from the HF Space secrets / process.env
const runtimeEnv = {
  VITE_SUPABASE_URL:      process.env.VITE_SUPABASE_URL      ?? '',
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY ?? '',
  VITE_APP_URL:           process.env.VITE_APP_URL            ?? '',
}

function injectEnv(html: string): string {
  const script = `<script>window.__env__=${JSON.stringify(runtimeEnv)}</script>`
  return html.replace('</head>', `${script}\n</head>`)
}

function mime(path: string): string {
  if (path.endsWith('.js'))   return 'application/javascript'
  if (path.endsWith('.css'))  return 'text/css'
  if (path.endsWith('.svg'))  return 'image/svg+xml'
  if (path.endsWith('.png'))  return 'image/png'
  if (path.endsWith('.ico'))  return 'image/x-icon'
  if (path.endsWith('.woff2')) return 'font/woff2'
  if (path.endsWith('.json')) return 'application/json'
  return 'text/plain'
}

const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf8')
const injected  = injectEnv(indexHtml)

console.log(`[VitalOS] Server starting on port ${PORT}`)

serve({
  port: PORT,
  fetch(req) {
    const url  = new URL(req.url)
    let   path = url.pathname

    // Strip leading slash
    if (path === '/') {
      return new Response(injected, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    }

    const filePath = join(DIST, path)
    if (existsSync(filePath)) {
      const ext = path.split('.').pop() ?? ''
      if (ext === 'html') {
        const html = readFileSync(filePath, 'utf8')
        return new Response(injectEnv(html), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })
      }
      return new Response(Bun.file(filePath), {
        headers: {
          'Content-Type': mime(filePath),
          'Cache-Control': path.startsWith('/assets/')
            ? 'public, max-age=31536000, immutable'
            : 'no-cache',
        },
      })
    }

    // SPA fallback — all unknown paths serve index.html
    return new Response(injected, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  },
})

console.log(`[VitalOS] Listening on http://0.0.0.0:${PORT}`)
