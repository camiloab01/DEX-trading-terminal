import { IToken } from '../../../lib/getToken'
import { topBarheight } from '../../charts/charts/liquidityChart/constants'
import ChartPanel from './panels/ChartPanel'
import TokenOverviewPanel from './panels/TokenOverviewPanel'
import TrendingPanel from './panels/TrendingPanel'
import { useCurrentClient } from '../../../hooks/useClient'
import { TitleAndDescriptionFunc } from '../../../route/helmet'
import { useChainLoader } from '../../../route/loaderData'
import OrderFormContainer from '../../forms/OrderForms/OrderFormContainer'
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { formatNumber } from '../../numbers/FormatNumber'
import { useWindowSize } from 'usehooks-ts'

interface IDefaultSwapPageLayout {
  token0: IToken
  token1: IToken
}
export default function DefaultSwapPageLayout(props: IDefaultSwapPageLayout) {
  const { token0, token1 } = props
  const windowSize = useWindowSize()
  const chartPanelHeight = windowSize.height - topBarheight - 100 < 700 ? 800 : windowSize.height - topBarheight - 70
  const { currentChainInfo } = useChainLoader()
  const { data: tokenOverview0 } = useCurrentClient('cush_getTokenOverview', [token0.address], {})
  const { data: tokenOverview1 } = useCurrentClient('cush_getTokenOverview', [token1.address], {})
  const [pageTitle, setPageTitle] = useState(t`swap on ${currentChainInfo.name} | Oku Trade`)
  const [pageDescription, setPageDescription] = useState(
    t`Charting, analytics, trending tokens, and more on Oku Trade.`
  )
  const tokenProps = {
    token0,
    token1,
    tokenOverview0: token0.isImported ? undefined : tokenOverview0,
    tokenOverview1: token1.isImported ? undefined : tokenOverview1,
  }
  const chartPanel = <ChartPanel {...tokenProps} />
  const tokenOverviewPanel = <TokenOverviewPanel {...tokenProps} />

  useEffect(() => {
    if (token0 != undefined && token1 != undefined && tokenOverview0?.price_deltas != undefined) {
      setPageTitle(t`${token1?.symbol}/${token0?.symbol} | Swap on ${currentChainInfo.name} | Oku Trade`)
      setPageDescription(
        t`${token1.symbol}/${token0.symbol} ${formatNumber({ num: tokenOverview0.price_deltas.week_change_usd * 100, belowOneDecimalAmount: 2 })}% over the past 7D. Swap ${token1.name} and ${token0.name} on ${currentChainInfo.name} today. Charting, analytics, trending tokens, and more ok Oku Trade`
      )
    }
  }, [token0, token1, currentChainInfo, tokenOverview0])

  const calculateMaxHeight = (width: number, chartPanelHeight: number) => {
    if (width < 640) return chartPanelHeight - 570
    if (width <= 768) return chartPanelHeight - 420
    if (width <= 1024) return chartPanelHeight - 410
    if (width <= 1280) return chartPanelHeight - 400
    return chartPanelHeight
  }

  return (
    <div
      className="flex flex-col-reverse flex-1 xl:flex-row w-full overflow-hidden gap-2 p-2"
      style={{ minHeight: chartPanelHeight }}
    >
      <TitleAndDescriptionFunc pageTitle={pageTitle} pageDescription={pageDescription} />
      <div
        className="flex flex-col flex-1 sm:flex-row gap-2 overflow-hidden"
        style={{ maxHeight: windowSize.width > 640 ? chartPanelHeight : '' }}
      >
        <div
          className={`flex basis-1/2 xl:basis-auto`}
          style={{
            maxHeight: calculateMaxHeight(windowSize.width, chartPanelHeight),
            minHeight: windowSize.width >= 1280 ? chartPanelHeight : 'auto',
          }}
        >
          <TrendingPanel />
        </div>
        <div className="flex basis-1/2 xl:basis-auto grow">
          {windowSize.width < 640 ? tokenOverviewPanel : chartPanel}
        </div>
      </div>
      <div className="flex flex-col sm:flex-1 sm:flex-row xl:flex-col xl:max-w-[390px] gap-2">
        <div className="flex sm:basis-1/2">
          <OrderFormContainer isSwapForm />
        </div>
        <div className="flex h-[594px] sm:h-auto sm:basis-1/2">
          {windowSize.width < 640 ? chartPanel : tokenOverviewPanel}
        </div>
      </div>
    </div>
  )
}
