import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import './Services.css'

function Services() {
  const { t } = useLanguage()

  return (
    <div className="services">
      <section className="section">
        <div className="container">
          <h1>{t.services.title}</h1>
          <p className="section-subtitle">{t.services.subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {t.services.list.map((service) => (
              <div key={service.title} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <Link to="/contact" className="service-link">{t.services.linkText}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container text-center">
          <h2>{t.services.ctaTitle}</h2>
          <p>{t.services.ctaText}</p>
          <Link to="/contact" className="btn btn-primary mt-3">{t.services.ctaButton}</Link>
        </div>
      </section>
    </div>
  )
}

export default Services
