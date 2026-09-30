export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
}

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

function withSecurityHeaders(response: Response, extra: Record<string, string> = {}) {
  const headers = new Headers(response.headers)
  for (const [key, value] of Object.entries(securityHeaders)) {
    headers.set(key, value)
  }
  for (const [key, value] of Object.entries(extra)) {
    headers.set(key, value)
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/health' || url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          service: 'vitalos',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
            ...securityHeaders,
          },
        },
      )
    }

    const response = await env.ASSETS.fetch(request)
    const pathname = url.pathname

    if (pathname.startsWith('/assets/')) {
      return withSecurityHeaders(response, {
        'Cache-Control': 'public, max-age=31536000, immutable',
      })
    }

    return withSecurityHeaders(response, {
      'Cache-Control': 'no-cache',
    })
  },
}
