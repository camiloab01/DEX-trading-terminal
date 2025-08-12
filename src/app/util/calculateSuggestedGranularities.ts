export const calculateSuggestedGranularities = (nums: number[]): { label: string; value: number; index: number }[] => {
  return nums.map((num, idx) => {
    const label = num < 1 ? Math.pow(10, num).toFixed(Math.abs(num)) : Math.pow(10, num).toString()
    return { label, value: num, index: idx }
  })
}
