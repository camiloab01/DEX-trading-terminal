import { PoolTokenInfo } from '../context/DataContext'
import { MAX_TICK, MIN_TICK } from '../v3-sdk'

export const getLog = (a: number, b: number) => Math.log(b) / Math.log(a)

export const getNearestIndex = (data: number[], value: number) => {
  const nearestValue = data.reduce(function (previousVal, currurrentVal) {
    return Math.abs(currurrentVal - value) < Math.abs(previousVal - value) ? currurrentVal : previousVal
  })
  return data.indexOf(nearestValue)
}

export const getNearestTick = (tickValue: number, tickSize: number, token: PoolTokenInfo) => {
  const tickRounded = Math.floor(tickValue)
  if (tickValue <= MIN_TICK || tickValue > MAX_TICK) {
    return token.selected === 0 ? MIN_TICK : MAX_TICK
  } else {
    return Math.round(tickRounded / tickSize) * tickSize
  }
}

export const tick2Price = (tick: number, token: PoolTokenInfo) => {
  const scalar = token.decimals
  const price = 1.0001 ** tick / 10 ** scalar
  return token.selected === 1 ? price : 1 / price
}

export const price2Tick = (price: number, token: PoolTokenInfo) => {
  if (price === 0) {
    return token.selected === 1 ? MIN_TICK : MAX_TICK
  }
  const scalar = token.decimals
  const tickValue =
    token.selected === 1 ? getLog(1.0001, price * 10 ** scalar) : getLog(1.0001, (1 / price) * 10 ** scalar)
  return Math.floor(tickValue)
}
