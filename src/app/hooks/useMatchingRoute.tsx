import { useMatches } from 'react-router-dom'

export const useMatchingRoute = () => {
  const matches = useMatches()
  let match
  for (const m of matches.reverse()) {
    if (m.handle) {
      const base = (m.handle as any).base
      if (base) {
        match = base
        break
      }
    }
  }
  return {
    match,
  }
}
