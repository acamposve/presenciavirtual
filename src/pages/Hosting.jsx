import { useLanguage } from '../i18n/LanguageContext'
import ServicePage from '../components/ServicePage'

function Hosting() {
  const { t } = useLanguage()
  return <ServicePage content={t.hosting} />
}

export default Hosting
