import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Mock prices for local development, kept in step with the live store
// (ResellersPanel, USD, 12 months) so the dev UI matches production.
const MOCK_PRICES = { com: 14.99, net: 15.49, org: 15.99, io: 67.99, info: 27.99 }
const MOCK_DEFAULT = ['com', 'net', 'org', 'io', 'info']

// Mirrors the name rule the real endpoint enforces for a single label.
const MOCK_NAME = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/

// The dev server cannot run PHP, so it answers /api/domain-check with fake data.
// Names containing "taken" (or shorter than 5 chars) are reported as registered.
function mockDomainApi() {
  return {
    name: 'mock-domain-api',
    configureServer(server) {
      server.middlewares.use('/api/domain-check.php', (req, res) => {
        const url = new URL(req.url, 'http://localhost')
        const name = (url.searchParams.get('name') || '').toLowerCase()
        const asked = (url.searchParams.get('tlds') || '').split(',').filter((t) => MOCK_PRICES[t])
        const tlds = [...new Set([...asked, ...MOCK_DEFAULT])]
        res.setHeader('Content-Type', 'application/json')
        if (!/^(?!-)[a-z0-9-]{1,63}(?<!-)$/.test(name)) {
          res.statusCode = 422
          return res.end(JSON.stringify({ ok: false, error: 'invalid_name' }))
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

export default defineConfig({
  plugins: [react(), mockDomainApi()],
  server: {
    port: 3000,
    open: true
  }
})
