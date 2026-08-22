import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import './Header.css'

function Header() {
  const { t, language, setLanguage } = useLanguage()

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <img src="/logo-icon.svg" alt="Presencia Virtual" className="logo-img" />
          <span>{t.brand.name}</span>
        </Link>
        <nav className="nav">
          <Link to="/">{t.nav.home}</Link>
          <Link to="/about">{t.nav.about}</Link>
          <Link to="/services">{t.nav.services}</Link>
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
      </div>
    </header>
  )
}

export default Header
