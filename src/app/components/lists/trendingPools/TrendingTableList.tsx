import { TrendingPoolsEnums } from '../../../types/Enums'
import { SkeletonLines } from '../../loadingStates/SkeletonLines'
import TrendingTableItem from './TrendingTableItem'
import { useCurrentClient } from '../../../hooks/useClient'
import { useChainLoader } from '../../../route/loaderData'
import { useEffect, useState } from 'react'
import { PoolSummary } from '@gfxlabs/oku'

interface ITrendingTableList {
  trendType: TrendingPoolsEnums
}

export default function TrendingTableList(props: ITrendingTableList) {
  const { trendType } = props
  const { chain } = useChainLoader()
  const [poolListFetched, setPoolListFetched] = useState<boolean>(false)
  const [pools, setPools] = useState<PoolSummary[]>([])
  const { data: poolResult } = useCurrentClient('cush_topPools', [createTopPoolParams(trendType)], {
    enabled: poolListFetched !== true,
  })
  useEffect(() => {
    setPoolListFetched(false)
  }, [chain, trendType])
  useEffect(() => {
    if (poolResult != undefined) {
      const pools = poolResult.pools !== undefined ? poolResult.pools : []
      setPools(pools)
      setPoolListFetched(true)
    }
  }, [poolResult])
  return (
    <div className="overflow-y-scroll no-scrollbar flex-col flex-1 h-min">
      <div className="flex flex-col min-h-[792px]">
        {poolListFetched ? (
          pools?.map((pool, index) => (
            <TrendingTableItem index={index} key={pool.address} pool={pool} trendType={trendType} />
          ))
        ) : (
          <SkeletonLines lines={50} random />
        )}
      </div>
    </div>
  )
}
const sortFields = {
  [TrendingPoolsEnums.TOP_GAINERS]: 't0_change_usd',
  [TrendingPoolsEnums.TOP_LOSERS]: 't0_change_usd',
  [TrendingPoolsEnums.TOTAL_SWAPS]: 'tx_count',
  [TrendingPoolsEnums.TVL]: 'tvl_usd',
  [TrendingPoolsEnums.VOLUME]: 'total_volume_7d_usd',
}
const createTopPoolParams = (trendType: TrendingPoolsEnums) => {
  const commonParams = {
    fee_tiers: [],
    result_offset: 0,
    result_size: 50,
    sort_order: trendType === TrendingPoolsEnums.TOP_LOSERS,
    sort_by: sortFields[trendType] || 't0_change_usd',
  }
  return commonParams
}
