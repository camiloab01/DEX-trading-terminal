import { Dispatch, SetStateAction } from 'react'

export interface I18nContextProps {
  locale: string
  setLocale: Dispatch<SetStateAction<string>>
}
