import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import { getTokenLogoUrl } from '../../../util/getTokenLogo'
import { PoolSummary } from '@gfxlabs/oku'
import { RoundTokenLogoPair } from '../../misc/RoundTokenLogo'
import { useChainLoader } from '../../../route/loaderData'
import { FormattedNumber, formatNumber } from '../../numbers/FormatNumber'
import { TokenSymbol } from '../../misc/TokenSymbol'

function TrendingPoolTitle({ pool }: { pool: PoolSummary }) {
  const { currentChain } = useChainLoader()
  return (
    <div className="flex items-center gap-[5px]">
      <RoundTokenLogoPair
        token0LogoUrl={getTokenLogoUrl(pool.t0, currentChain)}
        token1LogoUrl={getTokenLogoUrl(pool.t1, currentChain)}
        token0Symbol={pool.t0_symbol}
        token1Symbol={pool.t1_symbol}
      />
      <div className="flex flex-row">
        <T3>
          <TokenSymbol address={pool.t0} fallback_name={pool.t0_symbol} />
        </T3>
        <T3>
          /<TokenSymbol address={pool.t1} fallback_name={pool.t1_symbol} />
        </T3>
      </div>
      <T3>{pool.fee / 10000}%</T3>
    </div>
  )
}

export function TrendingTopGainerItem({ pool }: { pool: PoolSummary }) {
  return (
    <div className="w-full flex flex-row items-center">
      <div className="flex  flex-[19] ">
        <TrendingPoolTitle pool={pool} />
      </div>
      <div className="flex flex-[7] justify-end">
        <T3>${<FormattedNumber num={pool.t0_price_usd} />}</T3>
      </div>
      <div className="flex flex-[9] justify-end">
        <T3 color={colors.green[400]}>${formatNumber({ num: pool.t1_volume_usd + pool.t0_volume_usd })}</T3>
      </div>
    </div>
  )
}

export function TrendingTopLoserItem({ pool }: { pool: PoolSummary }) {
  return (
    <div className="w-full flex flex-row items-center">
      <div className="flex  flex-[19] ">
        <TrendingPoolTitle pool={pool} />
      </div>
      <div className="flex flex-[7] justify-end">
        <T3>${<FormattedNumber num={pool.t0_price_usd} />}</T3>
      </div>
      <div className="flex flex-[9] justify-end">
        <T3 color={colors.green[400]}>${formatNumber({ num: pool.t1_volume_usd + pool.t0_volume_usd })}</T3>
      </div>
    </div>
  )
}

export function TrendingTotalSwapsItem({ pool }: { pool: PoolSummary }) {
  return (
    <div className="w-full flex flex-row items-center justify-between">
      <div className="flex  ">
        <TrendingPoolTitle pool={pool} />
      </div>
      <div className="flex ">
        <T3 color={colors.green[400]}>{pool.tx_count}</T3>
      </div>
    </div>
  )
}

export function TrendingTVLItem({ pool }: { pool: PoolSummary }) {
  return (
    <div className="w-full flex flex-row items-center">
      <div className="flex  flex-[19] ">
        <TrendingPoolTitle pool={pool} />
      </div>
      <div className="flex flex-[7] justify-end">
        <T3>${formatNumber({ num: pool.tvl_usd })}</T3>
      </div>
      <div className="flex flex-[9] justify-end">
        <T3 color={colors.green[400]}>
          $
          {formatNumber({
            num: pool.total_volume_7d_usd,
          })}
        </T3>
      </div>
    </div>
  )
}

export function TrendingVolumeItem({ pool }: { pool: PoolSummary }) {
  return (
    <div className="w-full flex flex-row items-center">
      <div className="flex flex-[19]">
        <TrendingPoolTitle pool={pool} />
      </div>
      <div className="flex flex-[7] justify-end">
        <T3>
          $
          {formatNumber({
            num: (pool.t0_volume_usd + pool.t1_volume_usd) / 2,
          })}
        </T3>
      </div>
      <div className="flex flex-[9] justify-end">
        <T3 color={colors.green[400]}>
          $
          {formatNumber({
            num: pool.total_volume_7d_usd,
          })}
        </T3>
      </div>
    </div>
  )
}
