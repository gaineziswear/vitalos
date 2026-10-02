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
})

assert.deepEqual(
  away.map(item => item.scene),
  ['market', 'apologetics', 'stewardship', 'opportunity', 'community'],
)
assert.equal(away.length, 5)
assert.equal(away[0].cards[0].value, 'Test market')
assert.equal(away[2].cards[0].value, 'Test research')

const live = createProgramme({
  mode: 'live',
  scene: 'opportunity',
}, {})
assert.deepEqual(live.map(item => item.scene), ['opportunity'])
assert.match(live[0].cards[1].value, /not a promise of return/i)

const args = encoderArgs(live[0])
assert.ok(args.includes('-f'))
assert.ok(args.includes('lavfi'))
assert.ok(args.includes('libx264'))
assert.ok(args.includes('flv'))

console.log('broadcast-worker tests: ok')
