import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import './Services.css'

function Services() {
  const { t } = useLanguage()
  const arch = t.services.architectureDiagram

  return (
    <div className="services">
      <section className="section">
        <div className="container">
          <h1>{t.services.title}</h1>
          <p className="section-subtitle">{t.services.subtitle}</p>
        </div>
      </section>

      {/* Four pillars */}
      <section className="section section-light">
        <div className="container">
          <h2 className="text-center mb-4">{t.services.pillarsTitle}</h2>
          <div className="pillars-grid">
            {t.services.pillars.map((pillar) => (
              <div key={pillar.title} className="pillar-card">
                <div className="pillar-icon">{pillar.icon}</div>
                <h3>{pillar.title}</h3>
                <p>{pillar.desc}</p>
                <ul className="pillar-items">
                  {pillar.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="section">
        <div className="container">
          <h2 className="text-center">{t.services.useCasesTitle}</h2>
          <p className="text-center section-subtitle">{t.services.useCasesSubtitle}</p>
          <div className="grid grid-3">
            {t.services.useCases.map((useCase) => (
              <div key={useCase.title} className="service-card">
                <div className="service-icon">{useCase.icon}</div>
                <h3>{useCase.title}</h3>
                <p>{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="section section-light">
        <div className="container">
          <div className="arch-grid">
            <div className="arch-copy">
              <h2>{t.services.architectureTitle}</h2>
              <p>{t.services.architectureText}</p>
            </div>
            <div className="arch-diagram" aria-hidden="true">
              <div className="arch-node">{arch.users}</div>
              <div className="arch-connector" />
              <div className="arch-node arch-node-accent">{arch.api}</div>
              <div className="arch-fan">
                <span className="arch-fan-line" />
              </div>
              <div className="arch-row">
                {arch.branches.map((branch, i) => (
                  <div className="arch-col" key={branch}>
                    <div className="arch-drop" />
                    <div className="arch-node arch-node-small">{branch}</div>
                    <div className="arch-connector small" />
                    <div className="arch-node arch-node-leaf">{arch.leaves[i]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
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
