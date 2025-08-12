import GasInfoTag from '../../tags/GasInfoTag'
import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { IToken } from '../../../lib/getToken'
import { FontWeightEnums } from '../../../types/Enums'
import { getPriceFromTick } from '../../../util/calculateTick'
import { useDataContext } from '../../../context/DataContext'
import { minimumAssets, newOrder, poolToData } from '../../../contracts/limitOrder'
import { OrderBannerEnums } from '../../banners/OrderBanners'
import FlipButton from '../../buttons/FlipButton'
import LimitOrderButton from '../../buttons/LimitOrderButton'
import LimitOrderPriceInput from '../../inputs/LimitOrderPriceInput'
import { SkeletonLines } from '../../loadingStates/SkeletonLines'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { useNetworkContext } from '../../../context/NetworkContext'
import LimitOrderFormInput from '../../inputs/LimitOrderFormInput'
import { erc20Abi, getContract, maxInt256, parseUnits } from 'viem'
import { formatNumber, FormattedNumber } from '../../numbers/FormatNumber'
import { RoundTokenLogo } from '../../misc/RoundTokenLogo'
import { useChainLoader } from '../../../route/loaderData'
import { ITransaction, TransactionType, useTransactions } from '../../../context/TransactionsContext'
import { useCurrentClient } from '../../../hooks/useClient'
import ConnectWalletButton from '../../buttons/ConnectWalletButton'
import {
  useInputSideAndAmountQueryParam,
  useIsFlippedQueryParam,
  useLimitQuoteQueryParam,
} from '../../../hooks/useQueryParams.ts'
import { useDebouncedCallback } from 'use-debounce'
import { TokenSymbol } from '../../misc/TokenSymbol.tsx'

export interface IMinToken {
  amount: number
  token: IToken
}

export default function LimitOrderForm() {
  const { isConnected } = useAccount()
  const [order, updateOrder] = useState({
    token0: '',
    token1: '',
    tokenUpdated: '',
  })
  const { currentChain, currentChainInfo } = useChainLoader()
  const [focus, setFocus] = useState<string>('Sell')
  const { poolAddress, poolSummary, token0, token1, blockNumber, token } = useDataContext()
  const [showErrTooltip, setShowErrTooltip] = useState(false)
  const { signer, provider } = useNetworkContext()
  const [isPreferredTokenOrder, setIsPreferredTokenOrder] = useState(false)
  const [tick, setTick] = useState<null | number>(null)
  const [minToken, setMinToken] = useState<undefined | IMinToken>(undefined)
  const [isValidPool, setIsValidPool] = useState<boolean | undefined>()
  const [priceEntered, setPriceEntered] = useState(false)
  const [setIsFlipped, isFlippedQuery] = useIsFlippedQueryParam('isFlipped')
  const [, inputSideQuery, setInputAmountAndInputSide, inputAmountQuery] = useInputSideAndAmountQueryParam(
    'inputSide',
    'inputAmount'
  )
  const [, setLimitQuoteQuery] = useLimitQuoteQueryParam('limitQuote')
  const debouncedOrder = useDebouncedCallback(
    (inputAmount, inputSide) => setInputAmountAndInputSide(inputAmount, inputSide),
    500
  )

  useEffect(() => {
    if (isFlippedQuery) setIsPreferredTokenOrder(isFlippedQuery)
    if (inputAmountQuery != null) {
      if (inputSideQuery) {
        updateOrder({ token0: '', token1: inputAmountQuery, tokenUpdated: '' })
      } else {
        updateOrder({ token0: inputAmountQuery, token1: '', tokenUpdated: '' })
      }
      setNewValueTrigger(newValueTrigger + 1)
    }
  }, [])
  const { add, isCompleted, setIsCompleted } = useTransactions()
  const [newValueTrigger, setNewValueTrigger] = useState(0)
  const [previousValueTrigger, setPreviousValueTrigger] = useState(0)
  const balanceToken0 = useBalance({
    address: signer?.account.address,
    token: token0.address as `0x${string}`,
    chainId: currentChain,
  })
  const balanceToken1 = useBalance({
    address: signer?.account.address,
    token: token1.address as `0x${string}`,
    chainId: currentChain,
  })
  const { data: tickObject } = useCurrentClient('cush_simulateV3Pool', [poolAddress, blockNumber])
  const tickSpacing = Number(tickObject?.tick_spacing) || 0
  const LimitOrder = async (tokenA: IToken, tokenA_Amount: string, isPreferredTokenOrder: boolean) => {
    const direction = !isPreferredTokenOrder
    if (
      !(
        provider != undefined &&
        signer &&
        tick !== null &&
        tick != undefined &&
        'limitOrder' in currentChainInfo.contracts
      )
    )
      return
    const limitOrderAddress = currentChainInfo.contracts.limitOrder.address
    const spender = limitOrderAddress
    const tokenAddress = tokenA.address
    const execute = async function (this: ITransaction): Promise<`0x${string}`> {
      const erc20Contract = getContract({
        address: tokenAddress,
        abi: erc20Abi,
        client: {
          public: provider,
          wallet: signer,
        },
      })
      const allowance = await erc20Contract.read.allowance([signer.account.address, spender])
      const amount = parseUnits(tokenA_Amount, tokenA.decimals)
      let allowanceIsEnough = allowance >= amount
      while (!allowanceIsEnough) {
        this.banner_id = this.changeBanner(OrderBannerEnums.TOKEN_APPROVAL)
        const approveHash = await erc20Contract.write.approve(
          [currentChainInfo.contracts.limitOrder.address, maxInt256],
          { chain: signer.chain }
        )
        this.banner_id = this.changeBanner(OrderBannerEnums.TOKEN_APPROVAL_IN_PROGRESS, false, approveHash)
        await provider.waitForTransactionReceipt({ hash: approveHash })
        this.banner_id = this.changeBanner(OrderBannerEnums.TOKEN_APPROVAL_SUCCESS, false, approveHash)
        const allowance = await erc20Contract.read.allowance([signer.account.address, spender], {
          blockTag: 'pending',
        })
        allowanceIsEnough = allowance >= amount
      }
      const targetTick = tick
      this.banner_id = this.changeBanner(OrderBannerEnums.EXECUTE_TRADE, true)
      const orderHash = await newOrder({
        pool: poolAddress,
        amount,
        targetTick: targetTick,
        direction: direction,
        signer,
        provider,
        tickSpacing,
        contract: currentChainInfo.contracts.limitOrder.address,
      })
      this.banner_id = this.changeBanner(OrderBannerEnums.EXECUTE_TRADE_IN_PROGRESS, false, orderHash)
      return orderHash
    }
    add({ type: TransactionType.LIMIT, fn: execute, signer: signer, provider: provider, pool: poolAddress })
    setPreviousValueTrigger(newValueTrigger)
    setTick(null)
  }

  const onOrderChange = (value: string, tokenChanged: IToken) => {
    if (tick !== null && token0 !== undefined && token1 !== undefined) {
      const floatValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value)
      const floatPrice = getPriceFromTick(tick, token0?.decimals, token1?.decimals, token.selected !== 0)
      if (token0 != undefined && tokenChanged.address === token0.address) {
        const newCalculatedValue = token.selected === 0 ? floatValue / floatPrice : floatValue * floatPrice
        updateOrder({
          token0: value === '.' ? '0.' : value,
          token1:
            isNaN(newCalculatedValue) || newCalculatedValue === 0
              ? ''
              : (formatNumber({ num: newCalculatedValue }) as string),
          tokenUpdated: tokenChanged.address,
        })
      } else {
        const newCalculatedValue = token.selected === 0 ? floatValue * floatPrice : floatValue / floatPrice
        updateOrder({
          token0:
            isNaN(newCalculatedValue) || newCalculatedValue === 0
              ? ''
              : (formatNumber({ num: newCalculatedValue }) as string),
          token1: value === '.' ? '0.' : value,
          tokenUpdated: tokenChanged.address,
        })
      }
    } else {
      tokenChanged.address === token0.address
        ? updateOrder({ token0: value, token1: '', tokenUpdated: tokenChanged.address })
        : updateOrder({ token1: value, token0: '', tokenUpdated: tokenChanged.address })
    }
    setNewValueTrigger(newValueTrigger + 1)
  }
  const onPriceChange = (value: number) => {
    if (token0 != undefined && token1 != undefined) {
      const floatPrice = getPriceFromTick(value, token0?.decimals, token1?.decimals, token.selected !== 0)
      // need to know if pool is toggled here so i can flip pricing to be in terms of other token
      let newBuyAmount: number
      if (floatPrice > 0) {
        if (token1.address === order.tokenUpdated) {
          newBuyAmount =
            token.selected === 0 ? parseFloat(order.token1) * floatPrice : parseFloat(order.token1) / floatPrice
          updateOrder({
            token0: isNaN(newBuyAmount) ? '' : newBuyAmount.toString(),
            token1: order.token1,
            tokenUpdated: order.tokenUpdated,
          })
        } else {
          newBuyAmount =
            token.selected === 1 ? parseFloat(order.token0) * floatPrice : parseFloat(order.token0) / floatPrice
          updateOrder({
            token1: isNaN(newBuyAmount) ? '' : newBuyAmount.toString(),
            token0: order.token0,
            tokenUpdated: order.tokenUpdated,
          })
        }
      }
    }
  }
  const onPriceEntered = (value: string) => {
    setPriceEntered(value !== '')
    setLimitQuoteQuery(value)
  }

  useEffect(() => {
    if (!inputAmountQuery) {
      updateOrder({ token0: '', token1: '', tokenUpdated: '' })
      setTick(null)
    }
  }, [poolAddress])

  useEffect(() => {
    if (tick !== null) {
      onPriceChange(tick)
    }
  }, [tick])

  useEffect(() => {
    if (!inputAmountQuery) updateOrder({ token0: '', token1: '', tokenUpdated: '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token.selected])

  useEffect(() => {
    if (currentChainInfo?.contracts?.limitOrder == null) return
    if (poolAddress == null || provider == null || currentChain == null) return
    poolToData({ pool: poolAddress, provider, contract: currentChainInfo.contracts.limitOrder.address }).then((res) => {
      setIsValidPool(res != null && res[4] !== 0)
    })
  }, [poolSummary, poolAddress, signer, currentChain])
  useEffect(() => {
    if (isCompleted && previousValueTrigger == newValueTrigger) {
      updateOrder({ token0: '', token1: '', tokenUpdated: '' })
      setIsCompleted(false)
    }
    if (isCompleted != undefined) {
      setIsCompleted(false)
    }
  }, [isCompleted])
  useEffect(() => {
    if (currentChainInfo?.contracts?.limitOrder == null) return
    if (poolAddress == null || provider == null || currentChain == null) return
    const chosenToken = isPreferredTokenOrder ? token1 : token0
    minimumAssets({
      tokenAddress: chosenToken.address,
      provider,
      contract: currentChainInfo.contracts.limitOrder.address,
    }).then((amount) => {
      if (amount !== null) {
        setMinToken({ token: chosenToken, amount: Number(amount.toString()) / 10 ** chosenToken.decimals })
      } else {
        setMinToken(undefined)
      }
    })
  }, [poolAddress, provider, signer, currentChain, isPreferredTokenOrder, token0, token1])

  useEffect(() => {
    if (focus == 'Sell') {
      debouncedOrder(order.token0, focus)
    } else {
      debouncedOrder(order.token1, focus)
    }
  }, [order, tick])

  return (
    <div className="flex flex-col justify-between flex-1">
      <div className="flex flex-col">
        <div className="relative">
          {isValidPool && minToken != undefined && minToken.token != undefined ? (
            <div className="flex flex-row gap-1.5 absolute right-2 -top-8 ">
              <T3 color={colors.gray[400]}>
                Minimum order size is{' '}
                <FormattedNumber num={minToken?.amount} belowOneDecimalAmount={4} notation="standard" />
              </T3>
              <RoundTokenLogo tokenSymbol={minToken.token.symbol} logoUrl={minToken.token.logoURI} size={14} />
              <T3 color={colors.gray[400]}>
                <TokenSymbol address={minToken.token.address} fallback_name={minToken.token.symbol} />
              </T3>
            </div>
          ) : (
            <div
              className="flex flex-row gap-1.5 absolute right-2 -top-[2.05rem] items-center "
              onMouseEnter={() => setShowErrTooltip(true)}
              onMouseLeave={() => setShowErrTooltip(false)}
            >
              <InformationCircleIcon width={20} stroke={colors.red[300]} />
              {showErrTooltip && (
                <T3
                  color={colors.red[300]}
                  className="absolute bottom-full min-w-[11rem] backdrop-blur-sm mb-1  py-2 px-2 bg-red-300 bg-opacity-20 border-red-300 border right-2 rounded"
                >
                  Limit orders not enabled for this pool.
                </T3>
              )}
            </div>
          )}
        </div>
        <div className="relative grid grid-cols-2 gap-1">
          <div className="w-fit  h-fit absolute flex right-0 left-0 top-0 bottom-0  mx-[auto] my-[auto] text-white">
            <FlipButton
              onClick={() => {
                updateOrder({ token0: '', token1: '', tokenUpdated: '' })
                setIsPreferredTokenOrder(!isPreferredTokenOrder)
                setIsFlipped(!isPreferredTokenOrder)
              }}
            />
          </div>
          {token0 != undefined && token1 != undefined ? (
            <>
              <LimitOrderFormInput
                token={isPreferredTokenOrder ? token1 : token0}
                orderInput={isPreferredTokenOrder ? order.token1 : order.token0}
                setOrderInput={onOrderChange}
                action={'Sell'}
                setFocus={setFocus}
                disabled={false}
                focus={focus}
                balance={isPreferredTokenOrder ? balanceToken1.data : balanceToken0.data}
              />
              <LimitOrderFormInput
                token={isPreferredTokenOrder ? token0 : token1}
                orderInput={isPreferredTokenOrder ? order.token0 : order.token1}
                setOrderInput={onOrderChange}
                action={'Buy'}
                setFocus={setFocus}
                disabled={false}
                focus={focus}
                balance={isPreferredTokenOrder ? balanceToken0.data : balanceToken1.data}
              />
            </>
          ) : (
            <>
              <SkeletonLines lines={2} />
            </>
          )}
        </div>
        <div className="flex flex-col gap-1 pt-2 mt-1 text-white">
          {token0 != undefined && token1 != undefined ? (
            <LimitOrderPriceInput
              tick={tick}
              setTick={setTick}
              onPriceEntered={onPriceEntered}
              isPreferredTokenOrder={isPreferredTokenOrder}
              disabled={!isValidPool}
            />
          ) : (
            <SkeletonLines lines={1} />
          )}
        </div>
      </div>
      <div className="w-full border border-t-0 rounded-b-[6px] px-3 py-4 flex flex-col justify-between border-gray-750">
        <div className="flex justify-between">
          <T3 weight={FontWeightEnums.MEDIUM} color={colors.gray[400]}>
            Gas:
          </T3>
          <GasInfoTag />
        </div>
      </div>
      <div className="flex flex-col flex-1 justify-end">
        {isConnected ? (
          <LimitOrderButton
            orderAction={focus}
            isValidPool={isValidPool}
            priceEntered={priceEntered}
            onClick={() => {
              token0 != undefined &&
                token1 != undefined &&
                LimitOrder(
                  isPreferredTokenOrder ? token1 : token0,
                  isPreferredTokenOrder ? order.token1 : order.token0,
                  isPreferredTokenOrder
                )
            }}
            minToken={minToken}
            order={order}
            isPreferredTokenOrder={isPreferredTokenOrder}
            balance0={Number(balanceToken0.data?.value) / 10 ** (token0 != undefined ? token0.decimals : 18)}
            balance1={Number(balanceToken1.data?.value) / 10 ** (token1 != undefined ? token1.decimals : 18)}
            isEmpty={order.token0 === '' || order.token1 === ''}
          />
        ) : (
          <ConnectWalletButton additionalClass="h-10" />
        )}
      </div>
    </div>
  )
}
