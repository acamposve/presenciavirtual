import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import PageHero from '../components/PageHero'
import FeatureCard from '../components/FeatureCard'
import DomainSearch, { parseDomainQuery } from '../components/DomainSearch'
import './Domains.css'

function formatPrice(price, currency) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)
}

function Domains() {
  const { t } = useLanguage()
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const parsed = parseDomainQuery(q)
  const parsedKey = parsed ? `${parsed.name}|${parsed.tld}` : ''
  const [state, setState] = useState({ status: 'idle', results: [], error: '' })
  const content = t.domains
  const s = content.search

  useEffect(() => {
    if (!parsed) {
      setState({ status: 'idle', results: [], error: '' })
      return undefined
    }
    const controller = new AbortController()
    setState({ status: 'loading', results: [], error: '' })
    const query = new URLSearchParams({ name: parsed.name })
    if (parsed.tld) query.set('tlds', parsed.tld)

    fetch(`/api/domain-check.php?${query}`, { signal: controller.signal })
      .then(async (res) => {
        const data = await res.json().catch(() => null)
        if (!res.ok || !data?.ok) throw new Error(data?.error || 'generic')
        return data.results
      })
      .then((results) => setState({ status: 'done', results, error: '' }))
      .catch((err) => {
        if (err.name === 'AbortError') return
        const known = s.errors[err.message] ? err.message : 'network'
        setState({ status: 'error', results: [], error: s.errors[known] })
      })

    return () => controller.abort()
    // parsedKey captures name+tld; s changes only with the language.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedKey, s])

  const exact = parsed?.tld ? `${parsed.name}.${parsed.tld}` : null

  return (
    <div className="service-page domains-page">
      <PageHero title={content.title} subtitle={content.subtitle}>
        <DomainSearch variant="page" initialValue={q} key={q} />
      </PageHero>

      <section className="section" aria-live="polite">
        <div className="container domains-results">
          {state.status === 'loading' && <p className="domains-status">{s.searching}</p>}
          {state.status === 'error' && <p className="domains-status domains-status-error" role="alert">{state.error}</p>}

          {state.status === 'done' && (
            <>
              <h2>{s.resultsTitle} <span className="domains-query">{parsed.name}</span></h2>
              <ul className="domains-list">
                {state.results.map((r) => (
                  <li key={r.domain} className={`domains-row${r.domain === exact ? ' domains-row-exact' : ''}`}>
                    <span className="domains-name">{r.domain}</span>
                    <span className={`domains-badge domains-badge-${r.available === true ? 'ok' : r.available === false ? 'no' : 'unknown'}`}>
                      {r.available === true ? s.available : r.available === false ? s.taken : s.unknown}
                    </span>
                    <span className="domains-price">
                      {r.promo && <s className="domains-price-old">{formatPrice(r.regularPrice, r.currency)}</s>}
                      {formatPrice(r.price, r.currency)}<small>{s.perYear}</small>
                    </span>
                    {r.available === true && (
                      <a className="btn btn-primary" href={r.registerUrl} target="_blank" rel="noopener noreferrer">{s.register}</a>
                    )}
                    {r.available === null && (
                      <Link className="btn btn-secondary" to="/contact">{s.contactUs}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

          {state.status === 'idle' && (
            <div className="domains-empty">
              <h2>{s.emptyTitle}</h2>
              <p>{s.emptyText}</p>
            </div>
          )}
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <h2 className="text-center mb-4">{content.highlightsTitle}</h2>
          <div className="grid grid-3">
            {content.highlights.map((item) => (
              <FeatureCard key={item.title} icon={item.icon} title={item.title} desc={item.desc} />
            ))}
          </div>
          <p className="text-center mt-3">
            {s.hostingText} <Link to="/hosting">{s.hostingLink}</Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container text-center">
          <h2>{content.ctaTitle}</h2>
          <p>{content.ctaText}</p>
          <Link to="/contact" className="btn btn-primary mt-3">{content.ctaButton}</Link>
        </div>
      </section>
    </div>
  )
}

export default Domains
