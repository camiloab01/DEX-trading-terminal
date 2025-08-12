import { useThemeContext } from '../../../context/ThemeContext'
import { LayoutEnums } from '../../../types/Enums'
import LeftPanel from './panels/LeftPanel'
import OrderPanel from './panels/OrderPanel'
import RightPanel from './panels/RightPanel'
import { useDataContext } from '../../../context/DataContext'
import DefaultChartLayout from '../../charts/layouts/DefaultChartLayout'
import { formatNumber } from '../../numbers/FormatNumber'
import { TitleAndDescriptionFunc } from '../../../route/helmet'
import { useChainLoader } from '../../../route/loaderData'
import { useEffect, useState } from 'react'
import { t } from '@lingui/macro'

export default function PoolPageLayout() {
  const { appLayout } = useThemeContext()
  const isDefaultLayout = appLayout === LayoutEnums.DEFAULT
  const { token0, token1, poolSummary, token } = useDataContext()
  const { currentChainInfo } = useChainLoader()
  const [pageTitle, setPageTitle] = useState(t`Pool | Oku Trade`)
  const [pageDescription, setPageDescription] = useState(
    t`Swap on Ethereum and other chains today. Charting, analytics, trending tokens, and more on Oku Trade.`
  )

  useEffect(() => {
    if (token0 != undefined && token1 != undefined && poolSummary != undefined) {
      const price = token.selected === 0 ? poolSummary.t1_price : poolSummary.t0_price
      const formattedPrice = formatNumber({ num: price })
      const change = token.selected === 0 ? poolSummary.t1_change : poolSummary.t0_change
      const formattedVolume = formatNumber({
        num: (poolSummary.t1_volume_usd + poolSummary.t0_volume_usd) / 2,
      })
      const formattedFees = formatNumber({
        num: poolSummary.total_fees_usd,
      })
      const formattedTvl = formatNumber({ num: poolSummary.tvl_usd })

      setPageTitle(t`${token1?.symbol}/${token0?.symbol} at ${formattedPrice} | Oku Trade`)
      setPageDescription(
        t`${token1?.symbol}/${token0?.symbol} ${formatNumber({ num: change * 100, belowOneDecimalAmount: 2 })}% over the past 24H with a trading volume of ${formattedVolume} with $${formattedFees} in fees. The TVL is $${formattedTvl}. Trade on ${currentChainInfo.name} and other chains today. Limit orders, analytics, charts, and more on Oku Trade.`
      )
    }
  }, [token, token0, token1, poolSummary, currentChainInfo])

  return (
    <div className="flex-row grow gap-2 px-1.5 p-1 flex w-full h-full">
      <TitleAndDescriptionFunc pageTitle={pageTitle} pageDescription={pageDescription} />
      <div
        className="overflow-hidden flex gap-2 grow"
        style={{ flexDirection: isDefaultLayout ? 'row' : 'row-reverse' }}
      >
        <div className="lg:flex hidden">
          <LeftPanel />
        </div>
        <div className="w-full flex flex-1 flex-col gap-1 gap-y-1.5">
          <div className="flex flex-1 min-h-[400px] md:min-h-[400px] lg:min-h-[300px]">
            <DefaultChartLayout />
          </div>
          <div className="flex gap-1 h-fit flex-col md:flex-row">
            <div className={`flex lg:hidden flex-1 w-full md:w-[50%] h-full`}>
              <LeftPanel />
            </div>
            <div className="flex flex-1">
              <OrderPanel />
            </div>
          </div>
        </div>
      </div>
      <div className="hidden xl:block">
        <RightPanel />
      </div>
    </div>
  )
}
