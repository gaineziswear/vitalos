const SCENES = {
  market: { title: 'MARKET INTELLIGENCE', label: 'LIVE DATA', duration: 45 },
  stewardship: { title: 'STEWARDSHIP', label: 'EDUCATION', duration: 45 },
  opportunity: { title: 'OPPORTUNITY WATCH', label: 'VITALOS ANALYSIS', duration: 45 },
  community: { title: 'COMMUNITY', label: 'COMMUNITY', duration: 45 },
}

export function createProgramme(config, snapshot = {}) {
  const order = config.mode === 'away'
    ? ['market', 'stewardship', 'opportunity', 'community']
    : [config.scene]

  return order.map(scene => ({
    scene,
    ...SCENES[scene],
    generatedAt: new Date().toISOString(),
    cards: cardsFor(scene, snapshot),
    narration: narrationFor(scene, snapshot),
  }))
}

function cardsFor(scene, snapshot) {
  if (scene === 'market') return [
    { title: 'Market status', value: snapshot.marketStatus ?? 'Awaiting live feed', classification: 'LIVE DATA' },
    { title: 'Data timestamp', value: snapshot.timestamp ?? 'Not available', classification: 'SOURCE METADATA' },
  ]
  if (scene === 'stewardship') return [
    { title: 'Principle', value: 'Stewardship before speculation', classification: 'EDUCATION' },
    { title: 'Rule', value: 'Disclose assumptions and risk', classification: 'EDUCATION' },
  ]
  if (scene === 'opportunity') return [
    { title: 'Research status', value: snapshot.opportunityStatus ?? 'No live opportunity feed connected', classification: 'VITALOS ANALYSIS' },
    { title: 'Risk disclosure', value: 'Research is not a promise of return', classification: 'RISK DISCLOSURE' },
  ]
  return [
    { title: 'Community', value: 'Questions and education', classification: 'COMMUNITY' },
    { title: 'Interaction', value: 'Twitch telemetry pending', classification: 'TELEMETRY' },
  ]
}

function narrationFor(scene, snapshot) {
  const data = scene === 'market'
    ? snapshot.marketStatus ?? 'live market data is not connected yet'
    : scene === 'stewardship'
      ? 'Capital is a tool. Stewardship means understanding what we own, why we own it, and what can go wrong.'
      : scene === 'opportunity'
        ? 'VITALOS separates research from certainty. Every opportunity requires assumptions, risk disclosure, and independent verification.'
        : 'Welcome to VITALOS Live. We learn, examine evidence, and build with integrity.'
  return data
}
