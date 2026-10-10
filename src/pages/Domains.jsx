import { useLanguage } from '../i18n/LanguageContext'
import ServicePage from '../components/ServicePage'

function Domains() {
  const { t } = useLanguage()
  return <ServicePage content={t.domains} />
}

export default Domains
