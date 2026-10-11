import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { VALID_TOPICS, resolveTopic } from '../src/utils/contact.js'
import { contact } from '../src/i18n/sections/contact.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

test('resolveTopic: accepts valid topics and normalizes case/whitespace', () => {
  assert.equal(resolveTopic('general'), 'general')
  assert.equal(resolveTopic('domain'), 'domain')
  assert.equal(resolveTopic('hosting'), 'hosting')
  assert.equal(resolveTopic('web'), 'web')
  assert.equal(resolveTopic('ai'), 'ai')

  // Case-insensitivity and whitespace trimming
  assert.equal(resolveTopic('DOMAIN'), 'domain')
  assert.equal(resolveTopic('  Hosting  '), 'hosting')
  assert.equal(resolveTopic('AI'), 'ai')
})

test('resolveTopic: unknown or missing topics safely default to general', () => {
  assert.equal(resolveTopic(''), 'general')
  assert.equal(resolveTopic(null), 'general')
  assert.equal(resolveTopic(undefined), 'general')
  assert.equal(resolveTopic('something-else'), 'general')
  assert.equal(resolveTopic('wordpress'), 'general')
})

test('contact-send.php allowlist matches VALID_TOPICS exactly', () => {
  const phpSource = readFileSync(join(root, 'public', 'contact-send.php'), 'utf8')
  const match = phpSource.match(/\$valid_topics\s*=\s*\[([\s\S]*?)\];/m)
  assert.ok(match, 'could not extract $valid_topics from contact-send.php')

  const phpKeys = [...match[1].matchAll(/'([a-z_]+)'\s*=>/g)].map((m) => m[1])
  assert.deepEqual(
    phpKeys.sort(),
    [...VALID_TOPICS].sort(),
    'PHP and frontend topic allowlists have drifted apart',
  )
})

test('every valid topic is translated in es and en', () => {
  for (const topic of VALID_TOPICS) {
    const es = contact.es.topics[topic]
    const en = contact.en.topics[topic]
    assert.ok(es && typeof es === 'string', `missing es translation for topic: ${topic}`)
    assert.ok(en && typeof en === 'string', `missing en translation for topic: ${topic}`)
  }
})

test('service pages pass valid topic query parameters to /contact', () => {
  const pages = [
    { file: 'Domains.jsx', expected: 'domain' },
    { file: 'Hosting.jsx', expected: 'hosting' },
    { file: 'WebDevelopment.jsx', expected: 'web' },
    { file: 'AiConsulting.jsx', expected: 'ai' },
  ]

  for (const { file, expected } of pages) {
    const source = readFileSync(join(root, 'src', 'pages', file), 'utf8')
    const matches = [...source.matchAll(/to="\/contact\?topic=([a-z_]+)"/g)].map((m) => m[1])
    assert.ok(matches.length > 0, `no /contact?topic= link found in ${file}`)
    for (const topic of matches) {
      assert.equal(topic, expected, `unexpected topic in ${file}: ${topic}`)
      assert.ok(VALID_TOPICS.includes(topic), `invalid topic in ${file}: ${topic}`)
    }
  }
})
