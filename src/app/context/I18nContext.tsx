import { I18nContextProps } from '../components/I18n/types'
import { i18n } from '@lingui/core'
import { I18nProvider as LinguiI18nProvider } from '@lingui/react'
import { createContext, ReactElement, useContext, useEffect, useState } from 'react'

const InitialState: I18nContextProps = {
  locale: 'en',
  setLocale: () => undefined,
}

export const I18nContext = createContext<I18nContextProps>(InitialState)

export const I18nProvider = ({ children }: { children: ReactElement }) => {
  const [locale, setLocale] = useState('en')

  useEffect(() => {
    // Dynamically load the catalogs
    ;(async () => {
      const { messages } = await import(`../../locales/${locale}.po`)
      i18n.load(locale, messages)
      i18n.activate(locale)
    })()
  }, [])

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      <LinguiI18nProvider i18n={i18n}>{children}</LinguiI18nProvider>
    </I18nContext.Provider>
  )
}

export const useI18nContext = (): I18nContextProps => {
  const context = useContext<I18nContextProps>(I18nContext)

  if (context === null) {
    throw new Error('"useI18nContext" should be used inside a "I18nContextProvider"')
  }

  return context
}
