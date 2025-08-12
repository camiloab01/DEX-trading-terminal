import { colors } from '../../../../constants/colors'
import { getTokenLogoUrl } from '../../../../util/getTokenLogo'
import { RoundTokenLogoPair } from '../../../misc/RoundTokenLogo'
import { T2 } from '../../../typography/Typography'
import { PoolSummaryWithKey } from '../tables/Pools'
import { TokenSymbol } from '../../../misc/TokenSymbol'

export const LandingPoolPair = ({ pool, currentChain }: { pool: PoolSummaryWithKey; currentChain: number }) => {
  return (
    <div className="flex flex-row items-center w-fit gap-[6px]">
      <div className="relative z-0">
        <RoundTokenLogoPair
          token0LogoUrl={getTokenLogoUrl(pool.t0, currentChain)}
          token0Symbol={pool.t0_symbol}
          token1LogoUrl={getTokenLogoUrl(pool.t1, currentChain)}
          token1Symbol={pool.t1_symbol}
          size={14}
        />
      </div>
      <div className="flex flex-row items-center ">
        <T2>
          <TokenSymbol address={pool.t0} fallback_name={pool.t0_symbol} />
        </T2>
        <T2 color={colors.gray[400]}>
          {'/'}
          <TokenSymbol address={pool.t1} fallback_name={pool.t1_symbol} />
        </T2>
      </div>
    </div>
  )
}
