import { useLanguage } from '../i18n/LanguageContext'
import { CONTACT_INFO } from '../i18n/translations'
import { PRIVACY_OWNER_DATA, missingPrivacyFields } from '../data/privacy'
import PageHero from '../components/PageHero'
import './Privacy.css'

// One section of the policy. Every section has the same shape in both languages
// (title, paragraphs, items), so the page can render them without special cases;
// the sections that need to show an owner value pass it as `children`.
function PolicySection({ id, content, children }) {
  return (
    <section className="section privacy-section" id={id}>
      <div className="container">
        <h2>{content.title}</h2>
        {content.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {content.items.length > 0 && (
          <ul className="privacy-list">
            {content.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        {children}
      </div>
    </section>
  )
}

// One row of the data blocks. A value that is still empty is never hidden and
// never guessed: it renders as the pending label, so an incomplete policy shows
// what is missing instead of looking finished.
function PrivacyValue({ label, value, pending }) {
  return (
    <div className="privacy-value">
      <dt>{label}</dt>
      <dd className={value ? undefined : 'privacy-value-pending'}>{value || pending}</dd>
    </div>
  )
}

function Privacy() {
  const { t } = useLanguage()
  const content = t.privacy

  // Every value that depends on the owner comes from src/data/privacy.js and only
  // from there: nothing legal is hard-coded in this component.
  const owner = PRIVACY_OWNER_DATA
  const missing = missingPrivacyFields()
  const pending = content.pendingValue

  return (
    <div className="service-page privacy-page">
      {/* Draft notice: it comes before the hero on purpose. It exists only to
          stop this page from being published half-written, so it has to be the
          first thing anyone sees. It disappears by itself when
          missingPrivacyFields() is empty. */}
      {missing.length > 0 && (
        <div className="privacy-draft-notice">
          <div className="container">
            <h2 className="privacy-draft-title">{content.draftNoticeTitle}</h2>
            <p>{content.draftNoticeText}</p>
            <ul className="privacy-draft-fields">
              {missing.map((key) => (
                <li key={key}>{content.fieldLabels[key]}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <PageHero title={content.title} subtitle={content.subtitle} />

      <PolicySection id="controller" content={content.sections.controller}>
        <dl className="privacy-data">
          <PrivacyValue label={content.fieldLabels.legalName} value={owner.legalName} pending={pending} />
          <PrivacyValue label={content.fieldLabels.address} value={owner.address} pending={pending} />
          <div className="privacy-value">
            <dt>{t.contact.emailLabel}</dt>
            <dd>
              <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
            </dd>
          </div>
          <PrivacyValue label={content.fieldLabels.jurisdiction} value={owner.jurisdiction} pending={pending} />
        </dl>
      </PolicySection>

      <PolicySection id="data" content={content.sections.data} />

      <PolicySection id="purposes" content={content.sections.purposes} />

      <PolicySection id="retention" content={content.sections.retention}>
        <dl className="privacy-data">
          <PrivacyValue
            label={content.fieldLabels.retentionPeriod}
            value={content.retentionPeriod}
            pending={pending}
          />
        </dl>
      </PolicySection>

      <PolicySection id="recipients" content={content.sections.recipients} />

      <PolicySection id="transfers" content={content.sections.transfers}>
        <dl className="privacy-data">
          <PrivacyValue
            label={content.fieldLabels.hostingCountry}
            value={owner.hostingCountry}
            pending={pending}
          />
        </dl>
      </PolicySection>

      <PolicySection id="rights" content={content.sections.rights}>
        <p>{content.rightsHowToText}</p>
        <p className="privacy-contact-line">
          <strong>{content.rightsHowToLabel}:</strong>{' '}
          <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
        </p>
        <p>{content.rightsAuthorityIntro}</p>
        <dl className="privacy-data">
          <PrivacyValue
            label={content.fieldLabels.supervisoryAuthority}
            value={owner.supervisoryAuthority}
            pending={pending}
          />
        </dl>
      </PolicySection>

      <PolicySection id="cookies" content={content.sections.cookies} />

      <PolicySection id="security" content={content.sections.security} />

      <PolicySection id="changes" content={content.sections.changes}>
        <dl className="privacy-data">
          <PrivacyValue label={content.fieldLabels.lastUpdated} value={content.lastUpdated} pending={pending} />
        </dl>
      </PolicySection>
    </div>
  )
}

export default Privacy
