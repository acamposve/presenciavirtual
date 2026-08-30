import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import './Home.css'

function Home() {
  const { t } = useLanguage()
  const diagram = t.home.diffDiagram

  return (
    <div className="home">
      {/* Hero section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>{t.home.heroTitle}</h1>
            <p>{t.home.heroSubtitle}</p>
            <div className="hero-buttons">
              <Link to="/contact" className="btn btn-primary">{t.home.ctaContact}</Link>
              <Link to="/services" className="btn btn-secondary">{t.home.ctaServices}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* When to call us */}
      <section className="section">
        <div className="container">
          <h2 className="text-center">{t.home.whenTitle}</h2>
          <p className="text-center section-subtitle">{t.home.whenSubtitle}</p>
          <div className="when-list">
            {t.home.whenItems.map((item) => (
              <div className="when-item" key={item.trigger}>
                <p className="when-trigger">{item.trigger}</p>
                <p className="when-solution">→ {item.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI on top of existing systems */}
      <section className="section section-light">
        <div className="container">
          <div className="diff-grid">
            <div className="diff-copy">
              <h2>{t.home.diffTitle}</h2>
              <p>{t.home.diffSubtitle}</p>
            </div>
            <div className="ai-diagram" aria-hidden="true">
              <div className="ai-diagram-box">
                <strong>{diagram.source}</strong>
                <div className="ai-diagram-chips">
                  {diagram.sourceItems.map((item) => (
                    <span className="ai-diagram-chip" key={item}>{item}</span>
                  ))}
                </div>
              </div>
              <div className="ai-diagram-connector" />
              <div className="ai-diagram-box ai-diagram-box-accent">
                <strong>{diagram.layer}</strong>
                <div className="ai-diagram-chips">
                  {diagram.layerItems.map((item) => (
                    <span className="ai-diagram-chip ai-diagram-chip-accent" key={item}>{item}</span>
                  ))}
                </div>
              </div>
              <div className="ai-diagram-connector" />
              <div className="ai-diagram-box ai-diagram-output">
                <strong>{diagram.output}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="section">
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
