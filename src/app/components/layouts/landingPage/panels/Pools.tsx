import { useEffect, useState } from 'react'
import { useRpcContext } from '../../../../context/RpcContext'
import { convertToFlattenable, omniFlattenAndNoSort, omniFlattenAndSort, removeError } from '../util'
import Tab from '../misc/Tab'
import { Pools as PoolsTable, PoolSummaryWithKey } from '../tables/Pools'
import { useConfigContext } from '../../../../context/ConfigContext'
const Pools = () => {
  const { omniCush } = useRpcContext()
  const [pools, setPools] = useState<PoolSummaryWithKey[]>([])
  const [newPools, setNewPools] = useState<PoolSummaryWithKey[]>([])
  const [tab, setTab] = useState(0)
  const { features } = useConfigContext()
  useEffect(() => {
    omniCush
      .network('omni')
      .call('cush_topPools', [
        { sort_by: 'total_volume_7d_usd', sort_order: false, result_size: 20, result_offset: 0, fee_tiers: [] },
      ])
      .then((data) => {
        const removedError = removeError(data)
        const converted = convertToFlattenable(removedError, 'pools')
        const sortedData = omniFlattenAndSort(converted, 'total_volume_7d_usd', false, features) as PoolSummaryWithKey[]
        setPools(sortedData)
      })
    omniCush
      .network('omni')
      .call('cush_trendingPools', [20])
      .then((data) => {
        const removedError = removeError(data)
        const nonSortedData = omniFlattenAndNoSort(removedError, features) as PoolSummaryWithKey[]
        const sortedData = nonSortedData
          .sort((a, b) => b.t0_volume_usd + b.t1_volume_usd - (a.t0_volume_usd + a.t1_volume_usd))
          .slice(0, 20)
        setNewPools(sortedData)
      })
      .catch((error) => {
        window.log.error('Line: #31', 'error', error)
      })
  }, [])

  return (
    <div className="h-full overflow-hidden rounded-xl bg-gray-900 border border-gray-800 pb-10">
      <div className=" text-center bg-gray-900 rounded-t-xl flex flex-row outline-b outline-gray-dark pt-3">
        <Tab isActive={tab === 0} tab={0} setTab={setTab} text="New Pools" />
        <Tab isActive={tab === 1} tab={1} setTab={setTab} text="Top Pools" />
      </div>
      <PoolsTable pools={newPools} isVisible={tab === 0} />
      <PoolsTable pools={pools} isVisible={tab === 1} />
    </div>
  )
}

export default Pools
