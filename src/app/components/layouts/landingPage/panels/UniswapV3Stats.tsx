import { useEffect, useState } from 'react'
import { colors } from '../../../../constants/colors'
import { useRpcContext } from '../../../../context/RpcContext'
import { FontWeightEnums } from '../../../../types/Enums'
import { SkeletonLines } from '../../../loadingStates/SkeletonLines'
import { formatNumber } from '../../../numbers/FormatNumber'
import { T1, T2, T3 } from '../../../typography/Typography'
import { AnalyticsProtocolOverview } from '@gfxlabs/oku'

interface SumAnalyticsProtocolOverview {
  [key: string]: number
}

const UniswapV3Stats = () => {
  const { omniCush } = useRpcContext()
  const [v3Stats, setv3Stats] = useState<SumAnalyticsProtocolOverview>()

  useEffect(() => {
    omniCush
      .network('omni')
      .call('cush_analyticsProtocolOverview', [])
      .then((data) => setv3Stats(aggregateAnalyticsOverview(data)))
  }, [])

  return (
    <div className="w-full h-full bg-gray-900 p-3 rounded-xl border border-gray-800 text-gray-100 flex-col justify-around items-center gap-3 flex">
      {v3Stats ? (
        <>
          <T2 className="text-center" weight={FontWeightEnums.MEDIUM}>
            🌏 Uniswap v3 Stats
          </T2>
          <div className="w-full h-fit p-1 py-3 rounded-xl border border-gray-750 justify-around items-center gap-1 flex">
            <VolTVLStatsItem
              title="24H Volume"
              value={formatNumber({ num: v3Stats.total_volume_usd, notation: 'compact' })}
            />
            <VolTVLStatsItem title="TVL" value={formatNumber({ num: v3Stats.tvl_usd, notation: 'compact' })} />
          </div>
          <div className="w-full flex flex-col gap-y-3">
            <Stat
              title={'Fees 24H'}
              value={formatNumber({ num: v3Stats.total_fees_usd, notation: 'compact' })}
              isCurrencyValue
            />
            <Stat
              title={'New Positions 24H'}
              value={formatNumber({
                num: v3Stats.positions_created_24h,
                notation: 'standard',
                aboveOneDecimalAmount: 0,
              })}
            />
            <Stat
              title={'Active Accounts 7D'}
              value={formatNumber({ num: v3Stats.active_users, notation: 'standard', aboveOneDecimalAmount: 0 })}
            />
            <Stat
              title={'TX 24H'}
              value={formatNumber({ num: v3Stats.swap_count_24h, notation: 'standard', aboveOneDecimalAmount: 0 })}
            />
          </div>
        </>
      ) : (
        <SkeletonLines lines={10} />
      )}
    </div>
  )
}

export default UniswapV3Stats

const VolTVLStatsItem = ({ title, value }: { title: string; value: string }) => (
  <div className="text-center">
    <T1 color={colors.gray[100]} weight={FontWeightEnums.SEMIBOLD}>
      ${value}
    </T1>
    <T3 color={colors.gray[300]} className="mt-2">
      {title}
    </T3>
  </div>
)

const Stat = ({
  title,
  value,
  isCurrencyValue = false,
}: {
  title: string
  value: string
  isCurrencyValue?: boolean
}) => {
  return (
    <div className="w-full justify-between items-center flex">
      <T2 color={colors.gray[300]}>{title}</T2>
      <T2 color={colors.gray[100]}>
        {isCurrencyValue && '$'}
        {value}
      </T2>
    </div>
  )
}

function aggregateAnalyticsOverview(data: AnalyticsProtocolOverview): SumAnalyticsProtocolOverview {
  const result: SumAnalyticsProtocolOverview = {}

  for (const key in data) {
    const prop = data[key as keyof AnalyticsProtocolOverview]
    if (typeof prop === 'number') {
      if (!result[key]) {
        result[key] = 0
      }
      result[key] += prop
    } else if (typeof prop === 'object' && prop !== null) {
      const subResult = aggregateAnalyticsOverview(prop as unknown as AnalyticsProtocolOverview)
      for (const subKey in subResult) {
        if (!result[subKey]) {
          result[subKey] = 0
        }
        result[subKey] += subResult[subKey]
      }
    }
  }
  return result
}
