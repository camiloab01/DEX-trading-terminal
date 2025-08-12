import { useEffect, useMemo, useState } from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { parseUnits, zeroAddress } from 'viem'
import { useAccount, useBalance, useBlockNumber, useEstimateFeesPerGas } from 'wagmi'
import { CHAIN_INFO, WETH9_ADDRESS, getChainIdFromName } from '../../../../constants/abi/chainInfo'
import { colors } from '../../../../constants/colors.ts'
import { useDataContext } from '../../../../context/DataContext'
import { useNetworkContext } from '../../../../context/NetworkContext'
import { useSwapPageContext } from '../../../../context/SwapPageContext'
import { useTransactions } from '../../../../context/TransactionsContext.tsx'
import { useInputSideAndAmountQueryParam, useIsFlippedQueryParam } from '../../../../hooks/useQueryParams.ts'
import { useSwapRouter } from '../../../../hooks/useSwapRouter'
import { IToken, getTokenByAddress } from '../../../../lib/getToken'
import { useChainLoader } from '../../../../route/loaderData'
import { createToken } from '../../../../util/createToken'
import ConnectWalletButton from '../../../buttons/ConnectWalletButton.tsx'
import FlipButton from '../../../buttons/FlipButton'
import OrderButton from '../../../buttons/OrderButton'
import { IOrderSettings } from '../../../dropdown/OrderFormDropdown.tsx'
import SwapMarketOrderFormInput from '../../../inputs/SwapMarketOrderFormInput'
import { PendingQuotesModal } from '../../../modals/swap/PendingQuotesModal.tsx'
import { TermsModal } from '../../../modals/swap/TermsModal.tsx'
import { T1 } from '../../../typography/Typography.tsx'
import { PriceInfo } from './PriceInfo'
import { useCountdown, useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { PriceQuoteWithMarket } from '../../../../types/canoe.ts'

export default function MarketOrderForm({
  settings,
  isSwapForm,
  navigateAfterTokenSelection = true,
}: {
  settings: IOrderSettings
  isSwapForm?: boolean
  navigateAfterTokenSelection?: boolean
}) {
  const { isConnected } = useAccount()
  const [loadingTo, setLoadingTo] = useState(false)
  const [showPendingQuotes, setShowPendingQuotes] = useState(false)
  const [loadingFrom, setLoadingFrom] = useState(false)
  const [insufficientFunds, setInsufficientFund] = useState<boolean | undefined>(undefined)
  const { currentChainInfo } = useChainLoader()
  const { provider, signer } = useNetworkContext()
  const { data: feeData } = useEstimateFeesPerGas()
  const countStartVal = 15
  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: countStartVal,
  })
  const {
    fromToken,
    toToken,
    setFromToken: setRawFromToken,
    setToToken: setRawToToken,
    routes,
    selectedRoute,
    setSelectedRoute,
    isFetchingPrice,
    showTerms,
    acceptTerms,
    setCurrentRequest,
    executeTrade,
    userManuallySetRoute,
    setUserManuallySetRoute,
    freezedRoute,
    setFreezedRoute,
  } = useSwapRouter({
    signer,
    provider,
    chainInfo: currentChainInfo,
  })
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const [setIsFlippedQueryParam, isFlippedQueryParam] = useIsFlippedQueryParam('isFlipped')
  const [, inputSideQuery, setInputAmountAndInputSide, inputAmountQuery] = useInputSideAndAmountQueryParam(
    'inputSide',
    'inputAmount'
  )

  const clearOrder = (force = false) => {
    if (selectedRoute || force) {
      setFromTokenValue('')
      setToTokenValue('')
      setLoadingFrom(false)
      setLoadingTo(false)
      setCurrentRequest({
        tokenAmount: '',
        isExactIn: false,
        chain: '',
        slippage: 0,
      })
      setInputAmountAndInputSide('', focus)
      setUserManuallySetRoute(false)
    }
  }

  useEffect(() => {
    const chainName = searchParams.get('swap_chain')
    if (!chainName && pathname !== '/') return
    const chainId = getChainIdFromName(chainName || 'ethereum')
    const chain = CHAIN_INFO[chainId]
    const defaultToken0 = getTokenByAddress(chain.defaultToken0, chainId)
    const defaultToken1 = getTokenByAddress(chain.defaultToken1, chainId)
    setRawFromToken(defaultToken0)
    setRawToToken(defaultToken1)
  }, [searchParams.get('swap_chain'), pathname])

  const { data: nativeBalance } = useBalance({ address: signer?.account.address, chainId: currentChainInfo.id })
  const { data: wrappedNativeBalance } = useBalance({
    address: signer?.account.address,
    token: WETH9_ADDRESS[currentChainInfo.id],
    chainId: currentChainInfo.id,
  })

  const preferNative = useMemo(() => {
    return wrappedNativeBalance && nativeBalance && nativeBalance.value > wrappedNativeBalance.value
  }, [nativeBalance, wrappedNativeBalance])

  const { token1: dataToken1, token0: dataToken0, token, poolAddress } = useDataContext()
  const { token1: swapToken1, token0: swapTOken0, setFlip: setSwapFlip, flip: swapFlip } = useSwapPageContext()
  const { isCompleted, setIsCompleted, txState } = useTransactions()
  const [flip, setFlip] = useState(isFlippedQueryParam ? isFlippedQueryParam : isSwapForm)
  const navigate = useNavigate()
  const [disabled, setDisabled] = useState(false)
  const handleFlip =
    isSwapForm && navigateAfterTokenSelection
      ? (nextFlip: boolean) => {
          setSwapFlip(!swapFlip)
          if (flip != nextFlip) {
            navigate(`../${fromToken.address}/${toToken.address}?${searchParams.toString()}`)
          }
        }
      : (nextFlip: boolean) => {
          if (flip != nextFlip) {
            setRawFromToken(toToken)
            setRawToToken(fromToken)
            setFlip(nextFlip)
          }
        }
  const setFromToken =
    isSwapForm && navigateAfterTokenSelection
      ? (fromToken?: IToken) => {
          navigate(`../${toToken.address}/${fromToken?.address ?? zeroAddress}?${searchParams.toString()}`)
        }
      : setRawFromToken
  const setToToken =
    isSwapForm && navigateAfterTokenSelection
      ? (toToken?: IToken) => {
          navigate(`../${toToken?.address ?? zeroAddress}/${fromToken.address}?${searchParams.toString()}`)
        }
      : setRawToToken

  const token0Input = isSwapForm ? swapTOken0 : dataToken0
  const token1Input = isSwapForm ? swapToken1 : dataToken1

  useEffect(() => {
    if (!isSwapForm && flip) setIsFlippedQueryParam(flip)
    else setIsFlippedQueryParam(false)
  }, [flip])

  useEffect(() => {
    if (searchParams.get('swap_chain') || pathname === '/') return
    const nativeToken = createToken({
      address: zeroAddress,
      symbol: currentChainInfo.nativeCurrency.symbol,
      decimals: currentChainInfo.nativeCurrency.decimals,
      name: currentChainInfo.nativeCurrency.name,
      chainId: currentChainInfo.id,
    }) as IToken
    const [from, to] = flip ? [token1Input, token0Input] : [token0Input, token1Input]
    const fromNative =
      !isSwapForm &&
      preferNative &&
      from &&
      from.address.toLowerCase() == WETH9_ADDRESS[currentChainInfo.id].toLowerCase()
    const toNative =
      !isSwapForm && preferNative && to && to.address.toLowerCase() == WETH9_ADDRESS[currentChainInfo.id].toLowerCase()
    setRawFromToken(fromNative ? nativeToken : from)
    setRawToToken(toNative ? nativeToken : to)
  }, [preferNative, token0Input, token1Input])

  const [fromTokenValue, setFromTokenValue] = useState('')
  const [toTokenValue, setToTokenValue] = useState('')
  const [newValueTrigger, setNewValueTrigger] = useState(0)
  const [newValueTrigerDebounced] = useDebounceValue(newValueTrigger, 500)
  const [previousValueTrigger, setPreviousValueTrigger] = useState(0)
  const setFromTokenValueFocus = (x: string) => {
    setFromTokenValue(x)
    setNewValueTrigger(newValueTrigger + 1)
  }
  const setToTokenValueFocus = (x: string) => {
    setToTokenValue(x)
    setNewValueTrigger(newValueTrigger + 1)
  }
  const [focus, setFocus] = useState<string>(inputSideQuery ? inputSideQuery : 'Sell')

  const { data: blockNumber } = useBlockNumber({ watch: true })
  const { data: fromTokenBalance, refetch: refetchFrom } = useBalance({
    address: signer?.account.address,
    token: (fromToken.address as `0x${string}`) !== zeroAddress ? fromToken.address : undefined,
    chainId: currentChainInfo.id,
  })
  const { data: toTokenBalance, refetch: refetchTo } = useBalance({
    address: signer?.account.address,
    token: (toToken.address as `0x${string}`) !== zeroAddress ? toToken.address : undefined,
    chainId: currentChainInfo.id,
  })
  const debouncedOrder = useDebounceCallback(
    (inputAmount, inputSide) => setInputAmountAndInputSide(inputAmount, inputSide),
    500
  )

  useEffect(() => {
    if (isFlippedQueryParam && !isSwapForm) handleFlip(isFlippedQueryParam)
    if (inputSideQuery) setFocus(inputSideQuery)
    if (inputAmountQuery != null) {
      if (inputSideQuery) setToTokenValue(inputAmountQuery)
      else setFromTokenValue(inputAmountQuery)
      setNewValueTrigger(newValueTrigger + 1)
    }
  }, [])

  useEffect(() => {
    refetchFrom()
    refetchTo()
  }, [blockNumber])

  useEffect(() => clearOrder(), [currentChainInfo.id, preferNative, poolAddress])

  useEffect(() => {
    if (isCompleted && previousValueTrigger == newValueTrigger) {
      clearOrder()
      setIsCompleted(false)
    }
    if (isCompleted) setIsCompleted(false)
  }, [isCompleted])

  useEffect(() => {
    setInsufficientFund(fromTokenBalance && parseFloat(fromTokenValue) > parseFloat(fromTokenBalance.formatted))
  }, [flip, fromTokenValue, toTokenValue])

  useEffect(() => setNewValueTrigger(newValueTrigger + 1), [settings.slippage])

  useEffect(() => {
    if (txState === 0 || (txState === 1 && previousValueTrigger === newValueTrigger) || txState === 5) setDisabled(true)
    else setDisabled(false)
  }, [txState, newValueTrigger, previousValueTrigger])

  useEffect(() => {
    if (disabled) return
    const isExactIn = focus === 'Sell'
    const value = isExactIn ? fromTokenValue : toTokenValue
    if (value === '') {
      clearOrder(true)
      return
    }
    const decimalCount = isExactIn ? fromToken.decimals : toToken.decimals
    const tokenAmount = parseUnits(value, decimalCount)
    if (tokenAmount === 0n) return
    setCurrentRequest({
      chain: currentChainInfo.internalName,
      tokenAmount: value,
      isExactIn: isExactIn,
      gasPrice: feeData && typeof feeData.gasPrice === 'number' ? Number(feeData.gasPrice) : undefined,
      slippage: 100 * settings.slippage,
    })
    debouncedOrder(value, focus)
  }, [newValueTrigerDebounced, startCountdown])
  useEffect(() => {
    const isExactIn = focus === 'Sell'
    const value = isExactIn ? fromTokenValue : toTokenValue
    debouncedOrder(value, focus)
  }, [focus])
  useEffect(() => {
    if (!selectedRoute) return
    setFromTokenValue(selectedRoute.inAmount)
    setToTokenValue(selectedRoute.outAmount)
  }, [selectedRoute])

  useEffect(() => {
    const isExactIn = focus === 'Sell'
    if (isFetchingPrice) {
      const currentLoader = isExactIn ? setLoadingTo : setLoadingFrom
      currentLoader(true)
    } else {
      setLoadingFrom(false)
      setLoadingTo(false)
    }
  }, [isFetchingPrice])

  const priceInfoSetRoute = (selectedRoute: React.SetStateAction<PriceQuoteWithMarket | undefined>) => {
    setUserManuallySetRoute(true)
    setSelectedRoute(selectedRoute)
  }

  const onOrder = async () => {
    if (routes.length === 0 || signer == undefined || provider == undefined || selectedRoute === undefined) return
    resetCountdown()
    setFreezedRoute(selectedRoute)
    try {
      if (routes.filter((route) => route.loading).length > 0 && !userManuallySetRoute) {
        setShowPendingQuotes(true)
      } else {
        await executeTrade(selectedRoute)
        setPreviousValueTrigger(newValueTrigger)
      }
    } catch (err) {
      window.log.error(err)
    }
  }

  const handleClosePendingQuotesModal = async (shouldContinue: boolean) => {
    setShowPendingQuotes(false)
    if (shouldContinue && selectedRoute != undefined) {
      await executeTrade(selectedRoute)
      setPreviousValueTrigger(newValueTrigger)
    }
  }

  const isWrap =
    fromToken.address.toLowerCase() === zeroAddress &&
    toToken.address.toLowerCase() === WETH9_ADDRESS[currentChainInfo.id].toLowerCase()
  const isUnwrap =
    toToken.address.toLowerCase() === zeroAddress &&
    fromToken.address.toLowerCase() === WETH9_ADDRESS[currentChainInfo.id].toLowerCase()

  return (
    token != undefined && (
      <>
        <PendingQuotesModal open={showPendingQuotes} handleClose={handleClosePendingQuotesModal} />
        <TermsModal open={showTerms} close={acceptTerms} />
        <div className="flex flex-col gap-2">
          <div className={`relative grid ${isSwapForm ? 'grid-cols-1' : 'grid-cols-2'} gap-1`}>
            <div
              className={`w-fit h-fit absolute flex right-0 left-0 top-0 bottom-0 ${isSwapForm && 'rotate-90'} mx-[auto] my-[auto] text-white`}
            >
              <FlipButton onClick={() => handleFlip(!flip)} />
            </div>
            <SwapMarketOrderFormInput
              value={fromTokenValue}
              setValue={setFromTokenValueFocus}
              token={fromToken}
              setToken={setFromToken}
              loading={loadingFrom}
              action={'Sell'}
              setFocus={setFocus}
              focus={focus}
              balance={fromTokenBalance}
              allowTokenSelection={isSwapForm}
              fullScreenTokenSelection={!isSwapForm}
              usdValue={freezedRoute ? freezedRoute.inUsdValue : selectedRoute?.inUsdValue}
              setCurrentRequest={setCurrentRequest}
            />
            <SwapMarketOrderFormInput
              value={toTokenValue}
              setValue={setToTokenValueFocus}
              token={toToken}
              setToken={setToToken}
              loading={loadingTo}
              action={'Buy'}
              setFocus={setFocus}
              disabled={false}
              focus={focus}
              balance={toTokenBalance}
              allowTokenSelection={isSwapForm}
              fullScreenTokenSelection={!isSwapForm}
              usdValue={freezedRoute ? freezedRoute.outUsdValue : selectedRoute?.outUsdValue}
              setCurrentRequest={setCurrentRequest}
            />
          </div>
          <PriceInfo
            loading={isFetchingPrice}
            selectedRoute={freezedRoute ? freezedRoute : selectedRoute}
            setSelectedRoute={priceInfoSetRoute}
            routes={routes}
            showGas
          />
          <div className="grid grid-cols-4 gap-2 justify-center items-center">
            <div className="col-span-3">
              {isConnected ? (
                <OrderButton
                  orderAction={isWrap ? 'Wrap' : isUnwrap ? 'Unwrap' : isSwapForm ? 'Swap' : focus}
                  onClick={onOrder}
                  disabled={
                    disabled || loadingTo || loadingFrom || fromTokenValue === '' || toTokenValue === '' || !signer
                  }
                  loadingPrice={loadingTo || loadingFrom}
                  insufficientFunds={insufficientFunds}
                  isEmpty={fromTokenValue === '' || toTokenValue === ''}
                  isHighImpact={
                    selectedRoute?.extra?.trade?.priceImpact ? Number(selectedRoute.extra.trade.priceImpact) > 5 : false
                  }
                />
              ) : (
                <ConnectWalletButton additionalClass="h-10" />
              )}
            </div>
            <button
              title="Auto Refresh"
              className="flex items-center gap-2 text-[16px] bg-gray-900 hover:enabled:bg-gray-750 border-[1px] w-full border-gray-750 rounded-[8px] justify-center h-[42px]"
              onClick={count !== countStartVal ? resetCountdown : startCountdown}
              disabled={disabled}
            >
              <T1 fontSize={{ base: '14px', sm: '14px' }} color={colors.gray[50]} className="select-none">
                {count !== countStartVal ? count + 's' : '...'}
              </T1>
              <FiRefreshCw className={`text-sm ${count !== countStartVal ? 'text-green-400' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>
      </>
    )
  )
}
