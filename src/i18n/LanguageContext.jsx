import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from './translations'

const LanguageContext = createContext(null)

function detectInitialLanguage() {
  if (typeof window === 'undefined') return 'es'
  try {
    const stored = window.localStorage.getItem('pv-lang')
    if (stored === 'es' || stored === 'en') return stored
  } catch (e) {
    // localStorage not available, ignore
  }
  const browserLang = (navigator.language || 'es').slice(0, 2)
  return browserLang === 'en' ? 'en' : 'es'
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(detectInitialLanguage)

  useEffect(() => {
    document.documentElement.lang = language
    try {
      window.localStorage.setItem('pv-lang', language)
    } catch (e) {
      // ignore
    }
  }, [language])

  const setLanguage = (lang) => {
    if (lang === 'es' || lang === 'en') setLanguageState(lang)
  }

  const toggleLanguage = () => setLanguage(language === 'es' ? 'en' : 'es')

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: translations[language],
    }),
    [language]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
