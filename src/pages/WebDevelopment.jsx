import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import PageHero from '../components/PageHero'
import FeatureCard from '../components/FeatureCard'
import './WebDevelopment.css'

function WebDevelopment() {
  const { t } = useLanguage()
  const content = t.webDevelopment
  const cases = content.cases

  return (
    <div className="service-page web-development-page">
      <PageHero title={content.title} subtitle={content.subtitle} />

      {/* Offering tiers: the three highlights already published for this service. */}
      <section className="section">
        <div className="container">
          <h2 className="text-center mb-4">{content.highlightsTitle}</h2>
          <div className="grid grid-3">
            {content.highlights.map((item) => (
              <FeatureCard key={item.title} icon={item.icon} title={item.title} desc={item.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* Working process: order is the meaning, so it is a numbered list. */}
      <section className="section section-light">
        <div className="container">
          <h2 className="text-center">{content.processTitle}</h2>
          <p className="text-center section-subtitle">{content.processSubtitle}</p>
          <ol className="web-development-steps">
            {content.process.map((step, index) => (
              <li className="web-development-step" key={step.title}>
                <span className="web-development-step-number" aria-hidden="true">
                  {index + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Stack: only the capabilities already published on the Solutions page. */}
      <section className="section">
        <div className="container">
          <h2 className="text-center">{content.stackTitle}</h2>
          <p className="text-center section-subtitle">{content.stackText}</p>
          <ul className="web-development-stack">
            {content.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-center web-development-stack-link">
            <Link to="/services">{content.stackLink}</Link>
          </p>
        </div>
      </section>

      {/* Case studies: the cards only exist once a real case is confirmed. */}
      <section className="section section-light">
        <div className="container">
          <h2 className="text-center">{cases.title}</h2>
          {cases.subtitle && <p className="text-center section-subtitle">{cases.subtitle}</p>}
          {cases.items.length > 0 ? (
            <div className="grid grid-3">
              {cases.items.map((item) => (
                <FeatureCard key={item.title} title={item.title} desc={item.desc} />
              ))}
            </div>
          ) : (
            <p className="web-development-empty">{content.casesPending}</p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container text-center">
          <h2>{content.ctaTitle}</h2>
          <p>{content.ctaText}</p>
          <Link to="/contact?topic=web" className="btn btn-primary mt-3">{content.ctaButton}</Link>
        </div>
      </section>
    </div>
  )
}

export default WebDevelopment
