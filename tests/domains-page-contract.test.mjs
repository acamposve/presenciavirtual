// The two rules in `src/pages/Domains.jsx` that no other test can reach, plus
// the UI/i18n contract for the endpoint's error keys.
//
// Why this file exists: the project has no renderer (no jsdom, no
// @testing-library), so the component cannot be mounted in this test setup. The
// rules that decide WHAT the page shows are pure expressions over data, though,
// and they are exactly where the reported defects lived (the alternatives block
// appeared for an available domain and for a bare-name search). This file takes
// the gate expression out of the component source and exercises it over real
// result shapes, so a regression in either rule fails here instead of only being
// visible in a browser.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { availableAlternatives } from '../src/utils/domain.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const page = readFileSync(join(root, 'src', 'pages', 'Domains.jsx'), 'utf8')

// The gate itself, taken from the component. If the component is refactored the
// extraction throws, which is a deliberate signal to revisit this test.
function alternativesGate(source) {
  const match = source.match(/const alternatives = ([^\n]+)$/m)
  if (!match) {
    throw new Error('could not extract the alternatives gate from src/pages/Domains.jsx')
  }
  const expression = match[1].replace(/;\s*$/, '')
  return (exactResult, state, exact) => {
    // eslint-disable-next-line no-new-func
    return new Function('exactResult', 'state', 'exact', 'availableAlternatives', `return ${expression}`)(
      exactResult, state, exact, availableAlternatives,
    )
  }
}

const gate = alternativesGate(page)

// A realistic payload from /api/domain-check.php for "miempresa.com".
function payload(exactAvailable) {
  return {
    results: [
      { domain: 'miempresa.com', available: exactAvailable, price: 14.99, currency: 'USD' },
      { domain: 'miempresa.net', available: true, price: 15.49, currency: 'USD' },
      { domain: 'miempresa.org', available: false, price: 15.99, currency: 'USD' },
      { domain: 'miempresa.io', available: true, price: 67.99, currency: 'USD' },
      { domain: 'miempresa.info', available: null, price: 27.99, currency: 'USD' },
    ],
  }
}

test('the gate was actually extracted from Domains.jsx', () => {
  const match = page.match(/const alternatives = ([^\n]+)$/m)
  assert.ok(match, 'gate expression not found')
  assert.match(match[1], /available === false/, `unexpected gate: ${match[1]}`)
})

test('CA1: a bare-name search (no requested TLD) never shows alternatives', () => {
  const state = payload(true)
  // `exact` is null because parsed.tld is empty: the search covers many TLDs.
  assert.deepEqual(gate(null, state, null), [])
  assert.deepEqual(gate(undefined, state, null), [])
})

test('CA1: an available exact domain never shows the taken-domain alternatives', () => {
  const state = payload(true)
  const exact = 'miempresa.com'
  const exactResult = state.results.find((r) => r.domain === exact)
  assert.equal(exactResult.available, true)
  assert.deepEqual(gate(exactResult, state, exact), [])
})

test('CA1: a taken exact domain does show the other available domains', () => {
  const state = payload(false)
  const exact = 'miempresa.com'
  const exactResult = state.results.find((r) => r.domain === exact)
  assert.deepEqual(
    gate(exactResult, state, exact).map((r) => r.domain),
    ['miempresa.net', 'miempresa.io'],
  )
})

test('CA1: an unknown availability never shows the taken-domain alternatives', () => {
  const state = payload(null)
  const exact = 'miempresa.com'
  const exactResult = state.results.find((r) => r.domain === exact)
  assert.deepEqual(gate(exactResult, state, exact), [])
})

test('CA1: the old "any available result" condition is genuinely caught', () => {
  // The defect that was fixed: rendering alternatives whenever the payload
  // contained any available domain. This asserts the current gate is not that.
  const state = payload(true)
  const exact = 'miempresa.com'
  const exactResult = state.results.find((r) => r.domain === exact)
  const oldBehaviour = availableAlternatives(state.results, exact) // non-empty
  assert.ok(oldBehaviour.length > 0, 'fixture must contain available alternatives')
  assert.deepEqual(gate(exactResult, state, exact), [], 'gate still fires for an available domain')
})

// --- Error-path contract between the endpoint and the page ------------------

const API_ERROR_KEYS = [
  'invalid_name', 'invalid_tld', 'not_configured', 'rate_limited',
  'upstream_unreachable', 'upstream_error', 'method_not_allowed', 'no_tlds',
]

// Endpoint errors the page has no copy for. The list is empty on purpose:
// every error the endpoint can raise now has its own text in both languages
// (`method_not_allowed` was the last one missing). Adding a new endpoint error
// without copy makes these tests fail; only add it here as a deliberate,
// documented gap, never to silence a real one.
const KNOWN_UNMAPPED = []

const domains = (await import('../src/i18n/sections/domains.js')).domains

test('every error the endpoint can return has copy in es and en', () => {
  const unmapped = []
  for (const key of API_ERROR_KEYS) {
    const es = domains.es.search.errors[key]
    const en = domains.en.search.errors[key]
    if (!es || !en) {
      unmapped.push(key)
      continue
    }
    // A half-translated key is worse than a missing one.
    assert.equal(typeof es, 'string', `es copy for ${key} is not text`)
    assert.equal(typeof en, 'string', `en copy for ${key} is not text`)
  }
  assert.deepEqual(
    unmapped, KNOWN_UNMAPPED,
    `error keys with no copy changed: ${JSON.stringify(unmapped)} (expected ${JSON.stringify(KNOWN_UNMAPPED)})`,
  )
})

test('the page renders every error the endpoint can return, or the network text', () => {
  const errors = domains.es.search.errors
  for (const key of API_ERROR_KEYS) {
    const shown = errors[key] || errors.network
    assert.equal(typeof shown, 'string')
    assert.ok(shown.length > 0, `empty copy for ${key}`)
  }
  // The fallback itself must exist, or an unmapped key renders undefined.
  assert.ok(errors.network, 'no network fallback copy')
})

test('the endpoint error vocabulary and the page copy have not drifted apart', () => {
  const endpoint = readFileSync(join(root, 'public', 'api', 'domain-check.php'), 'utf8')
  const raised = [...endpoint.matchAll(/'error'\s*=>\s*'([a-z_]+)'/g)].map((m) => m[1])
  assert.ok(raised.length >= 5, `only found: ${raised.join(', ')}`)
  const unmapped = [...new Set(raised)].filter((key) => !domains.es.search.errors[key])
  // Any endpoint error that is neither translated nor in the documented list of
  // known gaps would render the generic connection text: fail on that.
  for (const key of unmapped) {
    assert.ok(
      KNOWN_UNMAPPED.includes(key),
      `endpoint can return "${key}" but the page has no copy for it and it is not a documented gap`,
    )
  }
})
