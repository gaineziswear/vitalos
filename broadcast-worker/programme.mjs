const SCENES = {
  market: { title: 'MARKET INTELLIGENCE', label: 'LIVE DATA', duration: 45 },
  stewardship: { title: 'STEWARDSHIP', label: 'EDUCATION', duration: 45 },
  opportunity: { title: 'OPPORTUNITY WATCH', label: 'VITALOS ANALYSIS', duration: 45 },
  community: { title: 'COMMUNITY', label: 'COMMUNITY', duration: 45 },
  apologetics: { title: 'TRUTH & APOSTOLIC HISTORY', label: 'APOLOGETICS', duration: 60 },
}

const APOLOGETICS = [
  {
    claim: 'CLAIM: Jesus only appeared to suffer and was not physically crucified.',
    fact: 'EARLY WITNESS: Ignatius of Antioch explicitly says Christ suffered truly, was crucified under Pontius Pilate, and truly rose.',
    source: 'Ignatius, Smyrnaeans 1-2',
    sourceUrl: 'https://www.newadvent.org/fathers/0109.htm',
    response: 'The docetic claim is not an early Christian consensus hidden by later councils; it is an error an early bishop is already arguing against.',
  },
  {
    claim: 'CLAIM: The early Church invented a bodily resurrection much later.',
    fact: 'EARLY WITNESS: Irenaeus argues that Christ rose in the flesh and appeals to apostolic writings against opponents who denied bodily resurrection.',
    source: 'Irenaeus, Against Heresies V.7',
    sourceUrl: 'https://www.newadvent.org/fathers/0103507.htm',
    response: 'That makes a late invention thesis historically difficult: second-century Christian writers are already defending bodily resurrection as inherited apostolic teaching.',
  },
  {
    claim: 'CLAIM: Jesus was a different kind of being from the man crucified.',
    fact: 'EARLY WITNESS: Irenaeus explicitly argues that Jesus Christ is the same one proclaimed in the apostolic writings and rejects theories separating Jesus from Christ.',
    source: 'Irenaeus, Against Heresies III.16',
    sourceUrl: 'https://www.newadvent.org/fathers/0103316.htm',
    response: 'The historical question is not what a later polemicist can make the text mean; it is what the earliest surviving Christian witnesses actually taught.',
  },
  {
    claim: 'CLAIM: The crucifixion is merely a Christian invention with no early external attestation.',
    fact: 'ANCIENT EXTERNAL WITNESS: Tacitus reports that Christus suffered the extreme penalty under Pontius Pilate during Tiberius reign.',
    source: 'Tacitus, Annals 15.44',
    sourceUrl: 'https://www.perseus.tufts.edu/hopper/text?doc=Tac.+Ann.+15.44',
    response: 'Tacitus is not a Christian witness and does not prove the resurrection, but he independently supports the historical core that Christians were attached to a crucified Christus under Pilate.',
  },
]

export function createProgramme(config, snapshot = {}) {
  const order = config.mode === 'away'
    ? ['market', 'apologetics', 'stewardship', 'opportunity', 'community']
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
  if (scene === 'apologetics') {
    const item = APOLOGETICS[Number(snapshot.apologeticsIndex ?? 0) % APOLOGETICS.length]
    return [
      { title: 'Claim under examination', value: item.claim, classification: 'CLAIM' },
      { title: 'Historical evidence', value: item.fact, classification: 'PRIMARY/ANCIENT SOURCE' },
      { title: 'Source', value: item.source, classification: 'REFERENCE' },
    ]
  }
  return [
    { title: 'Community', value: 'Questions and education', classification: 'COMMUNITY' },
    { title: 'Interaction', value: 'Twitch telemetry pending', classification: 'TELEMETRY' },
  ]
}

function narrationFor(scene, snapshot) {
  if (scene === 'market') return snapshot.marketStatus ?? 'live market data is not connected yet'
  if (scene === 'stewardship') return 'Capital is a tool. Stewardship means understanding what we own, why we own it, and what can go wrong.'
  if (scene === 'opportunity') return 'VITALOS separates research from certainty. Every opportunity requires assumptions, risk disclosure, and independent verification.'
  if (scene === 'apologetics') {
    const item = APOLOGETICS[Number(snapshot.apologeticsIndex ?? 0) % APOLOGETICS.length]
    return item.response
  }
  return 'Welcome to VITALOS Live. We learn, examine evidence, and build with integrity.'
}
