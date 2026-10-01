# VITALOS Live — Broadcast Architecture

## Control plane

The VitalOS application calls /api/broadcast/* on the Cloudflare Worker. The Worker authenticates the signed-in Supabase user, then forwards an authenticated command to the persistent encoder service.

The browser never receives Twitch stream keys, Twitch client secrets, encoder credentials, or RTMP URLs containing credentials.

## Data plane

broadcast-worker/ is the persistent compute boundary. It runs FFmpeg and publishes RTMP to Twitch. Cloudflare Workers are not used as the media encoder because the media process requires persistent compute and FFmpeg.

## Current API

- GET /api/broadcast/status
- POST /api/broadcast/start
- POST /api/broadcast/stop
- POST /api/broadcast/config

## Twitch integration

Twitch uses RTMP ingest and a protected stream key for encoder authorization. EventSub will be the telemetry layer for stream.online and stream.offline, followed by audience events where the required OAuth scopes and product permissions apply.

## Production sequence

1. Deploy the VitalOS Worker.
2. Configure SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY as Cloudflare Worker secrets/variables.
3. Deploy the persistent broadcast worker on compute with FFmpeg.
4. Configure the same BROADCAST_CONTROL_TOKEN on both services.
5. Configure Twitch ingest URL and stream key only on the encoder host.
6. Verify /status and /health.
7. Start the synthetic test programme and confirm the Twitch channel receives it.
8. Replace the synthetic programme with the VITALOS compositor, market data, AI scripts and TTS.
9. Add EventSub and audience/revenue telemetry.
10. Add recordings/clipping and autonomous away-mode scheduling.

No Twitch revenue or ROI is claimed until real telemetry exists.
