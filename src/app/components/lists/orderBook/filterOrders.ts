import { OrderBookTick } from '@gfxlabs/oku'
import { ITrade } from './OrderBookItems'
export const filterEntries = (entries: OrderBookTick[]): ITrade[] => {
  let entrySum = 0
  const f1 = entries.map((entry) => ({ ...entry, total: (entrySum += Number(entry.size)) }))
  return f1.sort((a, b) => Number(b.price) - Number(a.price))
}
