# Deploy VitalOS to Cloudflare

## Prerequisites

- Node.js and npm
- Cloudflare account
- Cloudflare API/token with permission to deploy Workers
- Repository access

## Local verification

1. Install dependencies: npm ci
2. Build: npm run build
3. Confirm the Vite output directory is dist.
4. Run a local static preview before deployment.

## First deployment

From the repository root:

    npx wrangler login
    npx wrangler deploy

The repository wrangler.jsonc runs the existing build command and publishes dist as Worker Static Assets with SPA fallback.

## Custom domain

After validating the Workers deployment, attach the chosen VitalOS domain in Cloudflare. Do not move production DNS until the Cloudflare deployment has passed smoke tests.

## Environment secrets

Never commit production secrets.

Use Cloudflare Worker secrets for server-side API credentials and Supabase secrets/configuration where appropriate. Public browser configuration must contain only values intended to be public.

## Smoke tests

Before considering the deployment production-ready:
- landing page loads
- direct navigation to every React route works
- refresh on nested routes works
- wallet connection uses the real connected address
- chain switching behaves correctly
- no private key/seed phrase is requested
- API requests do not expose provider secrets
- CSP/security headers are present
- error monitoring works
- analytics consent/privacy behavior is correct
- demo/fallback data is visibly identified
