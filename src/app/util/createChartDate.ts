export const createChartDate = (value: number, timeIncrement: number) => {
  return timeIncrement > 3600000 ? new Date(value).toLocaleDateString() : new Date(value).toLocaleString()
}
