import { TrendingPoolsEnums } from '../../../types/Enums'
import { PoolSummary } from '@gfxlabs/oku'
import { NavLink } from 'react-router-dom'
import {
  TrendingTVLItem,
  TrendingTopGainerItem,
  TrendingTopLoserItem,
  TrendingTotalSwapsItem,
  TrendingVolumeItem,
} from './TrendingListItems'

interface ITrendingTableItem {
  index: number
  trendType: TrendingPoolsEnums
  pool: PoolSummary
}

export default function TrendingTableItem(props: ITrendingTableItem) {
  const { index, trendType, pool } = props

  return (
    <NavLink
      className={`${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'} hover:bg-gray-750 focus:bg-gray-700 whitespace-pre w-full flex flex-row items-center p-3 border-b border-gray-800`}
      to={`../${pool.t0}/${pool.t1}`}
    >
      {SwitchTableTitle(trendType, pool)}
    </NavLink>
  )
}

const SwitchTableTitle = (trendType: TrendingPoolsEnums, pool: PoolSummary) => {
  switch (trendType) {
    case TrendingPoolsEnums.TOP_GAINERS:
      return <TrendingTopGainerItem pool={pool} />
    case TrendingPoolsEnums.TOP_LOSERS:
      return <TrendingTopLoserItem pool={pool} />
    case TrendingPoolsEnums.TOTAL_SWAPS:
      return <TrendingTotalSwapsItem pool={pool} />
    case TrendingPoolsEnums.TVL:
      return <TrendingTVLItem pool={pool} />
    case TrendingPoolsEnums.VOLUME:
      return <TrendingVolumeItem pool={pool} />
    default:
      return <TrendingTopGainerItem pool={pool} />
  }
}
