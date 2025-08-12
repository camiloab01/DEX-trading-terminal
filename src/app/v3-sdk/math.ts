import { MaxUint256 } from '.'
import { MIN_TICK, MAX_TICK } from './constants'

// constants used internally but not expected to be used externally
export const ONE = 1n
export const ZERO = 0n
// used in liquidity amount math
export const Q96 = 2n ** 96n
export const Q32 = 2n ** 32n

const TWO = 2n
const POWERS_OF_2 = [128, 64, 32, 16, 8, 4, 2, 1].map((pow: number): [bigint, bigint] => [
  BigInt(pow),
  TWO ** BigInt(pow),
])

export abstract class FullMath {
  /**
   * Cannot be constructed.
   */
  public static mulDivRoundingUp(a: bigint, b: bigint, denominator: bigint): bigint {
    const product = a * b
    let result = product / denominator
    if (product % denominator !== 0n) {
      result = result + ONE
    }
    return result
  }
}

export abstract class SqrtPriceMath {
  public static getAmount0Delta(
    sqrtRatioAX96: bigint,
    sqrtRatioBX96: bigint,
    liquidity: bigint,
    roundUp: boolean
  ): bigint {
    if (sqrtRatioAX96 > sqrtRatioBX96) {
      ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
    }
    const numerator1 = liquidity << 96n
    const numerator2 = sqrtRatioBX96 - sqrtRatioAX96

    return roundUp
      ? FullMath.mulDivRoundingUp(FullMath.mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96), ONE, sqrtRatioAX96)
      : (numerator1 * numerator2) / sqrtRatioBX96 / sqrtRatioAX96
  }

  public static getAmount1Delta(
    sqrtRatioAX96: bigint,
    sqrtRatioBX96: bigint,
    liquidity: bigint,
    roundUp: boolean
  ): bigint {
    if (sqrtRatioAX96 > sqrtRatioBX96) {
      ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
    }

    return roundUp
      ? FullMath.mulDivRoundingUp(liquidity, sqrtRatioBX96 - sqrtRatioAX96, Q96)
      : (liquidity * (sqrtRatioBX96 - sqrtRatioAX96)) / Q96
  }
}

function mulShift(val: bigint, mulBy: bigint): bigint {
  return (val * mulBy) >> 128n
}

export function mostSignificantBit(x: bigint): bigint {
  let msb = 0n
  for (const [power, min] of POWERS_OF_2) {
    if (x >= min) {
      x = x >> power
      msb += power
    }
  }
  return msb
}

const sqrtTable = [
  BigInt('0xfff97272373d413259a46990580e213a'),
  BigInt('0xfff2e50f5f656932ef12357cf3c7fdcc'),
  BigInt('0xffe5caca7e10e4e61c3624eaa0941cd0'),
  BigInt('0xffcb9843d60f6159c9db58835c926644'),
  BigInt('0xff973b41fa98c081472e6896dfb254c0'),
  BigInt('0xff2ea16466c96a3843ec78b326b52861'),
  BigInt('0xfe5dee046a99a2a811c461f1969c3053'),
  BigInt('0xfcbe86c7900a88aedcffc83b479aa3a4'),
  BigInt('0xf987a7253ac413176f2b074cf7815e54'),
  BigInt('0xf3392b0822b70005940c7a398e4b70f3'),
  BigInt('0xe7159475a2c29b7443b29c7fa6e889d9'),
  BigInt('0xd097f3bdfd2022b8845ad8f792aa5825'),
  BigInt('0xa9f746462d870fdf8a65dc1f90e061e5'),
  BigInt('0x70d869a156d2a1b890bb3df62baf32f7'),
  BigInt('0x31be135f97d08fd981231505542fcfa6'),
  BigInt('0x9aa508b5b7a84e1c677de54f3e99bc9'),
  BigInt('0x5d6af8dedb81196699c329225ee604'),
  BigInt('0x2216e584f5fa1ea926041bedfe98'),
  BigInt('0x48a170391f7dc42444e8fa2'),
]

export abstract class TickMath {
  public static ratio0 = BigInt('0xfffcb933bd6fad37aa2d162d1a594001')
  public static ratio1 = BigInt('0x100000000000000000000000000000000')
  /**
   * Returns the sqrt ratio as a Q64.96 for the given tick. The sqrt ratio is computed as sqrt(1.0001)^tick
   * @param tick the tick for which to compute the sqrt ratio
   */
  public static getSqrtRatioAtTick(tick: number): bigint {
    const absTick: number = tick < 0 ? tick * -1 : tick
    let ratio: bigint = (absTick & 0x1) !== 0 ? TickMath.ratio0 : TickMath.ratio1
    if ((absTick & 0x2) !== 0) ratio = mulShift(ratio, sqrtTable[0])
    if ((absTick & 0x4) !== 0) ratio = mulShift(ratio, sqrtTable[1])
    if ((absTick & 0x8) !== 0) ratio = mulShift(ratio, sqrtTable[2])
    if ((absTick & 0x10) !== 0) ratio = mulShift(ratio, sqrtTable[3])
    if ((absTick & 0x20) !== 0) ratio = mulShift(ratio, sqrtTable[4])
    if ((absTick & 0x40) !== 0) ratio = mulShift(ratio, sqrtTable[5])
    if ((absTick & 0x80) !== 0) ratio = mulShift(ratio, sqrtTable[6])
    if ((absTick & 0x100) !== 0) ratio = mulShift(ratio, sqrtTable[7])
    if ((absTick & 0x200) !== 0) ratio = mulShift(ratio, sqrtTable[8])
    if ((absTick & 0x400) !== 0) ratio = mulShift(ratio, sqrtTable[9])
    if ((absTick & 0x800) !== 0) ratio = mulShift(ratio, sqrtTable[10])
    if ((absTick & 0x1000) !== 0) ratio = mulShift(ratio, sqrtTable[11])
    if ((absTick & 0x2000) !== 0) ratio = mulShift(ratio, sqrtTable[12])
    if ((absTick & 0x4000) !== 0) ratio = mulShift(ratio, sqrtTable[13])
    if ((absTick & 0x8000) !== 0) ratio = mulShift(ratio, sqrtTable[14])
    if ((absTick & 0x10000) !== 0) ratio = mulShift(ratio, sqrtTable[15])
    if ((absTick & 0x20000) !== 0) ratio = mulShift(ratio, sqrtTable[16])
    if ((absTick & 0x40000) !== 0) ratio = mulShift(ratio, sqrtTable[17])
    if ((absTick & 0x80000) !== 0) ratio = mulShift(ratio, sqrtTable[18])
    if (tick > 0) ratio = MaxUint256 / ratio
    // back to Q96
    const ans = ratio % Q32 > ZERO ? ratio / Q32 + ONE : ratio / Q32

    return ans
  }

  /**
   * Returns the tick corresponding to a given sqrt ratio, s.t. #getSqrtRatioAtTick(tick) <= sqrtRatioX96
   * and #getSqrtRatioAtTick(tick + 1) > sqrtRatioX96
   * @param sqrtRatioX96 the sqrt ratio as a Q64.96 for which to compute the tick
   */
  public static getTickAtSqrtRatio(sqrtRatioX96: bigint): number {
    const sqrtRatioX128 = sqrtRatioX96 << 32n
    const msb = mostSignificantBit(sqrtRatioX128)
    let r: bigint
    let log_2 = (msb - 128n) << 64n

    if (msb >= 128n) {
      r = sqrtRatioX128 >> (msb - 127n)
    } else {
      r = sqrtRatioX128 << (127n - msb)
    }
    for (let i = 0n; i < 14n; i++) {
      r = (r * r) >> 127n
      const f = r >> 128n
      log_2 = log_2 | (f << (63n - i))
      r = r >> f
    }

    const log_sqrt10001 = log_2 * 255738958999603826347141n
    const tickLow = (log_sqrt10001 - 3402992956809132418596140100660247210n) >> 128n
    const tickHigh = (log_sqrt10001 + 291339464771989622907027621153398088495n) >> 128n
    const ans =
      tickLow === tickHigh
        ? tickLow
        : BigInt(TickMath.getSqrtRatioAtTick(Number(tickHigh)) <= sqrtRatioX96)
          ? tickHigh
          : tickLow

    return Number(ans)
  }
}

export function nearestUsableTick(tick: number, tickSpacing: number) {
  const rounded = Math.round(tick / tickSpacing) * tickSpacing
  if (rounded < MIN_TICK) return rounded + tickSpacing
  else if (rounded > MAX_TICK) return rounded - tickSpacing
  else return rounded
}
