import { useEffect, useState } from 'react'
import { useMatches } from 'react-router-dom'

export const usePageName = () => {
  const matches = useMatches()
  const [pageName, setPageName] = useState(undefined)
  useEffect(() => {
    for (const m of matches.reverse()) {
      if (m.handle) {
        const base = (m.handle as any).base
        if (base) {
          setPageName(base)
          break
        }
      }
    }
  }, [matches])
  return { pageName }
}
