import assert from 'node:assert/strict'
import { createProgramme } from './programme.mjs'
import { encoderArgs } from './renderer.mjs'

const away = createProgramme({
  mode: 'away',
  scene: 'market',
}, {
  marketStatus: 'Test market',
  opportunityStatus: 'Test research',
  timestamp: '2026-10-02T00:00:00Z',
  source: 'test',
  apologeticsIndex: 0,
})

assert.deepEqual(
  away.map(item => item.scene),
  ['market', 'apologetics', 'stewardship', 'opportunity', 'community'],
)
assert.equal(away.length, 5)
assert.equal(away[0].cards[0].value, 'Test market')
assert.equal(away[1].cards[0].classification, 'CLAIM')
assert.equal(away[2].cards[0].value, 'Test research')

const live = createProgramme({
  mode: 'live',
  scene: 'opportunity',
}, {})
assert.deepEqual(live.map(item => item.scene), ['opportunity'])
assert.match(live[0].cards[1].value, /not a promise of return/i)

const apologetics = createProgramme({
  mode: 'live',
  scene: 'apologetics',
}, { apologeticsIndex: 1 })
assert.deepEqual(apologetics.map(item => item.scene), ['apologetics'])
assert.match(apologetics[0].cards[0].value, /bodily resurrection/i)
assert.equal(apologetics[0].cards[2].source, 'Irenaeus, Against Heresies V.7')

const args = encoderArgs(live[0])
assert.ok(args.includes('-f'))
assert.ok(args.includes('lavfi'))
assert.ok(args.includes('libx264'))
assert.ok(args.includes('flv'))

console.log('broadcast-worker tests: ok')
