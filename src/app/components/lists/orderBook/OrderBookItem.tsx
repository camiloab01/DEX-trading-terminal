import { FormatByGranularity, FormattedNumber } from '../../numbers/FormatNumber'
import { useThemeContext } from '../../../context/ThemeContext'
import { ITrade } from './OrderBookItems'
import { OrderItemHeight } from './constants'
import { createBarBackground, orderBookSize, orderBookTotal } from './misc'

export interface IOrderBookItem {
  trade: ITrade
  isBid: boolean
  weight: number
  priceDecimals: number
  amountDecimals: number
  scalar?: number
  totalAmount: number
  totalTotal: number
  price: number
  amount: number
  total: number
}

export default function OrderBookItem(props: IOrderBookItem) {
  const { trade, isBid = true, weight = 0, amountDecimals, priceDecimals, scalar = 1 } = props
  const { colors } = useThemeContext()
  const amount = orderBookSize(trade.size, amountDecimals)
  const total = orderBookTotal(trade.size, trade.price, amountDecimals, priceDecimals)
  return (
    <div
      className="flex flex-row w-full px-2 relative my-[2px] items-center rounded-md"
      style={{
        height: OrderItemHeight,
        background: createBarBackground(Math.floor(90 * weight), isBid ? colors.pos_vol_color : colors.neg_vol_color),
      }}
    >
      <div className="grid grid-cols-3 justify-between gap-x-1 w-full z-[2]">
        <div style={{ color: isBid ? colors.pos_color : colors.neg_color, userSelect: 'none' }}>
          <FormatByGranularity num={orderBookSize(trade.price, priceDecimals)} granularity={scalar} />
        </div>
        <div style={{ userSelect: 'none', textAlign: 'center' }}>
          <FormattedNumber num={amount} />
        </div>
        <div style={{ userSelect: 'none' }} className="text-end pr-1">
          <FormattedNumber num={total} />
        </div>
      </div>
    </div>
  )
}
