// Front <-> back parity for the domain name rule.
//
// Why this file exists: `src/utils/domain.js` decides what the browser asks for
// and `public/api/domain-check.php` decides what it will answer. They live in
// two languages and drifted apart once already ("mi.a.com" was accepted by the
// parser and answered 422 invalid_name after a round trip). Neither project's
// existing tests can see both sides at once, so this test reads the PHP rule out
// of the endpoint source and asserts the parser only ever produces names the
// endpoint accepts. It is deliberately an integration test of the two files, not
// a unit test of either.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseDomainQuery } from '../src/utils/domain.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const endpoint = readFileSync(join(root, 'public', 'api', 'domain-check.php'), 'utf8')

// The pattern is taken from the endpoint source, not retyped, so this test fails
// if the two rules ever diverge. In PHP the pattern sits inside a quoted string
// with `/` delimiters, e.g. '/^(?!-)[a-z0-9-]{1,63}(?<!-)$/'; the delimiters are
// stripped so the rest can be handed to JavaScript's RegExp unchanged.
function phpNameRule(source) {
  const match = source.match(/preg_match\(\s*'((?:\\.|[^'\\])*)'\s*,\s*\$name\s*\)/)
  if (!match) {
    throw new Error('could not extract the name rule from public/api/domain-check.php')
  }
  const literal = match[1]
  const delimited = literal.match(/^(.)((?:[\s\S])*)\1$/)
  if (!delimited) {
    throw new Error(`unexpected PHP pattern literal: ${JSON.stringify(literal)}`)
  }
  return delimited[2]
}

const PHP_NAME_RULE = phpNameRule(endpoint)

// The endpoint also names the error it uses for a name it rejects.
const PHP_NAME_ERROR = /respond\(422,\s*\['ok'\s*=>\s*false,\s*'error'\s*=>\s*'invalid_name'\]\)/.test(endpoint)

// The endpoint lowercases with strtolower(trim(...)) before matching.
//
// PCRE's `$` matches only at the very end (or before a final newline), which is
// also JavaScript's default `$` semantics, and the endpoint trims the input
// first, so the translation is faithful for every input used here.
function endpointAcceptsName(name) {
  return new RegExp(PHP_NAME_RULE).test(String(name).toLowerCase().trim())
}

// The parser must cope with every TLD the endpoint's catalogue could hold, so
// this list is wider than the current store: two-level suffixes, the longest
// real TLDs, and the boundary at 24/25 characters.
const INPUTS = [
  // Baseline (must keep working exactly as before).
  'miempresa', 'miempresa.com', 'miempresa.com.uy', 'www.miempresa.com',
  'café.com', 'https://www.miempresa.com/ruta?x=1', 'miempresa.com:8443', '😀.com',
  // Trailing dot (FQDN root) alone and combined.
  'miempresa.com.', 'www.miempresa.com.', 'miempresa.com.uy.',
  'https://www.miempresa.com./ruta?x=1', 'miempresa.com.:8443', 'miempresa.com.:8443/ruta?x=1',
  'miempresa.', 'MIEMPRESA.COM.',
  // Ports.
  'miempresa.com:80', 'miempresa.com:8080', 'miempresa.com:65535', 'miempresa.com:abc',
  // Schemes and non-http schemes.
  'http://miempresa.com', 'https://miempresa.com/', 'https://miempresa.com:443/x',
  'ftp://miempresa.com', 'mailto:miempresa.com', 'miempresa.com//x',
  // Embedded credentials.
  'user:pass@miempresa.com', 'https://user:pass@miempresa.com', 'user@miempresa.com',
  'https://user@www.miempresa.com/x',
  // IDN in several forms.
  'ñoño.uy', 'münchen.de', 'CAFÉ.COM', 'xn--caf-dma.com', 'café', 'café.com.', '☕.com',
  // Dotted names: the endpoint registers a single label, so these must not
  // reach it as a dotted name.
  'mi.a.com', 'MI.EMPRESA.COM.uy', 'a.a.a.a.a', 'a.b', 'mi.a', 'miempresa.com.uy.x',
  // Length boundaries.
  `${'a'.repeat(63)}.com`, `${'a'.repeat(64)}.com`, `${'t'.repeat(63)}.${'t'.repeat(24)}`,
  '', '   ', '.', '..', '.com', 'miempresa..com',
  // Malformed labels.
  '-miempresa.com', 'miempresa-.com', 'mi_empresa.com', 'mi empresa.com',
  'miempresa.com-', 'miempresa.c', 'miempresa.123', 'miempresa.-com', 'miempresa.c-m',
  // Not domain-ish at all.
  'http://', 'https://', '/', 'a', '123', 'localhost', '127.0.0.1', '0.0.0.0',
  '[::1]', 'miempresa/path', 'miempresa?x=1', 'miempresa#frag',
]

test('the endpoint name rule was actually extracted from the PHP source', () => {
  // Guards the test itself: if the extraction stops working, fail loudly rather
  // than validating nothing.
  assert.ok(PHP_NAME_RULE.startsWith('^') && PHP_NAME_RULE.endsWith('$'), `unexpected rule: ${PHP_NAME_RULE}`)
  assert.ok(PHP_NAME_RULE.includes('(?<!-'), `unexpected rule: ${PHP_NAME_RULE}`)
  assert.ok(PHP_NAME_ERROR, 'the endpoint no longer responds 422 invalid_name for a bad name')
})

test('sanity: the extracted rule accepts and rejects what PCRE does', () => {
  // Verified against the running endpoint independently (harness E2E):
  // "miempresa" -> 200, "mi.a" -> 422 invalid_name.
  assert.equal(endpointAcceptsName('miempresa'), true)
  assert.equal(endpointAcceptsName('xn--caf-dma'), true)
  assert.equal(endpointAcceptsName('a'), true)
  assert.equal(endpointAcceptsName('a-b'), true)
  assert.equal(endpointAcceptsName('MIEMPRESA'), true)
  assert.equal(endpointAcceptsName('mi.a'), false)
  assert.equal(endpointAcceptsName('miempresa.com'), false)
  assert.equal(endpointAcceptsName('-miempresa'), false)
  assert.equal(endpointAcceptsName('miempresa-'), false)
})

test('every name the parser returns is accepted verbatim by the endpoint rule', () => {
  let parsedCount = 0
  for (const input of INPUTS) {
    const parsed = parseDomainQuery(input)
    if (!parsed) continue
    parsedCount++
    assert.ok(
      endpointAcceptsName(parsed.name),
      `endpoint would reject name ${JSON.stringify(parsed.name)} parsed from ${JSON.stringify(input)}`,
    )
  }
  // A test that parses nothing proves nothing.
  assert.ok(parsedCount > 25, `only ${parsedCount} inputs parsed; the corpus is not exercising the parser`)
})

test('no parsed name ever contains a dot', () => {
  for (const input of INPUTS) {
    const parsed = parseDomainQuery(input)
    if (!parsed) continue
    assert.doesNotMatch(parsed.name, /\./, `name has a dot for ${JSON.stringify(input)}`)
  }
})

test('the endpoint rule rejects the dotted names the parser must not produce', () => {
  // Documents the exact failure mode the parser used to have.
  for (const dotted of ['mi.a', 'mi.empresa.com', 'blog.miempresa']) {
    assert.equal(endpointAcceptsName(dotted), false, `endpoint unexpectedly accepts ${dotted}`)
  }
  for (const single of ['miempresa', 'xn--caf-dma', 'a', 'a-b']) {
    assert.equal(endpointAcceptsName(single), true, `endpoint unexpectedly rejects ${single}`)
  }
})

test('a parsed name+tld never exceeds the DNS limits the endpoint would hit', () => {
  for (const input of INPUTS) {
    const parsed = parseDomainQuery(input)
    if (!parsed) continue
    assert.ok(parsed.name.length <= 63, `name too long for ${JSON.stringify(input)}`)
    const full = parsed.tld ? `${parsed.name}.${parsed.tld}` : parsed.name
    assert.ok(full.length <= 253, `fqdn too long for ${JSON.stringify(input)}`)
  }
})

test('an invalid name is never forwarded to the endpoint', () => {
  // The parser's job is to return null rather than let the API answer 422
  // invalid_name after a round trip.
  for (const bad of ['mi.a.com', 'MI.EMPRESA.COM.uy', '-miempresa.com', 'miempresa-.com', 'mi_empresa']) {
    assert.equal(parseDomainQuery(bad), null, `expected null for ${JSON.stringify(bad)}`)
  }
})
