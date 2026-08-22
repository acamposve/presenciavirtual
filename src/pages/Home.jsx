import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import './Home.css'

function Home() {
  const { t } = useLanguage()

  return (
    <div className="home">
      {/* Hero section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>{t.home.heroTitle}</h1>
            <p>{t.home.heroSubtitle}</p>
            <div className="hero-buttons">
              <Link to="/services" className="btn btn-primary">{t.home.ctaServices}</Link>
              <Link to="/contact" className="btn btn-secondary">{t.home.ctaContact}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="section">
        <div className="container">
          <h2 className="text-center mb-4">{t.home.whyTitle}</h2>
          <div className="grid grid-3">
            {t.home.features.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="section section-light">
        <div className="container text-center">
          <h2>{t.home.ctaTitle}</h2>
          <p>{t.home.ctaText}</p>
          <Link to="/contact" className="btn btn-primary mt-3">{t.home.ctaButton}</Link>
        </div>
      </section>
    </div>
  )
}

export default Home
