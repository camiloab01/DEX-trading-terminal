import { PoolInfo } from '../contracts/pool'
import { IToken } from '../lib/getToken'
import { CurrencyAmount } from '@uniswap/sdk-core'
import { nearestUsableTick } from '../v3-sdk'
import { Pool, Position } from '@uniswap/v3-sdk'

export const constructPosition = async (
  token0: CurrencyAmount<IToken>,
  token1: CurrencyAmount<IToken>,
  poolInfo: PoolInfo,
  tick: {
    lower: number
    upper: number
  }
): Promise<Position> => {
  // construct pool instance
  const pool = new Pool(
    token0.currency,
    token1.currency,
    poolInfo.fee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick
  )

  // create/update position from input amounts
  return Position.fromAmounts({
    pool,
    tickLower: nearestUsableTick(tick.lower, pool.tickSpacing),
    tickUpper: nearestUsableTick(tick.upper, pool.tickSpacing),
    amount0: token0.quotient,
    amount1: token1.quotient,
    useFullPrecision: true,
  })
}
