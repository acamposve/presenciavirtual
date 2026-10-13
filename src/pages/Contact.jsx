import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { CONTACT_INFO } from '../i18n/translations'
// The selector is built from t.contact.topics, and tests/contact.test.mjs already
// asserts that every VALID_TOPICS entry is translated in both languages, so the
// allowlist needs no second copy here.
import { resolveTopic } from '../utils/contact'
import './Contact.css'

function Contact() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const initialTopic = resolveTopic(searchParams.get('topic'))

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: initialTopic,
    message: '',
    website: '',
  })

  useEffect(() => {
    const nextTopic = resolveTopic(searchParams.get('topic'))
    setFormData((prev) => ({ ...prev, topic: nextTopic }))
  }, [searchParams])

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)
  const [sending, setSending] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError(false)

    try {
      const body = new URLSearchParams(formData)
      const res = await fetch('/contact-send.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'send_failed')

      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        topic: initialTopic,
        message: '',
        website: '',
      })
      setTimeout(() => setSubmitted(false), 5000)
    } catch {
      setError(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="contact">
      <section className="section">
        <div className="container">
          <h1>{t.contact.title}</h1>
          <p className="section-subtitle">{t.contact.subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2 contact-grid">
            <div className="contact-info">
              <h2>{t.contact.infoTitle}</h2>

              <div className="info-item">
                <h3>{t.contact.emailLabel}</h3>
                <p><a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a></p>
              </div>

              <div className="info-item">
                <h3>{t.contact.phoneLabel}</h3>
                <p>
                  <a href={`tel:${CONTACT_INFO.phoneHref}`}>{CONTACT_INFO.phone}</a>
                  {' · '}
                  <a href={CONTACT_INFO.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                </p>
              </div>

              <div className="info-item">
                <h3>{t.contact.locationLabel}</h3>
                <p>{t.contact.locationValue}</p>
              </div>

              <div className="info-item">
                <h3>{t.contact.hoursLabel}</h3>
                <p>
                  {t.contact.hoursValue}<br />
                  {t.contact.hoursValue2}
                </p>
              </div>
            </div>

            <div className="contact-form">
              <h2>{t.contact.formTitle}</h2>

              {submitted && (
                <div className="success-message">
                  {t.contact.success}
                </div>
              )}

              {error && (
                <div className="error-message">
                  {t.contact.error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="website"
                  className="hp-field"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex="-1"
                  autoComplete="off"
                  aria-hidden="true"
                />
                <div className="form-group">
                  <label htmlFor="name">{t.contact.nameLabel}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t.contact.namePlaceholder}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t.contact.emailLabel}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={t.contact.emailPlaceholder}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">{t.contact.phoneLabel}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t.contact.phonePlaceholder}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="topic">{t.contact.topicLabel}</label>
                  <select
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                  >
                    {Object.entries(t.contact.topics).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">{t.contact.messageLabel}</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder={t.contact.messagePlaceholder}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={sending}>
                  {sending ? t.contact.sending : t.contact.submit}
                </button>

                {/* This form is where personal data is collected, so the notice
                    that the visitor is accepting a policy belongs next to the
                    submit button, not only in the footer. */}
                <p className="form-consent">
                  {t.contact.consentBefore}{' '}
                  <Link to="/privacy">{t.contact.consentLink}</Link>
                  {t.contact.consentAfter}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
