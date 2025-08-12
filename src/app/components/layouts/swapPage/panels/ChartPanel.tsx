import { IToken } from '../../../../lib/getToken'
import { tokenChartTimeIncrementEnums } from '../../../../types/Enums'
import { useSwapPageContext } from '../../../../context/SwapPageContext'
import TokenChartPanel from '../../../charts/layouts/TokenChartPanel'
import { useState } from 'react'
import { TokenOverview } from '@gfxlabs/oku'

interface IChartPanel {
  token0: IToken
  token1: IToken
  tokenOverview0: TokenOverview | undefined
  tokenOverview1: TokenOverview | undefined
}

export default function ChartPanel({ token0, token1, tokenOverview0, tokenOverview1 }: IChartPanel) {
  const [timeIncrement, setTimeIncrement] = useState(tokenChartTimeIncrementEnums.HOUR_1)
  const { flip } = useSwapPageContext()

  return (
    <div className={`rounded-xl border border-gray-800 p-3 w-full h-full bg-gray-900`}>
      <div className={`flex flex-1 h-full grow gap-3 ${flip ? 'flex-col-reverse' : 'flex-col'}`}>
        <TokenChartPanel
          timeIncrement={timeIncrement}
          setTimeIncrement={setTimeIncrement}
          token={token0}
          price={tokenOverview0?.price_deltas?.price_usd}
        />
        <TokenChartPanel
          timeIncrement={timeIncrement}
          setTimeIncrement={setTimeIncrement}
          token={token1}
          price={tokenOverview1?.price_deltas?.price_usd}
        />
      </div>
    </div>
  )
}
