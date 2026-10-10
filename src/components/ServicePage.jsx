import { Link } from 'react-router-dom'
import PageHero from './PageHero'
import FeatureCard from './FeatureCard'

function ServicePage({ content }) {
  return (
    <div className="service-page">
      <PageHero title={content.title} subtitle={content.subtitle} badge={content.badge} />

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

      <section className="section section-light">
        <div className="container text-center">
          <h2>{content.ctaTitle}</h2>
          <p>{content.ctaText}</p>
          <Link to="/contact" className="btn btn-primary mt-3">{content.ctaButton}</Link>
        </div>
      </section>
    </div>
  )
}

export default ServicePage
