import assert from 'node:assert/strict'
import { programmeFor, SCENES } from './scene-composer.mjs'

assert.deepEqual(SCENES, ['market', 'stewardship', 'opportunity', 'community'])

const programme = programmeFor('market', {
  title: 'Market Pulse',
  body: 'BTC +2%\nInjected line',
  disclosure: 'LIVE DATA',
})

assert.equal(programme.scene, 'market')
assert.equal(programme.title, 'Market Pulse')
assert.equal(programme.body, 'BTC +2% Injected line')
assert.equal(programme.disclosure, 'LIVE DATA')
assert.ok(programme.timestamp)

const fallback = programmeFor('not-a-scene')
assert.equal(fallback.scene, 'market')
assert.ok(fallback.title.includes('MARKET INTELLIGENCE'))

console.log('scene composer tests passed')
