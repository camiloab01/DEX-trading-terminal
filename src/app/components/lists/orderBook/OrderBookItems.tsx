import { LastTradeResponse, OrderBookTick } from '@gfxlabs/oku'
import OrderBookItem, { IOrderBookItem } from './OrderBookItem'
import { OrderBookViewOptions } from './OrderBookOptions'
import { useEffect, useMemo, useState } from 'react'
import { useThemeContext } from '../../../context/ThemeContext'
import { LastTrandsactionHeight } from './constants'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid'
import { T1, T3 } from '../../typography/Typography'
import { FormattedNumber } from '../../numbers/FormatNumber'
import {
  autoUpdate,
  useClientPoint,
  useFloating,
  useHover,
  useInteractions,
  useTransitionStyles,
  offset,
} from '@floating-ui/react'
import { orderBookSize, orderBookTotal } from './misc'
import { useWindowSize } from 'usehooks-ts'

export interface ITrade extends OrderBookTick {
  total: number
}

interface IOrderBookItems {
  activeOption: OrderBookViewOptions
  lastTrade: LastTradeResponse | undefined
  asks: ITrade[]
  bids: ITrade[]
  priceDecimals: number
  amountDecimals: number
  token0Price: number
  scalar?: number
}

const OrderBookLastTransaction = ({
  trade,
  token0Price,
}: {
  token0Price: number
  trade: LastTradeResponse | undefined
}) => {
  const { colors } = useThemeContext()
  const [blink, setBlink] = useState('white')
  const [prevTrade, setPrevTrade] = useState({
    price: 0,
    action: 'UP',
  })
  useEffect(() => {
    if (trade && trade.price && trade.price != prevTrade.price) {
      trade.price > prevTrade.price ? setBlink(colors.pos_color) : setBlink(colors.neg_color)
      setPrevTrade({
        action: trade.price > prevTrade.price ? 'UP' : 'DOWN',
        price: trade.price,
      })
    }
  }, [trade, prevTrade])
  useEffect(() => {
    if (blink === colors.pos_color || blink === colors.neg_color) {
      setTimeout(() => {
        setBlink('white')
      }, 150)
    }
  }, [blink])
  if (!trade) {
    return (
      <div role="status" className="animate-pulse px-10 my-1" style={{ height: LastTrandsactionHeight }}>
        <div className="h-[20px] bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px]  mx-auto"></div>
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
  const { price } = trade
  return (
    <div className="flex items-center flex-row w-full justify-evenly px-2" style={{ height: LastTrandsactionHeight }}>
      <div className="flex flex-row justify-between w-full items-end">
        <div className="flex flex-row">
          {prevTrade.action === 'UP' ? (
            <ArrowUpIcon width={16} color={blink} />
          ) : (
            <ArrowDownIcon width={16} color={blink} />
          )}
          <T1 color={blink}>
            <FormattedNumber num={price} smallNumberOn2Zeros={true} />
          </T1>
        </div>
        <T3 color={blink}>
          $
          <FormattedNumber num={token0Price} smallNumberOn2Zeros={true} />
        </T3>
      </div>
    </div>
  )
}

export const OrderBookItems = (props: IOrderBookItems) => {
  const { token0Price, lastTrade, asks, bids, priceDecimals, amountDecimals, scalar } = props
  const [amountToShow] = useState(60)
  const sumArray = (arr: number[]) => {
    const sum = arr.reduce((grabSum, val) => grabSum + val, 0)
    return sum
  }
  const weightedSumArray = (arr: number[][]) => {
    const sizeArr = arr.map((item) => item[1])
    const sumSize = sumArray(sizeArr)
    const weight = sizeArr.map((item) => item / sumSize)
    const weightedPriceArr = arr.map((item, index) => item[0] * weight[index])
    return { weightedPrice: sumArray(weightedPriceArr), weightSizeArray: weight }
  }
  const [hoverInfo, setHoverInfo] = useState<
    | {
        idx: number
        side: 'bid' | 'ask'
        data: IOrderBookItem[]
        totalAmount: number
        totalValue: number
      }
    | undefined
  >(undefined)
  const formattedAsks = useMemo((): IOrderBookItem[] => {
    let totalAmount = 0
    let totalTotal = 0
    return asks.slice(0, amountToShow).map((trade, index, arr): IOrderBookItem => {
      const weight = weightedSumArray(arr.map((item) => [parseFloat(item.price), parseFloat(item.size)]))
      const price = orderBookSize(trade.price, priceDecimals)
      const amount = orderBookSize(trade.size, amountDecimals)
      const total = orderBookTotal(trade.size, trade.price, amountDecimals, priceDecimals)
      totalAmount += amount
      totalTotal += total
      return {
        weight: weight.weightSizeArray[index] / Math.max(...weight.weightSizeArray),
        trade: trade,
        isBid: false,
        priceDecimals: priceDecimals,
        amountDecimals: amountDecimals,
        scalar: scalar,
        price,
        amount,
        total,
        totalAmount,
        totalTotal,
      }
    })
  }, [asks, priceDecimals, amountDecimals])
  const formattedBids = useMemo((): IOrderBookItem[] => {
    let totalAmount = 0
    let totalTotal = 0
    return bids.slice(0, amountToShow).map((trade, index, arr): IOrderBookItem => {
      const weight = weightedSumArray(arr.map((item) => [parseFloat(item.price), parseFloat(item.size)]))
      const price = orderBookSize(trade.price, priceDecimals)
      const amount = orderBookSize(trade.size, amountDecimals)
      const total = orderBookTotal(trade.size, trade.price, amountDecimals, priceDecimals)
      totalAmount += amount
      totalTotal += total
      return {
        weight: weight.weightSizeArray[index] / Math.max(...weight.weightSizeArray),
        trade: trade,
        isBid: true,
        priceDecimals: priceDecimals,
        amountDecimals: amountDecimals,
        scalar: scalar,
        price,
        amount,
        total,
        totalAmount,
        totalTotal,
      }
    })
  }, [bids, priceDecimals, amountDecimals])
  const [isOpen, setIsOpen] = useState(false)
  const windowSize = useWindowSize()
  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: windowSize.width < 700 ? (windowSize.width < 390 ? 'left' : 'bottom') : 'right',
    middleware: [offset({ crossAxis: -65 })],
  })
  const { isMounted, styles } = useTransitionStyles(context, {
    initial: { opacity: 1, transform: 'scale(0,1)' },
    common: {
      transformOrigin: `left`,
      transitionDuration: '0.1s',
      animationDelay: '0s',
    },
  })
  const clientPoint = useClientPoint(context, { axis: 'y' })
  const hover = useHover(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, clientPoint])
  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        onMouseLeave={() => setHoverInfo(undefined)}
        className="flex flex-col"
      >
        <div className="flex flex-col-reverse">
          {formattedAsks.slice(0, amountToShow).map((trade, index) => {
            return (
              <div
                key={index}
                onMouseEnter={() => {
                  const data = formattedAsks
                  setHoverInfo({
                    idx: index,
                    side: 'ask',
                    data,
                    totalValue: trade.totalTotal,
                    totalAmount: trade.totalAmount,
                  })
                }}
              >
                <OrderBookItem key={index} {...trade} />
              </div>
            )
          })}
        </div>
        <div className={`relative`}>
          {hoverInfo && (
            <>
              {hoverInfo.side === 'ask' && (
                <div
                  style={{
                    height: `${31 + hoverInfo.idx * 22}px`,
                    bottom: '40px',
                    right: '0px',
                  }}
                  className="pointer-events-none absolute w-full border-t-2 border-t-blue-500/100 bg-blue-500/20 z-10"
                />
              )}
              {hoverInfo.side === 'bid' && (
                <div
                  style={{
                    height: `${31 + hoverInfo.idx * 22}px`,
                    top: '40px',
                    right: '0px',
                  }}
                  className="pointer-events-none absolute w-full border-b-2 border-b-blue-500/100 bg-blue-500/20 z-10"
                />
              )}
            </>
          )}
          <div onMouseEnter={() => setHoverInfo(undefined)}>
            <OrderBookLastTransaction token0Price={token0Price} trade={lastTrade} />
          </div>
        </div>
        <div className={`w-full flex-col flex`}>
          {formattedBids.slice(0, amountToShow).map((trade, index) => {
            return (
              <div
                key={index}
                onMouseEnter={() => {
                  const data = formattedBids
                  setHoverInfo({
                    idx: index,
                    side: 'bid',
                    data,
                    totalValue: trade.totalTotal,
                    totalAmount: trade.totalAmount,
                  })
                }}
              >
                <OrderBookItem key={index} {...trade} />
              </div>
            )
          })}
        </div>
      </div>
      {isOpen && hoverInfo && (
        <div className="z-10" ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
          <div
            className="z-10 mt-1 bg-gray-900 rounded-lg"
            style={{
              ...styles,
            }}
          >
            {isMounted && (
              <div className="border-gray-700 border bg-gray-750 fixed h-20 flex flex-col gap-2 p-2 rounded-md w-[187px]">
                <div className="flex flex-row justify-between">
                  <T3>Avg Price:</T3>
                  <T3>
                    <FormattedNumber num={hoverInfo.totalValue / hoverInfo.totalAmount} />
                  </T3>
                </div>
                <div className="flex flex-row justify-between">
                  <T3>Amount:</T3>
                  <T3>
                    <FormattedNumber num={Number(hoverInfo.totalAmount)} />
                  </T3>
                </div>
                <div className="flex flex-row justify-between">
                  <T3>Total:</T3>
                  <T3>
                    <FormattedNumber num={Number(hoverInfo.totalValue)} />
                  </T3>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
