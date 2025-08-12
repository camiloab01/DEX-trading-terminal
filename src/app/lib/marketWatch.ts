import {
  LocalStorageKeys,
  appendLocalStorageItem,
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from './localStorage'
import { CHAIN_INFO } from '../constants/abi/chainInfo'

type MarketWatchAction = 'ADD' | 'REMOVE'

export const updateMarketWatch = (action: MarketWatchAction, pool_address: string, chain: number) => {
  const pools = getMarketWatch(chain)
  if (action === 'ADD') {
    appendLocalStorageItem(createMarketWatchKey(chain), pool_address.toLowerCase())
    return getMarketWatch(chain)
  } else if (action === 'REMOVE') {
    removeLocalStorageItem(createMarketWatchKey(chain), pool_address.toLowerCase())
    return getMarketWatch(chain)
  }
  return pools
}
export const getMarketWatch = (chain: number) => {
  const pools = getLocalStorageItem(createMarketWatchKey(chain)) as string[]

  if (pools === null || pools.length === 0) {
    const watchlist = [...CHAIN_INFO[chain].watchlist]
    setLocalStorageItem(createMarketWatchKey(chain), watchlist)
    return watchlist
  } else {
    return pools
  }
}

export const createMarketWatchKey = (chain = 1): keyof LocalStorageKeys =>
  `market_watch_${chain}` as keyof LocalStorageKeys
