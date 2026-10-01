# VITALOS Broadcast Worker

Persistent FFmpeg runtime for VITALOS Live.

The browser never receives the Twitch stream key. The Cloudflare Worker authenticates to this service with BROADCAST_CONTROL_TOKEN; the stream key exists only on the persistent encoder host.

Phase 2 proves the transport path with a deterministic FFmpeg test programme. It supports authenticated /health, /status, /start, /stop and /config plus bounded automatic restart after unexpected FFmpeg exit.

The synthetic programme is deliberately not the finished VITALOS broadcast. Phase 3 replaces the FFmpeg lavfi inputs with the VITALOS scene compositor, market-data cards, AI programme blocks, TTS and recording pipeline.

Required runtime variables:
- BROADCAST_CONTROL_TOKEN
- TWITCH_INGEST_URL
- TWITCH_STREAM_KEY

Run locally with npm start. Build with docker build -t vitalos-broadcast-worker .

Do not expose this service directly to the public Internet without TLS and access control. Production control traffic should originate only from the VitalOS API layer.
