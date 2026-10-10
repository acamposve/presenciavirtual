import { useLanguage } from '../i18n/LanguageContext'
import ServicePage from '../components/ServicePage'

function WebDevelopment() {
  const { t } = useLanguage()
  return <ServicePage content={t.webDevelopment} />
}

export default WebDevelopment
