import { useLanguage } from '../i18n/LanguageContext'
import ServicePage from '../components/ServicePage'

function AiConsulting() {
  const { t } = useLanguage()
  return <ServicePage content={t.aiConsulting} />
}

export default AiConsulting
