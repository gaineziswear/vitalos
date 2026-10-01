import fs from 'node:fs/promises'
import path from 'node:path'

export const SCENES = ['market', 'stewardship', 'opportunity', 'community']
const OUTPUT_DIR = process.env.VITALOS_SCENE_DIR ?? '/tmp/vitalos-broadcast'

const templates = {
  market: {
    title: 'VITALOS LIVE · MARKET INTELLIGENCE',
    body: 'Live market context · risk signals · macro conditions',
    disclosure: 'LIVE DATA · provider timestamp required',
  },
  stewardship: {
    title: 'VITALOS LIVE · STEWARDSHIP',
    body: 'Faithful stewardship · disciplined work · responsible capital',
    disclosure: 'EDUCATION · principles, not financial certainty',
  },
  opportunity: {
    title: 'VITALOS LIVE · OPPORTUNITY WATCH',
    body: 'Research-led opportunities · assumptions · downside first',
    disclosure: 'VITALOS ANALYSIS · methodology and version disclosed',
  },
  community: {
    title: 'VITALOS LIVE · COMMUNITY',
    body: 'Questions · education · viewer participation',
    disclosure: 'AI SCENARIO · assumptions disclosed',
  },
}

function clean(value, fallback) {
  const text = String(value ?? '').replace(/[\r\n]/g, ' ').trim()
  return text.slice(0, 220) || fallback
}

export function programmeFor(scene, context = {}) {
  const selected = SCENES.includes(scene) ? scene : 'market'
  const template = templates[selected]
  const market = context.market
    ? `Market context: ${clean(context.market, 'Awaiting provider data.')}`
    : template.body
  return {
    scene: selected,
    title: clean(context.title, template.title),
    body: clean(context.body, market),
    disclosure: clean(context.disclosure, template.disclosure),
    timestamp: new Date().toISOString(),
  }
}

export async function writeProgramme(programme) {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  const files = {
    title: path.join(OUTPUT_DIR, 'title.txt'),
    body: path.join(OUTPUT_DIR, 'body.txt'),
    disclosure: path.join(OUTPUT_DIR, 'disclosure.txt'),
  }
  await Promise.all([
    fs.writeFile(files.title, programme.title, 'utf8'),
    fs.writeFile(files.body, programme.body, 'utf8'),
    fs.writeFile(files.disclosure, programme.disclosure, 'utf8'),
  ])
  return files
}

export function drawtextFilters(files) {
  return [
    `drawtext=textfile='${files.title}':reload=1:fontcolor=white:fontsize=42:x=70:y=70:box=1:boxcolor=black@0.55:boxborderw=18`,
    `drawtext=textfile='${files.body}':reload=1:fontcolor=white:fontsize=30:x=70:y=180:box=1:boxcolor=black@0.45:boxborderw=14`,
    `drawtext=textfile='${files.disclosure}':reload=1:fontcolor=white:fontsize=22:x=70:y=h-80:box=1:boxcolor=black@0.65:boxborderw=10`,
  ].join(',')
}
