import { CurrencyAmount, Percent } from '@uniswap/sdk-core'
import { AddLiquidityOptions, CollectOptions, NonfungiblePositionManager } from '@uniswap/v3-sdk'
import {
  Address,
  Hex,
  PublicClient,
  WalletClient,
  encodeFunctionData,
  erc20Abi,
  getContract,
  parseUnits,
  zeroAddress,
} from 'viem'
import { uniswapNftManagerAbi } from '../../generated'
import { sendEncodedFunctionData } from '../util/calculateGasMargin'
import { constructPosition } from '../util/constructPosition'
import { getPoolInfo } from './pool'
import { IToken } from '../lib/getToken'

type EnsureAllowanceArgs = {
  signer: WalletClient
  provider: PublicClient
  token: Address
  approvee: Address
  amount: bigint
}

// TODO: maybe there needs to be a version of this that is more transparent about loading states. (maybe there doesnt, and thats the wallets job?)
export const approveIfNeeded = async (args: EnsureAllowanceArgs): Promise<Hex | undefined> => {
  const { signer, provider, token, approvee, amount } = args
  const approvalTarget = amount
  const tokenInContract = getContract({
    address: token,
    abi: erc20Abi,
    client: { wallet: signer, public: provider },
  })
  const owner = signer.account?.address || zeroAddress
  // make sure approved to permit2

  let currentApproved = await tokenInContract.read.allowance([owner, approvee])
  // if there is not enough, request approval
  while (approvalTarget > currentApproved) {
    const approving = await tokenInContract.write.approve([approvee, amount], {
      chain: signer.chain,
      account: owner,
    })
    await provider.waitForTransactionReceipt({ hash: approving })
    currentApproved = await tokenInContract.read.allowance([owner, approvee], { blockTag: 'pending' })
  }
  return undefined
}

export async function addLiquidity({
  positionId,
  pool_address,
  token0,
  token1,
  provider,
  signer,
  tick,
  token0Amount,
  token1Amount,
  contract,
}: {
  positionId: string
  pool_address: Address
  token0: IToken
  token1: IToken
  provider: PublicClient
  signer: WalletClient
  tick: { lower: number; upper: number }
  token0Amount: bigint
  token1Amount: bigint
  contract: `0x${string}`
}) {
  await approveIfNeeded({ token: token0.address, amount: token0Amount, provider, signer, approvee: contract })
  await approveIfNeeded({ token: token1.address, amount: token1Amount, provider, signer, approvee: contract })

  const token0Raw = CurrencyAmount.fromRawAmount(token0, token0Amount.toString())
  const token1Raw = CurrencyAmount.fromRawAmount(token1, token1Amount.toString())
  const poolInfo = await getPoolInfo({ pool_address, provider })
  const positionToIncreaseBy = await constructPosition(token0Raw, token1Raw, poolInfo, tick)
  const addLiquidityOptions: AddLiquidityOptions = {
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    slippageTolerance: new Percent(50, 10_000),
    tokenId: positionId,
  }

  // get calldata for increasing a position
  const { calldata, value } = NonfungiblePositionManager.addCallParameters(positionToIncreaseBy, addLiquidityOptions)

  return sendEncodedFunctionData(provider, signer, contract, calldata as Hex, {
    value: BigInt(value),
  })
}

export async function claimLiquidityFees({
  positionId,
  user_address,
  token0,
  token1,
  signer,
  provider,
  token0ExpectedOwed,
  token1ExpectedOwed,
  contract,
}: {
  positionId: string
  user_address: `0x${string}`
  token0: IToken
  token1: IToken
  signer: WalletClient
  provider: PublicClient
  token0ExpectedOwed: bigint
  token1ExpectedOwed: bigint
  contract: `0x${string}`
}) {
  const token0Raw = CurrencyAmount.fromRawAmount(token0, token0ExpectedOwed.toString())
  const token1Raw = CurrencyAmount.fromRawAmount(token1, token1ExpectedOwed.toString())

  const collectOptions: CollectOptions = {
    tokenId: positionId,
    expectedCurrencyOwed0: token0Raw,
    expectedCurrencyOwed1: token1Raw,
    recipient: user_address,
  }

  const { calldata, value } = NonfungiblePositionManager.collectCallParameters(collectOptions)
  return sendEncodedFunctionData(provider, signer, contract, calldata as Hex, {
    value: BigInt(value),
  })
}

async function getDeployPositionCallData({
  user_address,
  pool,
  token0,
  token1,
  token0Amount,
  token1Amount,
  provider,
  tick,
}: {
  user_address: Address
  pool: Address
  provider: PublicClient
  token0: IToken
  token1: IToken
  token0Amount: bigint
  token1Amount: bigint
  signer: WalletClient
  tick: {
    lower: number
    upper: number
  }
}): Promise<Hex> {
  try {
    const token0Raw = CurrencyAmount.fromRawAmount(token0, token0Amount.toString())
    const token1Raw = CurrencyAmount.fromRawAmount(token1, token1Amount.toString())

    //TODO: use of uniswap api - waiting on koray
    const poolInfo = await getPoolInfo({ pool_address: pool, provider })
    const positionToMint = await constructPosition(token0Raw, token1Raw, poolInfo, tick)
    const mintAmount = positionToMint.mintAmountsWithSlippage(new Percent(75, 10_000))
    return encodeFunctionData({
      abi: uniswapNftManagerAbi,
      functionName: 'mint',
      args: [
        {
          deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 20),
          recipient: user_address,
          fee: poolInfo.fee,
          token0: poolInfo.token0,
          token1: poolInfo.token1,
          tickLower: tick.lower,
          tickUpper: tick.upper,
          amount0Min: BigInt(mintAmount.amount0.toString()),
          amount1Min: BigInt(mintAmount.amount1.toString()),
          amount0Desired: BigInt(positionToMint.mintAmounts.amount0.toString()),
          amount1Desired: BigInt(positionToMint.mintAmounts.amount1.toString()),
        },
      ],
    })
  } catch (err) {
    window.log.error(err)
    throw new Error('Error in getDeployPositionCallData')
  }
}

export const deployPosition = async ({
  user_address,
  pool_address,
  token0,
  token1,
  token0Amount,
  token1Amount,
  provider,
  signer,
  tick,
  contract,
}: {
  user_address: Address
  pool_address: Address
  provider: PublicClient
  token0: IToken
  token1: IToken
  token0Amount: bigint
  token1Amount: bigint
  signer: WalletClient
  tick: {
    lower: number
    upper: number
  }
  contract: `0x${string}`
}) => {
  try {
    // first try to get approvals
    const approvee = contract
    await approveIfNeeded({ signer, provider, amount: token0Amount, token: token0.address, approvee })
    await approveIfNeeded({ signer, provider, amount: token1Amount, token: token1.address, approvee })
    const calldata = await getDeployPositionCallData({
      user_address,
      pool: pool_address,
      provider,
      token0,
      token1,
      token0Amount,
      token1Amount,
      signer,
      tick,
    })
    return signer.sendTransaction({ data: calldata, to: contract, chain: signer.chain, account: user_address })
  } catch (err) {
    window.log.error(err)
    throw new Error('Error in deployPosition')
  }
}

export const getMintCallData = async (
  token0Address: `0x${string}`,
  token1Address: `0x${string}`,
  token0Decimals: number,
  token1Decimals: number,
  fee: number,
  tickLower: number,
  tickUpper: number,
  token0Amount: string,
  token1Amount: string,
  recipient: Address
) => {
  try {
    const parsedToken0 = parseUnits(token0Amount, token0Decimals)
    const parsedToken1 = parseUnits(token1Amount, token1Decimals)
    window.log.log(
      token0Address,
      token1Address,
      fee,
      tickLower,
      tickUpper,
      parsedToken0,
      parsedToken1,
      0,
      0,
      recipient,
      Math.floor(Date.now() / 1000) + 600
    )
    return encodeFunctionData({
      abi: uniswapNftManagerAbi,
      functionName: 'mint',
      args: [
        {
          token0: token0Address,
          token1: token1Address,
          fee,
          tickLower,
          tickUpper,
          amount0Desired: parsedToken0,
          amount1Desired: parsedToken1,
          amount0Min: 0n,
          amount1Min: 0n,
          recipient,
          deadline: BigInt(Math.floor(Date.now() / 1000) + 600),
        },
      ],
    })
  } catch (e) {
    window.log.error(e)
    throw new Error('Error in getMintCallData')
  }
}

export async function removeLiquidity({
  positionId,
  user_address,
  contract,
  provider,
  signer,
  removePercent = 100,
}: {
  positionId: string
  contract: Address
  user_address: `0x${string}`
  provider: PublicClient
  signer: WalletClient
  removePercent?: number
}) {
  const nftManager = getContract({
    address: contract,
    abi: uniswapNftManagerAbi,
    client: { public: provider, wallet: signer },
  })
  const chainPosition = await nftManager.read.positions([BigInt(positionId)])
  let liq = chainPosition[7]
  if (removePercent < 100 && removePercent > 0) {
    liq = (liq * BigInt(Math.round(removePercent))) / 100n
  }

  const decreaseLiquidityTxn = encodeFunctionData({
    abi: uniswapNftManagerAbi,
    functionName: 'decreaseLiquidity',
    args: [
      {
        tokenId: BigInt(positionId),
        liquidity: liq,
        amount0Min: 0n,
        amount1Min: 0n,
        deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 20),
      },
    ],
  })

  const collectFeesTxn = encodeFunctionData({
    abi: uniswapNftManagerAbi,
    functionName: 'collect',
    args: [
      {
        tokenId: BigInt(positionId),
        recipient: user_address,
        amount0Max: BigInt('0xffffffffffffffffffffffffffffffff'),
        amount1Max: BigInt('0xffffffffffffffffffffffffffffffff'),
      },
    ],
  })

  return sendEncodedFunctionData(
    provider,
    signer,
    contract as Address,
    encodeFunctionData({
      abi: uniswapNftManagerAbi,
      functionName: 'multicall',
      args: [[decreaseLiquidityTxn, collectFeesTxn]],
    })
  )
}
