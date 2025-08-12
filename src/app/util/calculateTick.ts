import { TickMath } from '../v3-sdk'

export const getTickFromPrice = (price: number, token0decimals: number, token1decimals: number, direction: boolean) => {
  if (isNaN(price) || price === 0) return 0
  const newPrice = direction ? price : 1 / price
  const sqrtPrice = Math.sqrt(2 ** 192 * newPrice * (10 ** token1decimals / 10 ** token0decimals))
  const sqrtPriceJSBI = BigInt(sqrtPrice)
  return TickMath.getTickAtSqrtRatio(sqrtPriceJSBI)
}

export const getPriceFromTick = (tick: number, token0decimals: number, token1decimals: number, direction: boolean) => {
  if (isNaN(tick)) {
    return 0
  } else {
    const sqrtPrice = Number(TickMath.getSqrtRatioAtTick(tick))
    return sqrtPriceToPrice(sqrtPrice, token0decimals, token1decimals, direction)
  }
}

export const getNearestTick = (tick: number, increment: number) => {
  const tickRemainder = tick % increment
  const baseTick = tick - tickRemainder
  return tickRemainder >= increment / 2 ? baseTick + increment : baseTick
}

export const sqrtPriceToPrice = (
  sqrtPriceX96: string | number,
  token0decimals: number,
  token1decimals: number,
  direction: boolean
) => {
  const newPrice = Number(sqrtPriceX96) ** 2 / (2 ** 192 * (10 ** token1decimals / 10 ** token0decimals))
  return direction ? newPrice : 1 / newPrice
}

export const getTickSpacing = (fee: number) => {
  switch (fee) {
    case 100:
      return 1
    case 500:
      return 10
    case 3000:
      return 60
    case 10000:
      return 200
    default:
      return 60
  }
}
