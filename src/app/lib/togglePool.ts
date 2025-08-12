import { updateMarketWatch } from './marketWatch'

export const togglePool = (
  address: string,
  shouldRemove: boolean,
  currentChain: number,
  setFavoritePool: (value: string[]) => void,
  setPools?: (value: string[]) => void
) => {
  if (shouldRemove) {
    const poolsAfterRemove = updateMarketWatch('REMOVE', address, currentChain)
    setFavoritePool([...poolsAfterRemove])
    setPools && setPools([...poolsAfterRemove])
  } else {
    const poolsAfterAdd = updateMarketWatch('ADD', address, currentChain)
    setFavoritePool([...poolsAfterAdd])
    setPools && setPools([...poolsAfterAdd])
  }
}
