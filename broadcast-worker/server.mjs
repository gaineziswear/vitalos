import http from 'node:http'
import { spawn } from 'node:child_process'
import { createProgramme } from './programme.mjs'
import { encoderArgs } from './renderer.mjs'
import { fetchMarketSnapshot } from './market-data.mjs'

const PORT = Number(process.env.PORT ?? 8788)
const CONTROL_TOKEN = process.env.BROADCAST_CONTROL_TOKEN ?? ''
const TWITCH_INGEST_URL = process.env.TWITCH_INGEST_URL ?? ''
const TWITCH_STREAM_KEY = process.env.TWITCH_STREAM_KEY ?? ''

const state = {
  enabled: false, mode: 'away', scene: 'market', aiProducer: true, chatIntelligence: true,
  service: TWITCH_INGEST_URL && TWITCH_STREAM_KEY ? 'ready' : 'unconfigured',
  encoder: 'offline', pid: null, startedAt: null, lastError: null, restartCount: 0,
  currentProgramme: null, programmeStartedAt: null, lastMarketSnapshot: null, updatedAt: new Date().toISOString(),
}

let ffmpeg = null
let stopping = false
let programmeTimer = null
let programmeIndex = 0
let apologeticsIndex = 0

function update(patch) { Object.assign(state, patch, { updatedAt: new Date().toISOString() }) }
function authorized(req) { return Boolean(CONTROL_TOKEN && req.headers.authorization === `Bearer ${CONTROL_TOKEN}`) }
function send(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(payload))
}
async function body(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}
}
function buildTarget() { return `${TWITCH_INGEST_URL.replace(/\/$/, '')}/${TWITCH_STREAM_KEY}` }

function stopEncoder() {
  stopping = true
  if (programmeTimer) { clearTimeout(programmeTimer); programmeTimer = null }
  programmeIndex = 0
  if (ffmpeg) {
    ffmpeg.kill('SIGTERM')
    setTimeout(() => { if (ffmpeg) ffmpeg.kill('SIGKILL') }, 5000).unref()
  }
  update({ enabled: false, service: 'stopped', encoder: 'offline', pid: null })
}

function startProgramme(snapshot = {}) {
  if (!state.enabled || stopping || ffmpeg) return

  const programmes = createProgramme(state, snapshot)
  if (!programmes.length) return

  const index = state.mode === 'away'
    ? programmeIndex % programmes.length
    : 0
  const programme = programmes[index]

  if (state.mode === 'away') programmeIndex = (index + 1) % programmes.length
  else programmeIndex = 0

  update({
    currentProgramme: programme,
    lastMarketSnapshot: snapshot,
    programmeStartedAt: new Date().toISOString(),
    service: 'running',
    encoder: 'online',
  })
  ffmpeg = spawn('ffmpeg', [...encoderArgs(programme), buildTarget()], { stdio: ['ignore', 'ignore', 'pipe'] })
  update({ pid: ffmpeg.pid ?? null })
  ffmpeg.stderr.on('data', data => console.log(`[ffmpeg] ${String(data).trim()}`))
  ffmpeg.on('error', error => update({ service: 'degraded', encoder: 'error', lastError: error.message }))
  ffmpeg.on('exit', (code, signal) => {
    ffmpeg = null
    update({ pid: null, encoder: 'offline', service: stopping ? 'stopped' : 'degraded', lastError: stopping ? null : `FFmpeg exited (code=${code}, signal=${signal ?? 'none'}).` })
    if (!stopping && state.enabled) {
      state.restartCount += 1
      programmeTimer = setTimeout(() => {
        programmeTimer = null
        refreshAndStartProgramme()
      }, 1000)
    }
  })
}

async function refreshAndStartProgramme() {
  if (!state.enabled || stopping || ffmpeg) return
  const snapshot = await fetchMarketSnapshot()
  if (state.mode === 'away') snapshot.apologeticsIndex = apologeticsIndex++
  startProgramme(snapshot)
}

function startEncoder() {
  if (ffmpeg) return
  if (!TWITCH_INGEST_URL || !TWITCH_STREAM_KEY) {
    update({ service: 'unconfigured', encoder: 'error', lastError: 'Twitch ingest URL or stream key is missing.' })
    return
  }
  stopping = false
  update({ enabled: true, startedAt: state.startedAt ?? new Date().toISOString(), lastError: null })
  refreshAndStartProgramme().catch(error => {
    update({ service: 'degraded', lastError: error instanceof Error ? error.message : 'Failed to refresh market data.' })
    startProgramme({})
  })
}

async function handle(req, res) {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`)
  if (req.method === 'GET' && url.pathname === '/health')
    return send(res, 200, { status: 'ok', service: 'vitalos-broadcast-worker', timestamp: new Date().toISOString() })

  if (!authorized(req)) return send(res, 401, { error: 'Unauthorized.' })
  if (req.method === 'GET' && url.pathname === '/status') return send(res, 200, state)
  if (req.method === 'GET' && url.pathname === '/programme') return send(res, 200, { programme: state.currentProgramme, snapshot: state.lastMarketSnapshot })

  if (req.method === 'POST' && ['/start', '/config'].includes(url.pathname)) {
    const patch = await body(req)
    const previousMode = state.mode
    const previousScene = state.scene
    update({
      mode: patch.mode === 'live' ? 'live' : 'away',
      scene: ['market', 'stewardship', 'opportunity', 'community', 'apologetics'].includes(patch.scene) ? patch.scene : state.scene,
      aiProducer: patch.aiProducer !== false,
      chatIntelligence: patch.chatIntelligence !== false,
    })
    if (previousMode !== state.mode || previousScene !== state.scene) programmeIndex = 0
    if (url.pathname === '/start') startEncoder()
    return send(res, 200, state)
  }
  if (req.method === 'POST' && url.pathname === '/stop') {
    stopEncoder()
    return send(res, 200, state)
  }
  return send(res, 404, { error: 'Not found.' })
}

http.createServer((req, res) => {
  handle(req, res).catch(error => {
    console.error(error)
    send(res, 500, { error: 'Broadcast worker failure.' })
  })
}).listen(PORT, '0.0.0.0', () => console.log(`VITALOS broadcast worker listening on :${PORT}`))
