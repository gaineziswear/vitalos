export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
  BROADCAST_WORKER_URL?: string
  BROADCAST_CONTROL_TOKEN?: string
}

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...securityHeaders,
    },
  })
}

function withSecurityHeaders(response: Response, extra: Record<string, string> = {}) {
  const headers = new Headers(response.headers)
  for (const [key, value] of Object.entries(securityHeaders)) headers.set(key, value)
  for (const [key, value] of Object.entries(extra)) headers.set(key, value)
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}

function isAuthorized(request: Request, env: Env) {
  const expected = env.BROADCAST_CONTROL_TOKEN
  return Boolean(expected && request.headers.get('Authorization') === `Bearer ${expected}`)
}

async function encoderRequest(env: Env, path: string, init: RequestInit = {}) {
  if (!env.BROADCAST_WORKER_URL || !env.BROADCAST_CONTROL_TOKEN) {
    return json({ error: 'Broadcast encoder is not configured.' }, 503)
  }

  const upstream = await fetch(
    `${env.BROADCAST_WORKER_URL.replace(/\\/$/, '')}${path}`,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${env.BROADCAST_CONTROL_TOKEN}`,
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
    },
  )

  const body = await upstream.text()
  return new Response(body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
      'Cache-Control': 'no-store',
      ...securityHeaders,
    },
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/health' || url.pathname === '/api/health') {
      return json({ status: 'ok', service: 'vitalos', timestamp: new Date().toISOString() })
    }

    if (url.pathname.startsWith('/api/broadcast')) {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            ...securityHeaders,
            'Access-Control-Allow-Origin': url.origin,
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          },
        })
      }

      if (!isAuthorized(request, env)) {
        return json({ error: 'Unauthorized broadcast control request.' }, 401)
      }

      const endpoint = url.pathname.replace('/api/broadcast', '') || '/status'
      const allowed = new Set(['/status', '/start', '/stop', '/config'])
      if (!allowed.has(endpoint)) return json({ error: 'Unknown broadcast endpoint.' }, 404)

      return encoderRequest(env, endpoint, {
        method: request.method,
        body: request.method === 'GET' ? undefined : await request.text(),
      })
    }

    const response = await env.ASSETS.fetch(request)
    const pathname = url.pathname

    if (pathname.startsWith('/assets/')) {
      return withSecurityHeaders(response, { 'Cache-Control': 'public, max-age=31536000, immutable' })
    }

    return withSecurityHeaders(response, { 'Cache-Control': 'no-cache' })
  },
}
