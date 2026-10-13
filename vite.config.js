import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolveTopic } from './src/utils/contact.js'

// Mock prices for local development, kept in step with the live store
// (ResellersPanel, USD, 12 months) so the dev UI matches production.
const MOCK_PRICES = { com: 14.99, net: 15.49, org: 15.99, io: 67.99, info: 27.99 }
const MOCK_DEFAULT = ['com', 'net', 'org', 'io', 'info']

// Mirrors the name rule the real endpoint enforces for a single label.
const MOCK_NAME = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/

// Matches the addresses the contact form will realistically send: the real
// endpoint is stricter (FILTER_VALIDATE_EMAIL), but a missing "@" or domain
// must fail here too, not only in production.
const MOCK_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// The dev server cannot run PHP, so it answers /api/domain-check with fake data.
// Names containing "taken" (or shorter than 5 chars) are reported as registered.
function mockDomainApi() {
  return {
    name: 'mock-domain-api',
    configureServer(server) {
      server.middlewares.use('/api/domain-check.php', (req, res) => {
        const url = new URL(req.url, 'http://localhost')
        const name = (url.searchParams.get('name') || '').toLowerCase()
        const raw = url.searchParams.get('tlds') || ''
        const requested = raw.split(',').map((t) => t.trim()).filter(Boolean)
        const asked = requested.filter((t) => MOCK_PRICES[t])
        const tlds = [...new Set([...asked, ...MOCK_DEFAULT])]
        res.setHeader('Content-Type', 'application/json')
        if (!MOCK_NAME.test(name)) {
          res.statusCode = 422
          return res.end(JSON.stringify({ ok: false, error: 'invalid_name' }))
        }
        // Same rule as the real endpoint: asking for TLDs the store does not
        // sell must not silently answer about the popular ones instead.
        if (requested.length && !asked.length) {
          res.statusCode = 422
          return res.end(JSON.stringify({ ok: false, error: 'invalid_tld' }))
        }
        setTimeout(() => {
          const results = tlds.map((tld, i) => ({
            domain: `${name}.${tld}`,
            tld,
            available: name.includes('taken') || (name.length < 5 && i % 2 === 0) ? false : true,
            price: MOCK_PRICES[tld],
            regularPrice: MOCK_PRICES[tld],
            promo: false,
            currency: 'USD',
            registerUrl: `https://pvirtual.duoservers.com/dominios/resultados/?sld=${encodeURIComponent(name)}`,
          }))
          res.end(JSON.stringify({ ok: true, name, results }))
        }, 400)
      })
    },
  }
}

// The dev server cannot run PHP, so it answers /contact-send.php with a mock response.
// The mock validates the same things the endpoint does, on purpose: a rule that only
// runs on the server (the topic allowlist, the honeypot) drifts out of step with the
// form and nobody notices in development, only in production when a lead is rejected.
function mockContactApi() {
  return {
    name: 'mock-contact-api',
    configureServer(server) {
      server.middlewares.use('/contact-send.php', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end(JSON.stringify({ ok: false, error: 'method_not_allowed' }))
        }

        const chunks = []
        req.on('data', (chunk) => chunks.push(chunk))
        req.on('end', () => {
          const body = new URLSearchParams(Buffer.concat(chunks).toString('utf8'))

          // Honeypot: only bots fill it. Pretend success, exactly like the endpoint.
          if ((body.get('website') || '').trim() !== '') {
            return res.end(JSON.stringify({ ok: true }))
          }

          // An unknown topic is never a rejection: the endpoint degrades it to
          // 'general' too. Resolving it with the frontend helper keeps one
          // allowlist instead of a third copy that can rot on its own.
          const submitted = (body.get('topic') || '').trim().toLowerCase()
          const topic = resolveTopic(submitted)
          if (submitted && submitted !== topic) {
            server.config.logger.warn(
              `[mock-contact-api] unknown topic "${submitted}", using "${topic}"`,
            )
          }

          const name = (body.get('name') || '').trim()
          const email = (body.get('email') || '').trim()
          const message = (body.get('message') || '').trim()
          if (name === '' || message === '' || !MOCK_EMAIL.test(email)) {
            res.statusCode = 422
            return res.end(JSON.stringify({ ok: false, error: 'invalid_input' }))
          }

          setTimeout(() => {
            res.end(JSON.stringify({ ok: true }))
          }, 300)
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), mockDomainApi(), mockContactApi()],
  server: {
    port: 3000,
    open: true
  }
})
