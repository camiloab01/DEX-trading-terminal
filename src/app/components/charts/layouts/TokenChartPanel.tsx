import { IToken } from '../../../lib/getToken'
import { tokenChartTimeIncrementEnums } from '../../../types/Enums'
import TokenChartContainer from '../charts/swapPageCharts/components/TokenChartContainer'
import { TokenChartTopBar } from '../charts/swapPageCharts/components/topBar/TokenChartTopBar'
import { useEffect, useState } from 'react'
import { useChainLoader } from '../../../route/loaderData'
import NoDataFoundState from '../states/NoDataFoundState'

interface ITokenChartPanel {
  timeIncrement: tokenChartTimeIncrementEnums
  setTimeIncrement: (value: tokenChartTimeIncrementEnums) => void
  token: IToken
  price: number | undefined
}

function TokenChartPanel(props: ITokenChartPanel) {
  const { timeIncrement, setTimeIncrement, token, price } = props
  const { cushRpc } = useChainLoader()
  const [isEnoughData, setIsEnoughData] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    setIsEnoughData(undefined)
  }, [token, cushRpc])

  return (
    <div className="flex flex-1">
      {isEnoughData === false ? (
        <NoDataFoundState />
      ) : (
        <div className={`p-5 rounded-xl bg-gray-900 border-[1px] w-full flex grow flex-col border-gray-750`}>
          <div className="flex flex-col">
            <TokenChartTopBar
              token={token}
              tokenPriceUSD={price}
              timeIncrement={timeIncrement}
              setTimeIncrement={setTimeIncrement}
            />
          </div>
          <div className="flex flex-col grow">
            <TokenChartContainer timeIncrement={timeIncrement} token={token} setIsEnoughData={setIsEnoughData} />
          </div>
        </div>
      )}
    </div>
  )
}

export default TokenChartPanel
