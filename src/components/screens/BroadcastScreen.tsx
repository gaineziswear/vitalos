import { useEffect, useMemo, useState } from 'react'
import { readBroadcastConfig, writeBroadcastConfig, fetchBroadcastStatus, startBroadcast, stopBroadcast, updateBroadcastConfig, type BroadcastStatus } from '../../lib/broadcast'
import { useApp } from '../../lib/app-context'
import {
  Activity, Radio, Play, Pause, Square, Settings2, Bot, Eye,
  Clock3, TrendingUp, Users, Heart, Coins, ShieldCheck, AlertCircle,
} from 'lucide-react'

type BroadcastMode = 'live' | 'away'
type Scene = 'market' | 'stewardship' | 'opportunity' | 'community'

const scenes: { id: Scene; label: string; description: string }[] = [
  { id: 'market', label: 'Market Intelligence', description: 'Live market context, risk and macro signals.' },
  { id: 'stewardship', label: 'Stewardship', description: 'Christian principles applied to capital and work.' },
  { id: 'opportunity', label: 'Opportunity Watch', description: 'Research-led opportunities with risk disclosures.' },
  { id: 'community', label: 'Community', description: 'Questions, education and viewer participation.' },
]

export function BroadcastScreen() {
  const { lang } = useApp()
  const fr = lang === 'fr'
  const initial = readBroadcastConfig()
  const [running, setRunning] = useState(initial.enabled)
  const [mode, setMode] = useState<BroadcastMode>(initial.mode)
  const [scene, setScene] = useState<Scene>(initial.scene)
  const [autoProducer, setAutoProducer] = useState(initial.aiProducer)
  const [chatEnabled, setChatEnabled] = useState(initial.chatIntelligence)
  const [status, setStatus] = useState<BroadcastStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void fetchBroadcastStatus().then(remote => {
      setStatus(remote)
      setRunning(remote.enabled)
      setMode(remote.mode)
      setScene(remote.scene)
      setAutoProducer(remote.aiProducer)
      setChatEnabled(remote.chatIntelligence)
    }).catch(() => setStatus(null))
  }, [])

  function persist(patch: Partial<ReturnType<typeof readBroadcastConfig>>) {
    writeBroadcastConfig({ ...readBroadcastConfig(), ...patch })
  }

  const metrics = useMemo(() => ({
    viewers: 0,
    uptime: status?.startedAt ? 'active' : '—',
    revenue: '—',
    engagement: '—',
  }), [status])

  const title = fr ? 'VITALOS LIVE' : 'VITALOS LIVE'
  const subtitle = fr
    ? 'Studio de diffusion chrétien, intelligence financière et stewardship.'
    : 'Christian broadcast studio, financial intelligence and stewardship.'

  return (
    <div className="min-h-full px-4 py-6 lg:px-8 lg:py-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={running ? 'chip-mint' : 'chip'}><Radio size={12} /> {running ? 'LIVE' : 'OFFLINE'}</span>
              <span className="chip">BROADCAST ENGINE</span>
            </div>
            <h1 className="font-display text-2xl lg:text-3xl font-extrabold tracking-tight text-ink-primary">{title}</h1>
            <p className="text-sm text-ink-secondary mt-1 max-w-2xl">{subtitle}</p>
          </div>
          {error && <div className="card-warn px-3 py-2 text-xs text-amber-300">{error}</div>}
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => { setAutoProducer(v => { const next = !v; const cfg = { ...readBroadcastConfig(), aiProducer: next }; persist({ aiProducer: next }); void updateBroadcastConfig(cfg).then(setStatus).catch(e => setError(e.message)); return next }) }}>
              <Bot size={15} /> AI Producer {autoProducer ? 'ON' : 'OFF'}
            </button>
            <button
              className={running ? 'btn-danger' : 'btn-primary'}
              onClick={() => { void (running ? stopBroadcast() : startBroadcast({ ...readBroadcastConfig(), enabled: true, mode, scene, aiProducer: autoProducer, chatIntelligence: chatEnabled })).then(remote => { setStatus(remote); setRunning(remote.enabled); persist({ enabled: remote.enabled }) }).catch(e => setError(e.message)) }}
            >
              {running ? <><Square size={14} /> Stop Broadcast</> : <><Play size={14} /> Start Broadcast</>}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="metric-cell"><span className="metric-label">Encoder</span><span className="metric-value text-base">{status?.encoder ?? 'unknown'}</span><span className="metric-sub">live health</span></div>
          <div className="metric-cell"><span className="metric-label">Service</span><span className="metric-value text-base">{status?.service ?? 'unknown'}</span><span className="metric-sub">server status</span></div>
          <div className="metric-cell"><span className="metric-label">Restarts</span><span className="metric-value">{status?.restartCount ?? 0}</span><span className="metric-sub">encoder recovery</span></div>
          <div className="metric-cell"><span className="metric-label">Telemetry</span><span className="metric-value text-base">{status ? 'connected' : 'pending'}</span><span className="metric-sub">Twitch layer next</span></div>
        </div>

        <div className="grid lg:grid-cols-[1.55fr_1fr] gap-5">
          <section className="card overflow-hidden">
            <div className="p-5 border-b border-surface-border flex items-center justify-between gap-3">
              <div>
                <h2 className="section-heading">Broadcast Control</h2>
                <p className="text-xs text-ink-muted mt-1">Prepare the programme before connecting an actual encoder.</p>
              </div>
              <Settings2 size={18} className="text-ink-muted" />
            </div>

            <div className="p-5 space-y-6">
              <div>
                <div className="section-label mb-2">Operating Mode</div>
                <div className="seg-control">
                  <button className={mode === 'live' ? 'seg-item seg-item-active' : 'seg-item'} onClick={() => { setMode('live'); const cfg = { ...readBroadcastConfig(), mode: 'live' }; persist({ mode: 'live' }); void updateBroadcastConfig(cfg).then(setStatus).catch(e => setError(e.message)) }}>Live operator</button>
                  <button className={mode === 'away' ? 'seg-item seg-item-active' : 'seg-item'} onClick={() => { setMode('away'); const cfg = { ...readBroadcastConfig(), mode: 'away' }; persist({ mode: 'away' }); void updateBroadcastConfig(cfg).then(setStatus).catch(e => setError(e.message)) }}>Away / Autopilot</button>
                </div>
              </div>

              <div>
                <div className="section-label mb-2">Programme Scene</div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {scenes.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { setScene(item.id); const cfg = { ...readBroadcastConfig(), scene: item.id }; persist({ scene: item.id }); void updateBroadcastConfig(cfg).then(setStatus).catch(e => setError(e.message)) }}
                      className={scene === item.id ? 'text-left rounded-xl border border-mint-500/30 bg-mint-500/8 p-3 transition-all' : 'text-left rounded-xl border border-surface-border bg-surface-overlay p-3 hover:border-surface-border-hi transition-all'}
                    >
                      <div className="text-xs font-semibold text-ink-primary">{item.label}</div>
                      <div className="text-[11px] text-ink-muted mt-1 leading-relaxed">{item.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="metric-cell cursor-pointer">
                  <span className="flex items-center justify-between"><span className="metric-label">AI Producer</span><input type="checkbox" checked={autoProducer} onChange={e => { const value = e.target.checked; setAutoProducer(value); const cfg = { ...readBroadcastConfig(), aiProducer: value }; persist({ aiProducer: value }); void updateBroadcastConfig(cfg).then(setStatus).catch(err => setError(err.message)) }} /></span>
                  <span className="metric-sub">Rotates scenes, scripts and data cards.</span>
                </label>
                <label className="metric-cell cursor-pointer">
                  <span className="flex items-center justify-between"><span className="metric-label">Chat Intelligence</span><input type="checkbox" checked={chatEnabled} onChange={e => { const value = e.target.checked; setChatEnabled(value); const cfg = { ...readBroadcastConfig(), chatIntelligence: value }; persist({ chatIntelligence: value }); void updateBroadcastConfig(cfg).then(setStatus).catch(err => setError(err.message)) }} /></span>
                  <span className="metric-sub">Queues questions for human approval.</span>
                </label>
              </div>

              <div className="card-warn p-4 flex gap-3">
                <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-300">{status?.service === 'running' ? 'Encoder is running' : 'Encoder connection is not configured'}</p>
                  <p className="text-[11px] text-ink-secondary mt-1 leading-relaxed">
                    This control plane is intentionally separated from Twitch credentials. The production worker will hold the stream key and publish through an encoder such as FFmpeg/OBS.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div><h2 className="section-heading">AI Producer Queue</h2><p className="text-[11px] text-ink-muted mt-1">Next programme blocks</p></div>
                <Bot size={17} className="text-mint-400" />
              </div>
              <div className="space-y-3">
                {[
                  ['00:00', 'Market pulse', 'LIVE DATA'],
                  ['04:00', 'Risk explainer', 'VITALOS ANALYSIS'],
                  ['08:00', 'Stewardship principle', 'EDUCATION'],
                  ['12:00', 'Community Q&A', 'APPROVAL'],
                ].map(([time, label, tag]) => (
                  <div key={time} className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-ink-muted w-10">{time}</span>
                    <div className="flex-1 min-w-0"><p className="text-xs text-ink-primary font-medium">{label}</p><p className="text-[9px] text-ink-muted mt-0.5">{tag}</p></div>
                    <Clock3 size={13} className="text-ink-muted" />
                  </div>
                ))}
              </div>
            </section>

            <section className="card p-5">
              <div className="flex items-center gap-2 mb-4"><ShieldCheck size={17} className="text-mint-400" /><h2 className="section-heading">Trust Layer</h2></div>
              <div className="space-y-3">
                {[
                  ['LIVE DATA', 'Provider timestamp required'],
                  ['VITALOS ANALYSIS', 'Methodology + version'],
                  ['AI SCENARIO', 'Assumptions disclosed'],
                  ['SPONSORED', 'Commercial disclosure'],
                ].map(([a,b]) => <div key={a} className="table-row"><span className="table-label">{a}</span><span className="text-[10px] text-ink-muted text-right">{b}</span></div>)}
              </div>
            </section>

            <section className="card p-5">
              <h2 className="section-heading mb-4">Audience Economics</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="metric-cell"><Users size={15} className="text-ink-muted" /><span className="metric-value text-base">{metrics.viewers}</span><span className="metric-sub">viewers</span></div>
                <div className="metric-cell"><Heart size={15} className="text-ink-muted" /><span className="metric-value text-base">{running ? 12 : 0}</span><span className="metric-sub">interactions</span></div>
                <div className="metric-cell"><Coins size={15} className="text-ink-muted" /><span className="metric-value text-base">{metrics.revenue}</span><span className="metric-sub">illustrative</span></div>
                <div className="metric-cell"><TrendingUp size={15} className="text-ink-muted" /><span className="metric-value text-base">{running ? '+8.2%' : '—'}</span><span className="metric-sub">session trend</span></div>
              </div>
              <p className="text-[10px] text-ink-muted mt-4 leading-relaxed">Revenue figures in this first control-plane slice are placeholders, not Twitch earnings or ROI promises.</p>
            </section>
          </aside>
        </div>

        <section className="card p-5">
          <div className="flex items-start gap-3">
            <Eye size={17} className="text-mint-400 mt-0.5" />
            <div>
              <h2 className="section-heading">Production boundary</h2>
              <p className="text-xs text-ink-secondary mt-1 leading-relaxed max-w-4xl">
                VITALOS Live controls programming and analytics; it does not fake viewers, clicks or engagement. The next production layer will connect this control plane to a persistent FFmpeg/OBS worker, Twitch ingest, signed configuration, scheduled content generation, recordings and revenue telemetry.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
