import { useResizeObserver } from 'usehooks-ts'
import PoolSection from '../../../lists/poolList/PoolSection'
import TradingHistory from '../../../lists/tradingHistory/TradingHistory'
import { useRef } from 'react'

export default function RightPanel() {
  const ref = useRef(null)
  const { height: clientHeight } = useResizeObserver({ ref })
  return (
    <div className={` min-w-[280px] max-w-[280px] gap-2 flex flex-col h-full`}>
      <div className="flex flex-1 overflow-scroll no-scrollbar relative" ref={ref}>
        <div className="absolute" style={{ height: clientHeight }}>
          <PoolSection isModal={false} />
        </div>
      </div>
      <div className="flex-1">
        <TradingHistory />
      </div>
    </div>
  )
}
