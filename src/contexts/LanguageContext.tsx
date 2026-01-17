import { createContext, useContext, useState, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type Language = 'en' | 'ru' | 'uz'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  languages: { code: Language; name: string; nativeName: string }[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'uz', name: 'Uzbek', nativeName: 'O\'zbekcha' },
]

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language
    return saved || 'en'
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
