import { nav } from './sections/nav'
import { brand } from './sections/brand'
import { meta } from './sections/meta'
import { home } from './sections/home'
import { about } from './sections/about'
import { services } from './sections/services'
import { domains } from './sections/domains'
import { hosting } from './sections/hosting'
import { webDevelopment } from './sections/webDevelopment'
import { aiConsulting } from './sections/aiConsulting'
import { contact } from './sections/contact'
import { footer } from './sections/footer'

const sections = {
  nav,
  brand,
  meta,
  home,
  about,
  services,
  domains,
  hosting,
  webDevelopment,
  aiConsulting,
  contact,
  footer,
}

function build(lang) {
  return Object.fromEntries(Object.entries(sections).map(([key, value]) => [key, value[lang]]))
}

export const translations = {
  es: build('es'),
  en: build('en'),
}

export const CONTACT_INFO = {
  email: 'director@presenciavirtual.net',
  phone: '+598 99 405 667',
  phoneHref: '+59899405667',
  whatsappHref: 'https://wa.me/59899405667',
  domain: 'presenciavirtual.net',
}
