import test from 'node:test'
import assert from 'node:assert/strict'
import { availableAlternatives, parseDomainQuery } from '../src/utils/domain.js'

// [input, expected {name, tld} or null]
const CASES = [
  // Plain names and full domains.
  ['miempresa', { name: 'miempresa', tld: '' }],
  ['miempresa.com', { name: 'miempresa', tld: 'com' }],
  ['  miempresa.com  ', { name: 'miempresa', tld: 'com' }],
  ['MIEMPRESA.COM', { name: 'miempresa', tld: 'com' }],
  ['www.miempresa.com', { name: 'miempresa', tld: 'com' }],
  ['https://www.miempresa.com/ruta?x=1', { name: 'miempresa', tld: 'com' }],
  ['http://miempresa.com', { name: 'miempresa', tld: 'com' }],
  ['miempresa.com/', { name: 'miempresa', tld: 'com' }],
  ['miempresa.com#ancla', { name: 'miempresa', tld: 'com' }],
  ['miempresa.com:8443', { name: 'miempresa', tld: 'com' }],

  // A trailing dot marks a FQDN and means the same domain, so it is ignored.
  ['miempresa.com.', { name: 'miempresa', tld: 'com' }],
  ['miempresa.com.uy.', { name: 'miempresa', tld: 'com.uy' }],
  ['https://www.miempresa.com./ruta?x=1', { name: 'miempresa', tld: 'com' }],
  // Port after the trailing dot: the URL parser accepts it and the dot still goes.
  ['miempresa.com.:8443', { name: 'miempresa', tld: 'com' }],

  // Multi-level TLDs (a second level is allowed).
  ['miempresa.com.uy', { name: 'miempresa', tld: 'com.uy' }],
  ['miempresa.co.uk', { name: 'miempresa', tld: 'co.uk' }],

  // IDN: typed in Unicode, converted to punycode for the API.
  ['café.com', { name: 'xn--caf-dma', tld: 'com' }],
  ['ñoño.uy', { name: 'xn--oo-yjab', tld: 'uy' }],
  ['münchen.de', { name: 'xn--mnchen-3ya', tld: 'de' }],
  ['café', { name: 'xn--caf-dma', tld: '' }],
  ['CAFÉ.COM', { name: 'xn--caf-dma', tld: 'com' }],
  // Already punycode: left alone.
  ['xn--caf-dma.com', { name: 'xn--caf-dma', tld: 'com' }],
  // An emoji domain is a valid IDN.
  ['😀.com', { name: 'xn--e28h', tld: 'com' }],

  // Longest real TLDs must pass (the old 10-char limit rejected these).
  ['miempresa.southcarolina', { name: 'miempresa', tld: 'southcarolina' }],
  ['miempresa.versicherung', { name: 'miempresa', tld: 'versicherung' }],
  ['miempresa.travel', { name: 'miempresa', tld: 'travel' }],
  // Length boundary: accepted up to 24 characters, rejected at 25.
  [`miempresa.${'t'.repeat(24)}`, { name: 'miempresa', tld: 't'.repeat(24) }],
  [`miempresa.${'t'.repeat(25)}`, null],

  // Invalid input.
  ['', null],
  ['   ', null],
  ['mi empresa.com', null],
  ['-miempresa.com', null],
  ['miempresa-.com', null],
  ['miempresa..com', null],
  ['.com', null],
  // The trailing dot is ignored, so this is the bare name "miempresa" and the
  // search covers the popular TLDs (it used to be rejected).
  ['miempresa.', { name: 'miempresa', tld: '' }],
  ['miempresa.c', null],
  ['miempresa.123', null],
  [`${'a'.repeat(64)}.com`, null],
  ['miempresa.com-', null],

  // The name is a single label, so these never reach the API as "mi.a"
  // (the endpoint answered 422 invalid_name after a round trip).
  ['mi.a.com', null],
  ['MI.EMPRESA.COM.uy', null],
  ['a.a.a.a.a', null],
  // A trailing dot on a dotted name is stripped first, and the remaining name
  // still has a dot: still not a single label, so still rejected.
  ['mi.a.com.', null],
  ['MI.EMPRESA.COM.uy.', null],
  // Embedded credentials are rejected by the parser, not stripped.
  ['user:pass@miempresa.com', null],
  ['https://user:pass@miempresa.com', null],

  // --- Cases added by the test specialist (verified against the endpoint in a
  // local harness; see the report). No production code was changed for these.
  // The trailing dot survives every combination of port, path and query.
  ['www.miempresa.com.:8443', { name: 'miempresa', tld: 'com' }],
  ['www.miempresa.com./ruta?x=1', { name: 'miempresa', tld: 'com' }],
  ['https://WWW.MIEMPRESA.COM./Ruta', { name: 'miempresa', tld: 'com' }],
  ['miempresa.com:8443/ruta', { name: 'miempresa', tld: 'com' }],
  // Uppercase scheme, path, query and fragment together.
  ['HTTPS://miempresa.com:8443/ruta?x=1#ancla', { name: 'miempresa', tld: 'com' }],
  // Port boundaries: 65535 is the maximum valid port, 99999 is not a port and
  // the URL parser rejects the whole input.
  ['miempresa.com:65535', { name: 'miempresa', tld: 'com' }],
  ['miempresa.com:99999', null],
  // A trailing dot on an IDN: normalisation happens first, the dot still goes.
  ['café.com.', { name: 'xn--caf-dma', tld: 'com' }],
  ['www.ñoño.uy.', { name: 'xn--oo-yjab', tld: 'uy' }],
  ['münchen.de.', { name: 'xn--mnchen-3ya', tld: 'de' }],
  // The dot is only stripped once, at the end: "..." is not a FQDN root.
  ['miempresa.com...', null],
  ['miempresa...', null],
  // A scheme with no host at all is not a query.
  ['https://', null],
  ['http://', null],
  // Longest accepted name against a long TLD (both limits at once).
  [`${'a'.repeat(63)}.${'t'.repeat(24)}`, { name: 'a'.repeat(63), tld: 't'.repeat(24) }],
  [`${'a'.repeat(64)}.${'t'.repeat(24)}`, null],
]

test('parseDomainQuery: valid and invalid inputs', () => {
  for (const [input, expected] of CASES) {
    assert.deepEqual(parseDomainQuery(input), expected, `input: ${JSON.stringify(input)}`)
  }
})

test('parseDomainQuery: rejects non-string input', () => {
  for (const input of [null, undefined, 0, false, {}, []]) {
    assert.equal(parseDomainQuery(input), null, `input: ${JSON.stringify(input)}`)
  }
})

test('parseDomainQuery: the returned name is always one ASCII label', () => {
  for (const [input] of CASES) {
    const parsed = parseDomainQuery(input)
    if (parsed) {
      // One label means no dot, which is what the endpoint requires.
      assert.doesNotMatch(parsed.name, /\./, `name has a dot for ${JSON.stringify(input)}`)
      assert.match(parsed.name, /^[a-z0-9-]+$/, `not ASCII for ${JSON.stringify(input)}`)
      // A bare name has no TLD; a TLD is 1-2 lowercase ASCII labels.
      assert.match(parsed.tld, /^([a-z]{2,24})?(\.[a-z]{2,24})?$/, `bad tld for ${JSON.stringify(input)}`)
    }
  }
})

test('availableAlternatives: only available results, minus the requested domain', () => {
  const results = [
    { domain: 'acme.com', available: false },
    { domain: 'acme.net', available: true },
    { domain: 'acme.org', available: null },
    { domain: 'acme.io', available: true },
  ]
  assert.deepEqual(
    availableAlternatives(results, 'acme.net').map((r) => r.domain),
    ['acme.io'],
  )
  assert.deepEqual(
    availableAlternatives(results, null).map((r) => r.domain),
    ['acme.net', 'acme.io'],
  )
  assert.deepEqual(availableAlternatives(undefined, 'acme.com'), [])
  assert.deepEqual(availableAlternatives([], 'acme.com'), [])
})
