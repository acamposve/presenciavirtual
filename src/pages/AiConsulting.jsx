import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import PageHero from '../components/PageHero'
import FeatureCard from '../components/FeatureCard'
import './AiConsulting.css'

function AiConsulting() {
  const { t } = useLanguage()
  const content = t.aiConsulting

  return (
    <div className="service-page ai-consulting-page">
      <PageHero title={content.title} subtitle={content.subtitle} />

      {/* Engagement types: structured path in 3 stages */}
      <section className="section">
        <div className="container">
          <h2 className="text-center">{content.engagementsTitle}</h2>
          <p className="text-center section-subtitle">{content.engagementsSubtitle}</p>
          <ol className="ai-consulting-steps" role="list">
            {content.engagements.map((step, index) => (
              <li className="ai-consulting-step" key={step.title}>
                <span className="ai-consulting-step-number" aria-hidden="true">
                  {index + 1}
                </span>
                <div className="ai-consulting-step-icon" aria-hidden="true">
                  {step.icon}
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                <div className="ai-consulting-step-deliverable">
                  <span className="deliverable-tag">
                    {/* Says what the tag is before reading its value. */}
                    <span className="deliverable-label">{content.deliverableLabel}: </span>
                    {step.deliverable}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* AI Capabilities: Agents, RAG, Document Intelligence */}
      <section className="section section-light">
        <div className="container">
          <h2 className="text-center">{content.capabilitiesTitle}</h2>
          <p className="text-center section-subtitle">{content.capabilitiesSubtitle}</p>
          <div className="grid grid-3">
            {content.capabilities.map((item) => (
              <FeatureCard key={item.title} icon={item.icon} title={item.title} desc={item.desc} />
            ))}
          </div>
          <p className="text-center ai-consulting-solutions-link">
            <Link to="/services">{content.solutionsLink}</Link>
          </p>
        </div>
      </section>

      {/* Engineering Principles: Pragmatism, Security, Measurable ROI */}
      <section className="section">
        <div className="container">
          <h2 className="text-center">{content.principlesTitle}</h2>
          <p className="text-center section-subtitle">{content.principlesSubtitle}</p>
          <div className="grid grid-3">
            {content.principles.map((item) => (
              <FeatureCard key={item.title} icon={item.icon} title={item.title} desc={item.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="section section-light">
        <div className="container text-center">
          <h2>{content.ctaTitle}</h2>
          <p>{content.ctaText}</p>
          <Link to="/contact?topic=ai" className="btn btn-primary mt-3">
            {content.ctaButton}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AiConsulting

