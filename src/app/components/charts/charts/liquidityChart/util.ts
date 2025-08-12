import { tick2Price } from '../../../../lib/liquidity'
import { BetweenNumbers } from '../../../../util/between'
import { PoolTokenInfo } from '../../../../context/DataContext'
import { univ3_LiquiditySnapshot } from '@gfxlabs/oku'
import { SqrtPriceMath, TickMath } from '../../../../v3-sdk/math'

const sqrtTable = new Map<number, bigint>()

export const getLiquidityDataFromSnapshot = (token: PoolTokenInfo, data: univ3_LiquiditySnapshot) => {
  const tickAmounts: {
    tick: number
    price: number
    amount: number
  }[] = []
  if (token == undefined) return tickAmounts
  if (data == undefined || data.ticks == undefined || data?.ticks?.length === 0) return tickAmounts
  if (token.decimals !== undefined && isNaN(token.decimals)) return tickAmounts
  const max_positive_int = 2n ** 255n
  const neg_offset = 2n ** 256n
  const midMarketPrice = BigInt(data.sqrt_price_x96)
  let liquidity = 0n
  let aboveMidMarket = false
  data.ticks.forEach((tick, ind) => {
    let tickSpacing = data.tick_spacing
    if (ind >= data.ticks.length - 1) {
      return
    }
    if (data.tick_spacing === 1) {
      if (BetweenNumbers(data.current_pool_tick - 1000, data.current_pool_tick + 1000, tick.tick_index)) {
        tickSpacing = 1
      } else {
        tickSpacing = 60
      }
    }
    let newLiq = BigInt(tick.liquidity_net)
    if (newLiq >= max_positive_int) {
      newLiq = newLiq - neg_offset
    }
    liquidity = liquidity + newLiq
    let lastPrice = BigInt(tick.sqrt_price)
    const nextInitializedTick = data.ticks[ind + 1].tick_index
    for (let x = tick.tick_index; x < nextInitializedTick; x = x + tickSpacing) {
      let nextPriceToCalculate = sqrtTable.get(x + data.tick_spacing)
      if (nextPriceToCalculate == undefined) {
        nextPriceToCalculate = TickMath.getSqrtRatioAtTick(x + tickSpacing)
        sqrtTable.set(x + tickSpacing, nextPriceToCalculate)
      }
      // if we are at mid market price
      if (nextPriceToCalculate > midMarketPrice && lastPrice < midMarketPrice) {
        const newTick = calculateTick(
          x,
          lastPrice,
          midMarketPrice,
          liquidity,
          aboveMidMarket,
          data.token0_decimals,
          data.token1_decimals,
          token
        )
        tickAmounts.push(newTick)
        aboveMidMarket = true
        lastPrice = midMarketPrice
      }
      const newTick = calculateTick(
        x,
        lastPrice,
        nextPriceToCalculate,
        liquidity,
        aboveMidMarket,
        data.token0_decimals,
        data.token1_decimals,
        token
      )
      tickAmounts.push(newTick)
      lastPrice = nextPriceToCalculate
    }
  })
  return tickAmounts
}

const calculateTick = (
  tick: number,
  lastPrice: bigint,
  nextPrice: bigint,
  liquidity: bigint,
  aboveMidMarket: boolean,
  token0Decimals: number,
  token1Decimals: number,
  token: PoolTokenInfo
) => {
  const args: [bigint, bigint, bigint, boolean] = [lastPrice, nextPrice, liquidity, false]
  if (aboveMidMarket) {
    const amt = Number(SqrtPriceMath.getAmount0Delta(...args)) / 10 ** token0Decimals
    return {
      tick: tick,
      price: tick2Price(tick, token),
      amount: token.selected === 0 ? amt : amt * tick2Price(tick, token),
    }
  }
  const amt = Number(SqrtPriceMath.getAmount1Delta(...args)) / 10 ** token1Decimals
  return {
    tick: tick,
    price: tick2Price(tick, token),
    amount: token.selected === 1 ? amt : amt * tick2Price(tick, token),
  }
}
