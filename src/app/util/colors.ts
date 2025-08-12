import rgba from 'color-rgba'

export function parseColor(input: string): [number, number, number, number] | undefined {
  return rgba(input)
}

export const toRgba = (xs?: number[], alpha?: number) => {
  if (!xs) {
    xs = [0, 0, 0, 0]
  }
  if (alpha !== undefined) {
    xs[3] = alpha
  }
  return `rgba(${xs[0]},${xs[1]},${xs[2]},${xs[3]})`
}
