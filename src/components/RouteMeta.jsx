import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

const ROUTE_META_KEYS = {
  '/': 'home',
  '/about': 'about',
  '/services': 'services',
  '/domains': 'domains',
  '/hosting': 'hosting',
  '/web-development': 'webDevelopment',
  '/ai-consulting': 'aiConsulting',
  '/contact': 'contact',
}

const SITE_URL = 'https://presenciavirtual.net'

function setMetaTag(attr, name, content) {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function RouteMeta() {
  const { pathname } = useLocation()
  const { t, language } = useLanguage()

  useEffect(() => {
    const key = ROUTE_META_KEYS[pathname.replace(/\/+$/, '') || '/']
    const meta = t.meta[key] ?? t.meta.home

    document.title = meta.title
    setMetaTag('name', 'description', meta.description)
    setMetaTag('property', 'og:title', meta.title)
    setMetaTag('property', 'og:description', meta.description)
    setMetaTag('property', 'og:url', `${SITE_URL}${pathname}`)
    setMetaTag('property', 'og:locale', language === 'es' ? 'es_UY' : 'en_US')
  }, [pathname, t, language])

  return null
}

export default RouteMeta
