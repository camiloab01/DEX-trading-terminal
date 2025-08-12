export const SUPPORTED_LOCALES = ['en', 'zh']
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number] | 'pseudo'

export const DEFAULT_LOCALE: SupportedLocale = 'en'
