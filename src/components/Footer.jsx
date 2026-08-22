import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { CONTACT_INFO } from '../i18n/translations'
import './Footer.css'

function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <img src="/logo-icon-dark.svg" alt="Presencia Virtual" className="footer-logo" />
            <h3>{t.brand.name}</h3>
            <p>{t.footer.about}</p>
          </div>
          <div className="footer-section">
            <h4>{t.footer.linksTitle}</h4>
            <ul>
              <li><Link to="/">{t.nav.home}</Link></li>
              <li><Link to="/about">{t.nav.about}</Link></li>
              <li><Link to="/services">{t.nav.services}</Link></li>
              <li><Link to="/contact">{t.nav.contact}</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>{t.footer.contactTitle}</h4>
            <p>Email: <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a></p>
            <p>{t.contact.phoneLabel}: <a href={`tel:${CONTACT_INFO.phoneHref}`}>{CONTACT_INFO.phone}</a></p>
            <p>{t.contact.locationValue}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} {t.brand.name}. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
