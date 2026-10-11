import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { home } from '../src/i18n/sections/home.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const EXPECTED_SERVICES = ['/domains', '/hosting', '/web-development', '/ai-consulting']

test('home services list covers all four core services in es and en', () => {
  assert.equal(home.es.services.length, 4, 'expected 4 services in es')
  assert.equal(home.en.services.length, 4, 'expected 4 services in en')

  const esLinks = home.es.services.map((s) => s.link)
  const enLinks = home.en.services.map((s) => s.link)

  assert.deepEqual(esLinks, EXPECTED_SERVICES, 'es service links do not match expected four services')
  assert.deepEqual(enLinks, EXPECTED_SERVICES, 'en service links do not match expected four services')
})

test('every service item has icon, title, desc, link, linkLabel', () => {
  for (const lang of ['es', 'en']) {
    for (const item of home[lang].services) {
      assert.ok(item.icon && typeof item.icon === 'string', `${lang}: missing icon`)
      assert.ok(item.title && typeof item.title === 'string', `${lang}: missing title`)
      assert.ok(item.desc && typeof item.desc === 'string', `${lang}: missing desc`)
      assert.ok(item.link && typeof item.link === 'string', `${lang}: missing link`)
      assert.ok(item.linkLabel && typeof item.linkLabel === 'string', `${lang}: missing linkLabel`)
    }
  }
})

test('Home.jsx renders DomainSearch hero variant and FeatureCard for services', () => {
  const homeSource = readFileSync(join(root, 'src', 'pages', 'Home.jsx'), 'utf8')
  assert.match(homeSource, /<DomainSearch\s+variant="hero"\s*\/>/, 'DomainSearch variant="hero" missing in Home.jsx')
  assert.match(homeSource, /<FeatureCard\b/, 'FeatureCard component not rendered in Home.jsx')
  assert.match(homeSource, /className="[^"]*home-services-grid[^"]*"/, 'home-services-grid not found in Home.jsx')
})
