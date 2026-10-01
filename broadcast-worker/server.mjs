import http from 'node:http'
import { spawn } from 'node:child_process'
import { programmeFor, writeProgramme, drawtextFilters, SCENES } from './scene-composer.mjs'

const PORT = Number(process.env.PORT ?? 8788)
const CONTROL_TOKEN = process.env.BROADCAST_CONTROL_TOKEN ?? ''
const TWITCH_INGEST_URL = process.env.TWITCH_INGEST_URL ?? ''
const TWITCH_STREAM_KEY = process.env.TWITCH_STREAM_KEY ?? ''
const SCENE_ROTATION_MS = Number(process.env.SCENE_ROTATION_MS ?? 300000)
const AI_PRODUCER_URL = process.env.AI_PRODUCER_URL ?? ''

const state = {
  enabled: false, mode: 'away', scene: 'market', aiProducer: true, chatIntelligence: true,
  service: TWITCH_INGEST_URL && TWITCH_STREAM_KEY ? 'ready' : 'unconfigured',
  encoder: 'offline', pid: null, startedAt: null, lastError: null, restartCount: 0,
  programmeUpdatedAt: null, programmeSource: 'template', updatedAt: new Date().toISOString(),
}

let ffmpeg = null
let stopping = false
let restartTimer = null
let rotationTimer = null
let programme = programmeFor(state.scene)
let programmeFiles = null

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

async function produceProgramme(context = {}) {
  if (state.aiProducer && AI_PRODUCER_URL) {
    try {
      const response = await fetch(AI_PRODUCER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scene: state.scene, mode: state.mode, context }),
        signal: AbortSignal.timeout(15000),
      })
      if (response.ok) {
        const generated = await response.json()
        programme = programmeFor(state.scene, generated)
        state.programmeSource = 'ai'
      } else {
        programme = programmeFor(state.scene, context)
        state.programmeSource = 'template'
      }
    } catch {
      programme = programmeFor(state.scene, context)
      state.programmeSource = 'template'
    }
  } else {
    programme = programmeFor(state.scene, context)
    state.programmeSource = 'template'
  }
  programmeFiles = await writeProgramme(programme)
  update({ programmeUpdatedAt: programme.timestamp, programmeSource: state.programmeSource })
}

function encoderArgs() {
  const videoFilter = programmeFiles ? drawtextFilters(programmeFiles) : 'null'
  return [
    '-hide_banner', '-loglevel', 'warning', '-re',
    '-f', 'lavfi', '-i', 'testsrc2=size=1280x720:rate=30',
    '-f', 'lavfi', '-i', 'sine=frequency=440:sample_rate=48000',
    '-vf', videoFilter,
    '-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'zerolatency',
    '-pix_fmt', 'yuv420p', '-r', '30', '-g', '60',
    '-b:v', '4500k', '-maxrate', '4500k', '-bufsize', '9000k',
    '-c:a', 'aac', '-b:a', '160k', '-ar', '48000',
    '-f', 'flv', `${TWITCH_INGEST_URL.replace(/\/$/, '')}/${TWITCH_STREAM_KEY}`,
  ]
}

async function startEncoder() {
  if (ffmpeg) return
  if (!TWITCH_INGEST_URL || !TWITCH_STREAM_KEY) {
    update({ service: 'unconfigured', encoder: 'error', lastError: 'Twitch ingest URL or stream key is missing.' })
    return
  }
  await produceProgramme()
  stopping = false
  update({ service: 'running', encoder: 'online', enabled: true, startedAt: new Date().toISOString(), lastError: null })
  ffmpeg = spawn('ffmpeg', encoderArgs(), { stdio: ['ignore', 'ignore', 'pipe'] })
  update({ pid: ffmpeg.pid ?? null })
  ffmpeg.stderr.on('data', data => console.log(`[ffmpeg] ${String(data).trim()}`))
  ffmpeg.on('error', error => update({ service: 'degraded', encoder: 'error', lastError: error.message }))
  ffmpeg.on('exit', (code, signal) => {
    ffmpeg = null
    update({ pid: null, encoder: 'offline', service: stopping ? 'stopped' : 'degraded', lastError: stopping ? null : `FFmpeg exited (code=${code}, signal=${signal ?? 'none'}).` })
    if (!stopping && state.enabled) scheduleRestart()
  })
  if (rotationTimer) clearInterval(rotationTimer)
  rotationTimer = setInterval(() => rotateScene().catch(error => update({ lastError: error.message, service: 'degraded' })), SCENE_ROTATION_MS)
}

async function rotateScene() {
  if (!state.enabled || !state.aiProducer) return
  const next = SCENES[(SCENES.indexOf(state.scene) + 1) % SCENES.length]
  state.scene = next
  await produceProgramme()
}

function scheduleRestart() {
  if (restartTimer) return
  const delay = Math.min(60000, 2000 * (2 ** Math.min(state.restartCount, 5)))
  update({ restartCount: state.restartCount + 1 })
  restartTimer = setTimeout(() => { restartTimer = null; startEncoder().catch(error => update({ service: 'degraded', lastError: error.message })) }, delay)
}

function stopEncoder() {
  stopping = true
  if (restartTimer) { clearTimeout(restartTimer); restartTimer = null }
  if (rotationTimer) { clearInterval(rotationTimer); rotationTimer = null }
  if (ffmpeg) {
    ffmpeg.kill('SIGTERM')
    setTimeout(() => { if (ffmpeg) ffmpeg.kill('SIGKILL') }, 5000).unref()
  }
  update({ enabled: false, service: 'stopped', encoder: 'offline', pid: null })
}

async function handle(req, res) {
  if (!authorized(req)) return send(res, 401, { error: 'Unauthorized.' })
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`)
  if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { status: 'ok', service: 'vitalos-broadcast-worker', timestamp: new Date().toISOString() })
  if (req.method === 'GET' && url.pathname === '/status') return send(res, 200, { ...state, programme })

  if (req.method === 'POST' && ['/start', '/config'].includes(url.pathname)) {
    const patch = await body(req)
    update({ mode: patch.mode === 'live' ? 'live' : 'away', scene: SCENES.includes(patch.scene) ? patch.scene : state.scene, aiProducer: patch.aiProducer !== false, chatIntelligence: patch.chatIntelligence !== false })
    await produceProgramme(patch.context ?? {})
    if (url.pathname === '/start') await startEncoder()
    return send(res, 200, { ...state, programme })
  }

  if (req.method === 'POST' && url.pathname === '/programme') {
    const patch = await body(req)
    if (SCENES.includes(patch.scene)) state.scene = patch.scene
    await produceProgramme(patch.context ?? patch)
    return send(res, 200, { ...state, programme })
  }

  if (req.method === 'POST' && url.pathname === '/stop') {
    stopEncoder()
    return send(res, 200, state)
  }
  return send(res, 404, { error: 'Not found.' })
}

http.createServer((req, res) => {
  handle(req, res).catch(error => { console.error(error); send(res, 500, { error: 'Broadcast worker failure.' }) })
}).listen(PORT, '0.0.0.0', () => console.log(`VITALOS broadcast worker listening on :${PORT}`))
