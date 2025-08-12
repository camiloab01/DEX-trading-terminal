import { useWindowSize } from 'usehooks-ts'

interface IBreakpoint<T> {
  base: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
}

export const stringBreakpoints = { base: 'base', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' } as const
export const breakpoints = { base: 0, sm: 640, md: 768, lg: 1024, xl: 1280 }
export default function useBreakpoint<T>(props: IBreakpoint<T>): T {
  const windowSize = useWindowSize()
  const { base, sm, md, lg, xl } = props

  if (windowSize.width >= breakpoints.base && windowSize.width < breakpoints.sm) {
    return base
  } else if (windowSize.width >= breakpoints.sm && windowSize.width < breakpoints.md) {
    return sm ?? base
  } else if (windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg) {
    return md ?? sm ?? base
  } else if (windowSize.width >= breakpoints.lg && windowSize.width < breakpoints.xl) {
    return lg ?? md ?? sm ?? base
  } else {
    return xl ?? lg ?? md ?? sm ?? base
  }
}
