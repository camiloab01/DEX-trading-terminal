export interface FeeTiers {
  [fee: number]: number
}

export interface FeePercentages {
  [fee: number]: string
}

export const calculatePercentages = (feeTiers: FeeTiers | undefined): FeePercentages => {
  if (!feeTiers) return {}
  const total = Object.values(feeTiers).reduce((acc, val) => acc + val, 0)
  return Object.entries(feeTiers).reduce((acc, [key, value]) => {
    acc[key as unknown as number] = ((value / total) * 100).toFixed(2)
    return acc
  }, {} as FeePercentages)
}
