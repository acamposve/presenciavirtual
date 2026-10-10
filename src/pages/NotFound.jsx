import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import './NotFound.css'

// Rendered for any route the app does not know. Without this, a mistyped URL
// would show an empty page with nothing to click.
function NotFound() {
  const { t } = useLanguage()
  const c = t.notFound

  return (
    <div className="service-page not-found-page">
      <section className="section">
        <div className="container not-found">
          <p className="not-found-code">404</p>
          <h1>{c.title}</h1>
          <p className="not-found-text">{c.text}</p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">{c.home}</Link>
            <Link to="/domains" className="btn btn-secondary">{c.domains}</Link>
            <Link to="/contact" className="btn btn-secondary">{c.contact}</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NotFound
