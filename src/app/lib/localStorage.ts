import { CHAIN_INFO } from '../constants/abi/chainInfo'
import { LayoutEnums, ThemeEnums } from '../types/Enums'

type ChainId = keyof typeof CHAIN_INFO

type MarketWatchKeys = {
  [K in ChainId as `market_watch_${K}`]: string[]
}

type RecentSearchKeys = {
  [K in ChainId as `recent_search_${K}`]: string[]
}

export type LocalStorageKeys = MarketWatchKeys &
  RecentSearchKeys & {
    appLayout: LayoutEnums
    colorScheme: ThemeEnums
    id_token: string
    nonce: string
    slippage: string
    checkedMarkets: string
  }

export const getLocalStorageItem = <K extends keyof LocalStorageKeys>(key: K): LocalStorageKeys[K] | null => {
  const stored = window.localStorage.getItem(key)
  try {
    return stored ? JSON.parse(stored) : null
  } catch (e) {
    return null
  }
}

export const setLocalStorageItem = <K extends keyof LocalStorageKeys>(
  key: K,
  value: LocalStorageKeys[K] | LocalStorageKeys[K][]
): void => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export const appendLocalStorageItem = <K extends keyof LocalStorageKeys>(
  key: K,
  value: LocalStorageKeys[K] extends (infer U)[] ? U : string
): void => {
  const stored = getLocalStorageItem(key)
  if (Array.isArray(stored)) {
    const newValue = [...stored, value as any]
    setLocalStorageItem(key, newValue as unknown as LocalStorageKeys[K])
  } else if (stored === null) {
    setLocalStorageItem(key, [value as any] as unknown as LocalStorageKeys[K])
  }
}

export const removeLocalStorageItem = <K extends keyof LocalStorageKeys>(
  key: K,
  value?: LocalStorageKeys[K] extends (infer U)[] ? U : string
): void => {
  const stored = getLocalStorageItem(key)
  if (Array.isArray(stored)) {
    const newValue = stored.filter((item: any) => item !== value)
    setLocalStorageItem(key, newValue as unknown as LocalStorageKeys[K])
  } else {
    window.localStorage.removeItem(key)
  }
}
