import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { parseDomainQuery } from '../utils/domain'
import './DomainSearch.css'

const POPULAR_TLDS = ['.com', '.net', '.org', '.io', '.info']

function DomainSearch({ variant = 'page', initialValue = '' }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [value, setValue] = useState(initialValue)
  const [invalid, setInvalid] = useState(false)
  const s = t.domains.search

  const handleSubmit = (event) => {
    event.preventDefault()
    const parsed = parseDomainQuery(value)
    if (!parsed) {
      setInvalid(true)
      return
    }
    setInvalid(false)
    const q = parsed.tld ? `${parsed.name}.${parsed.tld}` : parsed.name
    navigate(`/domains?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className={`domain-search domain-search-${variant}`}>
      <form className="domain-search-bar" onSubmit={handleSubmit} role="search" noValidate>
        <svg className="domain-search-icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          className="domain-search-input"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (invalid) setInvalid(false)
          }}
          placeholder={s.placeholder}
          aria-label={s.label}
          aria-invalid={invalid}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck="false"
        />
        <button type="submit" className="domain-search-button">{s.button}</button>
      </form>
      {invalid && <p className="domain-search-error" role="alert">{s.invalid}</p>}
      {variant === 'hero' && (
        <p className="domain-search-tlds">
          {POPULAR_TLDS.map((tld) => <span key={tld}>{tld}</span>)}
        </p>
      )}
    </div>
  )
}

export default DomainSearch
