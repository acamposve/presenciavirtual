import { useLanguage } from '../i18n/LanguageContext'
import './About.css'

function About() {
  const { t } = useLanguage()

  return (
    <div className="about">
      <section className="section">
        <div className="container">
          <h1>{t.about.title}</h1>
          <p className="lead">{t.about.lead}</p>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <h2 className="mb-4">{t.about.missionTitle}</h2>
          <p>{t.about.missionP1}</p>
          <p>{t.about.missionP2}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="mb-4">{t.about.founderTitle}</h2>
          <p>{t.about.founderP}</p>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <h2 className="mb-4">{t.about.valuesTitle}</h2>
          <div className="grid grid-2">
            {t.about.values.map((v) => (
              <div className="value-item" key={v.title}>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
