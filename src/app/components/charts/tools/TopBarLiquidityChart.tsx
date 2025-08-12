import { FormattedNumber } from '../../numbers/FormatNumber'
import { T3 } from '../../typography/Typography'
import { colors } from '../../../constants/colors'
import useMobile from '../../../hooks/useMobile'
import { useDataContext } from '../../../context/DataContext'
import TokenSwitch from '../../switch/TokenSwitch'
import { TokenSymbol } from '../../misc/TokenSymbol'

interface ITopBarLiquidityChart {
  height: number
}

const TopBarLiquidityChart = (props: ITopBarLiquidityChart) => {
  const { height } = props
  const { poolSummary, token, setToken } = useDataContext()
  const { isMobile } = useMobile()
  const price = poolSummary.t0_price

  return (
    <div
      className="flex h-fit gap-6"
      style={{
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'start' : 'center',
        height: height,
        width: '100%',
      }}
    >
      <TokenSwitch
        token={token}
        token0Address={poolSummary.t0}
        token0Symbol={poolSummary.t0_symbol}
        token1Address={poolSummary.t1}
        token1Symbol={poolSummary.t1_symbol}
        setTokenSelected={setToken}
      />
      {!isMobile && (
        <div className="flex flex-row gap-2">
          <T3 color={colors.gray[400]}>Current Price: </T3>
          <T3 color={colors.gray[400]}>
            {<FormattedNumber num={token.selected === 1 ? price : 1 / price} />}{' '}
            {token.selected === 1 ? (
              <TokenSymbol address={poolSummary.t1} fallback_name={poolSummary.t1_symbol} />
            ) : (
              <TokenSymbol address={poolSummary.t0} fallback_name={poolSummary.t0_symbol} />
            )}
            {' per '}
            {token.selected === 1 ? (
              <TokenSymbol address={poolSummary.t0} fallback_name={poolSummary.t0_symbol} />
            ) : (
              <TokenSymbol address={poolSummary.t1} fallback_name={poolSummary.t1_symbol} />
            )}
          </T3>
        </div>
      )}
    </div>
  )
}

export default TopBarLiquidityChart
