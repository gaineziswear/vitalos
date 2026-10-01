# VITALOS Broadcast Worker

Persistent FFmpeg runtime for VITALOS Live.

The browser never receives the Twitch stream key. The Cloudflare Worker authenticates to this service with `BROADCAST_CONTROL_TOKEN`; the stream key exists only on the persistent encoder host.

## Current capabilities

- authenticated `/health`, `/status`, `/start`, `/stop`, `/config`, `/programme`
- FFmpeg RTMP output
- live scene text compositor using FFmpeg `drawtext` with reloadable text files
- four VITALOS programme scenes: market, stewardship, opportunity, community
- automatic scene rotation while the encoder remains running
- optional external AI Producer endpoint with deterministic template fallback
- bounded automatic encoder restart after unexpected FFmpeg exit

The compositor intentionally uses deterministic text and a test visual source at this stage. The next production layer replaces the visual source/audio source with real market-data cards, TTS and branded VITALOS scene assets.

## AI Producer contract

If `AI_PRODUCER_URL` is configured, the worker POSTs:

`{ "scene": "market", "mode": "away", "context": {} }`

The endpoint should return:

`{ "title": "...", "body": "...", "disclosure": "..." }`

The worker applies strict text-length/single-line normalization and falls back to a deterministic programme if the endpoint fails.

## Required runtime variables

- `BROADCAST_CONTROL_TOKEN`
- `TWITCH_INGEST_URL`
- `TWITCH_STREAM_KEY`

Optional:

- `AI_PRODUCER_URL`
- `SCENE_ROTATION_MS` (default: 300000)

Run locally with `npm start`. Build with `docker build -t vitalos-broadcast-worker .`.

Do not expose this service directly to the public Internet without TLS and access control. Production control traffic should originate only from the VitalOS API layer.
