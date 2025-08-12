export const BetweenNumbers = (min: number, max: number, check: number) => {
  return (min <= check && check <= max) || (min >= check && check >= max)
}
