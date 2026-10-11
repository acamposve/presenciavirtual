import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import PageHero from '../components/PageHero'
import FeatureCard from '../components/FeatureCard'
import { HOSTING_PLANS } from '../data/hostingPlans'
import { BILLING_PERIODS, formatUsd, getPlanAmount, isPricePending } from '../utils/pricing'
import './Hosting.css'

function Hosting() {
  const { t } = useLanguage()
  const [period, setPeriod] = useState('monthly')
  const content = t.hosting
  const plans = content.plans

  // An unknown plan id must not blow the page up: the fallback keeps the card
  // rendering (with its id as the visible name) instead of showing `undefined`.
  const labelOf = (plan) => plans.items[plan.id] || { name: plan.id, features: [] }

  return (
    <div className="service-page hosting-page">
      <PageHero title={content.title} subtitle={content.subtitle} badge={content.badge} />

      <section className="section">
        <div className="container">
          <h2 className="text-center">{plans.title}</h2>
          <p className="text-center section-subtitle">{plans.subtitle}</p>

          <div className="hosting-toggle" role="group" aria-label={plans.billingLabel}>
            {BILLING_PERIODS.map((value) => (
              <button
                key={value}
                type="button"
                className={period === value ? 'active' : ''}
                aria-pressed={period === value}
                onClick={() => setPeriod(value)}
              >
                {value === 'annual' ? plans.annual : plans.monthly}
              </button>
            ))}
          </div>

          <div className="hosting-grid">
            {HOSTING_PLANS.map((plan) => {
              const label = labelOf(plan)
              const amount = getPlanAmount(plan, period)
              const pending = isPricePending(amount)
              return (
                <FeatureCard key={plan.id} title={label.name} items={label.features}>
                  <p className={`hosting-plan-price${pending ? ' hosting-plan-price-pending' : ''}`}>
                    {pending ? plans.pricePending : formatUsd(amount)}
                    {!pending && (
                      <span>{period === 'annual' ? plans.perYear : plans.perMonth}</span>
                    )}
                  </p>
                  {label.features.length === 0 && (
                    <p className="hosting-plan-note">{plans.featuresPending}</p>
                  )}
                  {plan.orderUrl ? (
                    <a
                      className="btn btn-primary hosting-plan-cta"
                      href={plan.orderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {plans.order}
                    </a>
                  ) : (
                    <Link className="btn btn-secondary hosting-plan-cta" to="/contact?topic=hosting">
                      {plans.orderWithoutUrl}
                    </Link>
                  )}
                </FeatureCard>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <h2 className="text-center mb-4">{content.highlightsTitle}</h2>
          <div className="grid grid-3">
            {content.highlights.map((item) => (
              <FeatureCard key={item.title} icon={item.icon} title={item.title} desc={item.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* Domain + hosting bundle: links to the Phase 2 domain search. */}
      <section className="section">
        <div className="container hosting-bundle">
          <h2>{content.bundleTitle}</h2>
          <p>{content.bundleText}</p>
          <Link className="btn btn-primary mt-3" to="/domains">{content.bundleLink}</Link>
        </div>
      </section>

      <section className="section section-light">
        <div className="container text-center">
          <h2>{content.ctaTitle}</h2>
          <p>{content.ctaText}</p>
          <Link to="/contact?topic=hosting" className="btn btn-primary mt-3">{content.ctaButton}</Link>
        </div>
      </section>
    </div>
  )
}

export default Hosting
