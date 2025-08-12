import { useEffect, useState } from 'react'
import { useRpcContext } from '../../../../context/RpcContext'
import { TopTokensWithLogos, getTopTokensWithLogos, omniFlattenAndSort } from '../util'
import { TokenSearchResponseWithKey, TopTokens as TopTokensTable } from '../tables/TopTokens'
import { TopUsers7D, UserTradeStatsWithKey } from '../tables/TopUsers7D'
import { UserTradeStats } from '@gfxlabs/oku'
import Tab from '../misc/Tab'
import { SkeletonLines } from '../../../loadingStates/SkeletonLines'
import { useConfigContext } from '../../../../context/ConfigContext'

const TopTokens = () => {
  const { omniCush } = useRpcContext()
  const [topGainers, setTopGainers] = useState<TopTokensWithLogos[]>([])
  const [topLosers, setTopLosers] = useState<TopTokensWithLogos[]>([])
  const [topUsers, setTopUsers] = useState<UserTradeStatsWithKey[]>([])
  const [tab, setTab] = useState(0)
  const { features } = useConfigContext()

  useEffect(() => {
    omniCush
      .network('omni')
      .call('cush_topGainersAndLosers', [true, 30, 0])
      .then((data) => {
        const sortedData = omniFlattenAndSort(data, 'change_24h', false, features, 50) as TokenSearchResponseWithKey[]
        const topTokensWithLogos = getTopTokensWithLogos(sortedData)
        setTopGainers(topTokensWithLogos)
      })

    omniCush
      .network('omni')
      .call('cush_topGainersAndLosers', [false, 30, 0])
      .then((data) => {
        const sortedData = omniFlattenAndSort(data, 'change_24h', true, features, 50) as TokenSearchResponseWithKey[]

        const topTokensWithLogos = getTopTokensWithLogos(sortedData)
        setTopLosers(topTokensWithLogos)
      })

    omniCush
      .network('omni')
      .call('cush_topUsers', [{ limit: 20, offset: 0, sort_by: 'volume', sort_order: false }])
      .then((data) => {
        const sortedData = omniFlattenAndSort(data as UserTradeStats[], 'volume', false, features)
        setTopUsers(sortedData)
      })
  }, [])

  return (
    <div className="h-full overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
      {topGainers.length > 0 ? (
        <>
          <div className=" text-center bg-gray-900 rounded-t-xl flex flex-row outline-b outline-gray-dark pt-3">
            <Tab isActive={tab === 0} tab={0} setTab={setTab} text="Top Gainers" />
            <Tab isActive={tab === 1} tab={1} setTab={setTab} text="Top Losers" />
            <Tab isActive={tab === 2} tab={2} setTab={setTab} text="Top Users 7D" />
          </div>
          {tab === 0 ? <TopTokensTable tokens={topGainers} /> : null}
          {tab === 1 ? <TopTokensTable tokens={topLosers} /> : null}
          {tab === 2 ? <TopUsers7D users={topUsers} /> : null}
        </>
      ) : (
        <SkeletonLines lines={8} />
      )}
    </div>
  )
}

export default TopTokens
