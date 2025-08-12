import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { useRpcBlockContext } from '../../../context/RpcBlockContext'
import { FontWeightEnums } from '../../../types/Enums'
import { useDataContext } from '../../../context/DataContext'
import { LastTradeResponse, OrderBookResponse } from '@gfxlabs/oku'
import { SkeletonLines } from '../../loadingStates/SkeletonLines'
import { ITrade, OrderBookItems } from './OrderBookItems'
import { OrderBookViewOptions } from './OrderBookOptions'
import { filterEntries } from './filterOrders'
import { Trans } from '@lingui/macro'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useCurrentClient } from '../../../hooks/useClient'
import { useThemeContext } from '../../../context/ThemeContext'
import { calculateSuggestedGranularities } from '../../../util/calculateSuggestedGranularities'
import { autoUpdate, useClick, useFloating, useInteractions, useTransitionStyles, useDismiss } from '@floating-ui/react'
import SmallNumber from '../../numbers/SmallNumber'
import ColorfulBars from './OrderBookFilterBars'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { TokenSymbol } from '../../misc/TokenSymbol'
import { useDebounceCallback } from 'usehooks-ts'

const DEFAULT_GRANULARITY = 2
interface IOrderBookTitles {
  baseSymbol: JSX.Element
  quoteSymbol: JSX.Element
}
const OrderBookRadio = ({
  option,
  activeOption,
  onOptionSelect,
  topColor,
  bottomColor,
  resetScroll,
}: {
  resetScroll: (where: string) => void
  option: OrderBookViewOptions
  activeOption: OrderBookViewOptions
  onOptionSelect: (val: OrderBookViewOptions) => void
  topColor?: string
  bottomColor?: string
}) => {
  return (
    <>
      <label
        className={`rounded-sm cursor-pointer outline-gray-600 outline-2 mx-1 hover:outline ${
          activeOption === option ? ' outline' : ''
        }`}
      >
        <div
          onClick={() => {
            onOptionSelect(option)
            resetScroll(option)
          }}
        >
          <ColorfulBars topColor={topColor} bottomColor={bottomColor} />
        </div>
      </label>
    </>
  )
}
const GranularityDropdown = ({
  suggestedGranularities,
  selectedGranularity,
  setSelectedGranularity,
}: {
  suggestedGranularities: number[]
  selectedGranularity: number
  setSelectedGranularity: (val: number) => void
}) => {
  const converted = calculateSuggestedGranularities(suggestedGranularities)
  const selectedRich = converted[selectedGranularity]
  const [isOpen, setIsOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
  })
  const { isMounted, styles } = useTransitionStyles(context, {
    initial: {
      opacity: 1,
      transform: 'scale(1,0)',
    },
    common: {
      transformOrigin: `top left`,
    },
  })
  const click = useClick(context)
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])
  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        <div
          className={`gap-x-2 p-1 rounded-sm cursor-pointer outline-gray-600 outline-2 mx-1 flex flex-row items-center`}
        >
          {selectedRich != undefined ? (
            <SmallNumber number={Number(selectedRich.label)} minimumNumber={1e-6} removeTrailingZeros={true} />
          ) : (
            ''
          )}
          <ChevronDownIcon width={16} color={colors.gray[600]} />
        </div>
      </div>
      {isOpen && (
        <div className="z-20" ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
          <div
            className="z-10 bg-gray-900 outline outline-gray-600 outline-1 rounded-lg"
            style={{
              ...styles,
            }}
          >
            {isMounted && (
              <div
                className={`bg-gray-750 border border-gray-700 min-w-[60px] rounded-xl h-fit text-white flex flex-col absolute z-50`}
              >
                {converted.map((granularity) => (
                  <button
                    className="text-start :bg-gray-700 px-3 py-2 w-full first:rounded-t-[12px] hover:bg-gray-drophover last:rounded-b-[12px]"
                    key={granularity.index}
                    onClick={() => {
                      setSelectedGranularity(granularity.index)
                    }}
                  >
                    <SmallNumber number={Number(granularity.label)} minimumNumber={1e-6} removeTrailingZeros={true} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
const OrderBookTitles = (props: IOrderBookTitles) => {
  const { baseSymbol, quoteSymbol } = props
  return (
    <div className="flex flex-row w-full px-2 text-gray-300 mb-2 overflow-auto no-scrollbar">
      <div className="flex flex-1 whitespace-nowrap">
        <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
          <Trans>Price</Trans> ({baseSymbol})
        </T3>
      </div>
      <div className="flex flex-1 justify-center min-w-[100px] whitespace-nowrap">
        <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
          <Trans>Amount</Trans> ({quoteSymbol})
        </T3>
      </div>
      <div className="flex flex-1 justify-end whitespace-nowrap">
        <T3 weight={FontWeightEnums.REGULAR} color={colors.gray[300]}>
          <Trans>Total</Trans> ({baseSymbol})
        </T3>
      </div>
    </div>
  )
}

function OrderBook() {
  const { poolSummary, token, poolAddress } = useDataContext()
  const { blockNumberByChain } = useRpcBlockContext()
  const { colors: themeColors } = useThemeContext()
  const [asks, setAsks] = useState<ITrade[]>([])
  const [bids, setBids] = useState<ITrade[]>([])
  const debouncedAsks = useDebounceCallback(setAsks, 50)
  const debouncedBids = useDebounceCallback(setBids, 50)
  const [lastTrade, setLastTrade] = useState<LastTradeResponse>()
  const [optionSelect, setOptionSelect] = useState<OrderBookViewOptions>('default')
  const [selectedGranularity, setSelectedGranularity] = useState(DEFAULT_GRANULARITY)
  const [priceDecimals, setPriceDecimals] = useState(0)
  const [amountDecimals, setAmountDecimals] = useState(0)
  const [dataChanged, setDataChanged] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const getSelectedGranularities = () =>
    token.selected === 1 ? poolSummary.default_granularities : poolSummary.default_flipped_granularities
  const { refetch, data: currentBooks } = useCurrentClient('cush_orderBookSet', [
    poolAddress,
    [0, 1, 2, 3],
    [0, 1, 2, 3],
    blockNumberByChain,
  ])
  useEffect(() => {
    refetch()
  }, [poolAddress, blockNumberByChain])
  useEffect(() => {
    if (!currentBooks) return
    let dat: undefined | OrderBookResponse = undefined
    if (token.selected === 0) {
      if (currentBooks.flipped) {
        dat = currentBooks.flipped[selectedGranularity]
      }
    } else if (currentBooks.default) {
      dat = currentBooks.default[selectedGranularity]
    }
    if (!dat) return
    debouncedAsks(filterEntries(dat.asks).reverse())
    debouncedBids(filterEntries(dat.bids))
    setLastTrade(dat.last_trade)
    setPriceDecimals(dat.price_decimals)
    setAmountDecimals(dat.amount_decimals)
    setIsLoading(false)
    setDataChanged(true)
  }, [selectedGranularity, currentBooks, token, poolSummary])
  useEffect(() => {
    resetScroll(optionSelect, 'instant')
  }, [selectedGranularity, poolSummary.address, token])
  const ref = useRef<HTMLDivElement>(null)
  const resetScroll = useCallback(
    (where: string, behavior: ScrollBehavior = 'smooth') => {
      if (!ref.current) return
      if (where === 'asks') {
        ref.current.scrollTo({
          top: ref.current.scrollHeight / 2 - ref.current.clientHeight,
          behavior,
        })
      } else if (where == 'bids') {
        ref.current.scrollTo({
          top: ref.current.scrollHeight / 2,
          behavior,
        })
      } else {
        ref.current.scrollTo({
          top: (ref.current.scrollHeight - ref.current.clientHeight) / 2,
          behavior,
        })
      }
    },
    [ref]
  )
  useEffect(() => {
    if (asks.length || bids.length) {
      setTimeout(() => resetScroll(optionSelect, 'instant'), 100)
      setDataChanged(false)
    }
  }, [asks.length, bids.length, optionSelect, dataChanged])
  useEffect(() => {
    setIsLoading(true)
    setSelectedGranularity(DEFAULT_GRANULARITY)
  }, [poolAddress])

  return (
    <div className="overflow-hidden text-white text-[12px] font-normal flex flex-1 flex-col items-center w-full">
      {poolSummary !== undefined &&
      getSelectedGranularities() !== undefined &&
      asks !== undefined &&
      bids !== undefined ? (
        <div className="overflow-hidden w-full flex flex-1 flex-col h-full py-1">
          <div className="flex flex-row w-full px-0 text-white mb-2 items-center ">
            <GranularityDropdown
              suggestedGranularities={getSelectedGranularities()}
              selectedGranularity={selectedGranularity}
              setSelectedGranularity={setSelectedGranularity}
            />
            <div className="flex flex-1 justify-end">
              <OrderBookRadio
                resetScroll={resetScroll}
                option="default"
                activeOption={optionSelect}
                onOptionSelect={setOptionSelect}
                topColor={themeColors.neg_color}
                bottomColor={themeColors.pos_color}
              />
              <OrderBookRadio
                resetScroll={resetScroll}
                option="bids"
                activeOption={optionSelect}
                onOptionSelect={setOptionSelect}
                bottomColor={themeColors.pos_color}
              />
              <OrderBookRadio
                resetScroll={resetScroll}
                option="asks"
                activeOption={optionSelect}
                onOptionSelect={setOptionSelect}
                topColor={themeColors.neg_color}
              />
            </div>
          </div>
          {isLoading ? (
            <SkeletonLines lines={1} />
          ) : (
            <OrderBookTitles
              baseSymbol={
                token.flipped ? (
                  <TokenSymbol address={poolSummary.t0} fallback_name={poolSummary.t0_symbol} />
                ) : (
                  <TokenSymbol address={poolSummary.t1} fallback_name={poolSummary.t1_symbol} />
                )
              }
              quoteSymbol={
                token.flipped ? (
                  <TokenSymbol address={poolSummary.t1} fallback_name={poolSummary.t1_symbol} />
                ) : (
                  <TokenSymbol address={poolSummary.t0} fallback_name={poolSummary.t0_symbol} />
                )
              }
            />
          )}
          <div ref={ref} className={`no-scrollbar flex flex-col flex-1 overflow-scroll`}>
            <div className="flex flex-col h-0">
              {isLoading ? (
                <SkeletonLines lines={60} />
              ) : (
                <OrderBookItems
                  activeOption={optionSelect}
                  lastTrade={lastTrade}
                  asks={asks}
                  bids={bids}
                  priceDecimals={priceDecimals}
                  amountDecimals={amountDecimals}
                  token0Price={poolSummary[token.flipped ? 't1_price_usd' : 't0_price_usd']}
                  scalar={getSelectedGranularities()[selectedGranularity]}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <SkeletonLines lines={60} random />
      )}
    </div>
  )
}
export default OrderBook
