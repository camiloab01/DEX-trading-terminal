import OrderBook from '../../../lists/orderBook/OrderBook'
import TradingHistory from '../../../lists/tradingHistory/TradingHistory'
import BaseSwitch from '../../../switch/BaseSwitch'
import { useState } from 'react'

export default function LeftPanel() {
  const [item, setItem] = useState(false)
  return (
    <div
      className={`w-full bg-gray-900 p-1 rounded-lg border border-gray-800 overflow-hidden min-h-96 ${`sm:w-full min-w-[280px]`}`}
    >
      <div className="flex flex-1 h-full w-full flex-col gap-1 sm:max-h-full">
        <div className={'xl:hidden'}>
          <BaseSwitch item={item} setItem={setItem} item1={'Order Book'} item2={'Trading History'} />
        </div>
        {item ? (
          <div className="h-full">
            <TradingHistory />
          </div>
        ) : (
          <OrderBook />
        )}
      </div>
    </div>
  )
}
