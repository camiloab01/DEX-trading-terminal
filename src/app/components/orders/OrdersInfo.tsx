import { Order } from '@gfxlabs/oku'
import { FormattedNumber } from '../numbers/FormatNumber'
import { TokenSymbol } from '../misc/TokenSymbol'

/*
*****ORDERS FOLLOW THIS LOGIC*****
** LIMIT ORDERS **
** SELL =>
Buy: amount_total*price
Sell: amount_total
** BUY =>
Buy: amount_total/price
Sell: amount_total 
** MARKET ORDERS **
** SELL => 
Buy: amount_total*price
Sell: amount_total 
** BUY =>
Buy: amount_total
Sell: amount_total*price
*/

export const OrderBuyAmount = ({ order }: { order: Order }) => {
  if (order.type === 'MARKET') {
    if (order.side === 'BUY') {
      return (
        <div className="flex gap-1">
          <FormattedNumber num={order.amount_total ? order.amount_total : 0} />
          <span>
            <TokenSymbol address={order.base_currency_address!} fallback_name={order.base_currency} />
          </span>
        </div>
      )
    } else {
      const numValue = Number(order.amount_total) * Number(order.price)
      return (
        <div className="flex gap-1">
          <FormattedNumber num={numValue} />
          <span>
            <TokenSymbol address={order.quote_currency_address!} fallback_name={order.quote_currency} />
          </span>
        </div>
      )
    }
  } else if (order.side === 'BUY') {
    const numValue = Number(order.amount_total) / Number(order.price)
    return (
      <div className="flex gap-1">
        <FormattedNumber num={numValue} />
        <span>
          <TokenSymbol address={order.base_currency_address!} fallback_name={order.base_currency} />
        </span>
      </div>
    )
  } else {
    const numValue = Number(order.amount_total) * Number(order.price)
    return (
      <div className="flex gap-1">
        <FormattedNumber num={numValue} />
        <span>
          <TokenSymbol address={order.quote_currency_address!} fallback_name={order.quote_currency} />
        </span>
      </div>
    )
  }
}

export const OrderSellAmount = ({ order }: { order: Order }) => {
  if (order.type === 'MARKET') {
    if (order.side === 'BUY') {
      const numValue = Number(order.amount_total) * Number(order.price)
      return (
        <div className="flex gap-1">
          <FormattedNumber num={numValue} />
          <span>
            <TokenSymbol address={order.quote_currency!} fallback_name={order.quote_currency} />
          </span>
        </div>
      )
    } else {
      return (
        <div className="flex gap-1">
          <FormattedNumber num={Number(order.amount_total)} />
          <span>
            <TokenSymbol address={order.base_currency_address!} fallback_name={order.base_currency} />
          </span>
        </div>
      )
    }
  } else if (order.side === 'BUY') {
    return (
      <div className="flex gap-1">
        <FormattedNumber num={Number(order.amount_total)} />
        <span>
          <TokenSymbol address={order.quote_currency!} fallback_name={order.quote_currency} />
        </span>
      </div>
    )
  } else {
    return (
      <div className="flex gap-1">
        <FormattedNumber num={Number(order.amount_total)} />
        <span>
          <TokenSymbol address={order.base_currency_address!} fallback_name={order.base_currency} />
        </span>
      </div>
    )
  }
}

export const OrderPriceAmount = ({ order }: { order: Order }) => {
  const orderPrice = order.should_flip ? 1 / Number(order.avg_price) : Number(order.avg_price)
  return (
    <div className="flex gap-1">
      <FormattedNumber num={orderPrice} smallNumberOn2Zeros />
      <span>
        {order.should_flip ? (
          <TokenSymbol address={order.base_currency_address!} fallback_name={order.base_currency} />
        ) : (
          <TokenSymbol address={order.quote_currency!} fallback_name={order.quote_currency} />
        )}
      </span>
    </div>
  )
}
