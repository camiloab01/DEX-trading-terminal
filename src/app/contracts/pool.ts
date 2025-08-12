import { encodeSqrtRatioX96 } from '@uniswap/v3-sdk'
import { Address, Hex, PublicClient, WalletClient, encodeFunctionData, getContract, parseUnits } from 'viem'
import { uniswapNftManagerAbi, uniswapV3PoolAbi } from '../../generated'
import { sendEncodedFunctionData } from '../util/calculateGasMargin'
import { getNearestTick, getTickSpacing } from '../util/calculateTick'
import { getMintCallData, approveIfNeeded } from './position'

export interface PoolInfo {
  token0: Address
  token1: Address
  fee: number
  tickSpacing: number
  sqrtPriceX96: bigint
  liquidity: bigint
  tick: number
}

export const getCreatePoolCallData = async (
  token0Address: `0x${string}`,
  token1Address: `0x${string}`,
  token0Decimals: number,
  token1Decimals: number,
  fee: number,
  initialPrice: number
): Promise<Hex> => {
  try {
    const parsedToken0 = parseUnits('1', token0Decimals)
    const parsedToken1 = parseUnits(initialPrice.toString(), token1Decimals)
    return encodeFunctionData({
      abi: uniswapNftManagerAbi,
      functionName: 'createAndInitializePoolIfNecessary',
      args: [
        token0Address,
        token1Address,
        fee,
        BigInt(encodeSqrtRatioX96(parsedToken1.toString(), parsedToken0.toString()).toString()),
      ],
    })
  } catch (e) {
    window.log.error(e)
    throw new Error('Error in getCreatePoolCallData')
  }
}

export const createPoolAddLiqMulticall = async (
  token0Address: `0x${string}`,
  token1Address: `0x${string}`,
  token0Decimals: number,
  token1Decimals: number,
  fee: number,
  initialPrice: number,
  token0Amount: number,
  token1Amount: number,
  user_address: Address,
  tick: { lower: number; upper: number },
  signer: WalletClient,
  provider: PublicClient,
  contract: `0x${string}`
) => {
  try {
    const newPoolCallData = await getCreatePoolCallData(
      token0Address,
      token1Address,
      token0Decimals,
      token1Decimals,
      fee,
      initialPrice
    )
    const deployPositionCallData = await getMintCallData(
      token0Address,
      token1Address,
      token0Decimals,
      token1Decimals,
      fee,
      getNearestTick(tick.lower, getTickSpacing(fee)),
      getNearestTick(tick.upper, getTickSpacing(fee)),
      token0Amount.toString(),
      token1Amount.toString(),
      user_address
    )
    await approveIfNeeded({
      token: token0Address,
      amount: parseUnits(token0Amount.toString(), token0Decimals),
      provider,
      signer,
      approvee: contract,
    })
    await approveIfNeeded({
      token: token1Address,
      amount: parseUnits(token1Amount.toString(), token1Decimals),
      provider,
      signer,
      approvee: contract,
    })
    return sendEncodedFunctionData(
      provider,
      signer,
      contract,
      encodeFunctionData({
        abi: uniswapNftManagerAbi,
        functionName: 'multicall',
        args: [[newPoolCallData, deployPositionCallData]],
      })
    )
  } catch (e) {
    window.log.log(e)
    throw new Error('Error creating pool')
  }
}

export const getPoolInfo = async ({
  pool_address,
  provider,
}: {
  pool_address: Address
  provider: PublicClient
}): Promise<PoolInfo> => {
  if (provider == undefined) {
    throw new Error('No provider')
  }
  const poolContract = getContract({
    abi: uniswapV3PoolAbi,
    client: { public: provider },
    address: pool_address,
  })
  const [token0, token1, fee, tickSpacing, liquidity, slot0] = await Promise.all([
    poolContract.read.token0(),
    poolContract.read.token1(),
    poolContract.read.fee(),
    poolContract.read.tickSpacing(),
    poolContract.read.liquidity(),
    poolContract.read.slot0(),
  ])
  return {
    token0,
    token1,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  }
}
