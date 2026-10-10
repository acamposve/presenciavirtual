import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import './Header.css'

function Header() {
  const { t, language, setLanguage } = useLanguage()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [offerOpen, setOfferOpen] = useState(false)
  const offerRef = useRef(null)
  const offerToggleRef = useRef(null)

  const offerLinks = [
    { to: '/domains', label: t.nav.domains },
    { to: '/hosting', label: t.nav.hosting },
    { to: '/web-development', label: t.nav.webDevelopment },
    { to: '/ai-consulting', label: t.nav.aiConsulting },
  ]
  const offerActive = offerLinks.some((link) => link.to === pathname)

  useEffect(() => {
    setMenuOpen(false)
    setOfferOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!offerOpen) return undefined

    const handlePointerDown = (e) => {
      if (offerRef.current && !offerRef.current.contains(e.target)) setOfferOpen(false)
    }
    const handleKeyDown = (e) => {
      if (e.key !== 'Escape') return
      if (offerRef.current && offerRef.current.contains(document.activeElement)) {
        offerToggleRef.current?.focus()
      }
      setOfferOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [offerOpen])

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <img src="/logo-icon.svg" alt="Presencia Virtual" className="logo-img" />
          <span className="logo-text">
            <span className="logo-name">{t.brand.name}</span>
            <span className="logo-tagline">{t.brand.tagline}</span>
          </span>
        </Link>
        <nav
          id="main-nav"
          className={`nav${menuOpen ? ' nav-open' : ''}`}
          aria-label={t.nav.mainLabel}
          onClick={(e) => {
            if (e.target.closest('a')) {
              setMenuOpen(false)
              setOfferOpen(false)
            }
          }}
        >
          <Link to="/">{t.nav.home}</Link>
          <Link to="/about">{t.nav.about}</Link>
          <Link to="/services">{t.nav.services}</Link>
          <div className={`nav-dropdown${offerOpen ? ' open' : ''}`} ref={offerRef}>
            <button
              type="button"
              className={`nav-dropdown-toggle${offerActive ? ' active' : ''}`}
              ref={offerToggleRef}
              aria-expanded={offerOpen}
              aria-controls="nav-offer-menu"
              onClick={() => setOfferOpen((open) => !open)}
            >
              {t.nav.offer}
              <span className="nav-caret" aria-hidden="true" />
            </button>
            <div className="nav-dropdown-menu" id="nav-offer-menu">
              {offerLinks.map((link) => (
                <Link key={link.to} to={link.to}>{link.label}</Link>
              ))}
            </div>
          </div>
          <Link to="/contact">{t.nav.contact}</Link>
        </nav>
        <div className="lang-switch" role="group" aria-label="Language selector">
          <button
            type="button"
            className={language === 'es' ? 'active' : ''}
            onClick={() => setLanguage('es')}
            aria-pressed={language === 'es'}
          >
            ES
          </button>
          <span className="lang-divider">|</span>
          <button
            type="button"
            className={language === 'en' ? 'active' : ''}
            onClick={() => setLanguage('en')}
            aria-pressed={language === 'en'}
          >
            EN
          </button>
        </div>
        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? t.nav.menuClose : t.nav.menuOpen}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>
      </div>
    </header>
  )
}

export default Header
