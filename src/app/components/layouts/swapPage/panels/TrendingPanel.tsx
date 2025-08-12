import { TrendingPoolsEnums } from '../../../../types/Enums'
import TrendingTableList from '../../../lists/trendingPools/TrendingTableList'
import TrendingTableTitles from '../../../lists/trendingPools/TrendingTableTitles'
import TrendingTopBar from '../../../lists/trendingPools/TrendingTopBar'
import { useState } from 'react'

export default function TrendingPanel() {
  const [trendType, setTrendType] = useState<TrendingPoolsEnums>(TrendingPoolsEnums.VOLUME)

  return (
    <div
      className={`flex flex-col flex-1 w-full grow rounded-xl bg-gray-900 border border-gray-800 overflow-hidden sm:min-w-full md:min-w-[350px] lg:min-w-[475px] xl:min-w-[360px]`}
    >
      <TrendingTopBar trendType={trendType} setTrendType={setTrendType} />
      <TrendingTableTitles trendType={trendType} />
      <TrendingTableList trendType={trendType} />
    </div>
  )
}
