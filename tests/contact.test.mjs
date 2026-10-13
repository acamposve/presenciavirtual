import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
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

// The endpoint is executed for real, through the PHP CLI: `php -r` sets $_POST and
// $_SERVER, includes public/contact-send.php and leaves the JSON body on stdout
// (in that SAPI header() and http_response_code() are inert). No server, no port,
// no fixtures, so a TypeError in the endpoint fails here instead of in production.
const phpProbe = spawnSync('php', ['-v'], { encoding: 'utf8' })
const hasPhp = !phpProbe.error && phpProbe.status === 0
const skipReason = 'php is not on PATH: skipping the endpoint execution tests'
const phpFile = join(root, 'public', 'contact-send.php').replace(/\\/g, '/')

function phpLiteral(value) {
  if (Array.isArray(value)) return `[${value.map(phpLiteral).join(', ')}]`
  if (value && typeof value === 'object') {
    const pairs = Object.entries(value).map(([key, item]) => `${phpLiteral(key)} => ${phpLiteral(item)}`)
    return `[${pairs.join(', ')}]`
  }
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

function runEndpoint(post, method = 'POST') {
  const script = [
    // A fatal error has to be visible in the output, not swallowed.
    "ini_set('display_errors', '1');",
    `$_SERVER['REQUEST_METHOD'] = ${phpLiteral(method)};`,
    `$_POST = ${phpLiteral(post)};`,
    `include '${phpFile}';`,
  ].join(' ')

  try {
    return execFileSync('php', ['-r', script], { cwd: root, encoding: 'utf8' })
  } catch (error) {
    // A fatal error exits non-zero; keep what PHP printed so the assertion can show it.
    return `${error.stdout ?? ''}${error.stderr ?? ''}`
  }
}

function responseOf(output) {
  assert.doesNotMatch(
    output,
    /Fatal error|Uncaught|TypeError/,
    `the endpoint failed instead of answering:\n${output}`,
  )
  const json = output.match(/\{"ok":(?:true|false)[^}]*\}/)
  assert.ok(json, `no JSON response on stdout:\n${output}`)
  return JSON.parse(json[0])
}

test('contact-send.php: an array in `topic` is answered, not fatal', (t) => {
  if (!hasPhp) return t.skip(skipReason)

  const output = runEndpoint({
    name: 'Ana',
    email: 'ana@example.com',
    message: 'Hola',
    topic: ['hosting'],
  })
  const payload = responseOf(output)

  // With valid name/email/message the request reaches mail(); in a CLI with no
  // mail transport that is send_failed. Either way it is an answer, and the empty
  // topic is not what makes it fail.
  assert.notEqual(payload.error, 'invalid_input')
})

test('contact-send.php: an array in `name` is answered, not fatal', (t) => {
  if (!hasPhp) return t.skip(skipReason)

  const output = runEndpoint({
    name: ['Ana'],
    email: 'ana@example.com',
    message: 'Hola',
  })

  // A non-string name normalizes to '' and gets the same 422 an empty name gets,
  // before anything touches mail().
  assert.deepEqual(responseOf(output), { ok: false, error: 'invalid_input' })
})

test('contact-send.php: an unknown topic is handled like `general`', (t) => {
  if (!hasPhp) return t.skip(skipReason)

  const base = { name: 'Ana', email: 'ana@example.com', message: 'Hola' }
  const unknown = responseOf(runEndpoint({ ...base, topic: 'wordpress' }))
  const general = responseOf(runEndpoint({ ...base, topic: 'general' }))

  assert.deepEqual(unknown, general, 'an unknown topic must degrade to general, not change the answer')
  assert.notEqual(unknown.error, 'invalid_input')
})

test('contact-send.php: a GET request is rejected with method_not_allowed', (t) => {
  if (!hasPhp) return t.skip(skipReason)

  assert.deepEqual(responseOf(runEndpoint({}, 'GET')), { ok: false, error: 'method_not_allowed' })
})

test('contact-send.php: an invalid email is rejected with invalid_input', (t) => {
  if (!hasPhp) return t.skip(skipReason)

  const output = runEndpoint({ name: 'Ana', email: 'ana(at)example.com', message: 'Hola' })
  assert.deepEqual(responseOf(output), { ok: false, error: 'invalid_input' })
})
