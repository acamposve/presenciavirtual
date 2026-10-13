import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { home } from '../src/i18n/sections/home.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
// The hosting card is the exception: /hosting publishes no prices yet, so it sends
// the visitor to the contact form with the topic pre-selected instead of promising plans.
const EXPECTED_SERVICES = ['/domains', '/contact?topic=hosting', '/web-development', '/ai-consulting']

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

test('Home.jsx places the hero search before the secondary hero buttons', () => {
  const homeSource = readFileSync(join(root, 'src', 'pages', 'Home.jsx'), 'utf8')
  const search = homeSource.indexOf('<DomainSearch variant="hero" />')
  const buttons = homeSource.indexOf('hero-buttons')

  assert.ok(search !== -1, 'DomainSearch variant="hero" missing in Home.jsx')
  assert.ok(buttons !== -1, 'hero-buttons missing in Home.jsx')
  assert.ok(search < buttons, 'the hero search must come before .hero-buttons in Home.jsx')
})

test('Home.jsx styles the hero contact CTA as the secondary action', () => {
  const homeSource = readFileSync(join(root, 'src', 'pages', 'Home.jsx'), 'utf8')
  const block = homeSource.match(/<div className="hero-buttons">([\s\S]*?)<\/div>/)

  assert.ok(block, 'could not read the .hero-buttons block in Home.jsx')
  const contact = block[1].match(/<Link to="\/contact"[^>]*>/)
  assert.ok(contact, 'no /contact CTA inside .hero-buttons in Home.jsx')
  // The search box is the primary hook; contact must not compete with it.
  assert.match(contact[0], /btn-secondary/, 'the hero contact CTA must use btn-secondary')
})

test('every home service link targets a route declared in App.jsx', () => {
  const appSource = readFileSync(join(root, 'src', 'App.jsx'), 'utf8')
  const routes = [...appSource.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1])

  assert.ok(routes.length > 0, 'could not extract any <Route path> from App.jsx')

  for (const lang of ['es', 'en']) {
    for (const item of home[lang].services) {
      const path = item.link.split('?')[0]
      assert.ok(
        routes.includes(path),
        `${lang}: "${item.link}" is not a route declared in App.jsx (${routes.join(', ')})`,
      )
    }
  }
})
