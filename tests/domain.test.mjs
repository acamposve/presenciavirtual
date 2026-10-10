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
  ['miempresa.', null],
  ['miempresa.c', null],
  ['miempresa.123', null],
  ['miempresa.c0m', null],
  [`${'a'.repeat(64)}.com`, null],
  ['miempresa.c0m', null],
  ['miempresa.com-', null],
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

test('parseDomainQuery: the returned name is always ASCII', () => {
  for (const [input] of CASES) {
    const parsed = parseDomainQuery(input)
    if (parsed) {
      assert.match(parsed.name, /^[a-z0-9-]+$/, `not ASCII for ${JSON.stringify(input)}`)
      // A bare name has no TLD; a TLD is 1-2 lowercase labels.
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
