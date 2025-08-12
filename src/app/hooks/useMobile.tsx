import useBreakpoint from './useBreakpoint'

export default function useMobile() {
  const size = useBreakpoint({ base: 0, sm: 1, md: 2 })
  if (size === 0) {
    const isMobile = true
    const isTablet = false
    const isDesktop = false
    return { isMobile, isTablet, isDesktop }
  } else if (size === 1) {
    const isMobile = false
    const isTablet = true
    const isDesktop = false
    return { isMobile, isTablet, isDesktop }
  } else {
    const isMobile = false
    const isTablet = false
    const isDesktop = true
    return { isMobile, isTablet, isDesktop }
  }
}
