import { RefObject, useEffect, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'

export function useIsVisible<T extends HTMLElement>(ref: RefObject<T>) {
  const [isIntersecting, setIntersecting] = useState(false)
  const [debouncedIntersect] = useDebounceValue(isIntersecting, 250)

  useEffect(() => {
    if (ref == undefined || ref == null) return
    if (!ref.current) return
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting))
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])
  return debouncedIntersect
}
