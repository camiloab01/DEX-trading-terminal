import { useEffect, useState } from 'react'
import { useRpcContext } from '../../../../context/RpcContext'
import { UserTradeStats } from '@gfxlabs/oku'
import { T2 } from '../../../typography/Typography'
import { FontWeightEnums } from '../../../../types/Enums'
import { SkeletonLines } from '../../../loadingStates/SkeletonLines'
import { colors } from '../../../../constants/colors'
import { omniFlattenAndSort } from '../util'
import { UserTradeStatsWithKey, TopUsers7D as TopUsers7DTable } from '../tables/TopUsers7D'
import { useConfigContext } from '../../../../context/ConfigContext'

const TopUsers7D = () => {
  const { omniCush } = useRpcContext()
  const [topUsers, setTopUsers] = useState<UserTradeStatsWithKey[]>([])
  const { features } = useConfigContext()
  useEffect(() => {
    omniCush
      .network('omni')
      .call('cush_topUsers', [{ limit: 20, offset: 0, sort_by: 'volume', sort_order: false }])
      .then((data) => setTopUsers(omniFlattenAndSort(data as UserTradeStats[], 'volume', false, features)))
  }, [])

  return (
    <div className="h-full overflow-hidden rounded-xl border border-gray-800">
      {topUsers.length > 0 ? (
        <>
          <div className=" text-center py-2 bg-gray-dark rounded-t-xl border-b border-gray-dark">
            <T2 weight={FontWeightEnums.MEDIUM} color={colors.gray[100]}>
              Top Users 7D
            </T2>
          </div>
          <TopUsers7DTable users={topUsers} />
        </>
      ) : (
        <SkeletonLines lines={8} />
      )}
    </div>
  )
}

export default TopUsers7D
